/* 1B03 Graph Lab — core: math helpers, an SVG plot, control widgets and the drill engine.
 * Every lab/drill file registers itself on window.GL; init.js mounts them. */
(function () {
  'use strict';
  const NS = 'http://www.w3.org/2000/svg';
  const GL = window.GL = window.GL || {};

  /* ════════════ helpers ════════════ */
  const $ = (s, r = document) => r.querySelector(s);
  const el = (tag, attrs = {}, kids = []) => {
    const e = document.createElement(tag);
    for (const k in attrs) {
      const v = attrs[k];
      if (v == null || v === false) continue;
      if (k === 'html') e.innerHTML = v;
      else if (k === 'text') e.textContent = v;
      else if (k.startsWith('on')) e.addEventListener(k.slice(2), v);
      else if (k === 'class') e.className = v;
      else e.setAttribute(k, v === true ? '' : v);
    }
    (Array.isArray(kids) ? kids : [kids]).forEach(c => c != null && e.append(c));
    return e;
  };
  const sv = (tag, attrs = {}) => {
    const e = document.createElementNS(NS, tag);
    for (const k in attrs) if (attrs[k] != null) e.setAttribute(k, attrs[k]);
    return e;
  };
  const clamp = (v, a, b) => Math.max(a, Math.min(b, v));
  const round = (v, d = 2) => { const m = Math.pow(10, d); return Math.round(v * m) / m; };
  /* $1,234.5 style numbers; d = max decimals */
  const fmt = (v, d = 2) => {
    if (!isFinite(v)) return '—';
    const r = round(v, d);
    const s = Math.abs(r).toLocaleString('en-CA', { maximumFractionDigits: d, minimumFractionDigits: 0 });
    return (r < 0 ? '−' : '') + s;
  };
  /* dollars: whole numbers stay whole, anything else shows exactly d decimals ($40.50, not $40.5) */
  const money = (v, d = 2) => {
    if (!isFinite(v)) return '—';
    const a = round(Math.abs(v), d);
    const s = Number.isInteger(a) ? a.toLocaleString('en-CA') : a.toLocaleString('en-CA', { minimumFractionDigits: d, maximumFractionDigits: d });
    return (round(v, d) < 0 ? '−$' : '$') + s;
  };
  const pick = a => a[Math.floor(Math.random() * a.length)];
  const rint = (a, b) => a + Math.floor(Math.random() * (b - a + 1));
  const shuffle = a => { a = a.slice(); for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(Math.random() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; };
  /* root of f on [a,b] by bisection (f(a), f(b) opposite signs) */
  function bisect(f, a, b, it = 80) {
    let fa = f(a);
    for (let i = 0; i < it; i++) {
      const m = (a + b) / 2, fm = f(m);
      if ((fm > 0) === (fa > 0)) { a = m; fa = fm; } else b = m;
    }
    return (a + b) / 2;
  }
  /* minimum of a unimodal f on [a,b] */
  function argmin(f, a, b, it = 90) {
    const g = (Math.sqrt(5) - 1) / 2;
    let c = b - g * (b - a), d = a + g * (b - a);
    for (let i = 0; i < it; i++) { if (f(c) < f(d)) b = d; else a = c; c = b - g * (b - a); d = a + g * (b - a); }
    return (a + b) / 2;
  }
  /* trapezoid integral */
  function integ(f, a, b, n = 200) {
    if (b <= a) return 0;
    const h = (b - a) / n; let s = (f(a) + f(b)) / 2;
    for (let i = 1; i < n; i++) s += f(a + i * h);
    return s * h;
  }
  const niceStep = (span, target = 6) => {
    const raw = span / target, p = Math.pow(10, Math.floor(Math.log10(raw))), m = raw / p;
    return (m < 1.5 ? 1 : m < 3 ? 2 : m < 7 ? 5 : 10) * p;
  };
  Object.assign(GL, { $, el, sv, clamp, round, fmt, money, pick, rint, shuffle, bisect, argmin, integ });

  /* ════════════ Plot ════════════ */
  let plotId = 0;
  class Plot {
    /* opts: x:[x0,x1], y:[y0,y1], w, h, xlabel, ylabel, xticks, yticks (false = none), title */
    constructor(host, o = {}) {
      this.o = Object.assign({ x: [0, 100], y: [0, 100], w: 640, h: 400, xlabel: 'Quantity', ylabel: '$', grid: true }, o);
      this.m = Object.assign({ l: 64, r: 30, t: 16, b: 44 }, o.margin || {});
      /* on a phone, shrink the drawing box so the text doesn't shrink to nothing */
      const hw = host.clientWidth;
      if (!o.fixed && hw && hw < 540) { const k = Math.max(0.6, hw / 560); this.o.w = Math.round(this.o.w * k); this.o.h = Math.round(this.o.h * k); }
      this.id = 'glp' + (++plotId);
      this.wrap = el('div', { class: 'gl-plot' });
      if (o.title) this.wrap.append(el('p', { class: 'gl-plot-title', html: o.title }));
      this.svg = sv('svg', { viewBox: `0 0 ${this.o.w} ${this.o.h}`, role: 'img', 'aria-label': o.aria || o.title || 'Interactive economics graph' });
      this.wrap.append(this.svg);
      host.append(this.wrap);
      const defs = sv('defs');
      const cp = sv('clipPath', { id: this.id + 'c' });
      this.clipRect = sv('rect');
      cp.append(this.clipRect); defs.append(cp);
      const mk = sv('marker', { id: this.id + 'a', viewBox: '0 0 10 10', refX: 8, refY: 5, markerWidth: 7, markerHeight: 7, orient: 'auto-start-reverse' });
      mk.append(sv('path', { d: 'M0,0 L10,5 L0,10 z', fill: 'context-stroke' }));
      defs.append(mk);
      this.svg.append(defs);
      this.gAxes = sv('g'); this.gFill = sv('g', { 'clip-path': `url(#${this.id}c)` });
      this.gGuide = sv('g'); this.gCurve = sv('g', { 'clip-path': `url(#${this.id}c)` });
      this.gMark = sv('g'); this.gLab = sv('g'); this.gTop = sv('g');
      this.svg.append(this.gAxes, this.gFill, this.gGuide, this.gCurve, this.gMark, this.gLab, this.gTop);
      this.setRange(this.o.x, this.o.y);
    }
    setRange(x, y) { this.o.x = x; this.o.y = y; this.drawAxes(); return this; }
    get W() { return this.o.w - this.m.l - this.m.r; }
    get H() { return this.o.h - this.m.t - this.m.b; }
    sx(x) { const [a, b] = this.o.x; return this.m.l + (x - a) / (b - a) * this.W; }
    sy(y) { const [a, b] = this.o.y; return this.o.h - this.m.b - (y - a) / (b - a) * this.H; }
    ix(px) { const [a, b] = this.o.x; return a + (px - this.m.l) / this.W * (b - a); }
    iy(py) { const [a, b] = this.o.y; return a + (this.o.h - this.m.b - py) / this.H * (b - a); }
    drawAxes() {
      const g = this.gAxes; g.textContent = '';
      this.clipRect.setAttribute('x', this.m.l); this.clipRect.setAttribute('y', this.m.t - 2);
      this.clipRect.setAttribute('width', this.W + 2); this.clipRect.setAttribute('height', this.H + 2);
      const [x0, x1] = this.o.x, [y0, y1] = this.o.y;
      this.ticks = { x: [], y: [] };
      if (this.o.xticks !== false) {
        const st = this.o.xstep || niceStep(x1 - x0);
        for (let v = Math.ceil(x0 / st) * st; v <= x1 + 1e-9; v += st) this.ticks.x.push(round(v, 6));
      }
      if (this.o.yticks !== false) {
        const st = this.o.ystep || niceStep(y1 - y0, 5);
        for (let v = Math.ceil(y0 / st) * st; v <= y1 + 1e-9; v += st) this.ticks.y.push(round(v, 6));
      }
      this.gTicks = sv('g'); g.append(this.gTicks);
      g.append(sv('path', { class: 'gl-axis', d: `M${this.m.l},${this.m.t - 6} V${this.sy(y0)} H${this.m.l + this.W + 8}` }));
      g.append(Object.assign(sv('text', { class: 'gl-axlab', x: this.m.l + this.W, y: this.o.h - 6, 'text-anchor': 'end' }), { textContent: this.o.xlabel }));
      const yl = sv('text', { class: 'gl-axlab', x: 14, y: this.m.t + this.H / 2, 'text-anchor': 'middle', transform: `rotate(-90 14 ${this.m.t + this.H / 2})` });
      yl.textContent = this.o.ylabel; g.append(yl);
      this.marks = { x: [], y: [] };
      this.renderTicks();
    }
    renderTicks() {
      const g = this.gTicks; g.textContent = '';
      const near = (arr, px, sc) => arr.some(m => Math.abs(sc(m) - px) < 20);
      if (this.o.grid) {
        this.ticks.y.forEach(v => { if (v > this.o.y[0]) g.append(sv('line', { class: 'gl-gridl', x1: this.m.l, x2: this.m.l + this.W, y1: this.sy(v), y2: this.sy(v) })); });
      }
      const fx = this.o.xfmt || (v => fmt(v, 2)), fy = this.o.yfmt || (v => fmt(v, 2));
      this.ticks.x.forEach(v => {
        if (near(this.marks.x.map(m => m.v), this.sx(v), x => this.sx(x))) return;
        const t = sv('text', { class: 'gl-tick', x: this.sx(v), y: this.o.h - this.m.b + 16, 'text-anchor': 'middle' }); t.textContent = fx(v); g.append(t);
      });
      this.ticks.y.forEach(v => {
        if (near(this.marks.y.map(m => m.v), this.sy(v), y => this.sy(y))) return;
        const t = sv('text', { class: 'gl-tick', x: this.m.l - 7, y: this.sy(v) + 4, 'text-anchor': 'end' }); t.textContent = fy(v); g.append(t);
      });
      this.marks.x.forEach(m => {
        const gg = sv('g', { class: 'gl-mark' });
        gg.append(sv('line', { x1: this.sx(m.v), x2: this.sx(m.v), y1: this.sy(this.o.y[0]), y2: this.sy(this.o.y[0]) + 5 }));
        const t = sv('text', { x: this.sx(m.v), y: this.o.h - this.m.b + 17, 'text-anchor': 'middle' }); t.textContent = m.label; gg.append(t);
        if (m.cls) t.setAttribute('class', m.cls);
        g.append(gg);
      });
      this.marks.y.forEach(m => {
        const gg = sv('g', { class: 'gl-mark' });
        gg.append(sv('line', { x1: this.m.l - 5, x2: this.m.l, y1: this.sy(m.v), y2: this.sy(m.v) }));
        const t = sv('text', { x: this.m.l - 8, y: this.sy(m.v) + 4, 'text-anchor': 'end' }); t.textContent = m.label; gg.append(t);
        if (m.cls) t.setAttribute('class', m.cls);
        g.append(gg);
      });
    }
    /* wipe everything drawn since the axes */
    clear() {
      [this.gFill, this.gGuide, this.gCurve, this.gMark, this.gLab, this.gTop].forEach(g => g.textContent = '');
      this.marks = { x: [], y: [] }; this.labelBoxes = [];
      this.renderTicks();
      return this;
    }
    /* axis value labels in place of ticks (call after clear) */
    xmark(v, label, cls) { if (isFinite(v) && v >= this.o.x[0] && v <= this.o.x[1]) { this.marks.x.push({ v, label: label ?? fmt(v), cls }); this.renderTicks(); } return this; }
    ymark(v, label, cls) { if (isFinite(v) && v >= this.o.y[0] && v <= this.o.y[1]) { this.marks.y.push({ v, label: label ?? fmt(v), cls }); this.renderTicks(); } return this; }
    pathFor(f, a, b, n = 220) {
      const [y0, y1] = this.o.y, span = y1 - y0;
      let d = '', pen = false;
      for (let i = 0; i <= n; i++) {
        const x = a + (b - a) * i / n, y = f(x);
        if (!isFinite(y) || y > y1 + span * 3 || y < y0 - span * 3) { pen = false; continue; }
        d += (pen ? 'L' : 'M') + this.sx(x).toFixed(1) + ',' + this.sy(y).toFixed(1);
        pen = true;
      }
      return d;
    }
    /* f: x→y. opts: cls, from, to, label, labelX, lab:{dx,dy,anchor}, extra classes */
    fn(f, o = {}) {
      const a = Math.max(this.o.x[0], o.from ?? this.o.x[0]), b = Math.min(this.o.x[1], o.to ?? this.o.x[1]);
      if (b <= a) return null;
      const p = sv('path', { class: `gl-curve ${o.cls || ''}`, d: this.pathFor(f, a, b, o.n) });
      (o.top ? this.gTop : this.gCurve).append(p);
      if (o.label) this.curveLabel(f, a, b, o);
      return p;
    }
    curveLabel(f, a, b, o) {
      let x = o.labelX;
      if (x == null) {
        /* the right-most point still inside the box */
        const [y0, y1] = this.o.y;
        x = null;
        for (let i = 200; i >= 0; i--) {
          const xx = a + (b - a) * i / 200, y = f(xx);
          if (isFinite(y) && y >= y0 + (y1 - y0) * 0.03 && y <= y1 - (y1 - y0) * 0.02) { x = xx; break; }
        }
        if (x == null) return;
      }
      const y = f(x);
      const L = o.lab || {};
      this.text(x, y, o.label, { cls: 'gl-clab ' + (o.cls || '').split(' ').filter(c => c.startsWith('c-')).join(' '), dx: L.dx ?? 6, dy: L.dy ?? -7, anchor: L.anchor || 'start' });
    }
    /* polyline through data points */
    line(pts, o = {}) {
      const d = pts.map((p, i) => (i ? 'L' : 'M') + this.sx(p[0]).toFixed(1) + ',' + this.sy(p[1]).toFixed(1)).join('');
      const p = sv('path', { class: `gl-curve ${o.cls || ''}`, d });
      (o.top ? this.gTop : o.guide ? this.gGuide : this.gCurve).append(p);
      if (o.arrow) p.setAttribute('marker-end', `url(#${this.id}a)`);
      return p;
    }
    seg(x1, y1, x2, y2, o = {}) { return this.line([[x1, y1], [x2, y2]], o); }
    /* dashed guide from the axes to (x, y) */
    guide(x, y, o = {}) {
      const g = this.gGuide;
      if (o.v !== false) g.append(sv('line', { class: 'gl-guide', x1: this.sx(x), x2: this.sx(x), y1: this.sy(this.o.y[0]), y2: this.sy(y) }));
      if (o.h !== false) g.append(sv('line', { class: 'gl-guide', x1: this.sx(o.x0 ?? this.o.x[0]), x2: this.sx(x), y1: this.sy(y), y2: this.sy(y) }));
      return this;
    }
    dot(x, y, o = {}) {
      if (!isFinite(x) || !isFinite(y)) return null;
      const c = sv('circle', { class: `gl-dot ${o.cls || 'c-ink'}`, cx: this.sx(x), cy: this.sy(y), r: o.r || 5.5 });
      (o.layer || this.gMark).append(c);
      return c;
    }
    poly(pts, o = {}) {
      const p = sv('polygon', { class: `f-area ${o.cls || ''}`, points: pts.map(p => this.sx(p[0]).toFixed(1) + ',' + this.sy(p[1]).toFixed(1)).join(' ') });
      (o.layer || this.gFill).append(p);
      if (o.label) {
        const c = o.at || pts.reduce((s, p) => [s[0] + p[0] / pts.length, s[1] + p[1] / pts.length], [0, 0]);
        this.text(c[0], c[1], o.label, { cls: 'gl-flab' + (o.dark ? ' on-dark' : ''), anchor: 'middle', dy: 4 });
      }
      return p;
    }
    rect(x0, y0, x1, y1, o = {}) { return this.poly([[x0, y0], [x1, y0], [x1, y1], [x0, y1]], o); }
    /* area between f (top) and g (bottom) for x in [a,b] */
    between(f, g, a, b, o = {}) {
      const n = 80, top = [], bot = [];
      for (let i = 0; i <= n; i++) { const x = a + (b - a) * i / n; top.push([x, f(x)]); bot.push([x, g(x)]); }
      return this.poly(top.concat(bot.reverse()), o);
    }
    text(x, y, s, o = {}) {
      const t = sv('text', { class: o.cls || 'gl-note', x: this.sx(x) + (o.dx || 0), y: this.sy(y) + (o.dy || 0), 'text-anchor': o.anchor || 'start' });
      String(s).split('\n').forEach((line, i) => {
        const ts = sv('tspan', { x: this.sx(x) + (o.dx || 0), dy: i ? '1.2em' : 0 }); ts.textContent = line; t.append(ts);
      });
      (o.layer || this.gLab).append(t);
      return t;
    }
    /* vertical/horizontal bracket with a label (markups, excess capacity) */
    brace(x1, y1, x2, y2, label, o = {}) {
      const p = this.line([[x1, y1], [x2, y2]], { cls: 'gl-brace ' + (o.cls || 'c-ink'), top: true });
      p.setAttribute('marker-end', `url(#${this.id}a)`); p.setAttribute('marker-start', `url(#${this.id}a)`);
      if (label) this.text((x1 + x2) / 2, (y1 + y2) / 2, label, { cls: 'gl-note small', dx: o.dx ?? 8, dy: o.dy ?? 4, anchor: o.anchor || 'start' });
      return p;
    }
    /* pointer in data coords; cb(x, y, evt). type: 'move' | 'down' | 'drag' */
    onPointer(cb) {
      const pt = this.svg.createSVGPoint();
      const conv = e => { pt.x = e.clientX; pt.y = e.clientY; const p = pt.matrixTransform(this.svg.getScreenCTM().inverse()); return [this.ix(p.x), this.iy(p.y), p]; };
      let down = false;
      this.svg.addEventListener('pointerdown', e => { down = true; this.svg.setPointerCapture?.(e.pointerId); const [x, y] = conv(e); cb(x, y, 'down', e); });
      this.svg.addEventListener('pointermove', e => { const [x, y] = conv(e); cb(x, y, down ? 'drag' : 'move', e); });
      const up = e => { if (down) { down = false; const [x, y] = conv(e); cb(x, y, 'up', e); } };
      this.svg.addEventListener('pointerup', up); this.svg.addEventListener('pointercancel', up);
      this.svg.addEventListener('pointerleave', e => { if (!down) cb(NaN, NaN, 'leave', e); });
      return this;
    }
    inBox(x, y) { return x >= this.o.x[0] && x <= this.o.x[1] && y >= this.o.y[0] && y <= this.o.y[1]; }
  }
  GL.Plot = Plot;

  /* ════════════ widgets ════════════ */
  GL.slider = function (host, o) {
    const id = 'gls' + Math.random().toString(36).slice(2, 8);
    const inp = el('input', { type: 'range', id, min: o.min, max: o.max, step: o.step || 1, value: o.value });
    const out = el('output', { for: id });
    const w = el('div', { class: 'gl-slider' }, [el('label', { for: id, html: o.label }), out, inp]);
    const show = () => { out.textContent = (o.fmt || (v => fmt(v, 2)))(+inp.value); };
    inp.addEventListener('input', () => { show(); o.oninput && o.oninput(+inp.value); });
    show(); host.append(w);
    return { el: w, input: inp, get value() { return +inp.value; }, set(v, fire) { inp.value = v; show(); if (fire) o.oninput && o.oninput(+inp.value); } };
  };
  GL.seg = function (host, opts, value, onchange) {
    const w = el('div', { class: 'gl-seg', role: 'group' });
    const btns = opts.map(([v, label]) => {
      const b = el('button', { type: 'button', 'aria-pressed': String(v === value), html: label, onclick: () => set(v, true) });
      b.dataset.v = v; w.append(b); return b;
    });
    function set(v, fire) { value = v; btns.forEach(b => b.setAttribute('aria-pressed', String(b.dataset.v === String(v)))); if (fire) onchange(v); }
    host.append(w);
    return { el: w, set, get value() { return value; } };
  };
  GL.toggle = function (host, label, checked, onchange) {
    const inp = el('input', { type: 'checkbox' }); inp.checked = !!checked;
    const w = el('label', { class: 'gl-toggle' }, [inp, el('span', { html: label })]);
    inp.addEventListener('change', () => onchange(inp.checked));
    host.append(w);
    return { el: w, input: inp, get value() { return inp.checked; }, set(v) { inp.checked = v; } };
  };
  GL.ctrl = (host, title) => { const c = el('div', { class: 'gl-ctrl' }); if (title) c.append(el('p', { class: 'gl-ctrl-h', text: title })); host.append(c); return c; };
  /* rows: [[label, value, hl?], …] */
  GL.readout = function (host) {
    const t = el('table', { class: 'gl-read' }); host.append(t);
    return { el: t, set(rows) { t.innerHTML = rows.filter(Boolean).map(r => `<tr${r[2] ? ' class="hl"' : ''}><td>${r[0]}</td><td>${r[1]}</td></tr>`).join(''); } };
  };
  GL.status = function (host) {
    const d = el('div', { class: 'gl-status', 'aria-live': 'polite' }); host.append(d);
    return { el: d, set(kind, html) { d.className = 'gl-status ' + (kind || ''); d.innerHTML = html; } };
  };
  GL.legend = function (host, items) {
    host.append(el('div', { class: 'gl-legend', html: items.map(([cls, label, fill]) => fill ? `<span><i class="fill ${cls}"></i>${label}</span>` : `<span class="${cls}"><i></i>${label}</span>`).join('') }));
  };
  /* a lab card: { head, plotHost, side } */
  GL.labCard = function (host, title, tag) {
    const card = el('div', { class: 'gl-lab' });
    const head = el('div', { class: 'gl-lab-head' }, [el('h3', { html: title }), tag ? el('span', { class: 'gl-tag', text: tag }) : null]);
    const grid = el('div', { class: 'gl-grid2' });
    const plotHost = el('div'), side = el('div', { class: 'gl-side' });
    grid.append(plotHost, side); card.append(head, grid); host.append(card);
    return { card, head, grid, plotHost, side };
  };
  /* animate a number from a to b (ms), calling step(v) */
  GL.tween = function (a, b, ms, step, done) {
    const t0 = performance.now();
    const ease = t => t < .5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;
    function f(now) { const t = Math.min(1, (now - t0) / ms); step(a + (b - a) * ease(t)); if (t < 1) requestAnimationFrame(f); else done && done(); }
    requestAnimationFrame(f);
  };

  /* ════════════ progress (localStorage) ════════════ */
  const KEY = 'hub:1b03-graphlab';
  const load = () => { try { return JSON.parse(localStorage.getItem(KEY)) || {}; } catch (e) { return {}; } };
  const save = s => { try { localStorage.setItem(KEY, JSON.stringify(s)); } catch (e) { } };
  GL.progress = {
    get: load,
    record(skill, ok) {
      const s = load(); s.sk = s.sk || {};
      const r = s.sk[skill] || [0, 0]; r[1]++; if (ok) r[0]++; s.sk[skill] = r;
      s.n = (s.n || 0) + 1; s.ok = (s.ok || 0) + (ok ? 1 : 0);
      save(s); document.dispatchEvent(new CustomEvent('gl:progress'));
    },
    reset() { save({}); document.dispatchEvent(new CustomEvent('gl:progress')); }
  };

  /* ════════════ drills ════════════
   * A generator is { id, unit, skill, label, make() → question }.
   * question: { prompt, kind: 'mc'|'multi'|'num'|'select'|'click', figure?(host) → Plot (for 'click'),
   *   options, answer, fields:[{label, answer, tol, rel, pre, options}], click:{axis, x, y, tolX, tolY, show(plot)},
   *   explain (html), work (plain text worked solution) } */
  GL.gens = [];
  GL.addGen = g => GL.gens.push(g);
  GL.UNITS = { u7: 'Unit 7 · Costs', u8: 'Unit 8 · Perfect competition', u9: 'Unit 9 · Monopolistic competition', u10: 'Unit 10 · Oligopoly', u11: 'Unit 11 · Monopoly' };

  const near = (v, ans, tol, rel) => {
    if (!isFinite(v)) return false;
    const t = rel ? Math.abs(ans) * rel : tol ?? 0.01;
    return Math.abs(v - ans) <= Math.max(t, 1e-9);
  };
  const parseNum = s => { s = String(s).replace(/[,$\s]/g, '').replace(/[−–]/g, '-'); return s === '' ? NaN : +s; };

  GL.Drill = function (host, o) {
    /* o: { title, units:[…] (filter), chips:bool, mastery:bool } */
    const box = el('div', { class: 'gl-drill' });
    const top = el('div', { class: 'gl-drill-top' });
    top.append(el('h3', { html: o.title || 'Drill' }));
    const score = el('div', { class: 'gl-score' });
    const sc = el('span', { text: '0 / 0' }), st = el('span', { class: 'streak', text: '🔥 0' });
    score.append(sc, st); top.append(score); box.append(top);
    let units = o.units ? o.units.slice() : Object.keys(GL.UNITS);
    let right = 0, tries = 0, streak = 0;
    if (o.chips) {
      const chips = el('div', { class: 'gl-chips' });
      const all = el('button', { type: 'button', class: 'gl-chip', 'aria-pressed': 'true', text: 'All units' });
      const bs = Object.keys(GL.UNITS).map(u => el('button', { type: 'button', class: 'gl-chip', 'aria-pressed': 'false', text: GL.UNITS[u] }));
      const sync = () => { const allOn = units.length === Object.keys(GL.UNITS).length; all.setAttribute('aria-pressed', String(allOn)); bs.forEach((b, i) => b.setAttribute('aria-pressed', String(!allOn && units.includes(Object.keys(GL.UNITS)[i])))); };
      all.onclick = () => { units = Object.keys(GL.UNITS); sync(); next(); };
      bs.forEach((b, i) => b.onclick = () => {
        const u = Object.keys(GL.UNITS)[i];
        const allOn = units.length === Object.keys(GL.UNITS).length;
        if (allOn) units = [u]; else if (units.includes(u)) { units = units.filter(x => x !== u); if (!units.length) units = Object.keys(GL.UNITS); } else units.push(u);
        sync(); next();
      });
      chips.append(all, ...bs); box.append(chips);
    }
    const body = el('div'); box.append(body);
    const btns = el('div', { class: 'gl-btnrow' });
    const checkB = el('button', { type: 'button', class: 'gl-btn primary', text: 'Check' });
    const nextB = el('button', { type: 'button', class: 'gl-btn', text: 'Next question →' });
    const skipB = el('button', { type: 'button', class: 'gl-btn ghost', text: 'Skip' });
    btns.append(checkB, nextB, skipB);
    const fbHost = el('div'); box.append(fbHost, btns); btns.style.marginTop = '10px';
    let mastHost = null;
    if (o.mastery) {
      mastHost = el('div', { class: 'gl-mastery' });
      const resetB = el('button', { type: 'button', class: 'gl-btn ghost', text: 'Reset saved progress', style: 'margin-top:10px' });
      resetB.onclick = () => { if (confirm('Clear your Graph Lab drill history on this device?')) GL.progress.reset(); };
      const det = el('details', { style: 'margin-top:12px' }, [el('summary', { class: 'gl-key', style: 'cursor:pointer', html: '<b>Skill mastery on this device</b> (every drill on this page counts) — open to see which skills need work' }), mastHost, resetB]); box.append(det);
      const renderM = () => {
        const s = GL.progress.get().sk || {};
        const seen = new Map();
        GL.gens.forEach(g => { if (!seen.has(g.skill)) seen.set(g.skill, g); });
        mastHost.innerHTML = [...seen.values()].map(g => {
          const r = s[g.skill] || [0, 0], pct = r[1] ? Math.round(100 * r[0] / r[1]) : 0;
          return `<div class="gl-mast"><b>${g.label}</b>${GL.UNITS[g.unit].split(' · ')[0]} · ${r[0]}/${r[1]} right<div class="gl-bar"><i style="width:${pct}%"></i></div></div>`;
        }).join('');
      };
      document.addEventListener('gl:progress', renderM); renderM();
    }
    host.append(box);

    let q = null, gen = null, answered = false, state = {}, lastId = null;
    function next() {
      const pool = GL.gens.filter(g => units.includes(g.unit) && (!o.only || o.only.includes(g.id)));
      if (!pool.length) { body.innerHTML = '<p>No drills for this filter.</p>'; return; }
      /* prefer weaker skills a little */
      const prog = GL.progress.get().sk || {};
      const w = pool.map(g => { const r = prog[g.skill] || [0, 0]; return (g.id === lastId && pool.length > 1 ? 0.15 : 1) * (1.6 - (r[1] ? r[0] / r[1] : 0.5)); });
      let t = Math.random() * w.reduce((a, b) => a + b, 0), i = 0;
      while ((t -= w[i]) > 0 && i < pool.length - 1) i++;
      gen = pool[i]; lastId = gen.id;
      q = gen.make(); answered = false; state = {};
      render();
    }
    function render() {
      body.innerHTML = ''; fbHost.innerHTML = '';
      checkB.disabled = false; checkB.style.display = ''; nextB.style.display = 'none'; skipB.style.display = '';
      body.append(el('div', { class: 'gl-q', html: `<span class="skill">${GL.UNITS[gen.unit].split(' · ')[0]} · ${gen.label}</span>${q.prompt}` }));
      if (q.figure) {
        const fh = el('div', { class: 'gl-qfig' }); body.append(fh);
        state.plot = q.figure(fh);
        if (q.kind === 'click') {
          body.append(el('p', { class: 'gl-hint', text: q.click.hint || 'Click (or tap) the graph to place your answer, then press Check.' }));
          state.plot.onPointer((x, y, type) => {
            if (answered || type !== 'down' || !state.plot.inBox(x, y)) return;
            state.click = [x, y];
            state.marker && state.marker.remove();
            const ax = q.click.axis;
            const p = state.plot;
            const g = sv('g');
            if (ax === 'x') g.append(sv('line', { class: 'gl-scrub', x1: p.sx(x), x2: p.sx(x), y1: p.sy(p.o.y[0]), y2: p.sy(p.o.y[1]) }));
            if (ax === 'y') g.append(sv('line', { class: 'gl-scrub', x1: p.sx(p.o.x[0]), x2: p.sx(p.o.x[1]), y1: p.sy(y), y2: p.sy(y) }));
            g.append(sv('circle', { cx: p.sx(ax === 'y' ? p.o.x[0] : x), cy: p.sy(ax === 'x' ? p.o.y[0] : y), r: 7, fill: 'var(--acc)', stroke: 'var(--surface)', 'stroke-width': 2 }));
            p.gTop.append(g); state.marker = g;
          });
        }
      }
      if (q.kind === 'mc' || q.kind === 'multi') {
        const opts = el('div', { class: 'gl-opts' });
        state.sel = new Set();
        state.btns = q.options.map((t, i) => {
          const b = el('button', { type: 'button', class: 'gl-opt', 'aria-pressed': 'false', html: `<span class="k">${'ABCDEFGH'[i]}</span><span>${t}</span>` });
          b.onclick = () => {
            if (answered) return;
            if (q.kind === 'mc') { state.sel = new Set([i]); state.btns.forEach((x, j) => x.setAttribute('aria-pressed', String(j === i))); }
            else { state.sel.has(i) ? state.sel.delete(i) : state.sel.add(i); b.setAttribute('aria-pressed', String(state.sel.has(i))); }
          };
          opts.append(b); return b;
        });
        if (q.kind === 'multi') body.append(el('p', { class: 'gl-hint', text: 'Select all that apply.' }));
        body.append(opts);
      }
      if (q.kind === 'num' || q.kind === 'select') {
        const fs = el('div', { class: 'gl-fields' });
        state.inputs = q.fields.map(f => {
          const wrap = el('label', { class: 'gl-field' }, [el('span', { html: f.label })]);
          let inp;
          if (f.options) { inp = el('select'); inp.append(el('option', { value: '', text: 'Choose…' })); f.options.forEach((t, i) => inp.append(el('option', { value: i, html: t }))); }
          else inp = el('input', { type: 'text', inputmode: 'decimal', autocomplete: 'off', placeholder: f.pre ? f.pre + '…' : '' });
          inp.addEventListener('keydown', e => { if (e.key === 'Enter') check(); });
          wrap.append(inp); fs.append(wrap); return { f, inp, wrap };
        });
        body.append(fs);
      }
    }
    function check() {
      if (answered || !q) return;
      let ok = false;
      if (q.kind === 'mc' || q.kind === 'multi') {
        if (!state.sel.size) return;
        const ans = new Set([].concat(q.answer));
        ok = state.sel.size === ans.size && [...state.sel].every(i => ans.has(i));
        state.btns.forEach((b, i) => { if (ans.has(i)) b.classList.add('right'); else if (state.sel.has(i)) b.classList.add('wrong'); });
      } else if (q.kind === 'num' || q.kind === 'select') {
        if (state.inputs.every(x => x.inp.value === '')) return;
        ok = true;
        state.inputs.forEach(x => {
          const f = x.f;
          const good = f.options ? +x.inp.value === f.answer && x.inp.value !== '' : near(parseNum(x.inp.value), f.answer, f.tol, f.rel);
          x.wrap.classList.add(good ? 'right' : 'wrong');
          if (!good) { ok = false; x.wrap.append(el('span', { class: 'fix', html: '✓ ' + (f.options ? f.options[f.answer] : (f.pre || '') + fmt(f.answer, 2)) })); }
        });
      } else if (q.kind === 'click') {
        if (!state.click) return;
        const c = q.click, [x, y] = state.click;
        ok = (c.axis === 'y' || Math.abs(x - c.x) <= c.tolX) && (c.axis === 'x' || Math.abs(y - c.y) <= c.tolY);
        c.show && c.show(state.plot);
      }
      answered = true;
      tries++; if (ok) { right++; streak++; } else streak = 0;
      sc.textContent = `${right} / ${tries}`; st.textContent = '🔥 ' + streak;
      GL.progress.record(gen.skill, ok);
      fbHost.innerHTML = '';
      const fb = el('div', { class: 'gl-fb ' + (ok ? 'ok' : 'bad'), html: `<b class="v">${ok ? 'Correct!' : 'Not quite.'}</b> ${q.explain || ''}` });
      if (q.work) fb.append(el('pre', { text: q.work }));
      fbHost.append(fb);
      checkB.style.display = 'none'; skipB.style.display = 'none'; nextB.style.display = '';
      nextB.focus({ preventScroll: true });
    }
    checkB.onclick = check; nextB.onclick = next; skipB.onclick = next;
    next();
    return { next };
  };

  /* draw one standard firm graph quickly (used by drills): curves = [{f, cls, label, from, to}] */
  GL.quickPlot = function (host, o, curves) {
    const p = new Plot(host, Object.assign({ w: 600, h: 360 }, o));
    curves.forEach(c => p.fn(c.f, c));
    return p;
  };
})();
