#!/usr/bin/env node
/* Self-consistency check for graph questions.
 *
 * For every `graph` question in the given banks, derive the model answer with
 * EconGraph.modelPolys(), turn it into student drawings, and grade it with
 * EconGraph.gradeDrawings(). A well-formed task must accept its own model answer.
 * Also checks that an obviously wrong drawing (the reference curve itself, or a
 * point at the old equilibrium) is rejected, so tasks cannot be passed trivially.
 *
 * Usage: node check_graphs.js bank1.json [bank2.json ...]
 */
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const src = fs.readFileSync(path.join(__dirname, '..', 'graph.js'), 'utf8');
const win = {};
vm.runInNewContext(src, { window: win, document: undefined, Math, console });
const EconGraph = win.EconGraph;

function normSpec(spec) {
  const x = Object.assign({ min: 0, max: 100 }, spec.x || {});
  const y = Object.assign({ min: 0, max: 100 }, spec.y || {});
  return { x, y };
}
function fromNorm(spec, u, v) {
  const { x, y } = normSpec(spec);
  return [x.min + u * (x.max - x.min), y.min + v * (y.max - y.min)];
}
function toNorm(spec, px, py) {
  const { x, y } = normSpec(spec);
  return [(px - x.min) / (x.max - x.min), (py - y.min) / (y.max - y.min)];
}

let failures = 0, checked = 0;
for (const file of process.argv.slice(2)) {
  const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const q of bank.questions || []) {
    if (q.type !== 'graph') continue;
    checked++;
    const spec = q.graph;
    const tag = `${path.basename(file)} ${q.id}`;
    let models;
    try { models = EconGraph.modelPolys(spec); } catch (e) { console.log(`FAIL ${tag}: modelPolys threw ${e.message}`); failures++; continue; }
    const drawings = {};
    for (const t of spec.tasks) {
      const m = models[t.id];
      if (!m) { console.log(`FAIL ${tag}: no model answer could be derived for task "${t.id}" — add "model" or fix "expect"`); failures++; continue; }
      if (m.kind === 'line') drawings[t.id] = { kind: 'line', points: m.poly.map(p => fromNorm(spec, p[0], p[1])) };
      else drawings[t.id] = { kind: 'point', x: fromNorm(spec, m.point[0], m.point[1])[0], y: fromNorm(spec, m.point[0], m.point[1])[1] };
    }
    const res = EconGraph.gradeDrawings(spec, drawings);
    if (!res.ok) {
      failures++;
      console.log(`FAIL ${tag}: model answer does not pass its own grading`);
      for (const r of res.results) if (!r.ok) console.log(`      - ${r.taskId}: ${r.message}`);
      continue;
    }
    // Negative control: shifted-line tasks must reject the unshifted reference; intersection points must reject the old equilibrium.
    const bad = {};
    for (const t of spec.tasks) {
      const e = t.expect || {};
      if (t.kind === 'line' && e.shiftOf) {
        const ref = (spec.curves || []).find(c => c.id === e.shiftOf);
        if (ref && ref.points) bad[t.id] = { kind: 'line', points: ref.points.slice(0, 2) };
      } else if (t.kind === 'point' && e.relativeTo && typeof e.relativeTo.ref === 'string' && !e.relativeTo.ref.includes(':')) {
        const p = (spec.points || []).find(p => p.id === e.relativeTo.ref);
        if (p) bad[t.id] = { kind: 'point', x: p.x, y: p.y };
      }
    }
    if (Object.keys(bad).length) {
      const merged = Object.assign({}, drawings, bad);
      const r2 = EconGraph.gradeDrawings(spec, merged);
      const wrongly = r2.results.filter(r => r.ok && bad[r.taskId]);
      if (wrongly.length) { failures++; console.log(`FAIL ${tag}: trivially wrong drawing accepted for task(s) ${wrongly.map(r => r.taskId).join(', ')}`); continue; }
    }
    console.log(`ok   ${tag} (${spec.tasks.length} task${spec.tasks.length === 1 ? '' : 's'})`);
  }
}
// ── Lint: a labelled point that sits NEAR (but not ON) the crossing of two curves is almost certainly a
// mis-computed equilibrium — relativeTo checks against it would then grade correct answers wrong.
function lintPoints(file, id, spec) {
  const curves = (spec.curves || []).filter(c => c.points && c.points.length === 2);
  for (const p of spec.points || []) {
    const pn = toNorm(spec, p.x, p.y);
    for (let a = 0; a < curves.length; a++) for (let b = a + 1; b < curves.length; b++) {
      const A = curves[a].points.map(q => toNorm(spec, q[0], q[1])), B = curves[b].points.map(q => toNorm(spec, q[0], q[1]));
      const ix = EconGraph._geom.polyIntersect(A, B);
      if (!ix) continue;
      const d = Math.hypot(pn[0] - ix[0], pn[1] - ix[1]);
      if (d > 0.005 && d < 0.1) { failures++; const [x, y] = fromNorm(spec, ix[0], ix[1]); console.log(`FAIL ${file} ${id}: point "${p.id}" (${p.x}, ${p.y}) is near but not on the crossing of ${curves[a].id} and ${curves[b].id} at (${x.toFixed(2)}, ${y.toFixed(2)})`); }
    }
  }
}
for (const file of process.argv.slice(2)) {
  const bank = JSON.parse(fs.readFileSync(file, 'utf8'));
  for (const q of bank.questions || []) {
    const figs = [].concat(q.figure || []).map(f => f.spec).filter(Boolean);
    for (const spec of [q.graph, ...figs].filter(Boolean)) lintPoints(path.basename(file), q.id, spec);
  }
}

