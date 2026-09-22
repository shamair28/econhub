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
console.log(`\n${checked} graph questions checked, ${failures} failure(s)`);
process.exit(failures ? 1 : 0);
