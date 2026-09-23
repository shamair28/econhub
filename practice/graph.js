/* practice/graph.js — EconGraph
 *
 * A dependency-free SVG graphing utility for economics practice questions.
 *
 *  - Renders static figures: curves (points or linear form), labelled points,
 *    shaded regions (CS / PS / DWL), horizontal/vertical guides, drop lines.
 *  - Accepts tolerant freehand input: the user drags to draw a line (which is
 *    auto-straightened with a total-least-squares fit) or taps to place a point.
 *  - Grades drawings on *direction and relationship*, not precision: slope sign,
 *    shift direction relative to a reference curve, proximity to a target point,
 *    proximity to the intersection of two curves (including the user's own line).
 *
 * All grading geometry happens in normalised plot coordinates (0..1 on each
 * axis) so tolerances are independent of axis scales.
 *
 * Exposes window.EconGraph.
 */
(function (global) {
  'use strict';

  const NS = 'http://www.w3.org/2000/svg';
  const PALETTE = {
    blue: '#2563EB', red: '#DC2626', green: '#059669', purple: '#7C3AED',
    amber: '#D97706', gray: '#6B7280', slate: '#1F2937', pink: '#DB2777',
    teal: '#0D9488', orange: '#EA580C', indigo: '#4F46E5'
  };
  const USER_COLORS = ['purple', 'orange', 'teal', 'pink', 'indigo'];
  const DEFAULTS = {
    width: 560, height: 400,
    padding: { l: 60, r: 40, t: 28, b: 54 },
    grid: true
  };
  // Grading defaults (normalised units unless noted)
  const TOL = {
    point: 0.08,          // radius for "near" checks
    minShift: 0.05,       // minimum mean displacement for a shift to count
    shiftConsistency: 0.8,// fraction of samples that must agree with the mean sign
    flatDeg: 12,          // |angle| below this = flat
    verticalDeg: 78,      // |angle| above this = vertical
    minStroke: 0.08,      // minimum stroke extent to accept a line
    deadZone: 0.03        // for relative (+/-/0) comparisons
  };

  // ────────────────────────────────────────────────────────────────────────
  // Small helpers
  // ────────────────────────────────────────────────────────────────────────
  function svgEl(tag, attrs, parent) {
    const e = document.createElementNS(NS, tag);
    for (const k in (attrs || {})) if (attrs[k] !== undefined && attrs[k] !== null) e.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(e);
    return e;
  }
  function htmlEl(tag, cls, parent, text) {
    const e = document.createElement(tag);
    if (cls) e.className = cls;
    if (text !== undefined) e.textContent = text;
    if (parent) parent.appendChild(e);
    return e;
  }
  function color(c, fallback) { return PALETTE[c] || c || PALETTE[fallback] || PALETTE.slate; }
  function clamp(v, a, b) { return Math.max(a, Math.min(b, v)); }
  function isNum(v) { return typeof v === 'number' && isFinite(v); }
  function niceStep(range, target) {
    const raw = range / (target || 5);
    const mag = Math.pow(10, Math.floor(Math.log10(raw)));
    const norm = raw / mag;
    const s = norm < 1.5 ? 1 : norm < 3.5 ? 2 : norm < 7.5 ? 5 : 10;
    return s * mag;
  }
  function fmtTick(v) {
    if (Math.abs(v) >= 1000) return v.toLocaleString();
    return (Math.round(v * 100) / 100).toString();
  }

  // ────────────────────────────────────────────────────────────────────────
  // Geometry in normalised coordinates
  // ────────────────────────────────────────────────────────────────────────
  // A "poly" is an array of [u, v] points. A "line" is { p:[u,v], d:[du,dv] } with |d| = 1.

  function fitLine(pts) {
    const n = pts.length;
    if (n < 2) return null;
    let mu = 0, mv = 0;
    for (const p of pts) { mu += p[0]; mv += p[1]; }
    mu /= n; mv /= n;
    let suu = 0, svv = 0, suv = 0;
    for (const p of pts) { const du = p[0] - mu, dv = p[1] - mv; suu += du * du; svv += dv * dv; suv += du * dv; }
    let du, dv;
    if (n === 2) { du = pts[1][0] - pts[0][0]; dv = pts[1][1] - pts[0][1]; }
    else { const theta = 0.5 * Math.atan2(2 * suv, suu - svv); du = Math.cos(theta); dv = Math.sin(theta); }
    const len = Math.hypot(du, dv) || 1;
    du /= len; dv /= len;
    if (du < 0 || (du === 0 && dv < 0)) { du = -du; dv = -dv; }
    return { p: [mu, mv], d: [du, dv] };
  }

  // Clip an infinite line to the unit box; returns a 2-point poly or null.
  function clipLineToBox(line) {
    const [pu, pv] = line.p, [du, dv] = line.d;
    const ts = [];
    if (Math.abs(du) > 1e-9) { ts.push((0 - pu) / du, (1 - pu) / du); }
    if (Math.abs(dv) > 1e-9) { ts.push((0 - pv) / dv, (1 - pv) / dv); }
    const eps = 1e-6;
    const inside = ts.map(t => [pu + t * du, pv + t * dv, t])
      .filter(q => q[0] >= -eps && q[0] <= 1 + eps && q[1] >= -eps && q[1] <= 1 + eps);
    if (inside.length < 2) return null;
    inside.sort((a, b) => a[2] - b[2]);
    const a = inside[0], b = inside[inside.length - 1];
    if (Math.abs(a[2] - b[2]) < 1e-6) return null;
    return [[clamp(a[0], 0, 1), clamp(a[1], 0, 1)], [clamp(b[0], 0, 1), clamp(b[1], 0, 1)]];
  }

  function polyAtV(poly, v) {
    for (let i = 0; i < poly.length - 1; i++) {
      const [u1, v1] = poly[i], [u2, v2] = poly[i + 1];
      const lo = Math.min(v1, v2), hi = Math.max(v1, v2);
      if (v >= lo - 1e-9 && v <= hi + 1e-9) {
        if (Math.abs(v2 - v1) < 1e-9) return (u1 + u2) / 2;
        return u1 + (v - v1) * (u2 - u1) / (v2 - v1);
      }
    }
    return null;
  }
  function polyAtU(poly, u) {
    for (let i = 0; i < poly.length - 1; i++) {
      const [u1, v1] = poly[i], [u2, v2] = poly[i + 1];
      const lo = Math.min(u1, u2), hi = Math.max(u1, u2);
      if (u >= lo - 1e-9 && u <= hi + 1e-9) {
        if (Math.abs(u2 - u1) < 1e-9) return (v1 + v2) / 2;
        return v1 + (u - u1) * (v2 - v1) / (u2 - u1);
      }
    }
    return null;
  }
  function polyRange(poly) {
    let umin = 1, umax = 0, vmin = 1, vmax = 0;
    for (const [u, v] of poly) { umin = Math.min(umin, u); umax = Math.max(umax, u); vmin = Math.min(vmin, v); vmax = Math.max(vmax, v); }
    return { umin, umax, vmin, vmax };
  }
  function segIntersect(a, b, c, d) {
    const r = [b[0] - a[0], b[1] - a[1]], s = [d[0] - c[0], d[1] - c[1]];
    const denom = r[0] * s[1] - r[1] * s[0];
    if (Math.abs(denom) < 1e-12) return null;
    const qp = [c[0] - a[0], c[1] - a[1]];
    const t = (qp[0] * s[1] - qp[1] * s[0]) / denom;
    const w = (qp[0] * r[1] - qp[1] * r[0]) / denom;
    if (t < -1e-6 || t > 1 + 1e-6 || w < -1e-6 || w > 1 + 1e-6) return null;
    return [a[0] + t * r[0], a[1] + t * r[1]];
  }
  function polyIntersect(a, b) {
    for (let i = 0; i < a.length - 1; i++)
      for (let j = 0; j < b.length - 1; j++) {
        const p = segIntersect(a[i], a[i + 1], b[j], b[j + 1]);
        if (p) return p;
      }
    return null;
  }
  function dist(a, b) { return Math.hypot(a[0] - b[0], a[1] - b[1]); }
  // Signed vertical gap of point p above curve `poly` (normalised units). Where the curve has no
  // value at p's x (outside its x-range), fall back to horizontal distance, then to the range box.
  function sideGap(poly, p) {
    const vc = polyAtU(poly, p[0]);
    if (vc !== null) return p[1] - vc;
    const uc = polyAtV(poly, p[1]);
    if (uc !== null) return p[0] - uc;
    const r = polyRange(poly);
    return (p[0] > r.umax || p[1] > r.vmax) ? 1 : -1;
  }

  function slopeClass(d, opts) {
    const flat = (opts && opts.flatDeg) || TOL.flatDeg;
    const vert = (opts && opts.verticalDeg) || TOL.verticalDeg;
    const ang = Math.atan2(d[1], d[0]) * 180 / Math.PI; // du >= 0 so ang in (-90, 90]
    const a = Math.abs(ang);
    if (a <= flat) return 'flat';
    if (a >= vert) return 'vertical';
    return ang > 0 ? 'positive' : 'negative';
  }

  // Mean displacement of `poly` relative to `ref`, sampled along the shared range.
  // axis 'x' → horizontal displacement (u_poly - u_ref at equal v); 'y' → vertical.
  function shiftBetween(poly, ref, axis) {
    const a = polyRange(poly), b = polyRange(ref);
    const samples = [];
    if (axis === 'x') {
      const lo = Math.max(a.vmin, b.vmin), hi = Math.min(a.vmax, b.vmax);
      if (hi - lo < 0.02) return null;
      for (let i = 0; i <= 8; i++) {
        const v = lo + (hi - lo) * (i / 8);
        const u1 = polyAtV(poly, v), u2 = polyAtV(ref, v);
        if (u1 !== null && u2 !== null) samples.push(u1 - u2);
      }
    } else {
      const lo = Math.max(a.umin, b.umin), hi = Math.min(a.umax, b.umax);
      if (hi - lo < 0.02) return null;
      for (let i = 0; i <= 8; i++) {
        const u = lo + (hi - lo) * (i / 8);
        const v1 = polyAtU(poly, u), v2 = polyAtU(ref, u);
        if (v1 !== null && v2 !== null) samples.push(v1 - v2);
      }
    }
    if (!samples.length) return null;
    const mean = samples.reduce((s, x) => s + x, 0) / samples.length;
    const sign = Math.sign(mean);
    const agree = samples.filter(x => Math.sign(x) === sign).length / samples.length;
    return { mean, consistency: agree };
  }

  // Catmull-Rom → cubic bezier path (pixel coords)
  function smoothPath(pts) {
    if (pts.length < 3) return 'M' + pts.map(p => p.join(',')).join(' L');
    let d = 'M' + pts[0][0] + ',' + pts[0][1];
    for (let i = 0; i < pts.length - 1; i++) {
      const p0 = pts[Math.max(0, i - 1)], p1 = pts[i], p2 = pts[i + 1], p3 = pts[Math.min(pts.length - 1, i + 2)];
      const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
      const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
      d += ' C' + c1.join(',') + ' ' + c2.join(',') + ' ' + p2.join(',');
    }
    return d;
  }

  // ────────────────────────────────────────────────────────────────────────
  // Spec normalisation
  // ────────────────────────────────────────────────────────────────────────
  function normAxis(ax, fallbackLabel) {
    ax = Object.assign({ label: fallbackLabel, min: 0, max: 100 }, ax || {});
    if (!(ax.max > ax.min)) ax.max = ax.min + 100;
    return ax;
  }
  function normSpec(spec) {
    const s = Object.assign({}, DEFAULTS, spec || {});
    s.padding = Object.assign({}, DEFAULTS.padding, (spec && spec.padding) || {});
    s.x = normAxis(s.x, 'Quantity');
    s.y = normAxis(s.y, 'Price');
    s.curves = (s.curves || []).map((c, i) => Object.assign({ id: c.id || ('c' + i), color: i === 0 ? 'blue' : 'red', style: 'solid', width: 2.5, labelPos: 'end' }, c));
    s.points = (s.points || []).map((p, i) => Object.assign({ id: p.id || ('p' + i), color: 'slate' }, p));
    s.regions = s.regions || [];
    s.guides = s.guides || [];
    s.tasks = (s.tasks || []).map((t, i) => Object.assign({ id: t.id || ('t' + i), kind: 'line', color: USER_COLORS[i % USER_COLORS.length] }, t));
    return s;
  }

  // ────────────────────────────────────────────────────────────────────────
  // EconGraph
  // ────────────────────────────────────────────────────────────────────────
  class EconGraph {
    /**
     * @param {HTMLElement} container
     * @param {object} spec  – see SCHEMA.md ("graph spec")
     * @param {object} opts  – { interactive:boolean, onChange(drawings), showTasks:boolean, drawings:object }
     */
    constructor(container, spec, opts) {
      this.container = container;
      this.opts = Object.assign({ interactive: false, showTasks: true }, opts || {});
      this.spec = normSpec(spec);
      this.drawings = {};          // taskId → { kind, data-coord geometry }
      this.activeTaskId = null;
      this.locked = false;
      this._modelShown = false;
      this._build();
      if (this.opts.drawings) this.setDrawings(this.opts.drawings);
      if (this.opts.interactive && this.spec.tasks.length) this.setActiveTask(this.spec.tasks[0].id);
    }

    // ── coordinate transforms ───────────────────────────────────────────
    get plot() {
      const s = this.spec, p = s.padding;
      return { x0: p.l, y0: p.t, w: s.width - p.l - p.r, h: s.height - p.t - p.b };
    }
    toNorm(x, y) { const s = this.spec; return [(x - s.x.min) / (s.x.max - s.x.min), (y - s.y.min) / (s.y.max - s.y.min)]; }
    fromNorm(u, v) { const s = this.spec; return [s.x.min + u * (s.x.max - s.x.min), s.y.min + v * (s.y.max - s.y.min)]; }
    normToPx(u, v) { const P = this.plot; return [P.x0 + u * P.w, P.y0 + (1 - v) * P.h]; }
    pxToNorm(px, py) { const P = this.plot; return [clamp((px - P.x0) / P.w, 0, 1), clamp(1 - (py - P.y0) / P.h, 0, 1)]; }
    dataToPx(x, y) { const [u, v] = this.toNorm(x, y); return this.normToPx(u, v); }

    // Convert a curve spec into a normalised poly (clipped to the box).
    curvePoly(c) {
      let pts;
      if (c.linear) {
        const s = this.spec;
        const f = x => c.linear.intercept + c.linear.slope * x;
        pts = [[s.x.min, f(s.x.min)], [s.x.max, f(s.x.max)]];
        const n = pts.map(p => this.toNorm(p[0], p[1]));
        const line = fitLine(n);
        return line ? clipLineToBox(line) : n;
      }
      pts = (c.points || []).map(p => this.toNorm(p[0], p[1]));
      return pts;
    }

    // ── build ───────────────────────────────────────────────────────────
    _build() {
      const s = this.spec;
      this.container.innerHTML = '';
      this.container.classList.add('eg');
      const wrap = htmlEl('div', 'eg-wrap', this.container);
      const svg = svgEl('svg', {
        viewBox: `0 0 ${s.width} ${s.height}`, class: 'eg-svg',
        role: 'img', 'aria-label': s.alt || 'Economics graph'
      }, wrap);
      svg.style.maxWidth = s.width + 'px';
      this.svg = svg;
      if (this.opts.interactive) svg.classList.add('is-interactive');

      const defs = svgEl('defs', {}, svg);
      const clipId = 'egclip' + Math.random().toString(36).slice(2, 8);
      const clip = svgEl('clipPath', { id: clipId }, defs);
      const P = this.plot;
      svgEl('rect', { x: P.x0, y: P.y0, width: P.w, height: P.h }, clip);
      this.clipRef = `url(#${clipId})`;

      this.gGrid = svgEl('g', { class: 'eg-grid' }, svg);
      this.gRegions = svgEl('g', { class: 'eg-regions', 'clip-path': this.clipRef }, svg);
      this.gAxes = svgEl('g', { class: 'eg-axes' }, svg);
      this.gGuides = svgEl('g', { class: 'eg-guides' }, svg);
      this.gCurves = svgEl('g', { class: 'eg-curves' }, svg);
      this.gPoints = svgEl('g', { class: 'eg-points' }, svg);
      this.gModel = svgEl('g', { class: 'eg-model' }, svg);
      this.gUser = svgEl('g', { class: 'eg-user' }, svg);
      this.gStroke = svgEl('g', { class: 'eg-stroke' }, svg);
      this.gLabels = svgEl('g', { class: 'eg-labels' }, svg);

      this._drawAxes();
      this._drawRegions();
      this._drawGuides();
      this._drawCurves();
      this._drawPoints();

      if (this.opts.interactive) {
        this.hit = svgEl('rect', { x: P.x0, y: P.y0, width: P.w, height: P.h, class: 'eg-hit', fill: 'transparent' }, svg);
        this._bindPointer();
        if (this.opts.showTasks && s.tasks.length) this._buildTaskBar(wrap);
      }
      if (s.caption) htmlEl('div', 'eg-caption', wrap, s.caption);
    }

    _drawAxes() {
      const s = this.spec, P = this.plot;
      const axisColor = '#374151';
      // axes lines
      svgEl('line', { x1: P.x0, y1: P.y0, x2: P.x0, y2: P.y0 + P.h, stroke: axisColor, 'stroke-width': 1.5 }, this.gAxes);
      svgEl('line', { x1: P.x0, y1: P.y0 + P.h, x2: P.x0 + P.w, y2: P.y0 + P.h, stroke: axisColor, 'stroke-width': 1.5 }, this.gAxes);
      // arrows
      svgEl('path', { d: `M${P.x0 - 5},${P.y0 + 8} L${P.x0},${P.y0 - 1} L${P.x0 + 5},${P.y0 + 8}`, fill: 'none', stroke: axisColor, 'stroke-width': 1.5 }, this.gAxes);
      svgEl('path', { d: `M${P.x0 + P.w - 8},${P.y0 + P.h - 5} L${P.x0 + P.w + 1},${P.y0 + P.h} L${P.x0 + P.w - 8},${P.y0 + P.h + 5}`, fill: 'none', stroke: axisColor, 'stroke-width': 1.5 }, this.gAxes);
      // axis labels
      svgEl('text', { x: P.x0 + P.w / 2, y: s.height - 12, class: 'eg-axis-label', 'text-anchor': 'middle' }, this.gAxes).textContent = s.x.label;
      const yl = svgEl('text', { x: 16, y: P.y0 + P.h / 2, class: 'eg-axis-label', 'text-anchor': 'middle', transform: `rotate(-90 16 ${P.y0 + P.h / 2})` }, this.gAxes);
      yl.textContent = s.y.label;
      // ticks
      const tickAxis = (ax, isX) => {
        if (ax.hideTicks) return;
        let ticks = ax.ticks;
        if (!ticks) {
          const step = ax.step || niceStep(ax.max - ax.min, 5);
          ticks = [];
          const start = Math.ceil(ax.min / step) * step;
          for (let t = start; t <= ax.max + 1e-9; t += step) ticks.push(Math.round(t * 1e6) / 1e6);
        }
        for (const t of ticks) {
          const val = isNum(t) ? t : t.at;
          const label = isNum(t) ? fmtTick(t) : t.label;
          if (val < ax.min - 1e-9 || val > ax.max + 1e-9) continue;
          const [px, py] = isX ? this.dataToPx(val, s.y.min) : this.dataToPx(s.x.min, val);
          if (isX) {
            if (val !== ax.min) svgEl('line', { x1: px, y1: py, x2: px, y2: py + 5, stroke: axisColor, 'stroke-width': 1 }, this.gAxes);
            const tx = svgEl('text', { x: px, y: py + 18, class: 'eg-tick', 'text-anchor': 'middle' }, this.gAxes);
            tx.textContent = label;
            if (s.grid && val !== ax.min) svgEl('line', { x1: px, y1: P.y0, x2: px, y2: P.y0 + P.h, class: 'eg-gridline' }, this.gGrid);
          } else {
            if (val !== ax.min) svgEl('line', { x1: px - 5, y1: py, x2: px, y2: py, stroke: axisColor, 'stroke-width': 1 }, this.gAxes);
            const tx = svgEl('text', { x: px - 8, y: py + 4, class: 'eg-tick', 'text-anchor': 'end' }, this.gAxes);
            tx.textContent = label;
            if (s.grid && val !== ax.min) svgEl('line', { x1: P.x0, y1: py, x2: P.x0 + P.w, y2: py, class: 'eg-gridline' }, this.gGrid);
          }
        }
      };
      tickAxis(s.x, true);
      tickAxis(s.y, false);
    }

    _drawRegions() {
      for (const r of this.spec.regions) {
        const pts = (r.points || []).map(p => this.dataToPx(p[0], p[1]));
        if (pts.length < 3) continue;
        svgEl('polygon', { points: pts.map(p => p.join(',')).join(' '), fill: color(r.fill, 'blue'), 'fill-opacity': r.opacity != null ? r.opacity : 0.18, stroke: 'none' }, this.gRegions);
        if (r.label) {
          let lx, ly;
          if (r.labelAt) [lx, ly] = this.dataToPx(r.labelAt[0], r.labelAt[1]);
          else { lx = pts.reduce((a, p) => a + p[0], 0) / pts.length; ly = pts.reduce((a, p) => a + p[1], 0) / pts.length; }
          const t = svgEl('text', { x: lx, y: ly, class: 'eg-region-label', 'text-anchor': 'middle', fill: color(r.fill, 'blue') }, this.gLabels);
          t.textContent = r.label;
        }
      }
    }

    _drawGuides() {
      const s = this.spec, P = this.plot;
      for (const g of s.guides) {
        const dashed = g.dashed !== false;
        const col = color(g.color, 'gray');
        if (g.axis === 'y') { // horizontal line at y = at
          const [, py] = this.dataToPx(s.x.min, g.at);
          const x2 = g.toX != null ? this.dataToPx(g.toX, g.at)[0] : P.x0 + P.w;
          svgEl('line', { x1: P.x0, y1: py, x2, y2: py, stroke: col, 'stroke-width': g.width || 1.5, 'stroke-dasharray': dashed ? '5 4' : null }, this.gGuides);
          if (g.label) { const t = svgEl('text', { x: P.x0 - 8, y: py + 4, class: 'eg-guide-label', 'text-anchor': 'end', fill: col }, this.gLabels); t.textContent = g.label; }
        } else { // vertical line at x = at
          const [px] = this.dataToPx(g.at, s.y.min);
          const y1 = g.toY != null ? this.dataToPx(g.at, g.toY)[1] : P.y0;
          svgEl('line', { x1: px, y1, x2: px, y2: P.y0 + P.h, stroke: col, 'stroke-width': g.width || 1.5, 'stroke-dasharray': dashed ? '5 4' : null }, this.gGuides);
          if (g.label) { const t = svgEl('text', { x: px, y: P.y0 + P.h + 18, class: 'eg-guide-label', 'text-anchor': 'middle', fill: col }, this.gLabels); t.textContent = g.label; }
        }
      }
    }

    _pathFor(poly, smooth) {
      const px = poly.map(p => this.normToPx(p[0], p[1]));
      return smooth ? smoothPath(px) : 'M' + px.map(p => p.join(',')).join(' L');
    }

    _drawCurve(group, poly, opt) {
      if (!poly || poly.length < 2) return;
      const col = color(opt.color);
      svgEl('path', {
        d: this._pathFor(poly, opt.smooth), fill: 'none', stroke: col,
        'stroke-width': opt.width || 2.5, 'stroke-linecap': 'round', 'stroke-linejoin': 'round',
        'stroke-dasharray': opt.style === 'dashed' ? '7 5' : null, 'clip-path': this.clipRef,
        class: opt.cls || ''
      }, group);
      if (opt.label) {
        const end = opt.labelPos === 'start' ? poly[0] : poly[poly.length - 1];
        // choose the end with the larger u for 'end' (curves may be authored right-to-left)
        const pt = opt.labelPos === 'start' ? end : (poly[0][0] > poly[poly.length - 1][0] ? poly[0] : poly[poly.length - 1]);
        const [px, py] = this.normToPx(pt[0], pt[1]);
        const P = this.plot;
        const atRight = px > P.x0 + P.w - 6;
        const t = svgEl('text', {
          x: atRight ? px + 6 : px + 8, y: py + (pt[1] > 0.92 ? 14 : 4) + (opt.labelDy || 0),
          class: 'eg-curve-label', fill: col, 'text-anchor': 'start'
        }, this.gLabels);
        t.textContent = opt.label;
      }
    }

    _drawCurves() {
      this.curvePolys = {};
      for (const c of this.spec.curves) {
        const poly = this.curvePoly(c);
        this.curvePolys[c.id] = poly;
        if (!c.hidden) this._drawCurve(this.gCurves, poly, c);
      }
    }

    _drawPoint(group, x, y, opt) {
      const [px, py] = this.dataToPx(x, y);
      const col = color(opt.color, 'slate');
      const s = this.spec, P = this.plot;
      if (opt.drop) {
        const dash = { stroke: col, 'stroke-width': 1.2, 'stroke-dasharray': '4 4', opacity: 0.8 };
        if (opt.drop === 'both' || opt.drop === 'x') svgEl('line', Object.assign({ x1: px, y1: py, x2: px, y2: P.y0 + P.h }, dash), this.gGuides);
        if (opt.drop === 'both' || opt.drop === 'y') svgEl('line', Object.assign({ x1: P.x0, y1: py, x2: px, y2: py }, dash), this.gGuides);
        const dl = opt.dropLabels || {};
        if (dl.x) { const t = svgEl('text', { x: px, y: P.y0 + P.h + 18, class: 'eg-guide-label', 'text-anchor': 'middle', fill: col }, this.gLabels); t.textContent = dl.x; }
        if (dl.y) { const t = svgEl('text', { x: P.x0 - 8, y: py + 4, class: 'eg-guide-label', 'text-anchor': 'end', fill: col }, this.gLabels); t.textContent = dl.y; }
      }
      svgEl('circle', { cx: px, cy: py, r: opt.r || 5, fill: opt.hollow ? '#fff' : col, stroke: col, 'stroke-width': 2, class: opt.cls || '' }, group);
      if (opt.label) {
        const t = svgEl('text', { x: px + (opt.labelDx != null ? opt.labelDx : 8), y: py + (opt.labelDy != null ? opt.labelDy : -8), class: 'eg-point-label', fill: col }, this.gLabels);
        t.textContent = opt.label;
      }
    }

    _drawPoints() {
      for (const p of this.spec.points) this._drawPoint(this.gPoints, p.x, p.y, p);
    }

    // ── interaction ─────────────────────────────────────────────────────
    _buildTaskBar(wrap) {
      const bar = htmlEl('div', 'eg-taskbar', wrap);
      this.taskBar = bar;
      const list = htmlEl('div', 'eg-tasks', bar);
      this.taskChips = {};
      this.spec.tasks.forEach((t, i) => {
        const chip = htmlEl('button', 'eg-task', list);
        chip.type = 'button';
        chip.dataset.task = t.id;
        chip.style.setProperty('--task-color', color(t.color));
        chip.innerHTML = `<span class="eg-task-num">${i + 1}</span><span class="eg-task-text">${t.prompt || (t.kind === 'point' ? 'Mark ' : 'Draw ') + (t.label || '')}</span><span class="eg-task-state" aria-hidden="true"></span>`;
        chip.addEventListener('click', () => { if (!this.locked) this.setActiveTask(t.id); });
        this.taskChips[t.id] = chip;
      });
      const ctrls = htmlEl('div', 'eg-controls', bar);
      const undo = htmlEl('button', 'eg-btn', ctrls, 'Undo');
      undo.type = 'button';
      undo.addEventListener('click', () => { if (!this.locked) this.undo(); });
      const clear = htmlEl('button', 'eg-btn', ctrls, 'Clear all');
      clear.type = 'button';
      clear.addEventListener('click', () => { if (!this.locked) this.clearAll(); });
      this.hint = htmlEl('div', 'eg-hint', wrap);
      this._refreshTaskBar();
    }

    _refreshTaskBar() {
      if (!this.taskChips) return;
      for (const t of this.spec.tasks) {
        const chip = this.taskChips[t.id];
        chip.classList.toggle('is-active', t.id === this.activeTaskId);
        chip.classList.toggle('is-done', !!this.drawings[t.id]);
        const st = chip.querySelector('.eg-task-state');
        st.textContent = this.drawings[t.id] ? '✓' : '';
      }
      const t = this.activeTask();
      if (this.hint) {
        if (this.locked) this.hint.textContent = '';
        else if (!t) this.hint.textContent = 'All tasks drawn — press Check, or select a task to redraw it.';
        else this.hint.textContent = t.kind === 'point'
          ? `Tap / click on the graph to place ${t.label || 'the point'}.`
          : `Drag across the graph to draw ${t.label || 'the line'} — it will be straightened automatically.`;
      }
    }

    activeTask() { return this.spec.tasks.find(t => t.id === this.activeTaskId) || null; }
    setActiveTask(id) { this.activeTaskId = id; this._refreshTaskBar(); }
    _advanceTask() {
      const next = this.spec.tasks.find(t => !this.drawings[t.id]);
      this.activeTaskId = next ? next.id : null;
      this._refreshTaskBar();
    }

    _bindPointer() {
      const svg = this.svg;
      let stroke = null;
      const posOf = (ev) => {
        const r = svg.getBoundingClientRect();
        const sx = this.spec.width / r.width, sy = this.spec.height / r.height;
        return this.pxToNorm((ev.clientX - r.left) * sx, (ev.clientY - r.top) * sy);
      };
      svg.addEventListener('pointerdown', (ev) => {
        if (this.locked || !this.activeTask()) return;
        if (ev.button != null && ev.button !== 0) return;
        ev.preventDefault();
        svg.setPointerCapture(ev.pointerId);
        stroke = [posOf(ev)];
        this._strokeEl = svgEl('polyline', { class: 'eg-stroke-line', fill: 'none', stroke: color(this.activeTask().color), 'stroke-width': 3, 'stroke-linecap': 'round', opacity: 0.55, points: '' }, this.gStroke);
      });
      svg.addEventListener('pointermove', (ev) => {
        if (!stroke) return;
        const p = posOf(ev);
        const last = stroke[stroke.length - 1];
        if (dist(p, last) < 0.004) return;
        stroke.push(p);
        this._strokeEl.setAttribute('points', stroke.map(q => this.normToPx(q[0], q[1]).join(',')).join(' '));
      });
      const finish = (ev) => {
        if (!stroke) return;
        const task = this.activeTask();
        const pts = stroke; stroke = null;
        if (this._strokeEl) { this._strokeEl.remove(); this._strokeEl = null; }
        if (!task) return;
        if (task.kind === 'point') {
          const p = pts[pts.length - 1];
          const [x, y] = this.fromNorm(p[0], p[1]);
          this.drawings[task.id] = { kind: 'point', x, y };
        } else {
          const r = polyRange(pts);
          const extent = Math.hypot(r.umax - r.umin, r.vmax - r.vmin);
          if (pts.length < 2 || extent < TOL.minStroke) { this._flash('Drag a longer stroke to draw a line.'); return; }
          const line = fitLine(pts);
          const seg = line && clipLineToBox(line);
          if (!seg) { this._flash('Could not fit a line — try again.'); return; }
          const a = this.fromNorm(seg[0][0], seg[0][1]), b = this.fromNorm(seg[1][0], seg[1][1]);
          this.drawings[task.id] = { kind: 'line', points: [a, b] };
        }
        this._history = this._history || [];
        this._history.push(task.id);
        this._renderUser();
        this._advanceTask();
        if (this.opts.onChange) this.opts.onChange(this.getDrawings());
      };
      svg.addEventListener('pointerup', finish);
      svg.addEventListener('pointercancel', () => { stroke = null; if (this._strokeEl) { this._strokeEl.remove(); this._strokeEl = null; } });
    }

    _flash(msg) {
      if (!this.hint) return;
      this.hint.textContent = msg;
      this.hint.classList.add('is-flash');
      clearTimeout(this._flashT);
      this._flashT = setTimeout(() => { this.hint.classList.remove('is-flash'); this._refreshTaskBar(); }, 1600);
    }

    undo() {
      if (!this._history || !this._history.length) return;
      const id = this._history.pop();
      delete this.drawings[id];
      this._renderUser();
      this.setActiveTask(id);
      if (this.opts.onChange) this.opts.onChange(this.getDrawings());
    }
    clearAll() {
      this.drawings = {}; this._history = [];
      this._renderUser();
      this.setActiveTask(this.spec.tasks.length ? this.spec.tasks[0].id : null);
      if (this.opts.onChange) this.opts.onChange(this.getDrawings());
    }
    lock() { this.locked = true; if (this.svg) this.svg.classList.add('is-locked'); if (this.taskBar) this.taskBar.classList.add('is-locked'); this._refreshTaskBar(); }

    getDrawings() { return JSON.parse(JSON.stringify(this.drawings)); }
    setDrawings(d) {
      this.drawings = JSON.parse(JSON.stringify(d || {}));
      this._history = Object.keys(this.drawings);
      this._renderUser();
      if (this.opts.interactive) this._advanceTask();
    }

    // user poly for a task in normalised coords
    userPoly(taskId) {
      const d = this.drawings[taskId];
      if (!d) return null;
      if (d.kind === 'line') return d.points.map(p => this.toNorm(p[0], p[1]));
      return [this.toNorm(d.x, d.y)];
    }

    _renderUser() {
      this.gUser.innerHTML = '';
      // remove previously added user labels
      this.gLabels.querySelectorAll('.eg-user-label').forEach(n => n.remove());
      for (const t of this.spec.tasks) {
        const d = this.drawings[t.id];
        if (!d) continue;
        const col = color(t.color);
        if (d.kind === 'line') {
          const poly = d.points.map(p => this.toNorm(p[0], p[1]));
          svgEl('path', { d: this._pathFor(poly), fill: 'none', stroke: col, 'stroke-width': 3, 'stroke-linecap': 'round', 'clip-path': this.clipRef, class: 'eg-user-line' }, this.gUser);
          const pt = poly[0][0] > poly[1][0] ? poly[0] : poly[1];
          const [px, py] = this.normToPx(pt[0], pt[1]);
          const lbl = svgEl('text', { x: px + 7, y: py + (pt[1] > 0.92 ? 14 : 4), class: 'eg-curve-label eg-user-label', fill: col }, this.gLabels);
          lbl.textContent = t.label || t.id;
        } else {
          const [px, py] = this.dataToPx(d.x, d.y);
          svgEl('circle', { cx: px, cy: py, r: 6, fill: col, stroke: '#fff', 'stroke-width': 2, class: 'eg-user-point' }, this.gUser);
          const lbl = svgEl('text', { x: px + 9, y: py - 8, class: 'eg-point-label eg-user-label', fill: col }, this.gLabels);
          lbl.textContent = t.label || t.id;
        }
      }
    }

    // ── grading ─────────────────────────────────────────────────────────
    grade() { return EconGraph.gradeDrawings(this.spec, this.drawings); }

    // Draw the model answer (dashed) for every task.
    showModel() {
      if (this._modelShown) return;
      this._modelShown = true;
      const models = EconGraph.modelPolys(this.spec);
      for (const t of this.spec.tasks) {
        const m = models[t.id];
        if (!m) continue;
        if (m.kind === 'line') {
          this._drawCurve(this.gModel, m.poly, { color: 'green', style: 'dashed', width: 2.5, label: (t.label || t.id) + ' ✓', labelPos: 'end', labelDy: 18 });
        } else {
          const [x, y] = this.fromNorm(m.point[0], m.point[1]);
          this._drawPoint(this.gModel, x, y, { color: 'green', hollow: true, r: 7, label: (t.label || t.id) + ' ✓', labelDx: 10, labelDy: 16 });
        }
      }
    }

    destroy() { this.container.innerHTML = ''; }
  }

  // ── static grading (pure; usable without a mounted widget) ─────────────
  // Build a helper context with normalised polys for curves/points and user drawings.
  function makeCtx(spec, drawings) {
    spec = normSpec(spec);
    const g = { spec };
    g.toNorm = (x, y) => [(x - spec.x.min) / (spec.x.max - spec.x.min), (y - spec.y.min) / (spec.y.max - spec.y.min)];
    g.curves = {};
    for (const c of spec.curves) {
      let pts;
      if (c.linear) {
        const f = x => c.linear.intercept + c.linear.slope * x;
        const n = [[spec.x.min, f(spec.x.min)], [spec.x.max, f(spec.x.max)]].map(p => g.toNorm(p[0], p[1]));
        const line = fitLine(n);
        pts = line ? clipLineToBox(line) : n;
      } else pts = (c.points || []).map(p => g.toNorm(p[0], p[1]));
      g.curves[c.id] = pts;
    }
    g.points = {};
    for (const p of spec.points) g.points[p.id] = g.toNorm(p.x, p.y);
    g.user = {};
    for (const id in (drawings || {})) {
      const d = drawings[id];
      if (!d) continue;
      g.user[id] = d.kind === 'line' ? { kind: 'line', poly: d.points.map(p => g.toNorm(p[0], p[1])) } : { kind: 'point', point: g.toNorm(d.x, d.y) };
    }
    return g;
  }

  // Resolve a reference string: curve id | point id | 'user:<taskId>' | 'model:<taskId>' | {x,y}
  // When deriving the model answer there are no user drawings, so `user:` refs fall back to the model of that task.
  function resolveRef(ctx, ref, models, userToModel) {
    if (!ref) return null;
    if (typeof ref === 'object' && isNum(ref.x) && isNum(ref.y)) return { kind: 'point', point: ctx.toNorm(ref.x, ref.y) };
    if (typeof ref !== 'string') return null;
    if (ref.startsWith('user:')) { const id = ref.slice(5); const u = ctx.user[id]; return u || (userToModel && models ? models[id] : null) || null; }
    if (ref.startsWith('model:')) { const m = models && models[ref.slice(6)]; return m || null; }
    if (ctx.curves[ref]) return { kind: 'line', poly: ctx.curves[ref] };
    if (ctx.points[ref]) return { kind: 'point', point: ctx.points[ref] };
    return null;
  }
  function refLabel(spec, ref) {
    if (typeof ref !== 'string') return 'the target';
    const id = ref.replace(/^(user|model):/, '');
    const t = spec.tasks.find(t => t.id === id); if (t) return t.label || t.id;
    const c = spec.curves.find(c => c.id === id); if (c) return c.label || c.id;
    const p = spec.points.find(p => p.id === id); if (p) return p.label || p.id;
    return id;
  }

  // Compute model-answer geometry for each task (normalised). Used for overlays and
  // for grading references like 'model:D2'.
  EconGraph.modelPolys = function (spec) {
    spec = normSpec(spec);
    const ctx = makeCtx(spec, {});
    const models = {};
    for (const t of spec.tasks) {
      const e = t.expect || {}, m = t.model || {};
      if (t.kind === 'point') {
        let pt = null;
        if (isNum(m.x) && isNum(m.y)) pt = ctx.toNorm(m.x, m.y);
        else if (e.near) pt = ctx.toNorm(e.near.x, e.near.y);
        else if (e.atIntersection) {
          const a = resolveRef(ctx, e.atIntersection[0], models, true), b = resolveRef(ctx, e.atIntersection[1], models, true);
          if (a && b && a.kind === 'line' && b.kind === 'line') pt = polyIntersect(a.poly, b.poly);
        } else if (e.onCurve) {
          const c = resolveRef(ctx, e.onCurve, models, true);
          if (c && c.kind === 'line') {
            if (isNum(e.atY)) { const v = ctx.toNorm(0, e.atY)[1]; const u = polyAtV(c.poly, v); if (u !== null) pt = [u, v]; }
            else if (isNum(e.atX)) { const u = ctx.toNorm(e.atX, 0)[0]; const v = polyAtU(c.poly, u); if (v !== null) pt = [u, v]; }
            else { // anywhere on the curve → use its midpoint
              const r = polyRange(c.poly); const u = (r.umin + r.umax) / 2; const v = polyAtU(c.poly, u);
              if (v !== null) pt = [u, v];
            }
          }
        } else if (e.side && e.side.of) {
          const c = resolveRef(ctx, e.side.of, models, true);
          if (c && c.kind === 'line') {
            const r = polyRange(c.poly); const u = (r.umin + r.umax) / 2; const v = polyAtU(c.poly, u);
            const k = e.side.which === 'below' ? -0.16 : 0.16;
            if (v !== null) pt = [clamp(u + k, 0.04, 0.96), clamp(v + k, 0.04, 0.96)];
          }
        } else if (e.region) {
          // open-ended bounds fall back to the axis limits
          const r = e.region;
          const xa = isNum(r.xmin) ? r.xmin : spec.x.min, xb = isNum(r.xmax) ? r.xmax : spec.x.max;
          const ya = isNum(r.ymin) ? r.ymin : spec.y.min, yb = isNum(r.ymax) ? r.ymax : spec.y.max;
          pt = ctx.toNorm((xa + xb) / 2, (ya + yb) / 2);
        }
        if (pt) models[t.id] = { kind: 'point', point: pt };
      } else {
        let poly = null;
        if (m.points && m.points.length >= 2) {
          const n = m.points.map(p => ctx.toNorm(p[0], p[1]));
          const line = fitLine(n); poly = line ? clipLineToBox(line) : n;
        } else if (m.linear) {
          const f = x => m.linear.intercept + m.linear.slope * x;
          const n = [[spec.x.min, f(spec.x.min)], [spec.x.max, f(spec.x.max)]].map(p => ctx.toNorm(p[0], p[1]));
          const line = fitLine(n); poly = line ? clipLineToBox(line) : n;
        } else if (e.shiftOf && e.direction) {
          const ref = resolveRef(ctx, e.shiftOf, models, true);
          if (ref && ref.kind === 'line') {
            const amt = isNum(m.shift) ? m.shift : 0.16;
            const dx = e.direction === 'right' ? amt : e.direction === 'left' ? -amt : 0;
            const dy = e.direction === 'up' ? amt : e.direction === 'down' ? -amt : 0;
            const shifted = ref.poly.map(p => [p[0] + dx, p[1] + dy]);
            const line = fitLine(shifted); poly = line ? clipLineToBox(line) : shifted;
          }
        } else if (e.slope) {
          // generic model line with the expected slope through the plot centre
          const d = e.slope === 'positive' ? [0.7, 0.7] : e.slope === 'negative' ? [0.7, -0.7] : e.slope === 'flat' ? [1, 0] : [0, 1];
          const centre = e.through && e.through[0] ? ctx.toNorm(e.through[0].x, e.through[0].y) : [0.5, 0.5];
          const len = Math.hypot(d[0], d[1]); poly = clipLineToBox({ p: centre, d: [d[0] / len, d[1] / len] });
        }
        if (poly) models[t.id] = { kind: 'line', poly };
      }
    }
    return models;
  };

  /**
   * Grade drawings against task expectations.
   * @returns {{ ok:boolean, results:[{taskId,label,ok,message}] }}
   */
  EconGraph.gradeDrawings = function (spec, drawings) {
    spec = normSpec(spec);
    const ctx = makeCtx(spec, drawings);
    const models = EconGraph.modelPolys(spec);
    const results = [];
    for (const t of spec.tasks) {
      const label = t.label || t.id;
      const e = t.expect || {};
      const hints = t.hints || {};
      const u = ctx.user[t.id];
      const res = { taskId: t.id, label, ok: false, message: '' };
      if (!u) { res.message = `${label} was not drawn.`; results.push(res); continue; }

      if (t.kind === 'line') {
        if (u.kind !== 'line') { res.message = `${label} should be a line.`; results.push(res); continue; }
        const line = fitLine(u.poly);
        const problems = [];
        // slope
        if (e.slope && e.slope !== 'any') {
          const sc = slopeClass(line.d, e);
          if (sc !== e.slope) {
            const want = { negative: 'slope downward (negative slope)', positive: 'slope upward (positive slope)', flat: 'be horizontal', vertical: 'be vertical' }[e.slope];
            problems.push(hints.slope || `${label} should ${want}; yours is ${sc === 'flat' ? 'horizontal' : sc === 'vertical' ? 'vertical' : sc + 'ly sloped'}.`);
          }
        }
        // shift relative to reference
        if (e.shiftOf && e.direction) {
          const ref = resolveRef(ctx, e.shiftOf, models);
          if (ref && ref.kind === 'line') {
            const axis = (e.direction === 'right' || e.direction === 'left') ? 'x' : 'y';
            const sh = shiftBetween(u.poly, ref.poly, axis);
            const minShift = isNum(e.minShift) ? e.minShift : TOL.minShift;
            const wantSign = (e.direction === 'right' || e.direction === 'up') ? 1 : -1;
            const refName = refLabel(spec, e.shiftOf);
            const SIDE = { right: 'to the right of', left: 'to the left of', up: 'above', down: 'below' };
            const MOVE = { right: 'to the right', left: 'to the left', up: 'upward', down: 'downward' };
            const gotSide = Math.sign(sh ? sh.mean : 0) > 0 ? (axis === 'x' ? 'to the right of' : 'above') : (axis === 'x' ? 'to the left of' : 'below');
            if (!sh) problems.push(hints.shift || `${label} should sit ${SIDE[e.direction]} ${refName} across the same range of the graph.`);
            else if (Math.sign(sh.mean) !== wantSign || Math.abs(sh.mean) < minShift) {
              problems.push(hints.shift || (Math.abs(sh.mean) < minShift
                ? `${label} is almost on top of ${refName} — shift it clearly ${MOVE[e.direction]}.`
                : `${label} should be ${SIDE[e.direction]} ${refName}, not ${gotSide} it.`));
            } else if (sh.consistency < TOL.shiftConsistency) {
              problems.push(hints.shift || `${label} crosses ${refName} — a shift should keep the whole curve ${SIDE[e.direction]} it.`);
            }
          }
        }
        // through points
        if (Array.isArray(e.through)) {
          for (const tp of e.through) {
            const target = ctx.toNorm(tp.x, tp.y);
            const tol = isNum(tp.tol) ? tp.tol : TOL.point;
            const v = polyAtU(u.poly, target[0]);
            const uu = polyAtV(u.poly, target[1]);
            const dv = v === null ? Infinity : Math.abs(v - target[1]);
            const du = uu === null ? Infinity : Math.abs(uu - target[0]);
            if (Math.min(dv, du) > tol) problems.push(hints.through || `${label} should pass through ${tp.label || `(${tp.x}, ${tp.y})`}.`);
          }
        }
        res.ok = problems.length === 0;
        res.message = res.ok ? (t.success || `${label} looks right.`) : problems[0];
      } else {
        if (u.kind !== 'point') { res.message = `${label} should be a point.`; results.push(res); continue; }
        const p = u.point;
        const tol = isNum(e.tol) ? e.tol : TOL.point;
        let target = null, problem = null;
        if (e.near) target = ctx.toNorm(e.near.x, e.near.y);
        else if (e.atIntersection) {
          const a = resolveRef(ctx, e.atIntersection[0], models), b = resolveRef(ctx, e.atIntersection[1], models);
          if (!a || !b) problem = hints.missing || `Draw ${refLabel(spec, !a ? e.atIntersection[0] : e.atIntersection[1])} first, then mark ${label}.`;
          else if (a.kind === 'line' && b.kind === 'line') {
            target = polyIntersect(a.poly, b.poly);
            if (!target) problem = hints.intersection || `${refLabel(spec, e.atIntersection[0])} and ${refLabel(spec, e.atIntersection[1])} do not cross inside the graph.`;
          }
        } else if (e.onCurve) {
          const c = resolveRef(ctx, e.onCurve, models);
          if (!c || c.kind !== 'line') problem = `Draw ${refLabel(spec, e.onCurve)} first.`;
          else if (isNum(e.atY)) { const v = ctx.toNorm(0, e.atY)[1]; const uu = polyAtV(c.poly, v); if (uu !== null) target = [uu, v]; }
          else if (isNum(e.atX)) { const uu = ctx.toNorm(e.atX, 0)[0]; const v = polyAtU(c.poly, uu); if (v !== null) target = [uu, v]; }
          else {
            // anywhere on the curve
            const v = polyAtU(c.poly, p[0]); const uu = polyAtV(c.poly, p[1]);
            const d = Math.min(v === null ? Infinity : Math.abs(v - p[1]), uu === null ? Infinity : Math.abs(uu - p[0]));
            res.ok = d <= tol;
            res.message = res.ok ? (t.success || `${label} is on ${refLabel(spec, e.onCurve)}.`) : (hints.near || `${label} should sit on ${refLabel(spec, e.onCurve)}.`);
            results.push(res); continue;
          }
        } else if (e.side && e.side.of) {
          const c = resolveRef(ctx, e.side.of, models);
          const name = refLabel(spec, e.side.of);
          if (!c || c.kind !== 'line') { res.message = `Draw ${name} first.`; results.push(res); continue; }
          const gap = sideGap(c.poly, p);
          const minGap = isNum(e.side.minGap) ? e.side.minGap : 0.03;
          const want = e.side.which === 'below' ? -1 : 1;
          res.ok = gap * want >= minGap;
          const where = want > 0 ? 'above / beyond' : 'below / inside';
          res.message = res.ok ? (t.success || `${label} is ${where} ${name}.`)
            : (hints.near || (Math.abs(gap) < minGap ? `${label} is on ${name} — move it clearly ${want > 0 ? 'outside' : 'inside'} the curve.` : `${label} should be ${where} ${name}.`));
          results.push(res); continue;
        } else if (e.region) {
          const r = e.region;
          const [x, y] = [spec.x.min + p[0] * (spec.x.max - spec.x.min), spec.y.min + p[1] * (spec.y.max - spec.y.min)];
          const inside = (r.xmin == null || x >= r.xmin) && (r.xmax == null || x <= r.xmax) && (r.ymin == null || y >= r.ymin) && (r.ymax == null || y <= r.ymax);
          res.ok = inside;
          res.message = inside ? (t.success || `${label} is in the right region.`) : (hints.near || `${label} is not in the correct region of the graph.`);
          results.push(res); continue;
        }
        if (problem) { res.message = problem; results.push(res); continue; }
        // relative comparison (can be combined with target check)
        const problems = [];
        let onTarget = false;
        if (target) {
          const d = dist(p, target);
          onTarget = d <= tol;
          if (!onTarget) problems.push(hints.near || `${label} is too far from where it should be${e.atIntersection ? ` (where ${refLabel(spec, e.atIntersection[0])} meets ${refLabel(spec, e.atIntersection[1])})` : ''}.`);
        }
        if (e.relativeTo) {
          const ref = resolveRef(ctx, e.relativeTo.ref, models);
          if (ref && ref.kind === 'point') {
            // When the student's point is already on the target (e.g. where their own S₂ meets D), judge the
            // exact target instead of the tap: a small-but-correct shift moves the intersection only a little,
            // and click jitter must not flip the sign.
            const probe = onTarget ? target : p;
            const dz = onTarget ? 0.002 : (isNum(e.relativeTo.deadZone) ? e.relativeTo.deadZone : TOL.deadZone);
            const cmp = (delta, want, axisName) => {
              if (!want || want === 'any') return null;
              const s = delta > dz ? '+' : delta < -dz ? '-' : '0';
              if (s === want) return null;
              const words = { '+': 'higher', '-': 'lower', '0': 'the same' };
              return hints.relative || `${label} should have ${want === '0' ? 'the same' : words[want]} ${axisName} ${want === '0' ? 'as' : 'than'} ${refLabel(spec, e.relativeTo.ref)}.`;
            };
            const m1 = cmp(probe[0] - ref.point[0], e.relativeTo.x, spec.x.label.toLowerCase());
            const m2 = cmp(probe[1] - ref.point[1], e.relativeTo.y, spec.y.label.toLowerCase());
            if (m1) problems.push(m1); if (m2) problems.push(m2);
            // …but a tap that is clearly nearer the old point than the new target is just the old point.
            const moves = [e.relativeTo.x, e.relativeTo.y].some(s => s === '+' || s === '-');
            if (!m1 && !m2 && onTarget && moves && dist(p, ref.point) < 0.5 * dist(p, target))
              problems.push(hints.relative || `${label} is sitting on ${refLabel(spec, e.relativeTo.ref)} — mark where the curves cross now.`);
          }
        }
        res.ok = problems.length === 0;
        res.message = res.ok ? (t.success || `${label} is in the right place.`) : problems[0];
      }
      results.push(res);
    }
    return { ok: results.every(r => r.ok), results };
  };

  EconGraph.PALETTE = PALETTE;
  EconGraph.TOL = TOL;
  EconGraph._geom = { fitLine, clipLineToBox, polyAtU, polyAtV, polyIntersect, shiftBetween, slopeClass };
  global.EconGraph = EconGraph;
})(window);
