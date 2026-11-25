/* 1B03 Graph Lab — drill generators (randomized; auto-checked; every answer worked out). */
(function () {
  'use strict';
  const GL = window.GL;
  const { fmt, money, pick, rint, shuffle, round } = GL;
  const add = GL.addGen;

  /* multiple choice from a correct answer + distractors (shuffled) */
  const mcq = (prompt, right, wrong, explain, extra = {}) => {
    const opts = shuffle([right].concat(wrong));
    return Object.assign({ kind: 'mc', prompt, options: opts, answer: opts.indexOf(right), explain }, extra);
  };
  const plot = (host, o) => new GL.Plot(host, Object.assign({ w: 600, h: 360 }, o));

  /* ═════════════ Unit 7 · costs ═════════════ */
  add({ id: 'u7-name', unit: 'u7', skill: 'name-curves', label: 'Name that curve', make() {
    const f = GL.firm(rint(7, 14) * 100, pick([0.9, 1, 1.1]));
    const curves = shuffle([['MC', f.MC, 0], ['ATC', f.ATC, f.FC / 125], ['AVC', f.AVC, 0], ['AFC', f.AFC, f.FC / 125]]);
    const letters = ['A', 'B', 'C', 'D'];
    const labX = { MC: 86, ATC: 104, AVC: 100, AFC: 30 };
    const names = ['MC', 'ATC', 'AVC', 'AFC'];
    return {
      kind: 'select', prompt: 'These are a firm’s four short-run per-unit cost curves, all drawn in the same colour. Which is which?',
      figure: h => { const p = plot(h, { x: [0, 110], y: [0, 125] }); curves.forEach(([n, fn, from], i) => p.fn(fn, { cls: 'c-neutral', from: from || 0, label: letters[i], labelX: labX[n] })); return p; },
      fields: letters.map((L, i) => ({ label: 'Curve ' + L, options: names, answer: names.indexOf(curves[i][0]) })),
      explain: '<b>AFC</b> falls the whole way (a fixed cost spread over more units). <b>MC</b> is the steep U that cuts through the bottoms of the other two U’s. <b>ATC</b> is the higher U; <b>AVC</b> the lower one, and the gap between them (= AFC) shrinks as q grows.'
    };
  } });

  /* [scenario, why]; answers in SHIFT_KEYS as indexes into ['Shifts up','No change','Shifts down'] for [MC, AVC, ATC, AFC] */
  const SHIFTS = [
    ['The landlord raises the firm’s monthly rent.', 'Rent is a fixed cost: AFC and ATC rise; MC and AVC don’t change (they only involve variable costs).'],
    ['The province charges the firm a new annual licence fee.', 'A licence fee is a fixed cost: only AFC and ATC move. (In Unit 11 this is why a licence fee doesn’t change a monopoly’s q or P.)'],
    ['The minimum wage (paid to every worker) rises.', 'Labour is a variable input: MC, AVC and ATC all shift up. AFC is untouched.'],
    ['The price of the raw material used in every unit falls.', 'A cheaper variable input lowers MC, AVC and ATC. AFC doesn’t change.'],
    ['The government adds a $2 tax on every unit produced.', 'A per-unit tax is a variable cost: MC, AVC and ATC rise by $2 at every q. AFC doesn’t change.'],
    ['The firm’s insurance premium (a fixed yearly amount) falls.', 'Insurance is fixed: AFC and ATC fall; MC and AVC don’t move.'],
    ['New software means each unit needs less labour.', 'Better technology lowers variable cost per unit: MC, AVC and ATC fall. AFC is unchanged.']
  ];
  const SHIFT_KEYS = [
    [1, 1, 0, 0], [1, 1, 0, 0], [0, 0, 0, 1], [2, 2, 2, 1], [0, 0, 0, 1], [1, 1, 2, 2], [2, 2, 2, 1]
  ];
  add({ id: 'u7-shift', unit: 'u7', skill: 'cost-shifts', label: 'What shifts?', make() {
    const i = rint(0, SHIFTS.length - 1);
    const opts = ['Shifts up', 'No change', 'Shifts down'];
    return {
      kind: 'select', prompt: SHIFTS[i][0] + ' What happens to each cost curve?',
      fields: ['MC', 'AVC', 'ATC', 'AFC'].map((n, j) => ({ label: n, options: opts, answer: SHIFT_KEYS[i][j] })),
      explain: SHIFTS[i][1] + ' <br>Rule: <b>fixed</b> cost → AFC &amp; ATC only. <b>Variable</b> cost → MC, AVC &amp; ATC (not AFC).'
    };
  } });

  const costTable = () => {
    const FC = pick([20, 30, 40, 50, 60]);
    let inc = pick([8, 10, 12]), vc = 0; const VC = [0];
    const steps = [inc, inc - pick([2, 4]), inc - pick([2, 4]) + pick([0, 2]), inc + pick([2, 4]), inc + pick([8, 10]), inc + pick([16, 20])];
    steps.forEach(s => { vc += Math.max(2, s); VC.push(vc); });
    return { FC, VC, TC: VC.map(v => v + FC) };
  };
  add({ id: 'u7-table', unit: 'u7', skill: 'cost-table', label: 'Costs from a table', make() {
    const t = costTable(); const q = rint(2, 6);
    const mc = t.TC[q] - t.TC[q - 1];
    return {
      kind: 'num', prompt: `A firm’s fixed cost is ${money(t.FC, 0)}. Its total cost for q = 0 to 6 is ${t.TC.map(v => '$' + v).join(', ')}. For <b>q = ${q}</b>, find:`,
      fields: [{ label: 'MC of unit ' + q, answer: mc, tol: 0.01, pre: '$' }, { label: 'ATC', answer: t.TC[q] / q, tol: 0.011, pre: '$' }, { label: 'AVC', answer: t.VC[q] / q, tol: 0.011, pre: '$' }, { label: 'AFC', answer: t.FC / q, tol: 0.011, pre: '$' }],
      explain: 'MC = change in TC; ATC = TC ÷ q; AVC = (TC − FC) ÷ q; AFC = FC ÷ q. Check: ATC = AVC + AFC.',
      work: `MC(${q}) = TC(${q}) − TC(${q - 1}) = ${t.TC[q]} − ${t.TC[q - 1]} = ${mc}\nATC = ${t.TC[q]} ÷ ${q} = ${fmt(t.TC[q] / q)}\nAVC = (${t.TC[q]} − ${t.FC}) ÷ ${q} = ${fmt(t.VC[q] / q)}\nAFC = ${t.FC} ÷ ${q} = ${fmt(t.FC / q)}`
    };
  } });

  add({ id: 'u7-avgmarg', unit: 'u7', skill: 'avg-marg', label: 'Average–marginal rule', make() {
    const avg = pick(['ATC', 'AVC']);
    const a = rint(20, 60), case_ = rint(0, 2);
    const m = case_ === 0 ? a - rint(4, 15) : case_ === 1 ? a + rint(4, 15) : a;
    const right = case_ === 0 ? `${avg} is falling` : case_ === 1 ? `${avg} is rising` : `${avg} is at its minimum`;
    return mcq(`At q = ${rint(20, 80)}, MC = ${money(m, 0)} and ${avg} = ${money(a, 0)}. What is happening to ${avg} at this output?`, right,
      [`${avg} is falling`, `${avg} is rising`, `${avg} is at its minimum`, `${avg} is at its maximum`].filter(x => x !== right).slice(0, 3),
      'A marginal below the average pulls the average down; above it, pulls it up; equal → the average is flat (its minimum). That is why MC cuts ATC and AVC at their lowest points.');
  } });

  add({ id: 'u7-clickmin', unit: 'u7', skill: 'mc-cuts-min', label: 'Find min ATC', make() {
    const f = GL.firm(rint(6, 15) * 100, 1);
    return {
      kind: 'click', prompt: 'Click on the quantity axis where <b>ATC is at its minimum</b>. (Hint: look for where another curve crosses it.)',
      figure: h => { const p = plot(h, { x: [0, 110], y: [0, 120] }); p.fn(f.MC, { cls: 'c-mc', label: 'MC' }); p.fn(f.ATC, { cls: 'c-atc', from: 6, label: 'ATC', labelX: 104 }); p.fn(f.AVC, { cls: 'c-avc', label: 'AVC', labelX: 104, lab: { dy: 16 } }); return p; },
      click: { axis: 'x', x: f.qATC, tolX: 5, show: p => { p.dot(f.qATC, f.minATC, { cls: 'c-atc', r: 7 }); p.guide(f.qATC, f.minATC); p.xmark(f.qATC, 'min ATC: q ≈ ' + fmt(f.qATC, 0)); } },
      explain: `MC crosses ATC at ATC’s minimum, q ≈ ${fmt(f.qATC, 1)} (ATC ≈ ${money(f.minATC)}). Don’t confuse it with the minimum of AVC (q = 60) or of MC (q = 40).`
    };
  } });

  add({ id: 'u7-prod', unit: 'u7', skill: 'production', label: 'MP and AP', make() {
    const Qs = [
      () => mcq('When the marginal product of labour is greater than the average product, the average product is…', 'rising', ['falling', 'constant', 'negative'], 'Like grades: adding a worker who produces more than the current average pulls the average up.'),
      () => mcq('The law of diminishing marginal returns says that, with at least one input fixed, adding more of a variable input eventually…', 'makes the marginal product of that input fall', ['makes total output fall', 'raises average fixed cost', 'makes marginal cost fall'], 'MP eventually falls (total output still rises, just more slowly — until MP turns negative).'),
      () => mcq('When the marginal product of labour is rising, marginal cost is…', 'falling', ['rising', 'constant', 'equal to ATC'], 'MC = wage ÷ MP. Rising MP → each unit needs less extra labour → MC falls. MP peaks where MC bottoms out.'),
      () => mcq('Average product of labour is at its maximum when…', 'MP = AP', ['MP = 0', 'MP is at its maximum', 'total product is at its maximum'], 'MP cuts AP at AP’s peak — the same average–marginal rule as MC cutting ATC.'),
      () => mcq('Total product is at its maximum when…', 'the marginal product of labour is zero', ['MP = AP', 'MP is at its maximum', 'AP is at its maximum'], 'While MP > 0 each worker adds output. TP peaks exactly where MP hits zero.')
    ];
    return pick(Qs)();
  } });

  add({ id: 'u7-lr', unit: 'u7', skill: 'scale', label: 'Economies of scale', make() {
    const q = pick([30, 50, 100, 120, 170, 200]);
    const L = x => 30 + 0.006 * Math.pow(Math.max(0, 80 - x), 2) + 0.006 * Math.pow(Math.max(0, x - 140), 2);
    const right = q < 80 ? 'Economies of scale' : q <= 140 ? 'Constant returns to scale' : 'Diseconomies of scale';
    return mcq(`The firm produces at the marked point on its long-run average cost curve. Which region is it in?`, right,
      ['Economies of scale', 'Constant returns to scale', 'Diseconomies of scale'].filter(x => x !== right).concat(['Diminishing marginal returns']),
      'Falling LRAC = economies of scale; flat = constant returns; rising = diseconomies. The minimum efficient scale (MES) is where LRAC first reaches its minimum (q = 80 here). Diminishing marginal returns is a <em>short-run</em> idea.',
      { figure: h => { const p = plot(h, { x: [0, 220], y: [0, 75], ylabel: 'LRAC ($)' }); p.fn(L, { cls: 'c-lrac', label: 'LRAC', labelX: 205 }); p.dot(q, L(q), { r: 7 }); p.guide(q, L(q)); return p; } });
  } });

  /* ═════════════ Unit 8 · perfect competition ═════════════ */
  const firmFig = (f, P, o = {}) => h => {
    const p = plot(h, { x: [0, 110], y: [0, 110] });
    p.fn(f.ATC, { cls: 'c-atc', from: 8, label: 'ATC', labelX: 104 }); p.fn(f.AVC, { cls: 'c-avc', label: 'AVC', labelX: 104, lab: { dy: 16 } });
    p.fn(f.MC, { cls: 'c-mc', label: 'MC' });
    if (P != null) { p.seg(0, P, 110, P, { cls: 'c-p' }); p.text(2, P, 'P = MR = ' + money(P, 0), { cls: 'gl-clab c-p', dy: -7 }); }
    if (o.marks) { p.ymark(f.minAVC, 'min AVC ' + money(f.minAVC, 0), 'c-avc'); p.ymark(f.minATC, 'min ATC ' + money(f.minATC, 0), 'c-atc'); }
    return p;
  };
  add({ id: 'u8-decide', unit: 'u8', skill: 'shutdown', label: 'Party / Patience / Pack up', make() {
    const f = GL.firm(rint(8, 12) * 100, 1);
    const zone = rint(0, 2);
    const P = zone === 0 ? rint(Math.ceil(f.minATC) + 3, 90) : zone === 1 ? rint(Math.ceil(f.minAVC) + 2, Math.floor(f.minATC) - 2) : rint(10, Math.floor(f.minAVC) - 3);
    const right = ['Earn a profit and keep producing (Party)', 'Operate at a loss in the short run (Patience)', 'Shut down in the short run (Pack up)'][zone];
    return mcq(`A perfectly competitive firm has the cost curves shown (min AVC = ${money(f.minAVC, 2)}, min ATC = ${money(f.minATC, 2)}). The market price is <b>${money(P, 0)}</b>. In the short run, the firm should…`, right,
      ['Earn a profit and keep producing (Party)', 'Operate at a loss in the short run (Patience)', 'Shut down in the short run (Pack up)', 'Raise its price above the market price'].filter(x => x !== right),
      `Compare P with the two minimums: P &gt; min ATC → profit; min AVC &lt; P &lt; min ATC → loss but revenue covers variable cost, so operating loses less than FC; P &lt; min AVC → shut down and lose only FC. A price taker can never raise its price.`,
      { figure: firmFig(f, P, { marks: true }) });
  } });

  add({ id: 'u8-clickq', unit: 'u8', skill: 'pc-q', label: 'Find q* (P = MC)', make() {
    const f = GL.firm(1000, 1); const P = rint(30, 95); const q = f.qOfP(P);
    return {
      kind: 'click', prompt: `The market price is ${money(P, 0)}. Click on the quantity axis at this price taker’s profit-maximizing output.`,
      figure: firmFig(f, P),
      click: { axis: 'x', x: q, tolX: 4, show: p => { p.dot(q, P, { r: 7 }); p.guide(q, P, { h: false }); p.xmark(q, 'q* ≈ ' + fmt(q, 0)); } },
      explain: `For a price taker MR = P, so q* is where the price line meets the <b>rising</b> part of MC: q* ≈ ${fmt(q, 1)}. (Not where P meets ATC, and not the first, falling crossing of MC.)`
    };
  } });

  add({ id: 'u8-table', unit: 'u8', skill: 'pc-table', label: 'Profit from a table', make() {
    const t = costTable();
    const MC = t.TC.map((v, i) => i ? v - t.TC[i - 1] : null);
    const k = rint(3, 5); const P = MC[k] + pick([0, 1, 2]);
    /* profit-maximizing q by brute force; ties go to the larger q (produce while MR ≥ MC) */
    let q = 0, best = -t.FC;
    for (let i = 1; i <= 6; i++) { const v = P * i - t.TC[i]; if (v >= best - 1e-9) { best = v; q = i; } }
    const pi = P * q - t.TC[q];
    return {
      kind: 'num', prompt: `A price taker sells at <b>${money(P, 0)}</b>. Its total cost for q = 0 to 6 is ${t.TC.map(v => '$' + v).join(', ')}. Find the profit-maximizing quantity and the profit (use a minus sign for a loss).`,
      fields: [{ label: 'q*', answer: q, tol: 0.01 }, { label: 'Profit π', answer: pi, tol: 0.01, pre: '$' }],
      explain: 'Produce every unit whose MC ≤ P (the last one has MR = P ≥ MC); profit = P × q − TC. If two quantities tie, either is accepted by the textbook rule; this drill takes the larger.',
      work: `MC by unit: ${MC.slice(1).join(', ')}\nP = ${P}: produce while MC ≤ ${P} → q* = ${q}\nπ = ${P} × ${q} − ${t.TC[q]} = ${pi}`
    };
  } });

  add({ id: 'u8-lr', unit: 'u8', skill: 'pc-longrun', label: 'Long-run adjustment', make() {
    const up = Math.random() < .5;
    return pick([
      () => mcq(`In a perfectly competitive industry the typical firm is earning an economic ${up ? 'profit' : 'loss'}. In the long run…`,
        up ? 'firms enter, market supply shifts right and the price falls to min ATC' : 'firms exit, market supply shifts left and the price rises to min ATC',
        [up ? 'firms exit, market supply shifts left and the price rises' : 'firms enter, market supply shifts right and the price falls', 'each firm raises its own price', 'nothing changes because firms are price takers'],
        'Entry and exit continue until economic profit is zero: P = MC = min ATC.'),
      () => mcq('In long-run equilibrium, a perfectly competitive firm produces where…', 'P = MC = minimum ATC', ['P > ATC', 'P = minimum AVC', 'MR > MC'], 'Zero economic profit (P = ATC), profit-maximizing (P = MC), and at the bottom of ATC — both allocatively and productively efficient.'),
      () => mcq('A competitive firm earns zero economic profit. This means…', 'it earns a normal return, enough to stay in the industry', ['it will shut down immediately', 'its accounting profit is also zero', 'it should raise its price'], 'Zero economic profit = all costs covered, including the opportunity cost of the owners’ capital (a normal profit).'),
      () => mcq('A competitive firm’s short-run supply curve is…', 'its MC curve above minimum AVC', ['its MC curve above minimum ATC', 'its whole MC curve', 'its ATC curve'], 'Below min AVC it shuts down (supplies 0); above, it supplies where P = MC.')
    ])();
  } });

  add({ id: 'u8-prices', unit: 'u8', skill: 'pc-prices', label: 'Shutdown & break-even price', make() {
    const t = costTable();
    const AVC = t.VC.map((v, i) => i ? v / i : Infinity), ATC = t.TC.map((v, i) => i ? v / i : Infinity);
    const sd = Math.min(...AVC.slice(1)), be = Math.min(...ATC.slice(1));
    return {
      kind: 'num', prompt: `Fixed cost is ${money(t.FC, 0)} and variable cost for q = 1 to 6 is ${t.VC.slice(1).map(v => '$' + v).join(', ')}. Find the <b>shutdown price</b> (below it the firm stops producing) and the <b>break-even price</b>.`,
      fields: [{ label: 'Shutdown price (min AVC)', answer: sd, tol: 0.011, pre: '$' }, { label: 'Break-even price (min ATC)', answer: be, tol: 0.011, pre: '$' }],
      explain: 'Shutdown point = minimum AVC; break-even point = minimum ATC.',
      work: `AVC = ${AVC.slice(1).map(v => fmt(v)).join(', ')} → min ${fmt(sd)}\nATC = ${ATC.slice(1).map(v => fmt(v)).join(', ')} → min ${fmt(be)}`
    };
  } });

  /* ═════════════ Unit 9 · monopolistic competition ═════════════ */
  add({ id: 'u9-srlr', unit: 'u9', skill: 'mcomp-graph', label: 'Short run or long run?', make() {
    const FC = 900, c = 10, e = 0.1, ATC = q => FC / q + c + e * q, MC = q => c + 2 * e * q;
    const b = pick([0.26, 0.3, 0.35]); const aT = c + 2 * Math.sqrt(FC * (e + b));
    const kind = rint(0, 2); const a = kind === 0 ? aT + rint(10, 22) : kind === 1 ? aT : aT - rint(5, 9);
    const right = ['Short run: the firm earns an economic profit, so firms will enter', 'Long-run equilibrium: zero economic profit', 'Short run: the firm makes a loss, so some firms will exit'][kind];
    return mcq('The graph shows a monopolistically competitive firm. Which describes its situation?', right,
      ['Short run: the firm earns an economic profit, so firms will enter', 'Long-run equilibrium: zero economic profit', 'Short run: the firm makes a loss, so some firms will exit', 'Long-run equilibrium: the firm produces at minimum ATC'].filter(x => x !== right),
      'At q where MR = MC, compare the demand curve with ATC. Demand just touching (tangent to) ATC → P = ATC → zero profit, the long run. Note the long-run firm is <em>not</em> at min ATC (excess capacity).',
      { figure: h => { const p = plot(h, { x: [0, 200], y: [0, 100] }); const D = q => a - b * q; const q = (a - c) / (2 * (b + e));
        p.fn(ATC, { cls: 'c-atc', from: 8, label: 'ATC', labelX: 190 }); p.fn(MC, { cls: 'c-mc', label: 'MC', labelX: 170 }); p.fn(D, { cls: 'c-d', label: 'd', labelX: Math.min(190, a / b * 0.9) });
        p.fn(q => a - 2 * b * q, { cls: 'c-mr', to: a / (2 * b), label: 'MR', labelX: a / (2 * b) * 0.85, lab: { dy: 14 } }); p.dot(q, D(q)); p.guide(q, D(q)); return p; } });
  } });

  add({ id: 'u9-facts', unit: 'u9', skill: 'mcomp-lr', label: 'Long-run facts', make() {
    const T = ['Price equals average total cost', 'Price is greater than marginal cost', 'The firm has excess capacity (q is below the minimum-ATC output)', 'Economic profit is zero'];
    const F = ['Price equals marginal cost', 'The firm produces at minimum average total cost', 'The firm earns an economic profit', 'Demand is horizontal'];
    const opts = shuffle(T.slice(0, rint(2, 4)).concat(shuffle(F).slice(0, 2)));
    return { kind: 'multi', prompt: 'Which statements are true of a monopolistically competitive firm in <b>long-run equilibrium</b>?', options: opts, answer: opts.map((o, i) => T.includes(o) ? i : -1).filter(i => i >= 0),
      explain: 'Long run: d is tangent to ATC → P = ATC and zero economic profit. Because d slopes down, the tangency is on the falling part of ATC → q below min ATC (excess capacity), and P &gt; MC (a markup). Not allocatively or productively efficient — but consumers get variety.' };
  } });

  add({ id: 'u9-entry', unit: 'u9', skill: 'mcomp-entry', label: 'Entry and demand', make() {
    return pick([
      () => mcq('New coffee shops open near an existing café (monopolistic competition). The existing café’s demand curve…', 'shifts left and becomes more elastic', ['shifts right and becomes less elastic', 'becomes horizontal', 'does not change; only the market demand changes'], 'Rivals take some customers (left shift) and give the rest more close substitutes (flatter, more elastic).'),
      () => mcq('Why can a monopolistically competitive firm earn economic profit only in the short run?', 'Entry is easy, so new firms copy the idea until profit is gone', ['It is a price taker', 'Government regulation removes profits', 'Its product is identical to rivals’'], 'Like perfect competition, low barriers to entry drive long-run economic profit to zero.'),
      () => mcq('Compared with a perfectly competitive firm in the long run, a monopolistically competitive firm charges…', 'a higher price and produces less, with P > MC', ['the same price and output', 'a lower price because of competition', 'a price equal to MC but above ATC'], 'Downward-sloping demand → MR < P → P > MC (markup) and q < MES (excess capacity).'),
      () => mcq('A monopolistically competitive firm maximizes profit where…', 'MR = MC, charging the price on its demand curve at that quantity', ['P = MC', 'P = minimum ATC', 'MR = 0'], 'Same recipe as a monopoly: cross (MR = MC), climb (to d).')
    ])();
  } });

  /* integer-friendly linear demand / cost problems */
  const linMono = () => {
    const b = pick([1, 2, 3, 4]), d = pick([0, 2, 4, 6]), c = pick([0, 10, 20, 40]), q = pick([10, 15, 20, 25, 30, 40, 50]);
    const a = c + (2 * b + d) * q, P = a - b * q, VC = c * q + d * q * q / 2;
    const FC = Math.max(0, Math.round((P * q - VC) * (0.3 + Math.random() * 0.45) / 100) * 100);
    const pi = P * q - VC - FC, qC = (a - c) / (b + d), PC = a - b * qC, dwl = b * b * q * q / (2 * (b + d));
    return { a, b, c, d, q, P, FC, pi, qC, PC, dwl, mc: c + d * q, atc: FC / q + c + d * q / 2 };
  };
  const mcText = m => m.d ? (m.c ? `MC = ${m.c} + ${m.d}q` : `MC = ${m.d}q`) : `MC = ${m.c} (constant)`;
  const atcText = m => `ATC = ${m.FC ? fmt(m.FC, 0) + '/q + ' : ''}${m.c ? m.c + (m.d ? ' + ' : '') : ''}${m.d ? (m.d / 2 === 1 ? '' : m.d / 2) + 'q' : ''}`;
  add({ id: 'u9-calc', unit: 'u9', skill: 'mcomp-calc', label: 'Price and markup', make() {
    let m = linMono(); while (m.d === 0 && m.c === 0) m = linMono();
    return {
      kind: 'num', prompt: `A restaurant in a monopolistically competitive market faces demand <b>P = ${m.a} − ${m.b}q</b> and has <b>${mcText(m)}</b>. Find its profit-maximizing quantity, price and markup (P − MC).`,
      fields: [{ label: 'q', answer: m.q, tol: 0.01 }, { label: 'P', answer: m.P, tol: 0.01, pre: '$' }, { label: 'Markup', answer: m.P - m.mc, tol: 0.01, pre: '$' }],
      explain: 'MR has the same intercept and double the slope; set MR = MC; climb to demand for P.',
      work: `MR = ${m.a} − ${2 * m.b}q\n${m.a} − ${2 * m.b}q = ${m.c}${m.d ? ' + ' + m.d + 'q' : ''} → q = ${m.q}\nP = ${m.a} − ${m.b}(${m.q}) = ${m.P}\nMC(${m.q}) = ${m.mc} → markup = ${m.P} − ${m.mc} = ${m.P - m.mc}`
    };
  } });

  /* ═════════════ Unit 10 · oligopoly ═════════════ */
  const randGame = () => {
    for (let tries = 0; tries < 400; tries++) {
      const v = shuffle([1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]).slice(0, 8);
      const g = { A: ['Up', 'Down'], B: ['Left', 'Right'], pay: [[[v[0], v[1]], [v[2], v[3]]], [[v[4], v[5]], [v[6], v[7]]]] };
      const an = GL.analyseGame(g);
      if (an.nash.length === 1) return { g, an };
    }
  };
  add({ id: 'u10-nash', unit: 'u10', skill: 'nash', label: 'Dominant strategies & Nash', make() {
    const story = pick([['Rogers', 'Bell', ['High price', 'Low price'], ['High price', 'Low price']], ['Airbus', 'Boeing', ['Build', 'Don’t build'], ['Build', 'Don’t build']], ['Uber', 'Lyft', ['Raise fares', 'Hold fares'], ['Raise fares', 'Hold fares']], ['Firm A', 'Firm B', ['Up', 'Down'], ['Left', 'Right']]]);
    const { g, an } = randGame();
    g.A = story[2]; g.B = story[3];
    const cells = [[0, 0], [0, 1], [1, 0], [1, 1]];
    const cellName = ([r, c]) => `${story[0]}: ${g.A[r]}, ${story[1]}: ${g.B[c]}`;
    const tbl = `<table class="gl-matrix"><tr><th></th><th class="pb">${story[1]}: ${g.B[0]}</th><th class="pb">${story[1]}: ${g.B[1]}</th></tr>` +
      [0, 1].map(r => `<tr><th class="pa">${story[0]}: ${g.A[r]}</th>${[0, 1].map(c => `<td class="cell"><span class="gl-pay a">${g.pay[r][c][0]}</span> , <span class="gl-pay b">${g.pay[r][c][1]}</span></td>`).join('')}</tr>`).join('') + '</table>';
    const domOpts = n => [g[n][0], g[n][1], 'No dominant strategy'];
    return {
      kind: 'select', prompt: `Payoffs are profits in $ millions: <b style="color:var(--gl-p)">${story[0]}</b>’s first, <b style="color:var(--gl-atc)">${story[1]}</b>’s second.${tbl}`,
      fields: [
        { label: story[0] + '’s dominant strategy', options: domOpts('A'), answer: an.domA == null ? 2 : an.domA },
        { label: story[1] + '’s dominant strategy', options: domOpts('B'), answer: an.domB == null ? 2 : an.domB },
        { label: 'Nash equilibrium', options: cells.map(cellName), answer: cells.findIndex(c => c[0] === an.nash[0][0] && c[1] === an.nash[0][1]) }
      ],
      explain: 'Circle method (Dr. Mang): for each of the rival’s choices, circle your higher payoff. A strategy that is best in <em>both</em> cases is dominant. The cell where both payoffs are circled is the Nash equilibrium.' + (an.pd ? ' This one is a <b>prisoner’s dilemma</b>: both would do better at another cell, but each has an incentive to deviate.' : ''),
      work: `${story[0]}’s best replies: vs ${g.B[0]} → ${g.A[an.bestA[0][0]]}; vs ${g.B[1]} → ${g.A[an.bestA[1][0]]}\n${story[1]}’s best replies: vs ${g.A[0]} → ${g.B[an.bestB[0][0]]}; vs ${g.A[1]} → ${g.B[an.bestB[1][0]]}\nNash: (${g.A[an.nash[0][0]]}, ${g.B[an.nash[0][1]]}) → payoffs (${g.pay[an.nash[0][0]][an.nash[0][1]].join(', ')})`
    };
  } });

  add({ id: 'u10-seq', unit: 'u10', skill: 'backward', label: 'Backward induction', make() {
    const ent = rint(2, 6), loss = -rint(1, 4);
    const HE = rint(4, 8), HS = HE + rint(4, 8), LE = rint(0, 3); let LS = rint(HE - 3, HE + 4); if (LS === HE) LS += pick([-1, 1]);
    const P = { HE: [HE, ent], HS: [HS, 0], LE: [LE, loss], LS: [LS, 0] };
    const afterH = 0, afterL = 1; /* entrant enters after High (ent > 0), stays out after Low (loss < 0) */
    const inc = LS > HE ? 1 : 0;
    return {
      kind: 'select', prompt: `An incumbent chooses a <b>high</b> or <b>low</b> price; then a potential entrant, seeing the price, decides to <b>enter</b> or <b>stay out</b>. Payoffs (incumbent, entrant):<br>High → Enter (${P.HE.join(', ')}) · High → Stay out (${P.HS.join(', ')})<br>Low → Enter (${P.LE.join(', ')}) · Low → Stay out (${P.LS.join(', ')})`,
      fields: [
        { label: 'Entrant after a high price', options: ['Enter', 'Stay out'], answer: afterH },
        { label: 'Entrant after a low price', options: ['Enter', 'Stay out'], answer: afterL },
        { label: 'Incumbent’s choice', options: ['High price', 'Low price'], answer: inc }
      ],
      explain: 'Backward induction: solve the entrant’s choices first (compare its payoffs), then the incumbent compares only the outcomes it will actually reach.',
      work: `After High: entrant gets ${ent} by entering vs 0 → Enter → incumbent gets ${HE}\nAfter Low: entrant gets ${loss} by entering vs 0 → Stay out → incumbent gets ${LS}\nIncumbent: ${HE} vs ${LS} → ${inc ? 'Low price (deter entry)' : 'High price (accept entry)'}`
    };
  } });

  add({ id: 'u10-concepts', unit: 'u10', skill: 'oligopoly-ideas', label: 'Oligopoly ideas', make() {
    return pick([
      () => mcq('Why is collusion (a cartel agreement to keep prices high) hard to sustain?', 'Each firm can raise its own profit by secretly undercutting the agreed price', ['Collusion lowers every firm’s profit', 'Firms in an oligopoly are price takers', 'Demand is perfectly elastic'], 'The prisoner’s dilemma: the cooperative outcome isn’t a Nash equilibrium.'),
      () => mcq('In a prisoner’s dilemma, the Nash equilibrium is…', 'worse for both players than the cooperative outcome', ['the outcome with the highest joint payoff', 'always reached only if players can communicate', 'impossible to find without a dominant strategy'], 'Each plays its dominant strategy and both end up worse off.'),
      () => mcq('A Nash equilibrium is a situation where…', 'each firm’s strategy is its best response to the other firms’ strategies', ['total industry profit is maximized', 'every firm earns zero economic profit', 'one firm drives the others out'], 'No one can gain by changing strategy alone.'),
      () => mcq('Tit-for-tat in a repeated game means…', 'cooperate first, then copy whatever the rival did last round', ['always cheat', 'cooperate no matter what', 'cheat first, then cooperate'], 'It rewards cooperation and punishes cheating immediately — a way repeated games sustain high prices.'),
      () => mcq('A four-firm concentration ratio of 85% suggests the industry is…', 'an oligopoly', ['perfectly competitive', 'monopolistically competitive', 'impossible to classify'], 'Hubbard: a four-firm concentration ratio above about 40% is a sign of oligopoly.'),
      () => mcq('Which is a barrier to entry that helps keep an industry an oligopoly?', 'Large economies of scale', ['Many small sellers', 'Identical products', 'Perfect information'], 'Economies of scale, ownership of a key input, and government barriers (patents, licences) keep entrants out.'),
      () => mcq('A low-price guarantee (“we’ll match any competitor’s price”) can help firms…', 'keep prices high, because undercutting no longer wins customers', ['start a price war', 'become price takers', 'avoid ever changing prices'], 'Matching turns the price war game around: cutting the price gains nothing (Unit 11, Lesson 11.3).')
    ])();
  } });

  /* ═════════════ Unit 11 · monopoly ═════════════ */
  add({ id: 'u11-calc', unit: 'u11', skill: 'mono-calc', label: 'Monopoly q, P, π', make() {
    let m = linMono(); while (m.d === 0 && m.c === 0) m = linMono();
    return {
      kind: 'num', prompt: `A monopoly faces demand <b>P = ${m.a} − ${m.b}q</b>. Its marginal cost is <b>${mcText(m)}</b> and its fixed cost is <b>${money(m.FC, 0)}</b>${m.d ? ` (so ${atcText(m)})` : ''}. Find the profit-maximizing q, P, profit, and the deadweight loss compared with P = MC.`,
      fields: [{ label: 'q', answer: m.q, tol: 0.01 }, { label: 'P', answer: m.P, tol: 0.01, pre: '$' }, { label: 'Profit π', answer: m.pi, tol: 0.6, pre: '$' }, { label: 'DWL', answer: m.dwl, rel: 0.01, pre: '$' }],
      explain: 'Cross (MR = MC), climb (P from demand), box ((P − ATC) × q = TR − TC). DWL = ½ × (q<sub>C</sub> − q<sub>M</sub>) × (P<sub>M</sub> − MC(q<sub>M</sub>)).',
      work: `MR = ${m.a} − ${2 * m.b}q = ${mcText(m).replace('MC = ', '').replace(' (constant)', '')} → q = ${m.q}\nP = ${m.a} − ${m.b}(${m.q}) = ${m.P}\nTC = ${m.FC} + ${m.c}(${m.q})${m.d ? ' + ' + m.d / 2 + '(' + m.q + ')²' : ''} = ${fmt(m.FC + m.c * m.q + m.d * m.q * m.q / 2)}\nπ = ${m.P} × ${m.q} − ${fmt(m.FC + m.c * m.q + m.d * m.q * m.q / 2)} = ${fmt(m.pi)}\nP = MC: ${m.a} − ${m.b}q = ${mcText(m).replace('MC = ', '').replace(' (constant)', '')} → q_C = ${fmt(m.qC)}\nDWL = ½ × (${fmt(m.qC)} − ${m.q}) × (${m.P} − ${m.mc}) = ${fmt(m.dwl)}`
    };
  } });

  add({ id: 'u11-clickP', unit: 'u11', skill: 'mono-price', label: 'Read the monopoly price', make() {
    const a = pick([100, 120, 150]), b = pick([1, 1.5, 2]), c = pick([10, 20]), d = pick([0.5, 1, 1.5]);
    const m = GL.mono(a, b, c, d, 0);
    return {
      kind: 'click', prompt: 'Click on the <b>price axis</b> at the price this monopoly charges.',
      figure: h => { const xm = Math.min(a / b, m.qC * 1.5); const p = plot(h, { x: [0, xm], y: [0, a * 1.08] });
        p.fn(m.D, { cls: 'c-d', label: 'd = D' }); p.fn(m.MR, { cls: 'c-mr', to: a / (2 * b), label: 'MR', labelX: a / (2 * b) * 0.85, lab: { dy: 14 } }); p.fn(m.MC, { cls: 'c-mc', label: 'MC' }); return p; },
      click: { axis: 'y', y: m.PM, tolY: a * 0.04, show: p => { p.dot(m.qM, m.MC(m.qM), { cls: 'c-mc' }); p.seg(m.qM, m.MC(m.qM), m.qM, m.PM, { cls: 'c-ink thin', top: true, arrow: true }); p.dot(m.qM, m.PM, { r: 7 }); p.guide(m.qM, m.PM); p.ymark(m.PM, 'P = ' + money(m.PM, 0)); } },
      explain: `MR = MC at q ≈ ${fmt(m.qM, 1)}; the height there is MC ≈ ${money(m.MC(m.qM), 0)} — a common wrong answer. Climb to the demand curve: <b>P ≈ ${money(m.PM, 0)}</b>.`
    };
  } });

  add({ id: 'u11-area', unit: 'u11', skill: 'mono-areas', label: 'Name the areas', make() {
    const a = 120, b = 1, mcS = 1; const MC = q => mcS * q;
    const qM = a / (2 * b + mcS), PM = a - b * qM, qC = a / (b + mcS), PC = a - b * qC, mcM = MC(qM);
    const T = pick([
      ['the <b>deadweight loss</b> of the monopoly', ['C', 'D'], 'B + C in Hubbard’s figure: the triangles between demand and MC from q<sub>M</sub> to q<sub>C</sub>.'],
      ['<b>consumer surplus under monopoly</b>', ['A'], 'Below demand, above P<sub>M</sub>, up to q<sub>M</sub>.'],
      ['<b>consumer surplus under perfect competition</b>', ['A', 'B', 'C'], 'Below demand, above P<sub>C</sub>, up to q<sub>C</sub>.'],
      ['surplus <b>transferred from consumers to the monopoly</b>', ['B'], 'The rectangle between P<sub>C</sub> and P<sub>M</sub> on the units still sold.'],
      ['<b>producer surplus under monopoly</b>', ['B', 'E'], 'Above MC, below P<sub>M</sub>, up to q<sub>M</sub>.'],
      ['<b>producer surplus under perfect competition</b>', ['D', 'E'], 'Above MC, below P<sub>C</sub>, up to q<sub>C</sub>.']
    ]);
    const L = ['A', 'B', 'C', 'D', 'E'];
    return {
      kind: 'multi', prompt: `The graph compares a monopoly (q<sub>M</sub>, P<sub>M</sub>) with the competitive outcome (q<sub>C</sub>, P<sub>C</sub>, where demand meets MC). Which areas make up ${T[0]}?`,
      options: L, answer: T[1].map(x => L.indexOf(x)),
      figure: h => { const p = plot(h, { x: [0, 100], y: [0, 130], xticks: false, yticks: false });
        p.poly([[0, a], [qM, PM], [0, PM]], { cls: 'f-cs', label: 'A' });
        p.rect(0, PC, qM, PM, { cls: 'f-hi', label: 'B' });
        p.poly([[qM, PM], [qC, PC], [qM, PC]], { cls: 'f-dwl', label: 'C', dark: true, at: [qM + (qC - qM) * 0.3, PC + (PM - PC) * 0.3] });
        p.poly([[qM, PC], [qC, PC], [qM, mcM]], { cls: 'f-loss', label: 'D', at: [qM + (qC - qM) * 0.3, PC - (PC - mcM) * 0.35] });
        p.poly([[0, 0], [qM, mcM], [qM, PC], [0, PC]], { cls: 'f-ps', label: 'E' });
        p.fn(q => a - b * q, { cls: 'c-d', label: 'd = D' }); p.fn(q => a - 2 * b * q, { cls: 'c-mr', to: a / 2, label: 'MR', labelX: 52, lab: { dy: 14 } }); p.fn(MC, { cls: 'c-mc', label: 'MC', labelX: 92 });
        p.guide(qM, PM); p.guide(qC, PC); p.xmark(qM, 'q_M'); p.xmark(qC, 'q_C'); p.ymark(PM, 'P_M'); p.ymark(PC, 'P_C'); return p; },
      explain: T[2] + ' Map: A = CS left under monopoly · B = transfer · C + D = deadweight loss · E = PS both ways.'
    };
  } });

  add({ id: 'u11-policy', unit: 'u11', skill: 'mono-policy', label: 'Regulation effects', make() {
    return pick([
      () => mcq('The government charges a monopoly a lump-sum licence fee. What happens to its output and price?', 'Both stay the same; only profit falls', ['Output falls and price rises', 'Output rises and price falls', 'The monopoly passes the whole fee on in a higher price'], 'A licence fee is a fixed cost: ATC rises, MC doesn’t, so MR = MC still picks the same q and P.'),
      () => mcq('A per-unit tax on a monopoly will…', 'raise MC, so output falls and price rises', ['leave output and price unchanged', 'lower price because profit falls', 'only shift ATC'], 'Per-unit = variable cost → MC shifts up → MR = MC at a smaller q → higher P on demand.'),
      () => mcq('A price ceiling set between the competitive price and the monopoly price will…', 'increase output and consumer surplus and reduce deadweight loss', ['cause a shortage and lower output', 'have no effect on a monopoly', 'raise the monopoly’s profit'], 'The ceiling makes MR = P<sub>max</sub> (flat) up to demand, so the firm sells more at a lower price.'),
      () => mcq('If the government sets a monopoly’s price ceiling exactly where demand meets MC, the result is…', 'the perfectly competitive quantity, with no deadweight loss', ['a shortage', 'the monopoly quantity', 'zero output'], 'P<sub>max</sub> = P<sub>C</sub>: the firm acts like a price taker, P = MC.'),
      () => mcq('Regulators of a natural monopoly usually set price equal to average total cost because…', 'P = MC would be below ATC and the firm would lose money', ['P = ATC is the efficient price', 'P = ATC maximizes the firm’s profit', 'MC is above ATC for a natural monopoly'], 'For a natural monopoly ATC is falling, so MC < ATC: P = MC means a loss. P = ATC lets it break even.'),
      () => mcq('A merger between two competing grocery chains is a…', 'horizontal merger', ['vertical merger', 'conglomerate franchise', 'public franchise'], 'Same industry, competing firms → horizontal (Mang: horizontal integration).'),
      () => mcq('Dr. Mang’s rule of thumb: the Competition Bureau typically blocks a merger when…', 'the new firm would have over 35% of the market, or the top four over 65%', ['the new firm would have over 50%', 'any two firms merge', 'the merged firm has lower costs'], '35% for one firm, 65% for the top four.'),
      () => mcq('A natural monopoly exists when…', 'one firm can supply the whole market at a lower average cost than two or more firms', ['the government grants a patent', 'a firm owns a key natural resource', 'demand is perfectly inelastic'], 'Graph test: ATC is still falling where it crosses demand.'),
      () => mcq('Compared with perfect competition, a monopoly…', 'charges a higher price, produces less, and causes a deadweight loss', ['charges a lower price because of economies of scale', 'produces more to drive out rivals', 'always earns zero economic profit in the long run'], 'MR < P → MR = MC at a lower q → higher P → CS falls, DWL appears.')
    ])();
  } });

  add({ id: 'u11-ceiling', unit: 'u11', skill: 'mono-ceiling', label: 'Price ceiling numbers', make() {
    let m = linMono(); while (m.d === 0) m = linMono();
    const Pmax = Math.round((m.P + m.PC) / 2);
    const qd = (m.a - Pmax) / m.b, qmc = (Pmax - m.c) / m.d, q = Math.min(qd, qmc);
    const TS = x => m.a * x - m.b * x * x / 2 - (m.c * x + m.d * x * x / 2);
    const dwl = TS(m.qC) - TS(q);
    return {
      kind: 'num', prompt: `A monopoly faces <b>P = ${m.a} − ${m.b}q</b> with <b>${mcText(m)}</b> (unregulated: q = ${m.q}, P = $${m.P}). The government sets a price ceiling of <b>$${Pmax}</b>. Find the new output and deadweight loss.`,
      fields: [{ label: 'q with the ceiling', answer: q, rel: 0.01 }, { label: 'DWL', answer: dwl, rel: 0.015, pre: '$' }],
      explain: 'Under the ceiling, MR = P<sub>max</sub> up to the quantity demanded at P<sub>max</sub>. The firm sells the smaller of (quantity demanded at P<sub>max</sub>) and (q where MC = P<sub>max</sub>).',
      work: `Demand at $${Pmax}: q = (${m.a} − ${Pmax}) ÷ ${m.b} = ${fmt(qd)}\nMC = ${Pmax} at q = (${Pmax} − ${m.c}) ÷ ${m.d} = ${fmt(qmc)}\n→ q = ${fmt(q)}\nCompetitive q_C = ${fmt(m.qC)}; DWL = area between D and MC from ${fmt(q)} to ${fmt(m.qC)} = ${fmt(dwl)}`
    };
  } });

  add({ id: 'u11-pd', unit: 'u11', skill: 'price-discrim', label: 'Price discrimination', make() {
    const S = [
      ['A movie theatre charges $9 for students (with ID) and $15 for adults.', '3rd degree (multi-market)'],
      ['A cereal company sells a 1 kg box for $6 and a 2 kg box for $9.', '2nd degree (quantity-based)'],
      ['A used-car dealer haggles with each buyer to get as close as possible to what they’re willing to pay.', '1st degree (perfect)'],
      ['An airline charges more for tickets bought the day before departure (business travellers) than for tickets bought months ahead.', '3rd degree (multi-market)'],
      ['A power utility charges a lower rate per kWh once a household uses more than 1,000 kWh.', '2nd degree (quantity-based)'],
      ['An auction house sells a painting to the highest bidder.', '1st degree (perfect)'],
      ['A delivery company charges more to deliver to a remote northern town than to a nearby suburb because it costs more.', 'Not price discrimination (the cost differs)'],
      ['Seniors pay less for a haircut on Tuesdays.', '3rd degree (multi-market)']
    ];
    const s = pick(S);
    const all = ['1st degree (perfect)', '2nd degree (quantity-based)', '3rd degree (multi-market)', 'Not price discrimination (the cost differs)'];
    if (Math.random() < 0.3) return mcq('Which is NOT one of the three conditions price discrimination needs?', 'The good must be sold in a perfectly competitive market', ['The firm has market power', 'The firm can identify customers willing to pay more', 'The firm can prevent resale'], 'Power, Identify, Resale blocked (PIR). A price taker can’t charge anyone more than the market price.');
    return { kind: 'mc', prompt: s[0] + ' Which kind of pricing is this?', options: all, answer: all.indexOf(s[1]),
      explain: '1st = each buyer’s own WTP (haggling, auctions); 2nd = price depends on how much you buy (bulk); 3rd = different prices for different groups (students, seniors, regions, timing). Different prices that reflect different <em>costs</em> are not price discrimination.' };
  } });

  /* ═════════════ added with the Unit 9 / 10 slides ═════════════ */
  add({ id: 'u9-sources', unit: 'u9', skill: 'differentiation', label: 'Sources of differentiation', make() {
    const S = [
      ['Diners pick a café because its beans are organic and fair-trade.', 'Actual or perceived difference in materials / quality'],
      ['You buy Nike over an unbranded shoe that looks identical.', 'Brand name and reputation'],
      ['You buy lunch at the food court in your building rather than walk 10 minutes.', 'Location and convenience'],
      ['You stay with your phone carrier because switching means a new contract and porting fees.', 'Transaction costs, lock-in and switching costs'],
      ['You keep using the same mechanic because you don’t know whether the others are any good.', 'Incomplete information'],
      ['You collect points at one grocery chain, so you keep shopping there.', 'Transaction costs, lock-in and switching costs'],
      ['A gym is the only one open 24 hours near campus.', 'Location and convenience']
    ];
    const s = pick(S);
    const all = ['Actual or perceived difference in materials / quality', 'Brand name and reputation', 'Location and convenience', 'Transaction costs, lock-in and switching costs', 'Incomplete information'];
    return { kind: 'mc', prompt: s[0] + ' Which of Dr. Mang’s five sources of product differentiation is at work?', options: all, answer: all.indexOf(s[1]),
      explain: 'The five sources (Lesson 9.1): quality / materials, brand &amp; reputation, location &amp; convenience, lock-in (transaction &amp; switching costs), incomplete information.' };
  } });

  add({ id: 'u9-elastic', unit: 'u9', skill: 'mr-elasticity', label: 'MR and elasticity', make() {
    const a = pick([20, 30, 40, 60]), b = pick([0.1, 0.2, 0.25, 0.5]);
    const qz = a / (2 * b);
    return pick([
      () => ({ kind: 'num', prompt: `A price-setter’s demand is <b>P = ${a} − ${b}q</b>. At what quantity is total revenue maximized, and what is the price there?`,
        fields: [{ label: 'q (revenue max)', answer: qz, rel: 0.005 }, { label: 'P', answer: a / 2, rel: 0.005, pre: '$' }],
        explain: 'Revenue is maximized where MR = 0 (unit elastic). MR = a − 2bq = 0 → q = a ÷ 2b, half the quantity where demand hits zero.',
        work: `MR = ${a} − ${2 * b}q = 0 → q = ${fmt(qz)}\nP = ${a} − ${b}(${fmt(qz)}) = ${fmt(a / 2)}` }),
      () => mcq('Why does a profit-maximizing price-setter only produce on the elastic part of its demand curve?', 'MC is always positive, so MR = MC requires MR > 0, which only happens where demand is elastic',
        ['Because demand is unit elastic everywhere', 'Because MR = P on the elastic part', 'Because revenue is maximized there'],
        'Mang (Lesson 9.2): MC &gt; 0 → MR &gt; 0 at the chosen q → elastic portion. So the profit-maximizing q is less than the revenue-maximizing q.'),
      () => mcq('At the quantity where MR = 0, demand is…', 'unit elastic, and total revenue is at its maximum', ['elastic, and total revenue is rising', 'inelastic, and total revenue is falling', 'perfectly elastic'], 'MR &gt; 0 elastic · MR = 0 unit elastic (TR max) · MR &lt; 0 inelastic.')
    ])();
  } });

  add({ id: 'u10-hhi', unit: 'u10', skill: 'concentration', label: 'C₄ and HHI', make() {
    /* random market shares (integers) that sum to 100 */
    let sh;
    do {
      const n = rint(4, 7); const cuts = shuffle(Array.from({ length: 98 }, (_, i) => i + 1)).slice(0, n - 1).sort((x, y) => x - y);
      sh = [0].concat(cuts, [100]).slice(1).map((v, i, arr) => v - ([0].concat(cuts))[i]).sort((x, y) => y - x);
    } while (sh.some(v => v < 2));
    const c4 = sh.slice(0, 4).reduce((s, v) => s + v, 0), hhi = sh.reduce((s, v) => s + v * v, 0);
    const band = hhi < 100 ? 0 : hhi < 1500 ? 1 : hhi < 2500 ? 2 : 3;
    const bands = ['Highly / perfectly competitive (< 100)', 'Unconcentrated (100–1,500)', 'Moderately concentrated (1,500–2,500)', 'Highly concentrated (> 2,500)'];
    return { kind: 'select', prompt: `An industry’s firms have revenue shares of <b>${sh.map(v => v + '%').join(', ')}</b>. Find the four-firm concentration ratio and the HHI, then classify the industry with Dr. Mang’s HHI bands.`,
      /* the engine renders a field with `options` as a dropdown and any other field as a number box */
      fields: [{ label: 'C₄ (%)', answer: c4, tol: 0.01 }, { label: 'HHI', answer: hhi, tol: 0.5 }, { label: 'Classification', options: bands, answer: band }],
      explain: 'C₄ = the top four shares added. HHI = the sum of every firm’s <em>squared percentage</em> share (0 to 10,000).',
      work: `C₄ = ${sh.slice(0, 4).join(' + ')} = ${c4}%\nHHI = ${sh.map(v => v + '²').join(' + ')} = ${sh.map(v => v * v).join(' + ')} = ${hhi}\n→ ${bands[band]}` };
  } });

  add({ id: 'u10-terms', unit: 'u10', skill: 'game-terms', label: 'Game-theory terms', make() {
    const T = [
      ['An assumption one player makes about the behaviour of a competitor', 'Conjecture'],
      ['A choice that maximizes profit given an assumption about what the competitor will do', 'Best response'],
      ['A choice that maximizes profit regardless of what competitors do', 'Dominant strategy'],
      ['Both players choose a best response, so each is satisfied after seeing the other’s choice', 'Nash equilibrium'],
      ['Both players play a strategy that is best no matter what the other does', 'Dominant strategy equilibrium'],
      ['Firms coordinate to raise prices above the competitive level', 'Collusion'],
      ['A firm’s profit depends on its own decisions and on its rivals’ decisions', 'Mutual interdependence'],
      ['A market with exactly two firms', 'Duopoly']
    ];
    const t = pick(T);
    const opts = shuffle([t[1]].concat(shuffle(T.filter(x => x[1] !== t[1]).map(x => x[1])).slice(0, 3)));
    return { kind: 'mc', prompt: `Which term (Dr. Mang, Unit 10) matches: “${t[0]}”?`, options: opts, answer: opts.indexOf(t[1]),
      explain: 'Conjecture → best response → dominant strategy (best for every conjecture). Both best-responding = Nash equilibrium; both dominant = dominant strategy equilibrium (always also a Nash equilibrium).' };
  } });
})();
