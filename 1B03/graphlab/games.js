/* 1B03 Graph Lab — Unit 10 oligopoly: payoff matrices (Dr. Mang's games), a repeated game and a sequential (entry) game. */
(function () {
  'use strict';
  const GL = window.GL;
  const { el, fmt } = GL;
  const labs = GL.labs = GL.labs || {};

  /* game: { A:[r0,r1] row labels, B:[c0,c1], pay[r][c] = [a, b] } */
  const analyse = g => {
    const bestA = [0, 1].map(c => { const x = g.pay[0][c][0], y = g.pay[1][c][0]; return x > y ? [0] : y > x ? [1] : [0, 1]; });
    const bestB = [0, 1].map(r => { const x = g.pay[r][0][1], y = g.pay[r][1][1]; return x > y ? [0] : y > x ? [1] : [0, 1]; });
    const domA = bestA[0].length === 1 && bestA[1].length === 1 && bestA[0][0] === bestA[1][0] ? bestA[0][0] : null;
    const domB = bestB[0].length === 1 && bestB[1].length === 1 && bestB[0][0] === bestB[1][0] ? bestB[0][0] : null;
    const nash = [];
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) if (bestA[c].includes(r) && bestB[r].includes(c)) nash.push([r, c]);
    let joint = [0, 0], best = -Infinity;
    for (let r = 0; r < 2; r++) for (let c = 0; c < 2; c++) { const s = g.pay[r][c][0] + g.pay[r][c][1]; if (s > best) { best = s; joint = [r, c]; } }
    const pd = domA != null && domB != null && nash.length === 1 && (g.pay[joint[0]][joint[1]][0] > g.pay[nash[0][0]][nash[0][1]][0]) && (g.pay[joint[0]][joint[1]][1] > g.pay[nash[0][0]][nash[0][1]][1]);
    return { bestA, bestB, domA, domB, nash, joint, pd };
  };
  GL.analyseGame = analyse;

  const GAMES = {
    ads: { name: 'Advertising Game (Mang)', A: ['Low budget', 'High budget'], B: ['Low budget', 'High budget'], who: ['Firm A', 'Firm B'],
      pay: [[[10, 10], [5, 12]], [[12, 5], [7, 7]]], unit: '$ millions profit',
      story: 'Dr. Mang’s Lesson 10.2: two duopolists choose an advertising budget. Same budget → they split the market; whoever spends more while the other spends less takes most of the customers.' },
    front: { name: 'Front Page Game (Mang)', A: ['Politics', 'Business'], B: ['Politics', 'Business'], who: ['Newspaper A', 'Newspaper B'],
      pay: [[[50, 50], [100, 70]], [[70, 100], [35, 35]]], unit: 'thousands of readers',
      story: 'Dr. Mang’s Lesson 10.3: two local papers choose the front-page story. More readers prefer politics, but two papers running the same story split those readers. No dominant strategies.' },
    price: { name: 'Pricing (Hubbard)', A: ['$14.99', '$9.99'], B: ['$14.99', '$9.99'], who: ['Apple', 'Spotify'],
      pay: [[[10, 10], [5, 15]], [[15, 5], [7.5, 7.5]]], unit: '$ millions profit per month',
      story: 'Hubbard Figure 12.3: Apple and Spotify each charge $14.99 or $9.99 a month for music streaming. The undercutter steals customers.' },
    expand: { name: 'One player dominant', A: ['Expand', 'Hold'], B: ['Expand', 'Hold'], who: ['Firm A', 'Firm B'],
      pay: [[[4, 3], [7, 2]], [[3, 5], [6, 6]]], unit: '$ millions profit',
      story: 'Firm A has a dominant strategy; Firm B does not. B can still predict A’s move (a conjecture) and best-respond to it.' }
  };
  GL.GAMES = GAMES;

  /* ── matrix explorer ── */
  labs.matrix = function (host) {
    const card = el('div', { class: 'gl-lab' });
    card.append(el('div', { class: 'gl-lab-head', html: '<h3>Find the Nash equilibrium: circle the best responses</h3><span class="gl-tag">Unit 10</span>' }));
    host.append(card);
    let key = 'ads', picks = new Set(), checked = false;
    const top = el('div', { class: 'gl-ctrl' }); card.append(top);
    GL.seg(top, Object.keys(GAMES).map(k => [k, GAMES[k].name]), key, v => { key = v; picks = new Set(); checked = false; render(); });
    const story = el('p', { style: 'margin:10px 0 4px;font-size:14.5px' }); top.append(story);
    const grid = el('div', { class: 'gl-grid2', style: 'margin-top:12px' }); card.append(grid);
    const left = el('div'), right = el('div', { class: 'gl-side' }); grid.append(left, right);
    right.append(el('div', { class: 'gl-ctrl', html: '<p class="gl-ctrl-h">Dr. Mang’s circle method</p><ol style="margin:0;padding-left:20px;font-size:14px"><li>Fix <b style="color:var(--gl-atc)">B</b>’s choice (one column). Click <b style="color:var(--gl-p)">A</b>’s <em>higher</em> payoff in that column: A’s best response. Do both columns.</li><li>Fix A’s choice (one row). Click B’s higher payoff. Do both rows.</li><li>Same choice circled in both cases → a <b>dominant strategy</b>. A cell with <b>both</b> payoffs circled → a <b>Nash equilibrium</b>.</li></ol>' }));
    const btns = el('div', { class: 'gl-btnrow' }); right.append(btns);
    const chk = el('button', { type: 'button', class: 'gl-btn primary', text: 'Check my circles' });
    const show = el('button', { type: 'button', class: 'gl-btn', text: 'Show the answer' });
    const clr = el('button', { type: 'button', class: 'gl-btn ghost', text: 'Clear' });
    btns.append(chk, show, clr);
    const out = GL.status(right);
    chk.onclick = () => { checked = true; render(); };
    show.onclick = () => { const an = analyse(GAMES[key]); picks = new Set(); an.bestA.forEach((rs, c) => rs.forEach(r => picks.add(`a${r}${c}`))); an.bestB.forEach((cs, r) => cs.forEach(c => picks.add(`b${r}${c}`))); checked = true; render(); };
    clr.onclick = () => { picks = new Set(); checked = false; render(); };
    function render() {
      const g = GAMES[key], an = analyse(g);
      story.innerHTML = g.story + ` <span style="color:var(--muted)">(payoffs: ${g.unit}; <b style="color:var(--gl-p)">${g.who[0]}</b>’s first, <b style="color:var(--gl-atc)">${g.who[1]}</b>’s second)</span>`;
      const t = el('table', { class: 'gl-matrix' });
      t.innerHTML = `<tr><th></th><th></th><th colspan="2" class="pb">${g.who[1]}${/ [AB]$/.test(g.who[1]) ? '' : ' (B)'}</th></tr><tr><th></th><th></th><th class="pb">${g.B[0]}</th><th class="pb">${g.B[1]}</th></tr>`;
      for (let r = 0; r < 2; r++) {
        const tr = el('tr');
        if (r === 0) tr.append(el('th', { class: 'pa', rowspan: 2, html: `${g.who[0]}${/ [AB]$/.test(g.who[0]) ? '' : '<br>(A)'}` }));
        tr.append(el('th', { class: 'pa', text: g.A[r] }));
        for (let c = 0; c < 2; c++) {
          const td = el('td', { class: 'cell' });
          const isNash = an.nash.some(n => n[0] === r && n[1] === c);
          if (checked && isNash) td.classList.add('nash');
          if (checked && an.joint[0] === r && an.joint[1] === c && !isNash) td.classList.add('collude');
          ['a', 'b'].forEach((who, i) => {
            const id = `${who}${r}${c}`;
            const right = who === 'a' ? an.bestA[c].includes(r) : an.bestB[r].includes(c);
            const b = el('button', { type: 'button', class: `gl-pay ${who}`, text: g.pay[r][c][i], 'aria-pressed': String(picks.has(id)) });
            if (picks.has(id)) b.classList.add('picked');
            if (checked) { if (picks.has(id)) b.classList.add(right ? 'right' : 'wrong'); else if (right) b.classList.add('missed'); }
            b.onclick = () => { picks.has(id) ? picks.delete(id) : picks.add(id); checked = false; render(); };
            td.append(b);
            if (!i) td.append(document.createTextNode(' , '));
          });
          tr.append(td);
        }
        t.append(tr);
      }
      left.innerHTML = ''; left.append(t);
      left.append(el('p', { class: 'gl-key', html: 'Click a payoff to circle it. Green border = Nash equilibrium · amber outline = what they’d pick if they could collude (highest joint payoff).' }));
      if (!checked) { out.set('', 'Circle the best responses, then press <b>Check</b>.'); return; }
      const allRight = ['a', 'b'].every(who => [0, 1].every(r => [0, 1].every(c => {
        const right = who === 'a' ? an.bestA[c].includes(r) : an.bestB[r].includes(c);
        return right === picks.has(`${who}${r}${c}`);
      })));
      const dom = (d, names, who) => d == null ? `${who} has <b>no dominant strategy</b> (its best response depends on the rival’s choice).` : `${who}’s <b>dominant strategy</b> is <b>${names[d]}</b>: the best response whatever the rival does.`;
      const ne = an.nash.map(([r, c]) => `(${g.A[r]}, ${g.B[c]})`).join(' and ');
      let msg = `${allRight ? '<b>All circles right.</b> ' : 'Some circles are off (red = wrong, dashed green = missed). '}` +
        `${dom(an.domA, g.A, g.who[0])} ${dom(an.domB, g.B, g.who[1])}<br>Nash equilibri${an.nash.length > 1 ? 'a' : 'um'}: <b>${ne}</b>${an.domA != null && an.domB != null ? ' — also a <b>dominant strategy equilibrium</b>' : ''}.`;
      if (an.pd) msg += `<small><b>A prisoner’s dilemma:</b> both would earn more at (${g.A[an.joint[0]]}, ${g.B[an.joint[1]]}), but each has an incentive to cheat on that deal, so they end up worse off. Mang: individuals acting in their own self-interest can end up somewhere that isn’t socially optimal — and that’s why collusion is tempting but unstable.</small>`;
      else if (an.nash.length > 1) msg += '<small>No dominant strategies and two equilibria. Outcomes outside them can happen, but then a player would want to switch. In a repeated game, players can signal and learn.</small>';
      out.set(allRight ? 'ok' : 'warn', msg);
    }
    render();
  };

  /* ── repeated game (Hubbard's Apple–Spotify payoffs) ── */
  labs.repeated = function (host) {
    const card = el('div', { class: 'gl-lab' });
    card.append(el('div', { class: 'gl-lab-head', html: '<h3>Repeated pricing game: can cooperation survive?</h3><span class="gl-tag">Unit 10</span>' }));
    host.append(card);
    const P = GAMES.price.pay; /* 0 = cooperate ($14.99), 1 = undercut ($9.99) */
    const STRATS = {
      tft: ['Tit-for-tat', 'Start at $14.99; then copy the rival’s last move', (me, them) => them.length ? them[them.length - 1] : 0],
      grim: ['Grim trigger', '$14.99 until the rival cuts once, then $9.99 forever', (me, them) => them.includes(1) ? 1 : 0],
      coop: ['Always $14.99', 'Never undercut', () => 0],
      cheat: ['Always $9.99', 'Undercut every round', () => 1],
      rand: ['Random', 'Flip a coin each round', () => Math.random() < .5 ? 0 : 1]
    };
    let mine = 'tft', theirs = 'cheat';
    const g = el('div', { class: 'gl-grid2' }); card.append(g);
    const left = el('div', { class: 'gl-side' }), right = el('div', { class: 'gl-side' }); g.append(left, right);
    const c1 = GL.ctrl(left, 'Your strategy (Apple)'); GL.seg(c1, Object.keys(STRATS).map(k => [k, STRATS[k][0]]), mine, v => { mine = v; run(); });
    const c2 = GL.ctrl(left, 'Rival’s strategy (Spotify)'); GL.seg(c2, Object.keys(STRATS).map(k => [k, STRATS[k][0]]), theirs, v => { theirs = v; run(); });
    const again = el('button', { type: 'button', class: 'gl-btn', text: '↻ Replay 10 months' }); again.onclick = run;
    left.append(again);
    const rows = el('div'); right.append(rows);
    const ro = GL.readout(right), st = GL.status(right);
    function run() {
      const a = [], b = [];
      for (let i = 0; i < 10; i++) { const x = STRATS[mine][2](a, b), y = STRATS[theirs][2](b, a); a.push(x); b.push(y); }
      const pa = a.map((x, i) => P[x][b[i]][0]), pb = a.map((x, i) => P[x][b[i]][1]);
      const sum = v => v.reduce((s, x) => s + x, 0);
      rows.innerHTML = '';
      const mk = (lab, arr, pay) => { rows.append(el('div', { class: 'gl-key', html: `<b>${lab}</b>` })); const r = el('div', { class: 'gl-rounds' }); arr.forEach((x, i) => r.append(el('div', { class: 'gl-round ' + (x ? 'x' : 'c'), title: x ? '$9.99' : '$14.99', text: (x ? 'L ' : 'H ') + fmt(pay[i], 1) }))); rows.append(r); };
      mk('You — ' + STRATS[mine][1], a, pa); mk('Rival — ' + STRATS[theirs][1], b, pb);
      rows.append(el('p', { class: 'gl-key', text: 'H = $14.99 (cooperate), L = $9.99 (undercut); numbers are that month’s profit in $ millions.' }));
      ro.set([['Your total profit (10 months)', '$' + fmt(sum(pa), 1) + 'M', true], ['Rival’s total profit', '$' + fmt(sum(pb), 1) + 'M'], ['Both always $14.99 (collusion)', '$100M each'], ['Both always $9.99 (one-shot Nash)', '$75M each']]);
      const both = sum(pa) + sum(pb);
      st.set(both >= 185 ? 'ok' : both <= 160 ? 'bad' : 'warn', both >= 185 ? 'Cooperation held: both kept the high price and earned close to the collusive profit.<small>In a repeated game, undercutting today invites retaliation tomorrow. Tit-for-tat (Hubbard) is easy to read, quick to punish and quick to forgive — Mang’s “signalling and updating” in action.</small>'
        : both <= 160 ? 'A price war: both end up near the one-shot Nash outcome.<small>Against “always $9.99”, the best you can do is match it (punishment), which is what tit-for-tat and grim trigger do after month 1.</small>'
          : 'Mixed results: some months of cooperation, some of punishment.<small>Try tit-for-tat against tit-for-tat or grim trigger.</small>');
    }
    run();
  };

  /* ── sequential game (Hubbard Figure 12.7: Apple and Dell) ── */
  labs.sequential = function (host) {
    const card = el('div', { class: 'gl-lab' });
    card.append(el('div', { class: 'gl-lab-head', html: '<h3>Sequential game: should Apple deter Dell?</h3><span class="gl-tag">Unit 10 · Textbook</span>' }));
    host.append(card);
    /* payoffs = rates of return (Apple, Dell); Dell's "stay out" = the 15% it can earn elsewhere */
    const VERS = {
      deter: { name: 'Hubbard’s numbers', pay: { HE: [16, 16], HS: [30, 15], LE: [5, 5], LS: [20, 15] } },
      nodeter: { name: 'What if $800 earns Apple only 14%?', pay: { HE: [16, 16], HS: [30, 15], LE: [5, 5], LS: [14, 15] } }
    };
    const LAB = { H: 'Charge $1,000', L: 'Charge $800' };
    let ver = 'deter', choice = {}, step = 0;
    const top = el('div', { class: 'gl-ctrl' }); card.append(top);
    GL.seg(top, Object.keys(VERS).map(k => [k, VERS[k].name]), ver, v => { ver = v; choice = {}; step = 0; render(); });
    top.append(el('p', { style: 'margin:8px 0 0;font-size:14px', html: '<b>Apple</b> prices its new laptop first ($1,000, or $800 to deter entry); <b>Dell</b> sees the price and decides to enter or stay out. Payoffs are rates of return <b>(Apple, Dell)</b>; each firm needs <b>15%</b> to break even, so Dell’s “stay out” is the 15% it can earn elsewhere. Solve by <b>backward induction</b>: start at the end.' }));
    const g = el('div', { class: 'gl-grid2', style: 'margin-top:12px' }); card.append(g);
    const left = el('div'), right = el('div', { class: 'gl-side' }); g.append(left, right);
    const st = GL.status(right);
    const reset = el('button', { type: 'button', class: 'gl-btn', text: 'Start over' }); reset.onclick = () => { choice = {}; step = 0; render(); };
    right.append(reset);
    function render() {
      const P = VERS[ver].pay;
      const W = 560, H = 330;
      const svg = GL.sv('svg', { viewBox: `0 0 ${W} ${H}`, class: 'gl-tree' });
      const nodes = { root: [70, 165], H: [270, 85], L: [270, 245] };
      const leaves = { HE: [470, 40], HS: [470, 130], LE: [470, 200], LS: [470, 290] };
      const best2 = { H: P.HE[1] > P.HS[1] ? 'HE' : 'HS', L: P.LE[1] > P.LS[1] ? 'LE' : 'LS' };
      const best1 = P[best2.H][0] >= P[best2.L][0] ? 'H' : 'L';
      const edge = (a, b, lab, id, clickable) => {
        const cls = 'edge' + (step >= 1 && (id === best2.H || id === best2.L) ? ' best' : '') + (step >= 1 && (id.length === 2 && id !== best2[id[0]]) ? ' cut' : '') + (step >= 2 && id.length === 1 ? (id === best1 ? ' best' : ' cut') : '');
        svg.append(GL.sv('line', { class: cls, x1: a[0], y1: a[1], x2: b[0], y2: b[1] }));
        const t = GL.sv('text', { x: (a[0] + b[0]) / 2, y: (a[1] + b[1]) / 2 - 8, 'text-anchor': 'middle' }); t.textContent = lab; svg.append(t);
        if (clickable) { const hit = GL.sv('line', { x1: a[0], y1: a[1], x2: b[0], y2: b[1], stroke: 'transparent', 'stroke-width': 22, class: 'node' }); hit.addEventListener('click', clickable); svg.append(hit); }
      };
      const pick2 = (n, id) => () => { if (step !== 0) return; choice[n] = id; if (choice.H && choice.L) step = 1; render(); };
      const pick1 = id => () => { if (step !== 1) return; choice.root = id; step = 2; render(); };
      edge(nodes.root, nodes.H, LAB.H, 'H', pick1('H')); edge(nodes.root, nodes.L, LAB.L, 'L', pick1('L'));
      edge(nodes.H, leaves.HE, 'Enter', 'HE', pick2('H', 'HE')); edge(nodes.H, leaves.HS, 'Stay out', 'HS', pick2('H', 'HS'));
      edge(nodes.L, leaves.LE, 'Enter', 'LE', pick2('L', 'LE')); edge(nodes.L, leaves.LS, 'Stay out', 'LS', pick2('L', 'LS'));
      const node = (p, lab) => { svg.append(GL.sv('circle', { cx: p[0], cy: p[1], r: 9, fill: 'var(--acc)' })); const t = GL.sv('text', { x: p[0], y: p[1] + 28, 'text-anchor': 'middle' }); t.textContent = lab; svg.append(t); };
      node(nodes.root, 'Apple'); node(nodes.H, 'Dell'); node(nodes.L, 'Dell');
      Object.keys(leaves).forEach(k => {
        const [x, y] = leaves[k]; const g2 = GL.sv('g', { class: 'pay' });
        const t = GL.sv('text', { x: x + 12, y: y + 5 }); t.textContent = `(${P[k][0]}%, ${P[k][1]}%${k[1] === 'S' ? '*' : ''})`;
        if (choice.H === k || choice.L === k) t.setAttribute('style', 'text-decoration:underline');
        g2.append(t); svg.append(g2);
      });
      left.innerHTML = ''; left.append(svg, el('p', { class: 'gl-key', text: '* Dell stays out and earns its 15% elsewhere.' }));
      const word = k => k[1] === 'E' ? 'enters' : 'stays out';
      if (step === 0) st.set('', '<b>Step 1 (the end of the game):</b> click the branch <b>Dell</b> would choose after a <em>$1,000</em> price, then after an <em>$800</em> price. Dell compares the <em>second</em> number.');
      else if (step === 1) {
        const ok = choice.H === best2.H && choice.L === best2.L;
        st.set(ok ? 'ok' : 'warn', `${ok ? 'Right.' : 'Not quite — the green branches show Dell’s best replies.'} After $1,000 Dell <b>${word(best2.H)}</b> (${P[best2.H][1]}% vs ${P[best2.H === 'HE' ? 'HS' : 'HE'][1]}%); after $800 it <b>${word(best2.L)}</b>.<br><b>Step 2:</b> now click Apple’s best price, knowing those replies (compare the <em>first</em> numbers on the green branches).`);
      } else {
        const ok = choice.root === best1;
        const r = P[best2[best1]];
        st.set(ok ? 'ok' : 'warn', `${ok ? 'Right.' : 'Not quite.'} Apple compares ${P[best2.H][0]}% ($1,000 → Dell ${word(best2.H)}) with ${P[best2.L][0]}% ($800 → Dell ${word(best2.L)}) and charges <b>${best1 === 'H' ? '$1,000' : '$800'}</b>. Equilibrium: (${r[0]}%, ${r[1]}%).<small>${ver === 'deter' ? 'Apple’s dream outcome (30%) was never available: at $1,000 Dell always enters. A low price deters entry and that is worth it.' : 'Now keeping the price low earns Apple less than sharing the market at $1,000, so it accepts entry — Hubbard’s “Is deterring entry always a good idea?”'}</small>`);
      }
    }
    render();
  };
})();