// ── Regression cases for tolerant grading (bugs reported from real use) ──
function expectGrade(name, spec, drawings, want) {
  const r = EconGraph.gradeDrawings(spec, drawings);
  if (r.ok !== want) { failures++; console.log(`FAIL regression: ${name} → got ${r.ok}, want ${want}: ${r.results.map(x => x.message).join(' | ')}`); }
  else console.log(`ok   regression: ${name}`);
}
{
  const ppf = { x: { min: 0, max: 100 }, y: { min: 0, max: 100 }, curves: [{ id: 'ppf', points: [[0, 100], [100, 0]] }],
    tasks: [{ id: 'N', kind: 'point', label: 'N', expect: { side: { of: 'ppf', which: 'above' } } }] };
  expectGrade('PPF point just beyond the frontier (55, 62) is unattainable', ppf, { N: { kind: 'point', x: 55, y: 62 } }, true);
  expectGrade('PPF point inside the frontier (30, 30) is not unattainable', ppf, { N: { kind: 'point', x: 30, y: 30 } }, false);
  const inside = JSON.parse(JSON.stringify(ppf)); inside.tasks[0].expect = { side: { of: 'ppf', which: 'below' } };
  expectGrade('PPF point (60, 30) is inside the frontier', inside, { N: { kind: 'point', x: 60, y: 30 } }, true);

  // small leftward supply shift; E₂ tapped near the true intersection must pass "higher price than E₁"
  const D = [[8, 78], [70, 12]], S = [[8, 12], [78, 82]];
  const t = 66 / (66 / 62 + 1), E = { id: 'E', x: 8 + t, y: 12 + t };
  const spec = { x: { min: 0, max: 100 }, y: { min: 0, max: 100 }, curves: [{ id: 'D', points: D }, { id: 'S', points: S }], points: [E],
    tasks: [{ id: 'S2', kind: 'line', expect: { slope: 'positive', shiftOf: 'S', direction: 'left' } },
            { id: 'E2', kind: 'point', expect: { atIntersection: ['D', 'user:S2'], relativeTo: { ref: 'E', x: '-', y: '+' } } }] };
  const S2 = S.map(p => [p[0] - 6, p[1]]); // just over the minimum shift
  const m1 = (D[1][1] - D[0][1]) / (D[1][0] - D[0][0]), c1 = D[0][1] - m1 * D[0][0];
  const m2 = (S2[1][1] - S2[0][1]) / (S2[1][0] - S2[0][0]), c2 = S2[0][1] - m2 * S2[0][0];
  const ix = (c2 - c1) / (m1 - m2), iy = m1 * ix + c1;
  expectGrade('small S shift, E₂ tapped 2 units off the true intersection', spec,
    { S2: { kind: 'line', points: S2 }, E2: { kind: 'point', x: ix + 1, y: iy - 2 } }, true);
  expectGrade('small S shift, E₂ tapped on the old equilibrium', spec,
    { S2: { kind: 'line', points: S2 }, E2: { kind: 'point', x: E.x, y: E.y } }, false);
}

console.log(`\n${checked} graph questions checked, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
