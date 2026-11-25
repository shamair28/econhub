/* 1B03 Graph Lab — the interactive explorers (Units 7, 8, 9, 11, the recipe and the comparison).
 * Each lab is GL.labs.<name>(host). Oligopoly games live in games.js. */
(function () {
  'use strict';
  const GL = window.GL;
  const { el, fmt, money, round, argmin, bisect, clamp } = GL;
  const labs = GL.labs = GL.labs || {};

  /* ════════════ shared cost models ════════════ */
  /* Unit 7/8 firm (same cost function as the Ch 9 and Ch 10 pages): FC = 1,000, VC = 0.01q³ − 1.2q² + 60q */
  const firm = (FC = 1000, w = 1) => {
    const VC = q => w * (0.01 * q * q * q - 1.2 * q * q + 60 * q);
    const MC = q => w * (0.03 * q * q - 2.4 * q + 60);
    const AVC = q => w * (0.01 * q * q - 1.2 * q + 60);
    const AFC = q => FC / q;
    const ATC = q => AVC(q) + FC / q;
    const TC = q => FC + VC(q);
    const qAVC = 60, minAVC = AVC(60);
    const qATC = argmin(ATC, 5, 200), minATC = ATC(qATC);
    /* rising branch of MC: the firm's supply */
    const qOfP = P => P < minAVC - 1e-9 ? 0 : (2.4 + Math.sqrt(Math.max(0, 5.76 - 0.12 * (60 - P / w)))) / 0.06;
    return { FC, w, VC, MC, AVC, AFC, ATC, TC, qAVC, minAVC, qATC, minATC, qOfP };
  };
  GL.firm = firm;

  /* linear monopoly model: d: P = a − bq, MC = c + dq, FC  (TC = FC + cq + dq²/2) */
  const mono = (a, b, c, d, FC) => {
    const VC = q => c * q + d * q * q / 2;
    const m = {
      a, b, c, d, FC, VC,
      D: q => a - b * q, MR: q => a - 2 * b * q, MC: q => c + d * q,
      ATC: q => FC / q + c + d * q / 2,
      TS: q => a * q - b * q * q / 2 - VC(q),
      qC: d + b > 0 ? Math.max(0, (a - c) / (b + d)) : 0
    };
    m.PC = m.D(m.qC);
    m.qM = Math.max(0, (a - c) / (2 * b + d)); m.PM = m.D(m.qM);
    m.qMES = d > 0 && FC > 0 ? Math.sqrt(2 * FC / d) : NaN; m.minATC = isFinite(m.qMES) ? m.ATC(m.qMES) : NaN;
    /* natural monopoly: ATC still falling where it meets demand ⇔ P = MC would not cover ATC */
    m.natural = FC > 0 && m.qC > 0 && m.ATC(m.qC) > m.PC + 1e-9;
    return m;
  };
  GL.mono = mono;

  /* ════════════ 0 · The recipe ════════════ */
  labs.recipe = function (host) {
    const f = firm();
    const CASES = {
      pc: {
        name: 'Perfect competition', x: [0, 110], y: [0, 110],
        D: () => 60, MR: () => 60, MC: f.MC, ATC: f.ATC, q: 80, P: 60, dLab: 'd = MR = P', mrSame: true,
        txt: ['A wheat farm (Unit 8). Its demand is the market price, $60, so d = MR = P — one horizontal line.',
          '<b>Cross:</b> MR (the $60 line) meets MC at <b>q = 80</b>. Left of 80, each unit adds more to revenue than to cost; right of it, less.',
          '<b>Climb:</b> go up from q = 80 to the demand curve. For a price taker it is the same $60 line, so <b>P = $60</b> (P = MC).',
          '<b>Compare:</b> at q = 80, ATC = $40.50. P = $60 is above it → profit of $19.50 per unit.',
          '<b>Box:</b> profit = (P − ATC) × q = (60 − 40.50) × 80 = <b>$1,560</b>. In the long run this profit attracts entry and the price falls to min ATC.']
      },
      mcomp: {
        name: 'Monopolistic competition', x: [0, 170], y: [0, 36],
        D: q => 32 - 0.2 * q, MR: q => 32 - 0.4 * q, MC: q => 0.4 * q, ATC: q => 300 / q + 0.2 * q, q: 40, P: 24, dLab: 'd',
        txt: ['Dr. Mang’s restaurant (Unit 9): demand P = 32 − 0.2q slopes down, so MR = 32 − 0.4q lies below it. MC = 0.4q; ATC = 300/q + 0.2q.',
          '<b>Cross:</b> MR = MC → 32 − 0.4q = 0.4q → <b>q = 40</b>. The height there is MC = $16 — that is NOT the price.',
          '<b>Climb:</b> up from q = 40 to the demand curve: P = 32 − 0.2(40) = <b>$24</b>. Markup P − MC = $8.',
          '<b>Compare:</b> ATC(40) = 300/40 + 0.2(40) = $15.50 &lt; $24 → profit.',
          '<b>Box:</b> (24 − 15.50) × 40 = <b>$340</b>. Easy entry means this is short-run only: rivals enter until d is tangent to ATC.']
      },
      mono: {
        name: 'Monopoly (profit)', x: [0, 180], y: [0, 760],
        D: q => 700 - 2 * q, MR: q => 700 - 4 * q, MC: q => 6 * q, ATC: q => 8000 / q + 3 * q, q: 70, P: 560, dLab: 'd = D',
        txt: ['Dr. Mang’s slide example (Unit 11): demand P = 700 − 2q, so MR = 700 − 4q; MC = 6q; ATC = 8,000/q + 3q.',
          '<b>Cross:</b> 700 − 4q = 6q → <b>q = 70</b>. MC there is $420.',
          '<b>Climb:</b> P = 700 − 2(70) = <b>$560</b>. Markup = 560 − 420 = $140.',
          '<b>Compare:</b> ATC(70) = 114.29 + 210 = $324.29 &lt; $560 → profit.',
          '<b>Box:</b> (560 − 324.29) × 70 = <b>$16,500</b>. Barriers to entry let it last — a monopoly rent.']
      },
      loss: {
        name: 'Monopoly (loss)', x: [0, 180], y: [0, 760],
        D: q => 700 - 2 * q, MR: q => 700 - 4 * q, MC: q => 6 * q, ATC: q => 30000 / q + 3 * q, q: 70, P: 560, dLab: 'd = D',
        txt: ['Same monopoly, but fixed cost is $30,000: ATC = 30,000/q + 3q. Fixed cost never moves MR or MC.',
          '<b>Cross:</b> still MR = MC at <b>q = 70</b>.',
          '<b>Climb:</b> still <b>P = $560</b>.',
          '<b>Compare:</b> ATC(70) = 428.57 + 210 = $638.57 &gt; $560 → a loss on every unit.',
          '<b>Box:</b> loss = (638.57 − 560) × 70 = <b>$5,500</b>. q = 70 is the loss-minimizing quantity; P &gt; AVC ($210), so it keeps operating for now.']
      }
    };
    const card = GL.labCard(host, 'One recipe for every firm graph', 'Start here');
    const p = new GL.Plot(card.plotHost, { w: 640, h: 420 });
    const side = card.side;
    const c1 = GL.ctrl(side, 'Market structure');
    let key = 'mono', step = 0, timer = null;
    GL.seg(c1, Object.keys(CASES).map(k => [k, CASES[k].name]), key, v => { key = v; go(0); });
    const steps = el('div', { class: 'gl-steps' });
    const names = [['0', 'The curves', 'd, MR, MC, ATC'], ['1', 'Cross', 'MR = MC → q'], ['2', 'Climb', 'up to d → P'], ['3', 'Compare', 'P vs ATC'], ['4', 'Box', '(P − ATC) × q']];
    const sb = names.slice(1).map(([n, t, s]) => {
      const b = el('button', { type: 'button', class: 'gl-step', html: `<b>${n} · ${t}</b>${s}` });
      b.onclick = () => { stop(); go(+n); }; steps.append(b); return b;
    });
    const btns = el('div', { class: 'gl-btnrow' });
    const play = el('button', { type: 'button', class: 'gl-btn primary', text: '▶ Play all steps' });
    const reset = el('button', { type: 'button', class: 'gl-btn', text: 'Reset' });
    btns.append(play, reset);
    const exp = el('div', { class: 'gl-explain', 'aria-live': 'polite' });
    side.append(btns);
    const c2 = GL.ctrl(side, 'The four steps (memorize the verbs)');
    c2.append(el('div', { html: '<b>Cross</b> → <b>Climb</b> → <b>Compare</b> → <b>Box</b><br><span style="font-size:13px;color:var(--muted)">Quantity comes from the <em>marginals</em>. Price comes from the <em>demand</em> curve. Profit is a <em>rectangle</em>, never a triangle.</span>' }));
    card.card.append(steps, exp);
    play.onclick = () => { stop(); go(0); let k = 0; timer = setInterval(() => { k++; go(k); if (k >= 4) stop(); }, 1700); };
    reset.onclick = () => { stop(); go(0); };
    function stop() { if (timer) clearInterval(timer); timer = null; }

    function go(s) {
      step = s;
      const C = CASES[key];
      p.setRange(C.x, C.y); p.clear();
      const faint = s >= 1 && s <= 1;
      const atcStart = C.x[1] * 0.03;
      p.fn(C.ATC, { cls: 'c-atc' + (s === 1 || s === 2 ? ' faint' : ''), from: atcStart, label: 'ATC' });
      p.fn(C.D, { cls: 'c-d' + (faint ? ' faint' : ''), label: C.dLab });
      if (!C.mrSame) p.fn(C.MR, { cls: 'c-mr' + (s === 2 ? ' faint' : ''), label: 'MR', from: 0, to: C.x[1] });
      p.fn(C.MC, { cls: 'c-mc' + (s === 2 ? ' faint' : ''), label: 'MC', from: C.mcFrom || 0 });
      const q = C.q, P = C.P, mc = C.MC(q), atc = C.ATC(q);
      if (s >= 1) {
        p.guide(q, mc, { h: false }); p.xmark(q, 'q* = ' + fmt(q));
        const d = p.dot(q, mc, { cls: 'c-mc', r: 7 }); if (s === 1) d.classList.add('gl-pulse');
        if (s === 1 && !C.mrSame) { p.ymark(mc, fmt(mc), 'c-mc'); p.guide(q, mc, { v: false }); }
      }
      if (s >= 2) {
        if (!C.mrSame) p.seg(q, mc, q, P, { cls: 'c-ink thin', top: true, arrow: true });
        p.guide(q, P, { v: false }); p.ymark(P, fmt(P));
        const d = p.dot(q, P, { cls: 'c-d', r: 7 }); if (s === 2) d.classList.add('gl-pulse');
      }
      if (s >= 3) {
        p.dot(q, atc, { cls: 'c-atc', r: 6 }); p.guide(q, atc, { v: false }); p.ymark(atc, fmt(atc), 'c-atc');
        p.brace(q + (C.x[1] - C.x[0]) * 0.03, P, q + (C.x[1] - C.x[0]) * 0.03, atc, (P > atc ? 'profit per unit\n' : 'loss per unit\n') + money(Math.abs(P - atc)));
      }
      if (s >= 4) {
        const pi = (P - atc) * q;
        p.rect(0, Math.min(P, atc), q, Math.max(P, atc), { cls: pi >= 0 ? 'f-profit' : 'f-loss', label: (pi >= 0 ? 'Profit ' : 'Loss ') + money(Math.abs(pi), 0) });
      }
      sb.forEach((b, i) => { b.setAttribute('aria-current', i + 1 === s ? 'step' : 'false'); b.classList.toggle('done', i + 1 < s); });
      exp.innerHTML = C.txt[s];
    }
    go(0);
  };

  /* ════════════ Unit 7 · production ════════════ */
  labs.production = function (host) {
    const TP = L => 6 * L * L - 0.2 * L * L * L, MP = L => 12 * L - 0.6 * L * L, AP = L => 6 * L - 0.2 * L * L;
    const card = GL.labCard(host, 'Production: total, marginal and average product', 'Unit 7');
    card.grid.classList.add('even');
    const p1 = new GL.Plot(card.plotHost, { x: [0, 25], y: [0, 900], w: 520, h: 330, xlabel: 'Workers (L)', ylabel: 'Output', title: 'Total product (TP)' });
    const p2 = new GL.Plot(card.side, { x: [0, 25], y: [-30, 70], w: 520, h: 330, xlabel: 'Workers (L)', ylabel: 'Output per worker', title: 'Marginal and average product' });
    const below = el('div', { class: 'gl-grid2', style: 'margin-top:12px' }); card.card.append(below);
    const c = GL.ctrl(below, 'Hire workers');
    let L = 8;
    const s = GL.slider(c, { label: 'Workers, L', min: 0, max: 25, step: 0.5, value: L, fmt: v => fmt(v, 1), oninput: v => { L = v; draw(); } });
    const right = el('div', { class: 'gl-side' }); below.append(right);
    const st = GL.status(right), ro = GL.readout(c);
    p1.onPointer((x, y, t) => { if ((t === 'drag' || t === 'down') && x >= 0 && x <= 25) { L = Math.round(x * 2) / 2; s.set(L); draw(); } });
    p2.onPointer((x, y, t) => { if ((t === 'drag' || t === 'down') && x >= 0 && x <= 25) { L = Math.round(x * 2) / 2; s.set(L); draw(); } });
    function draw() {
      p1.clear(); p2.clear();
      p1.fn(TP, { cls: 'c-ink', label: 'TP', labelX: 21 });
      p2.seg(0, 0, 25, 0, { cls: 'c-neutral thin' });
      p2.fn(MP, { cls: 'c-mc', label: 'MP', labelX: 21.5 }); p2.fn(AP, { cls: 'c-atc', label: 'AP', labelX: 23 });
      p1.dot(L, TP(L)); p1.guide(L, TP(L)); p1.xmark(L, 'L = ' + fmt(L, 1));
      if (L > 0) {
        /* tangent line shows MP as the slope of TP */
        const m = MP(L);
        p1.seg(Math.max(0, L - 4), TP(L) - 4 * m, Math.min(25, L + 4), TP(L) + 4 * m, { cls: 'c-mc thin', top: true });
      }
      p2.dot(L, MP(L), { cls: 'c-mc' }); p2.dot(L, AP(L), { cls: 'c-atc' }); p2.xmark(L, 'L = ' + fmt(L, 1));
      p2.dot(10, 60, { cls: 'c-neutral', r: 4 }); p2.text(10, 60, 'MP peaks (L = 10)', { dx: 6, dy: -8, cls: 'gl-note small' });
      p2.dot(15, 45, { cls: 'c-neutral', r: 4 }); p2.text(15, 45, 'MP = AP at AP’s max (L = 15)', { dx: 6, dy: -8, cls: 'gl-note small' });
      ro.set([['Total product TP', fmt(TP(L), 1), true], ['Marginal product MP', fmt(MP(L), 1)], ['Average product AP = TP ÷ L', L ? fmt(AP(L), 1) : '—']]);
      if (L === 0) st.set('', 'Drag the slider (or the graph) to hire workers.');
      else if (L < 10) st.set('ok', `Increasing marginal returns: each new worker adds more than the last (MP rising).<small>Specialization: workers split tasks. MP &gt; AP, so AP is being pulled up.</small>`);
      else if (L < 20) st.set('warn', `Diminishing marginal returns: MP is falling (but still positive), so TP rises more slowly.<small>The fixed input (the shop, the ovens) is getting crowded. ${MP(L) > AP(L) ? 'MP is still above AP, so AP keeps rising.' : 'MP is now below AP, so AP is falling.'}</small>`);
      else st.set('bad', `Negative marginal returns: one more worker <em>lowers</em> total output (MP &lt; 0).<small>No firm hires here — TP peaked at L = 20.</small>`);
    }
    draw();
  };

  /* ════════════ Unit 7 · short-run cost curves ════════════ */
  labs.costs = function (host) {
    const card = GL.labCard(host, 'Short-run cost curves: drag along q', 'Unit 7');
    const p = new GL.Plot(card.plotHost, { x: [0, 110], y: [0, 120], w: 640, h: 420 });
    const c = GL.ctrl(card.side, 'Change the costs');
    let FC = 1000, w = 1, q = 30, view = 'unit', rule = true;
    GL.slider(c, { label: 'Fixed cost FC (rent, licence)', min: 0, max: 2500, step: 50, value: FC, fmt: v => money(v, 0), oninput: v => { FC = v; draw(); } });
    GL.slider(c, { label: 'Input price (wage) × ', min: 0.6, max: 1.6, step: 0.05, value: w, fmt: v => '×' + fmt(v, 2), oninput: v => { w = v; draw(); } });
    const qs = GL.slider(c, { label: 'Output q (or drag on the graph)', min: 2, max: 108, step: 1, value: q, fmt: v => fmt(v, 0), oninput: v => { q = v; draw(); } });
    const c2 = GL.ctrl(card.side, 'View');
    GL.seg(c2, [['unit', 'Per-unit curves'], ['total', 'Total curves']], view, v => { view = v; draw(); });
    const tg = el('div', { class: 'gl-toggles', style: 'margin-top:8px' }); c2.append(tg);
    GL.toggle(tg, 'Show “MC cuts the minimums”', rule, v => { rule = v; draw(); });
    const ro = GL.readout(card.side);
    const st = GL.status(card.side);
    p.onPointer((x, y, t) => { if ((t === 'drag' || t === 'down' || t === 'move') && x > 1 && x < 109) { q = Math.round(x); qs.set(q); draw(); } });
    function draw() {
      const f = firm(FC, w);
      p.clear();
      if (view === 'unit') {
        p.setRange([0, 110], [0, 120]); p.clear();
        p.fn(f.MC, { cls: 'c-mc', label: 'MC' });
        p.fn(f.ATC, { cls: 'c-atc', from: FC > 0 ? Math.max(2, FC / 120) : 0, label: 'ATC', labelX: 104 });
        p.fn(f.AVC, { cls: 'c-avc', label: 'AVC', labelX: 104, lab: { dy: 16 } });
        if (FC > 0) p.fn(f.AFC, { cls: 'c-afc thin', from: FC / 120, label: 'AFC', labelX: 100 });
        /* scrub */
        p.seg(q, 0, q, 120, { cls: 'gl-scrub', top: true });
        p.dot(q, f.MC(q), { cls: 'c-mc' }); p.dot(q, f.ATC(q), { cls: 'c-atc' }); p.dot(q, f.AVC(q), { cls: 'c-avc' });
        if (FC > 0 && f.AFC(q) < 120) p.dot(q, f.AFC(q), { cls: 'c-afc', r: 4 });
        if (FC > 0 && f.ATC(q) < 120) p.brace(q + 2.2, f.ATC(q), q + 2.2, f.AVC(q), 'AFC = ATC − AVC\n= ' + money(f.AFC(q)), { dx: 6 });
        p.xmark(q, 'q = ' + q);
        if (rule) {
          p.dot(f.qAVC, f.minAVC, { cls: 'c-avc', r: 7 }).classList.add('gl-pulse');
          if (p.o.w >= 520) p.text(f.qAVC, f.minAVC, 'MC cuts AVC at its min', { dy: 22, anchor: 'middle', cls: 'gl-note small' });
          if (FC > 0 && f.qATC < 110) {
            p.dot(f.qATC, f.minATC, { cls: 'c-atc', r: 7 }).classList.add('gl-pulse');
            if (p.o.w >= 520) p.text(f.qATC, f.minATC, 'MC cuts ATC at its min', { dy: -12, dx: 8, cls: 'gl-note small' });
          }
        }
      } else {
        const top = f.TC(110) * 1.05;
        p.setRange([0, 110], [0, Math.max(top, 2000)]); p.clear();
        p.fn(f.TC, { cls: 'c-tc', label: 'TC' }); p.fn(f.VC, { cls: 'c-vc', label: 'VC', lab: { dy: 16 } });
        p.fn(() => FC, { cls: 'c-fc thin', label: 'FC' });
        p.seg(q, 0, q, p.o.y[1], { cls: 'gl-scrub', top: true });
        p.dot(q, f.TC(q), { cls: 'c-tc' }); p.dot(q, f.VC(q), { cls: 'c-vc' });
        p.brace(q + 2.2, f.TC(q), q + 2.2, f.VC(q), 'gap = FC', { dx: 6 });
        const m = f.MC(q);
        p.seg(q - 12, f.TC(q) - 12 * m, q + 12, f.TC(q) + 12 * m, { cls: 'c-mc thin', top: true });
        p.text(q + 12, f.TC(q) + 12 * m, 'slope of TC = MC', { dx: 4, cls: 'gl-note small' });
        p.xmark(q, 'q = ' + q);
      }
      ro.set([
        ['Total cost TC = FC + VC', money(f.TC(q))], ['Variable cost VC', money(f.VC(q))], ['Fixed cost FC', money(FC)],
        ['ATC = TC ÷ q', money(f.ATC(q)), true], ['AVC = VC ÷ q', money(f.AVC(q))], ['AFC = FC ÷ q', money(f.AFC(q))], ['MC (cost of the next unit)', money(f.MC(q)), true]
      ]);
      const mc = f.MC(q), atc = f.ATC(q), avc = f.AVC(q);
      const rel = (avg, name) => mc < avg - 0.05 ? `MC (${money(mc)}) &lt; ${name} (${money(avg)}) → ${name} is <b>falling</b>` : mc > avg + 0.05 ? `MC (${money(mc)}) &gt; ${name} (${money(avg)}) → ${name} is <b>rising</b>` : `MC ≈ ${name} → ${name} is at its <b>minimum</b>`;
      st.set('', `${rel(avc, 'AVC')}<br>${FC > 0 ? rel(atc, 'ATC') : 'FC = 0, so ATC = AVC and AFC disappears.'}<small>The average–marginal rule: a marginal below the average pulls it down; above, it pulls it up. ${w !== 1 ? 'A higher input price moves MC, AVC and ATC (not AFC).' : 'Try the wage slider: MC, AVC and ATC move, AFC does not. FC moves only ATC and AFC.'}</small>`);
    }
    draw();
  };

  /* ════════════ Unit 7 · long run ════════════ */
  labs.longrun = function (host) {
    const L = q => 30 + 0.006 * Math.pow(Math.max(0, 80 - q), 2) + 0.006 * Math.pow(Math.max(0, q - 140), 2);
    const Lp = q => -0.012 * Math.max(0, 80 - q) + 0.012 * Math.max(0, q - 140);
    const card = GL.labCard(host, 'The long run: choosing plant size', 'Unit 7');
    const p = new GL.Plot(card.plotHost, { x: [0, 220], y: [0, 75], w: 640, h: 380, xlabel: 'Output, q', ylabel: 'Average cost ($)' });
    const c = GL.ctrl(card.side, 'Pick a plant');
    let k = 40;
    GL.slider(c, { label: 'Plant size (the q it is built for)', min: 20, max: 200, step: 1, value: k, fmt: v => fmt(v, 0), oninput: v => { k = v; draw(); } });
    const st = GL.status(card.side);
    card.side.append(el('div', { class: 'gl-ctrl', html: '<p class="gl-ctrl-h">Vocabulary trap</p><span style="font-size:13.5px">Hubbard puts economies of scale and the <b>minimum efficient scale (MES)</b> on the <b>long-run</b> average cost curve. Dr. Mang’s Unit 7 slides use “returns to scale” for the falling/rising parts of a <em>short-run</em> ATC and label its minimum “MES”. Know both.</span>' }));
    function draw() {
      p.clear();
      const S = q => L(k) + Lp(k) * (q - k) + 0.02 * (q - k) * (q - k);
      [40, 110, 180].forEach(kk => { if (Math.abs(kk - k) > 8) p.fn(q => L(kk) + Lp(kk) * (q - kk) + 0.02 * (q - kk) * (q - kk), { cls: 'c-atc thin faint', from: kk - 45, to: kk + 45 }); });
      p.rect(0, 0, 80, 4, { cls: 'f-profit' }); p.rect(80, 0, 140, 4, { cls: 'f-ps' }); p.rect(140, 0, 220, 4, { cls: 'f-loss' });
      p.text(40, 6, 'economies of scale', { anchor: 'middle', cls: 'gl-note small' }); p.text(110, 6, 'constant returns', { anchor: 'middle', cls: 'gl-note small' });
      p.text(180, 6, 'diseconomies of scale', { anchor: 'middle', cls: 'gl-note small' });
      p.fn(L, { cls: 'c-lrac', label: 'LRAC', labelX: 205, lab: { dy: -10 } });
      p.fn(S, { cls: 'c-atc', from: Math.max(1, k - 45), to: k + 45, label: 'SRATC', labelX: Math.min(205, k + 30) });
      p.dot(k, L(k), { cls: 'c-atc' }); p.guide(k, L(k)); p.xmark(k, 'plant for q = ' + k);
      p.dot(80, 30, { cls: 'c-lrac', r: 6 }); p.text(80, 30, 'MES', { dy: -10, anchor: 'middle', cls: 'gl-note' });
      const region = k < 80 ? ['ok', 'Economies of scale: a bigger plant lowers long-run average cost.', 'Why: specialization, bigger machines, buying in bulk. Firms this size can be undercut by larger rivals.']
        : k <= 140 ? ['warn', 'Constant returns to scale: LRAC is flat.', 'Any plant from the MES (q = 80) to q = 140 has the same lowest average cost.']
          : ['bad', 'Diseconomies of scale: the plant is so big that average cost rises again.', 'Why: managers lose track, communication breaks down, workers lose motivation.'];
      st.set(region[0], region[1] + `<small>${region[2]} Each short-run ATC (red) touches the LRAC at one point — the LRAC is the envelope of all possible plants.</small>`);
    }
    draw();
  };

  /* ════════════ Unit 8 · perfect competition (market + firm) ════════════ */
  labs.competition = function (host) {
    const f = firm();
    const k = 200;
    let A = 100, N = 100, mode = 'market', Pme = 60, trace = false, anim = false;
    const card = GL.labCard(host, 'The market sets the price, the firm picks q', 'Unit 8');
    card.grid.classList.add('even');
    const pm = new GL.Plot(card.plotHost, { x: [0, 26000], y: [0, 110], w: 520, h: 360, xlabel: 'Market quantity, Q', ylabel: 'Price ($)', title: 'The market', xfmt: v => fmt(v / 1000, 0) + 'k' });
    const pf = new GL.Plot(card.side, { x: [0, 110], y: [0, 110], w: 520, h: 360, xlabel: 'Firm’s output, q', ylabel: 'Price / cost ($)', title: 'One firm' });
    const below = el('div', { class: 'gl-grid2', style: 'margin-top:12px' }); card.card.append(below);
    const left = el('div', { class: 'gl-side' }), right = el('div', { class: 'gl-side' }); below.append(left, right);
    const c = GL.ctrl(left, 'Controls');
    GL.seg(c, [['market', 'Market sets P'], ['me', 'I set P']], mode, v => { mode = v; showCtl(); draw(); });
    const box1 = el('div', { style: 'margin-top:10px' }), box2 = el('div', { style: 'margin-top:10px' }); c.append(box1, box2);
    const sA = GL.slider(box1, { label: 'Market demand (shift)', min: 60, max: 130, step: 1, value: A, fmt: v => 'P = ' + v + ' − Q/200', oninput: v => { A = v; draw(); } });
    const sN = GL.slider(box1, { label: 'Number of firms N', min: 30, max: 260, step: 1, value: N, fmt: v => fmt(v, 0), oninput: v => { N = v; draw(); } });
    const sP = GL.slider(box2, { label: 'Price P', min: 0, max: 105, step: 0.5, value: Pme, fmt: v => money(v), oninput: v => { Pme = v; draw(); } });
    const btns = el('div', { class: 'gl-btnrow', style: 'margin-top:8px' }); box1.append(btns);
    const lr = el('button', { type: 'button', class: 'gl-btn primary', text: '⏩ Run to the long run (entry / exit)' }); btns.append(lr);
    const tg = el('div', { class: 'gl-toggles', style: 'margin-top:10px' }); c.append(tg);
    GL.toggle(tg, 'Trace the firm’s supply curve', trace, v => { trace = v; draw(); });
    const ro = GL.readout(left);
    const st = GL.status(right);
    right.append(el('div', { class: 'gl-ctrl', html: '<p class="gl-ctrl-h">Party · Patience · Pack up</p><span style="font-size:13.5px"><b>P &gt; min ATC</b> → profit (Party). <b>min AVC &lt; P &lt; min ATC</b> → loss, but keep operating (Patience): revenue covers all variable cost and some fixed cost. <b>P &lt; min AVC</b> → shut down (Pack up): lose only FC.<br>Here min AVC = $24.00 and min ATC = ' + money(f.minATC) + '.</span>' }));
    function showCtl() { box1.style.display = mode === 'market' ? '' : 'none'; box2.style.display = mode === 'me' ? '' : 'none'; }
    const Qd = P => k * Math.max(0, A - P);
    const Qs = P => N * f.qOfP(P);
    const eqP = () => bisect(P => Qs(P) - Qd(P), 0, A);
    lr.onclick = () => {
      if (anim) return;
      const Nstar = Qd(f.minATC) / f.qOfP(f.minATC);
      if (!isFinite(Nstar) || Nstar <= 0) return;
      anim = true;
      GL.tween(N, clamp(Nstar, 30, 260), 1600, v => { N = v; sN.set(Math.round(v)); draw(); }, () => { anim = false; N = clamp(Nstar, 30, 260); draw(); });
    };
    function draw() {
      const P = mode === 'market' ? eqP() : Pme;
      const Q = mode === 'market' ? Qd(P) : NaN;
      /* market */
      pm.clear();
      pm.fn(Qp => A - Qp / k, { cls: 'c-d', label: 'D', from: 0, to: k * A });
      const pts = []; for (let pp = f.minAVC; pp <= 110; pp += 1) pts.push([N * f.qOfP(pp), pp]);
      pm.line([[0, 0], [0, f.minAVC]], { cls: 'c-s' }); pm.line(pts, { cls: 'c-s' });
      const lastS = pts.filter(p => p[0] < 26000).pop(); if (lastS) pm.text(lastS[0], lastS[1], 'S (N = ' + Math.round(N) + ')', { cls: 'gl-clab c-s', dx: -6, dy: -6, anchor: 'end' });
      if (mode === 'market') { pm.dot(Q, P); pm.guide(Q, P); pm.ymark(P, money(P)); pm.xmark(Q, fmt(Q / 1000, 1) + 'k'); }
      else { pm.seg(0, P, 26000, P, { cls: 'c-p thin' }); pm.ymark(P, money(P)); }
      /* firm */
      pf.clear();
      pf.fn(f.ATC, { cls: 'c-atc', from: 9, label: 'ATC', labelX: 104 });
      pf.fn(f.AVC, { cls: 'c-avc', label: 'AVC', labelX: 104, lab: { dy: 16 } });
      pf.fn(f.MC, { cls: 'c-mc' + (trace ? ' faint' : ''), label: 'MC' });
      if (trace) {
        pf.fn(f.MC, { cls: 'c-s', from: 60, label: 'firm’s supply = MC above min AVC', labelX: 66, lab: { dx: 8, dy: 4 } });
        pf.seg(0, 0, 0, f.minAVC, { cls: 'c-s' });
        pf.dot(60, f.minAVC, { cls: 'c-avc' });
      }
      pf.seg(0, P, 110, P, { cls: 'c-p' }); pf.text(2, P, 'd = MR = P', { cls: 'gl-clab c-p', dy: -7 });
      pf.ymark(P, money(P));
      const q = f.qOfP(P);
      let pi, kind;
      if (q > 0) {
        const atc = f.ATC(q); pi = (P - atc) * q;
        pf.dot(q, P); pf.guide(q, Math.max(P, atc), { h: false }); pf.xmark(q, 'q* = ' + fmt(q, 1));
        pf.dot(q, atc, { cls: 'c-atc' });
        pf.rect(0, Math.min(P, atc), q, Math.max(P, atc), { cls: pi >= 0 ? 'f-profit' : 'f-loss', label: (pi >= 0 ? 'profit ' : 'loss ') + money(Math.abs(pi), 0) });
        kind = P >= f.minATC - 0.01 ? 'party' : 'patience';
        ro.set([['Market price P', money(P), true], mode === 'market' ? ['Market quantity Q', fmt(Q, 0)] : null, mode === 'market' ? ['Firms N', fmt(N, 0)] : null,
          ['Firm output q* (P = MC)', fmt(q, 1), true], ['ATC at q*', money(atc)], ['AVC at q*', money(f.AVC(q))],
          ['TR = P × q', money(P * q, 0)], ['TC', money(f.TC(q), 0)], ['Profit π', money(pi, 0), true], ['π if it shut down', money(-f.FC, 0)]]);
      } else {
        pi = -f.FC; kind = 'packup';
        pf.xmark(0, 'q* = 0');
        ro.set([['Market price P', money(P), true], mode === 'market' ? ['Firms N', fmt(N, 0)] : null, ['Firm output', '0 (shut down)', true], ['Profit π', money(-f.FC, 0), true], ['(it still pays FC)', money(f.FC, 0)]]);
      }
      if (kind === 'party') st.set('ok', `Party: P = ${money(P)} is above min ATC (${money(f.minATC)}) → economic profit of ${money(pi, 0)}.<small>Long run: profit attracts <b>entry</b> → market supply shifts right → the price falls until P = min ATC and profit = 0. Press “Run to the long run”.</small>`);
      else if (kind === 'patience') st.set('warn', `Patience: P = ${money(P)} is below min ATC but above min AVC ($24) → a loss of ${money(-pi, 0)}, but keep operating.<small>Shutting down would lose the whole fixed cost (${money(f.FC, 0)}). Long run: losses cause <b>exit</b> → supply shifts left → P rises to min ATC.</small>`);
      else st.set('bad', `Pack up: P = ${money(P)} is below min AVC ($24) → shut down; q = 0 and the loss is just FC = ${money(f.FC, 0)}.<small>Producing would not even cover variable cost.</small>`);
      if (mode === 'market' && Math.abs(P - f.minATC) < 0.4) st.set('ok', `Long-run equilibrium: P = MC = min ATC = ${money(f.minATC)} → zero economic profit (a normal profit).<small>No reason to enter or exit. With ${fmt(N, 0)} firms each making ${fmt(f.qOfP(P), 1)} units.</small>`);
    }
    showCtl(); draw();
  };

  /* ════════════ Unit 9 · monopolistic competition ════════════ */
  labs.moncomp = function (host) {
    /* Dr. Mang's Unit 9 restaurant: P = 32 − 0.2q, MC = 0.4q, ATC = 300/q + 0.2q */
    const FC = 300, c = 0, e = 0.2;
    const ATC = q => FC / q + c + e * q, MC = q => c + 2 * e * q;
    const qMES = Math.sqrt(FC / e), minATC = ATC(qMES);
    const a0 = 32, b0 = 0.2;
    const bOf = t => b0 * (1 - 0.35 * t);
    const aStar = b => c + 2 * Math.sqrt(FC * (e + b));
    const aOf = t => a0 - t * (a0 - aStar(bOf(t)));
    let t = 0, showMk = true, showEx = true, showPC = false, anim = false;
    const card = GL.labCard(host, 'From short-run profit to the long-run tangency', 'Unit 9');
    const p = new GL.Plot(card.plotHost, { x: [0, 170], y: [0, 36], w: 640, h: 420, xlabel: 'Meals per day, q' });
    const c1 = GL.ctrl(card.side, 'Entry');
    const sT = GL.slider(c1, { label: 'Rivals that have entered', min: 0, max: 1.4, step: 0.01, value: t, fmt: v => v < 0.02 ? 'none yet' : v < 0.98 ? Math.round(v * 100) + '% of the way' : v <= 1.02 ? 'long run' : 'too many!', oninput: v => { t = v; draw(); } });
    const br = el('div', { class: 'gl-btnrow' }); c1.append(br);
    const go = el('button', { type: 'button', class: 'gl-btn primary', text: '⏩ Fast-forward to the long run' });
    const back = el('button', { type: 'button', class: 'gl-btn', text: 'Reset' });
    br.append(go, back);
    go.onclick = () => { if (anim) return; anim = true; GL.tween(t, 1, 1500, v => { t = v; sT.set(v); draw(); }, () => { anim = false; t = 1; sT.set(1); draw(); }); };
    back.onclick = () => { t = 0; sT.set(0); draw(); };
    const tg = el('div', { class: 'gl-toggles', style: 'margin-top:10px' }); c1.append(tg);
    GL.toggle(tg, 'Markup (P − MC)', showMk, v => { showMk = v; draw(); });
    GL.toggle(tg, 'Excess capacity', showEx, v => { showEx = v; draw(); });
    GL.toggle(tg, 'Compare: perfect competition', showPC, v => { showPC = v; draw(); });
    const ro = GL.readout(card.side), st = GL.status(card.side);
    function draw() {
      const a = aOf(t), b = bOf(t);
      const D = q => a - b * q, MR = q => a - 2 * b * q;
      const q = (a - c) / (2 * (b + e)), P = D(q), atc = ATC(q), pi = (P - atc) * q, mc = MC(q);
      p.clear();
      p.fn(ATC, { cls: 'c-atc', from: 6, label: 'ATC', labelX: 160 });
      p.fn(MC, { cls: 'c-mc', label: 'MC', labelX: 82 });
      p.fn(D, { cls: 'c-d', label: 'd', labelX: Math.min(162, a / b * 0.92) });
      p.fn(MR, { cls: 'c-mr', label: 'MR', to: a / (2 * b), labelX: a / (2 * b) * 0.85, lab: { dy: 14 } });
      if (t > 0.02) p.fn(q => a0 - b0 * q, { cls: 'c-d thin faint' });
      p.rect(0, Math.min(P, atc), q, Math.max(P, atc), { cls: pi >= 0 ? 'f-profit' : 'f-loss', label: Math.abs(pi) > 15 ? (pi >= 0 ? 'profit ' : 'loss ') + money(Math.abs(pi), 0) : '' });
      p.dot(q, mc, { cls: 'c-mc' }); p.dot(q, P); p.dot(q, atc, { cls: 'c-atc', r: 4.5 });
      p.guide(q, P); p.xmark(q, 'q = ' + fmt(q, 1)); p.ymark(P, money(P, 2));
      if (showMk) p.brace(q + 4, P, q + 4, mc, 'markup\n' + money(P - mc, 2), { dx: 8, dy: 10 });
      if (showEx) { p.dot(qMES, minATC, { cls: 'c-atc', r: 5 }); if (qMES - q > 1.5) { p.brace(q, 1.2, qMES, 1.2, '', {}); p.text((q + qMES) / 2, 1.2, 'excess capacity ' + fmt(qMES - q, 1), { anchor: 'middle', dy: -8, cls: 'gl-note small' }); p.xmark(qMES, 'MES ' + fmt(qMES, 1)); } }
      if (showPC) { p.seg(0, minATC, 170, minATC, { cls: 'c-ink thin dotted' }); p.text(166, minATC, 'perfect competition LR: P = min ATC = ' + money(minATC), { anchor: 'end', dy: 16, cls: 'gl-note small' }); }
      ro.set([['Firm demand', `P = ${fmt(a, 1)} − ${fmt(b, 3)}q`], ['q (MR = MC)', fmt(q, 1), true], ['P (from d)', money(P), true], ['MC at q', money(mc)], ['ATC at q', money(atc)],
        ['Profit π', money(pi, 0), true], ['Markup P − MC', money(P - mc)], ['Excess capacity (MES − q)', qMES - q > 0.05 ? fmt(qMES - q, 1) : 'none yet (q is past MES)']]);
      if (Math.abs(pi) < 4) st.set('ok', 'Long-run equilibrium: d is <b>tangent</b> to ATC → P = ATC, zero economic profit.<small>But P &gt; MC (a markup → some deadweight loss) and q &lt; MES (excess capacity) — unlike perfect competition. The textbook’s defence: consumers get <em>variety</em>.</small>');
      else if (pi > 0) st.set('warn', `Short run: P &gt; ATC → profit of ${money(pi, 0)}.<small>Easy entry: rivals open similar restaurants. Each one takes customers <b>and</b> offers more substitutes, so this firm’s d shifts <b>left</b> and gets <b>flatter</b> (more elastic). Keep sliding.</small>`);
      else st.set('bad', `Too many firms: P &lt; ATC → loss of ${money(-pi, 0)}.<small>Some firms exit, the survivors’ demand shifts back right, until the tangency (zero profit) returns.</small>`);
    }
    draw();
  };

  /* ════════════ Unit 11 · the monopoly lab ════════════ */
  labs.monopoly = function (host) {
    const PRESETS = {
      mang: { name: 'Mang’s slide example', a: 700, b: 2, c: 0, d: 6, FC: 8000 },
      nat: { name: 'Natural monopoly (utility)', a: 100, b: 1, c: 20, d: 0, FC: 1200 },
      ch13p1: { name: 'Ch 13 page, Problem 1', a: 360, b: 2, c: 0, d: 2, FC: 3000 }
    };
    let par = Object.assign({}, PRESETS.mang);
    let pol = 'none', fee = 6000, tax = 60, pmax = 540, natRule = 'atc';
    const ov = { profit: true, cs: true, ps: false, dwl: true, comp: true, mes: false };
    const card = GL.labCard(host, 'Monopoly lab: demand, costs and policy', 'Unit 11');
    const p = new GL.Plot(card.plotHost, { x: [0, 190], y: [0, 760], w: 660, h: 460 });
    const legend = el('div'); card.plotHost.append(legend);
    GL.legend(legend, [['c-d', 'd = D (demand)'], ['c-mr', 'MR'], ['c-mc', 'MC'], ['c-atc', 'ATC'], ['f-cs', 'CS', 1], ['f-profit', 'profit', 1], ['f-dwl', 'DWL', 1]]);
    const c0 = GL.ctrl(card.side, 'Start from');
    GL.seg(c0, Object.keys(PRESETS).map(k => [k, PRESETS[k].name]), 'mang', v => { par = Object.assign({}, PRESETS[v]); syncSliders(); if (v === 'nat') { setPol('natural'); } else setPol('none'); draw(); });
    const c1 = GL.ctrl(card.side, 'Demand and cost');
    const S = {
      a: GL.slider(c1, { label: 'Demand intercept a (P = a − bq)', min: 50, max: 900, step: 10, value: par.a, fmt: v => money(v, 0), oninput: v => { par.a = v; draw(); } }),
      b: GL.slider(c1, { label: 'Demand slope b', min: 0.25, max: 5, step: 0.25, value: par.b, fmt: v => fmt(v, 2), oninput: v => { par.b = v; draw(); } }),
      c: GL.slider(c1, { label: 'MC intercept c (MC = c + dq)', min: 0, max: 300, step: 5, value: par.c, fmt: v => money(v, 0), oninput: v => { par.c = v; draw(); } }),
      d: GL.slider(c1, { label: 'MC slope d', min: 0, max: 10, step: 0.5, value: par.d, fmt: v => fmt(v, 1), oninput: v => { par.d = v; draw(); } }),
      FC: GL.slider(c1, { label: 'Fixed cost FC', min: 0, max: 40000, step: 100, value: par.FC, fmt: v => money(v, 0), oninput: v => { par.FC = v; draw(); } })
    };
    function syncSliders() { Object.keys(S).forEach(k => S[k].set(par[k])); }
    const c2 = GL.ctrl(card.side, 'Policy');
    const polSeg = GL.seg(c2, [['none', 'None'], ['fee', 'Licence fee'], ['ceiling', 'Price ceiling'], ['tax', 'Per-unit tax'], ['natural', 'Natural-monopoly pricing'], ['pd', 'Perfect price discrimination']], pol, v => setPol(v));
    const polBox = el('div', { style: 'margin-top:10px' }); c2.append(polBox);
    const feeS = GL.slider(polBox, { label: 'Licence fee (a fixed cost)', min: 0, max: 20000, step: 500, value: fee, fmt: v => money(v, 0), oninput: v => { fee = v; draw(); } });
    const pmS = GL.slider(polBox, { label: 'Price ceiling P<sub>max</sub>', min: 0, max: 900, step: 1, value: pmax, fmt: v => money(v, 0), oninput: v => { pmax = v; draw(); } });
    const taxS = GL.slider(polBox, { label: 'Tax per unit t', min: 0, max: 300, step: 5, value: tax, fmt: v => money(v, 0), oninput: v => { tax = v; draw(); } });
    const natBox = el('div'); polBox.append(natBox);
    const natSeg = GL.seg(natBox, [['none', 'Unregulated'], ['atc', 'P = ATC'], ['mc', 'P = MC']], natRule, v => { natRule = v; draw(); });
    function setPol(v) {
      pol = v; polSeg.set(v);
      feeS.el.style.display = v === 'fee' ? '' : 'none'; pmS.el.style.display = v === 'ceiling' ? '' : 'none';
      taxS.el.style.display = v === 'tax' ? '' : 'none'; natBox.style.display = v === 'natural' ? '' : 'none';
      if (v === 'ceiling') { const m = mono(par.a, par.b, par.c, par.d, par.FC); pmS.input.min = Math.floor(par.c); pmS.input.max = Math.ceil(par.a); pmax = Math.round((m.PM + m.PC) / 20) * 10; if (!(pmax > m.PC && pmax < m.PM)) pmax = Math.round((m.PM + m.PC) / 2); pmS.set(pmax); }
      draw();
    }
    const c3 = GL.ctrl(card.side, 'Show');
    const tg = el('div', { class: 'gl-toggles' }); c3.append(tg);
    [['profit', 'Profit box'], ['cs', 'Consumer surplus'], ['ps', 'Producer surplus'], ['dwl', 'Deadweight loss'], ['comp', 'Competitive point (P = MC)'], ['mes', 'MES (min ATC)']]
      .forEach(([k, l]) => GL.toggle(tg, l, ov[k], v => { ov[k] = v; draw(); }));
    const st = GL.status(card.plotHost), ro = GL.readout(card.plotHost);
    st.el.style.marginTop = '12px';
    ro.el.style.marginTop = '8px';

    function solve(m) {
      const r = { q: m.qM, P: m.PM, tax: 0, fee: 0, shortage: 0, note: '' };
      if (pol === 'fee') r.fee = fee;
      if (pol === 'tax') { r.tax = tax; r.q = Math.max(0, (m.a - m.c - tax) / (2 * m.b + m.d)); r.P = m.D(r.q); }
      if (pol === 'ceiling') {
        if (pmax < m.PM) {
          const qd = Math.max(0, (m.a - pmax) / m.b);
          const qmc = m.d > 0 ? Math.max(0, (pmax - m.c) / m.d) : (pmax >= m.c ? Infinity : 0);
          r.q = Math.min(qd, qmc); r.P = pmax; r.shortage = Math.max(0, qd - r.q); r.qd = qd; r.binding = true;
        }
      }
      if (pol === 'natural') {
        if (natRule === 'mc') { r.q = m.qC; r.P = m.PC; }
        if (natRule === 'atc') {
          const A = m.b + m.d / 2, B = -(m.a - m.c), C = m.FC, disc = B * B - 4 * A * C;
          if (!m.natural) { r.q = m.qC; r.P = m.PC; r.notNatural = true; }
          else if (disc >= 0) { r.q = (-B + Math.sqrt(disc)) / (2 * A); r.P = m.D(r.q); }
          else r.note = 'No price covers ATC: demand lies below ATC everywhere, so P = ATC is impossible without a subsidy.';
        }
      }
      if (pol === 'pd') { r.q = m.qC; r.P = NaN; }
      const q = r.q;
      r.mc = m.MC(q); r.atc = q > 0 ? m.ATC(q) : NaN;
      if (pol === 'pd') { r.cs = 0; r.ps = m.TS(q); }
      else { r.cs = m.a * q - m.b * q * q / 2 - r.P * q; r.ps = (r.P - r.tax) * q - m.VC(q); }
      r.gov = r.tax * q + r.fee;
      r.pi = r.ps - m.FC - r.fee;
      r.dwl = Math.max(0, m.TS(m.qC) - m.TS(q));
      return r;
    }
    function draw() {
      const m = mono(par.a, par.b, par.c, par.d, par.FC);
      const base = (() => { const save = pol; pol = 'none'; const r = solve(m); pol = save; return r; })();
      const r = solve(m);
      const xmax = Math.min(m.a / m.b * 1.02, Math.max(m.qC * 1.4, m.a / (2 * m.b) * 1.12, 10));
      p.setRange([0, xmax], [0, m.a * 1.1]);
      p.clear();
      const q = r.q, P = r.P;
      /* areas first */
      if (pol === 'pd') {
        p.between(m.D, x => Math.max(0, m.MC(x)), 0, q, { cls: 'f-ps', label: 'all surplus → firm ' + money(r.ps, 0), at: [q * 0.35, (m.a + m.MC(q * 0.35)) / 2] });
      } else if (q > 0) {
        if (ov.cs) p.between(m.D, () => P, 0, q, { cls: 'f-cs', label: r.cs > 0 ? 'CS ' + money(r.cs, 0) : '', at: [q * 0.28, (m.a + P) / 2 + (m.a - P) * 0.05] });
        if (ov.ps && !ov.profit) p.between(() => P - r.tax, x => m.MC(x), 0, q, { cls: 'f-ps', label: 'PS ' + money(r.ps, 0) });
        if (r.tax > 0) p.rect(0, P - r.tax, q, P, { cls: 'f-tax', label: 'tax ' + money(r.tax * q, 0) });
        if (ov.profit && isFinite(r.atc)) {
          const top = P - r.tax, bot = r.atc + (r.fee ? r.fee / q : 0);
          if (r.fee) p.rect(0, r.atc, q, r.atc + r.fee / q, { cls: 'f-fee', label: 'fee ' + money(r.fee, 0) });
          if (Math.abs(top - bot) * q > 1) p.rect(0, Math.min(top, bot), q, Math.max(top, bot), { cls: r.pi >= 0 ? 'f-profit' : 'f-loss', label: (r.pi >= 0 ? 'profit ' : 'loss ') + money(Math.abs(r.pi), 0) });
        }
      }
      if (ov.dwl && r.dwl > 0.5 && q < m.qC) p.between(m.D, x => m.MC(x), q, m.qC, { cls: 'f-dwl' });
      /* curves */
      p.fn(m.ATC, { cls: 'c-atc', from: Math.max(xmax * 0.02, m.FC / (m.a * 1.1)), label: 'ATC', labelX: xmax * 0.93 });
      if (r.fee) p.fn(x => m.ATC(x) + r.fee / x, { cls: 'c-atc2', from: (m.FC + r.fee) / (m.a * 1.1), label: "ATC'", labelX: xmax * 0.86 });
      p.fn(m.D, { cls: 'c-d', label: pol === 'pd' ? 'd = MR (perfect PD)' : 'd = D', labelX: Math.min(xmax * 0.9, m.a / m.b * 0.9) });
      if (pol === 'ceiling' && r.binding) {
        p.fn(m.MR, { cls: 'c-mr thin dotted', to: m.a / (2 * m.b) });
        const qd = r.qd;
        p.line([[0, pmax], [qd, pmax], [qd, Math.min(pmax, m.MR(qd))]], { cls: 'c-mr' });
        if (m.MR(qd) < pmax) p.fn(m.MR, { cls: 'c-mr', from: qd, to: m.a / (2 * m.b) });
        p.text(xmax * 0.02, pmax, 'P_max = MR', { cls: 'gl-clab c-mr', dy: -7 });
      } else if (pol !== 'pd') p.fn(m.MR, { cls: 'c-mr', to: m.a / (2 * m.b), label: 'MR', labelX: m.a / (2 * m.b) * 0.9, lab: { dy: 14 } });
      if (r.tax) { p.fn(x => m.MC(x) + r.tax, { cls: 'c-mc', label: 'MC + t' }); p.fn(m.MC, { cls: 'c-mc thin faint', label: 'MC' }); }
      else p.fn(m.MC, { cls: 'c-mc', label: 'MC' });
      /* points */
      if (ov.comp) { p.dot(m.qC, m.PC, { cls: 'c-neutral', r: 5 }); p.text(m.qC, m.PC, 'P = MC', { dx: 8, dy: -8, cls: 'gl-note small' }); }
      if (ov.mes && isFinite(m.qMES) && m.qMES < xmax) { p.dot(m.qMES, m.minATC, { cls: 'c-atc', r: 5 }); p.text(m.qMES, m.minATC, 'MES', { dx: 7, dy: 16, cls: 'gl-note small' }); }
      if (pol === 'natural') {
        const pts = [['unreg.', m.qM, m.PM]];
        const save = natRule;
        ['atc', 'mc'].forEach(k => { natRule = k; const rr = solve(m); if (rr.q > 0 && !rr.note) pts.push([k === 'atc' ? 'P = ATC' : 'P = MC', rr.q, rr.P]); });
        natRule = save;
        pts.forEach(([n, x, y]) => { p.dot(x, y, { cls: 'c-neutral', r: 4.5 }); p.text(x, y, n, { dx: 7, dy: -7, cls: 'gl-note small' }); });
      }
      if (q > 0 && pol !== 'pd') {
        p.dot(q, r.mc + r.tax, { cls: 'c-mc' }); p.dot(q, P, { r: 7 }); p.guide(q, P);
        p.xmark(q, 'q = ' + fmt(q, 1)); p.ymark(P, 'P = ' + money(P, 2));
        if (isFinite(r.atc)) p.dot(q, r.atc + (r.fee ? r.fee / q : 0), { cls: r.fee ? 'c-atc2' : 'c-atc', r: 4.5 });
      }
      if (pol === 'pd') { p.dot(q, m.MC(q), { r: 7 }); p.guide(q, m.MC(q)); p.xmark(q, 'q = ' + fmt(q, 1)); }
      if (r.shortage > 0.05) { p.brace(q, P + m.a * 0.03, r.qd, P + m.a * 0.03, ''); p.text((q + r.qd) / 2, P + m.a * 0.03, 'shortage ' + fmt(r.shortage, 1), { anchor: 'middle', dy: -8, cls: 'gl-note small' }); }

      /* readout + explanation */
      const d = (v, b, dd = 0) => { const x = v - b; return Math.abs(x) < 0.005 ? '' : ` <small style="color:var(--muted)">(${x > 0 ? '+' : '−'}${fmt(Math.abs(x), dd)})</small>`; };
      const rows = [
        ['Quantity q', fmt(q, 2) + (pol !== 'none' ? d(q, base.q, 2) : ''), true],
        ['Price P', pol === 'pd' ? 'each buyer’s WTP' : money(P) + (pol !== 'none' ? d(P, base.P, 2) : ''), true],
        ['MC at q', money(r.mc)], ['ATC at q', isFinite(r.atc) ? money(r.atc) : '—'],
        ['Markup P − MC', pol === 'pd' ? '—' : money(P - r.mc - r.tax)],
        ['Profit π', money(r.pi, 2) + (pol !== 'none' ? d(r.pi, base.pi, 2) : ''), true],
        ['Consumer surplus CS', money(r.cs, 2) + (pol !== 'none' ? d(r.cs, base.cs, 2) : '')],
        ['Producer surplus PS = TR − VC', money(r.ps, 2)],
        ['Deadweight loss', money(r.dwl, 2) + (pol !== 'none' ? d(r.dwl, base.dwl, 2) : ''), true],
        r.gov ? ['Government revenue', money(r.gov, 2)] : null,
        ['Competitive benchmark (P = MC)', `q = ${fmt(m.qC, 2)}, P = ${money(m.PC)}`]
      ];
      ro.set(rows);
      let html = '', kind = '';
      const mr = `MR = ${fmt(m.a)} − ${fmt(2 * m.b)}q`;
      if (pol === 'none') {
        kind = r.pi >= 0 ? 'ok' : 'bad';
        html = `MR = MC: ${mr} = ${fmt(m.c)} + ${fmt(m.d)}q → q = ${fmt(q, 2)}; climb to demand → P = ${money(P)}. ${r.pi >= 0 ? 'Profit' : 'Loss'} = (P − ATC) × q = ${money(Math.abs(r.pi))}.<small>Versus competition (P = MC): q is ${fmt(m.qC - q, 2)} lower and P is ${money(P - m.PC)} higher, so ${money(r.dwl)} of surplus is lost.</small>`;
      } else if (pol === 'fee') {
        kind = 'ok';
        html = `A licence fee is a <b>fixed cost</b>: ATC shifts up to ATC', MC does not move → q and P are unchanged. Profit falls by exactly ${money(fee, 0)}; CS and DWL are unchanged.<small>The government collects ${money(fee, 0)} without distorting output, and can use it to cut taxes in other markets (Unit 4).</small>`;
      } else if (pol === 'tax') {
        kind = 'warn';
        html = `A per-unit tax is a <b>variable cost</b>: MC shifts up by ${money(tax, 0)} → q falls to ${fmt(q, 2)}, P rises to ${money(P)}. DWL grows to ${money(r.dwl)}.<small>Contrast with a licence fee, which leaves q and P alone. Same idea as Shaw’s flat $25 tax in Hubbard.</small>`;
      } else if (pol === 'ceiling') {
        if (!r.binding) { kind = ''; html = `P<sub>max</sub> = ${money(pmax, 0)} is above the monopoly price (${money(m.PM)}) → it doesn’t bind; nothing changes.`; }
        else if (r.shortage > 0.05) { kind = 'bad'; html = `P<sub>max</sub> is below the competitive price (${money(m.PC)}): the firm produces only where MC = P<sub>max</sub> (q = ${fmt(q, 2)}), but ${fmt(r.qd, 2)} are demanded → a <b>shortage</b> of ${fmt(r.shortage, 2)}. DWL = ${money(r.dwl)}.<small>Too low a ceiling brings back the Unit 4 problem.</small>`; }
        else if (Math.abs(pmax - m.PC) < 1.01 * Math.max(1, m.a / 900)) { kind = 'ok'; html = `P<sub>max</sub> ≈ the competitive price: the monopoly behaves like a price taker (MR = P = MC) → q = ${fmt(q, 2)} and DWL ≈ 0. “Just right.”`; }
        else { kind = 'ok'; html = `The ceiling makes <b>MR = P<sub>max</sub></b> (flat) up to q = ${fmt(r.qd, 2)}, where it meets demand; then MR drops. Output rises to ${fmt(q, 2)}, CS rises to ${money(r.cs)} and DWL falls to ${money(r.dwl)}.<small>The firm can’t raise its price, so selling one more unit no longer means cutting the price on the others — just like perfect competition.</small>`; }
      } else if (pol === 'natural') {
        if (r.note) { kind = 'bad'; html = r.note; }
        else if (r.notNatural) { kind = 'warn'; html = `This isn’t a natural monopoly: at the efficient output (q = ${fmt(m.qC, 2)}) ATC is ${money(m.ATC(m.qC))}, already below P = MC = ${money(m.PC)}. Setting P = MC covers costs, so there is no break-even dilemma; the graph shows P = MC.<small>P = ATC pricing is for a <b>natural monopoly</b>, where ATC is still falling as it crosses demand. Load the “Natural monopoly (utility)” preset.</small>`; }
        else if (natRule === 'none') { kind = ''; html = `Unregulated: q = ${fmt(q, 2)}, P = ${money(P)}. ${m.natural ? 'ATC is still falling where it crosses demand: a natural monopoly.' : 'Note: with these costs it is not a natural monopoly.'} Pick a regulation rule above.`; }
        else if (natRule === 'mc') { kind = r.pi < 0 ? 'bad' : 'ok'; html = r.pi < 0 ? `P = MC: efficient (DWL = 0) but P &lt; ATC, so the firm loses ${money(-r.pi)} — it needs a subsidy or it leaves in the long run.` : `P = MC: efficient (DWL = 0), and here P still covers ATC (π = ${money(r.pi)}), because this isn’t a natural monopoly.`; }
        else { kind = 'warn'; html = `P = ATC (the larger root): the firm (or a non-profit SOE) just breaks even, π ≈ ${money(r.pi, 0)}. Output ${fmt(q, 2)} is below the efficient ${fmt(m.qC, 2)}, but DWL falls from ${money(base.dwl)} to ${money(r.dwl)}.`; }
      } else if (pol === 'pd') {
        kind = 'ok';
        html = `Perfect (1st-degree) price discrimination: each buyer pays their own willingness to pay, so the demand curve is the MR curve. The firm produces where demand meets MC (q = ${fmt(q, 2)}) → <b>DWL = 0</b>, <b>CS = 0</b>; profit = all of the surplus minus FC = ${money(r.pi)}.<small>Efficient, but every bit of surplus goes to the firm.</small>`;
      }
      st.set(kind, html);
    }
    setPol('none');
  };

  /* ════════════ market structures compared ════════════ */
  labs.compare = function (host) {
    const card = GL.labCard(host, 'Fewer substitutes → steeper demand → bigger markup and DWL', 'Units 8–11');
    const p = new GL.Plot(card.plotHost, { x: [0, 100], y: [0, 210], w: 640, h: 400, xlabel: 'q', ylabel: 'P' });
    const c = GL.ctrl(card.side, 'Availability of close substitutes');
    let b = 1;
    const names = b => b < 0.05 ? 'Perfect competition' : b < 0.7 ? 'Monopolistic competition' : b < 1.4 ? 'Oligopoly' : 'Monopoly';
    GL.slider(c, { label: 'many ←→ none', min: 0, max: 2, step: 0.02, value: b, fmt: v => names(v), oninput: v => { b = v; draw(); } });
    const ro = GL.readout(card.side), st = GL.status(card.side);
    function draw() {
      const a = 80 + 60 * b, MC = q => 20 + q;
      p.clear();
      const q1 = (a - 20) / (2 * b + 1), P1 = a - b * q1, mc1 = MC(q1);
      const dwl = 0.5 * (60 - q1) * (P1 - mc1);
      if (dwl > 0.5) p.poly([[q1, P1], [60, 80], [q1, mc1]], { cls: 'f-dwl' });
      p.fn(MC, { cls: 'c-mc', label: 'MC' });
      p.fn(q => a - b * q, { cls: 'c-d', label: b < 0.05 ? 'd = MR = P' : 'd', labelX: b > 0.05 ? Math.min(95, a / b * 0.9) : 90 });
      if (b > 0.05) p.fn(q => a - 2 * b * q, { cls: 'c-mr', label: 'MR', to: a / (2 * b), labelX: Math.min(95, a / (2 * b) * 0.85), lab: { dy: 14 } });
      p.dot(60, 80, { cls: 'c-neutral', r: 4.5 }); p.text(60, 80, 'P = MC (efficient)', { dx: 8, dy: 16, cls: 'gl-note small' });
      p.dot(q1, P1, { r: 7 }); p.dot(q1, mc1, { cls: 'c-mc' }); p.guide(q1, P1);
      if (b > 0.05) p.brace(q1 - 2.5, P1, q1 - 2.5, mc1, 'markup ' + money(P1 - mc1, 0), { anchor: 'end', dx: -8 });
      p.xmark(q1, 'q = ' + fmt(q1, 1)); p.ymark(P1, money(P1, 0));
      ro.set([['Structure', names(b), true], ['Firm’s q (MR = MC)', fmt(q1, 1)], ['Price', money(P1)], ['Markup P − MC', money(P1 - mc1), true], ['Deadweight loss', money(dwl, 0), true]]);
      st.set(b < 0.05 ? 'ok' : b < 1.4 ? 'warn' : 'bad', b < 0.05 ? 'Perfect substitutes everywhere: the firm’s demand is flat, MR = P, so it produces where P = MC. No markup, no DWL.'
        : `${names(b)}: fewer close substitutes make the firm’s demand less elastic (steeper). MR falls below it, so MR = MC happens at a lower q and a higher price.<small>Dr. Mang (Lesson 11.2): the markup is largest in a monopoly, so its deadweight loss is larger than in any market with competition.</small>`);
    }
    draw();

    /* the four long-run pictures */
    const wrap = el('div', { class: 'gl-cards4', style: 'margin-top:14px' }); card.card.append(wrap);
    const mini = (title, note, drawFn) => {
      const cd = el('div', { class: 'gl-card' }); wrap.append(cd);
      cd.append(el('h4', { text: title }));
      const pp = new GL.Plot(cd, { fixed: true, x: [0, 100], y: [0, 100], w: 300, h: 240, xlabel: 'q', ylabel: 'P', xticks: false, yticks: false, margin: { l: 26, r: 14, t: 10, b: 28 }, grid: false });
      drawFn(pp); cd.append(el('p', { html: note }));
    };
    mini('Perfect competition', '<b>P = MC = min ATC</b>, π = 0. Allocatively and productively efficient.', pp => {
      const A = q => 600 / q + 10 + 0.06 * q, M = q => 10 + 0.12 * q, qm = 100, pm = A(100);
      pp.setRange([0, 160], [0, 60]); pp.clear();
      pp.fn(A, { cls: 'c-atc', from: 8, label: 'ATC', labelX: 30 }); pp.fn(M, { cls: 'c-mc', label: 'MC', labelX: 140 });
      pp.seg(0, pm, 100, pm, { cls: 'c-p' }); pp.text(2, pm, 'd = MR = P', { cls: 'gl-clab c-p', dy: -6 });
      pp.dot(qm * 0.999, pm);
    });
    mini('Monopolistic competition', '<b>d tangent to ATC</b>: P = ATC, π = 0, but P &gt; MC and q &lt; MES (excess capacity).', pp => {
      const A = q => 900 / q + 10 + 0.1 * q, M = q => 10 + 0.2 * q;
      const b = 0.26, a = 46; const D = q => a - b * q;
      pp.setRange([0, 180], [0, 90]); pp.clear();
      pp.fn(A, { cls: 'c-atc', from: 12, label: 'ATC', labelX: 165 }); pp.fn(M, { cls: 'c-mc', label: 'MC', labelX: 150 });
      pp.fn(D, { cls: 'c-d', label: 'd', labelX: 160 }); pp.fn(q => a - 2 * b * q, { cls: 'c-mr', to: a / (2 * b), label: 'MR', labelX: 80, lab: { dy: 14 } });
      pp.dot(50, 33); pp.guide(50, 33);
    });
    mini('Oligopoly', 'Barriers → profit can last. Strategic: each firm’s best move depends on its rivals’ (game theory).', pp => {
      const D = q => 85 - 0.6 * q, MR = q => 85 - 1.2 * q, M = q => 10 + 0.3 * q, A = q => 900 / q + 10 + 0.15 * q;
      const q = 75 / 1.5, P = D(q);
      pp.rect(0, A(q), q, P, { cls: 'f-profit' });
      pp.fn(A, { cls: 'c-atc', from: 11, label: 'ATC', labelX: 72, lab: { dy: 18 } }); pp.fn(M, { cls: 'c-mc', label: 'MC', labelX: 92 });
      pp.fn(D, { cls: 'c-d', label: 'd', labelX: 30 }); pp.fn(MR, { cls: 'c-mr', to: 70, label: 'MR', labelX: 60, lab: { dy: 14 } });
      pp.dot(q, P); pp.guide(q, P);
    });
    mini('Monopoly', 'MR = MC, P read from D. <b>Monopoly rent</b> lasts (blocked entry). P &gt; MC and usually MC ≠ ATC.', pp => {
      const D = q => 95 - 1 * q, MR = q => 95 - 2 * q, M = q => 10 + 0.3 * q, A = q => 900 / q + 10 + 0.15 * q;
      const q = 85 / 2.3, P = D(q);
      pp.rect(0, A(q), q, P, { cls: 'f-profit' });
      pp.fn(A, { cls: 'c-atc', from: 11, label: 'ATC', labelX: 72, lab: { dy: 18 } }); pp.fn(M, { cls: 'c-mc', label: 'MC', labelX: 92 });
      pp.fn(D, { cls: 'c-d', label: 'd = D', labelX: 12 }); pp.fn(MR, { cls: 'c-mr', to: 47.5, label: 'MR', labelX: 40, lab: { dy: 14 } });
      pp.dot(q, P); pp.guide(q, P);
    });
  };
})();
