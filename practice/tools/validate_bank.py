#!/usr/bin/env python3
"""Validate practice-test question banks against practice-bank/v1 (see ../SCHEMA.md).

Usage:  python validate_bank.py bank1.json [bank2.json ...]
Exit code 0 when every bank is valid; 1 otherwise. Warnings never fail the run.
"""
import json
import re
import sys
from pathlib import Path

TYPES = {"mc", "multi", "tf", "numeric", "graph"}
KINDS = {"past-test", "slides", "textbook", "generated", "custom"}
SLOPES = {"negative", "positive", "flat", "vertical", "any"}
DIRS = {"right", "left", "up", "down"}
ALL_OF_THE_ABOVE = re.compile(r"\b(all|none|both|neither)\b.*\b(above|of these|a and b|b and c|\(a\)|\(b\))", re.I)


class Report:
    def __init__(self, name):
        self.name, self.errors, self.warnings = name, [], []

    def err(self, where, msg):
        self.errors.append(f"{where}: {msg}")

    def warn(self, where, msg):
        self.warnings.append(f"{where}: {msg}")


def is_num(v):
    return isinstance(v, (int, float)) and not isinstance(v, bool)


def check_text(rep, where, obj, key, required=True):
    v = obj.get(key)
    if v is None or (isinstance(v, str) and not v.strip()):
        if required:
            rep.err(where, f'missing "{key}"')
        return
    if not isinstance(v, str):
        rep.err(where, f'"{key}" must be a string')
        return
    if "<script" in v.lower() or re.search(r"\son\w+\s*=", v):
        rep.err(where, f'"{key}" contains script/event-handler markup')


def check_figure(rep, where, fig):
    if not isinstance(fig, dict):
        rep.err(where, "figure must be an object")
        return
    t = fig.get("type")
    if t == "graph":
        check_graph_spec(rep, where + ".figure", fig.get("spec"), allow_tasks=False)
    elif t == "image":
        if not fig.get("src"):
            rep.err(where, 'image figure needs "src"')
    elif t == "table":
        check_table(rep, where + ".figure", fig)
    else:
        rep.err(where, f'unknown figure type "{t}" (graph | image | table)')


def check_table(rep, where, t):
    rows = t.get("rows")
    if not isinstance(rows, list) or not rows:
        rep.err(where, 'table needs a non-empty "rows" array')
        return
    widths = {len(r) for r in rows if isinstance(r, list)}
    if len(widths) > 1:
        rep.warn(where, f"table rows have differing lengths {sorted(widths)}")
    if t.get("headers") and isinstance(t["headers"], list) and widths and len(t["headers"]) not in widths:
        rep.warn(where, "table headers length differs from row length")


def check_axis(rep, where, ax):
    if ax is None:
        return
    if not isinstance(ax, dict):
        rep.err(where, "axis must be an object")
        return
    lo, hi = ax.get("min", 0), ax.get("max", 100)
    if not (is_num(lo) and is_num(hi) and hi > lo):
        rep.err(where, f"axis min/max invalid ({lo}, {hi})")


def in_range(v, lo, hi):
    return is_num(v) and lo - 1e-9 <= v <= hi + 1e-9


def check_graph_spec(rep, where, spec, allow_tasks=True):
    if not isinstance(spec, dict):
        rep.err(where, "graph spec must be an object")
        return
    check_axis(rep, where + ".x", spec.get("x"))
    check_axis(rep, where + ".y", spec.get("y"))
    x = spec.get("x") or {}
    y = spec.get("y") or {}
    xlo, xhi = x.get("min", 0), x.get("max", 100)
    ylo, yhi = y.get("min", 0), y.get("max", 100)
    curve_ids, point_ids = set(), set()
    for i, c in enumerate(spec.get("curves") or []):
        w = f"{where}.curves[{i}]"
        if not isinstance(c, dict):
            rep.err(w, "curve must be an object")
            continue
        cid = c.get("id", f"c{i}")
        if cid in curve_ids:
            rep.err(w, f'duplicate curve id "{cid}"')
        curve_ids.add(cid)
        pts = c.get("points")
        lin = c.get("linear")
        if lin is not None:
            if not (isinstance(lin, dict) and is_num(lin.get("intercept")) and is_num(lin.get("slope"))):
                rep.err(w, "linear needs numeric intercept and slope")
        elif not (isinstance(pts, list) and len(pts) >= 2):
            rep.err(w, 'curve needs "points" (>= 2) or "linear"')
        else:
            for p in pts:
                if not (isinstance(p, list) and len(p) == 2 and is_num(p[0]) and is_num(p[1])):
                    rep.err(w, f"bad point {p}")
                elif not (in_range(p[0], xlo, xhi) and in_range(p[1], ylo, yhi)):
                    rep.warn(w, f"point {p} lies outside the axes (will be clipped)")
    for i, p in enumerate(spec.get("points") or []):
        w = f"{where}.points[{i}]"
        if not isinstance(p, dict) or not (is_num(p.get("x")) and is_num(p.get("y"))):
            rep.err(w, "point needs numeric x and y")
            continue
        pid = p.get("id", f"p{i}")
        if pid in point_ids:
            rep.err(w, f'duplicate point id "{pid}"')
        point_ids.add(pid)
        if not (in_range(p["x"], xlo, xhi) and in_range(p["y"], ylo, yhi)):
            rep.warn(w, "point lies outside the axes")
    for i, r in enumerate(spec.get("regions") or []):
        w = f"{where}.regions[{i}]"
        pts = r.get("points") if isinstance(r, dict) else None
        if not (isinstance(pts, list) and len(pts) >= 3):
            rep.err(w, "region needs >= 3 points")
    for i, g in enumerate(spec.get("guides") or []):
        w = f"{where}.guides[{i}]"
        if not isinstance(g, dict) or g.get("axis") not in ("x", "y") or not is_num(g.get("at")):
            rep.err(w, 'guide needs axis ("x"|"y") and numeric "at"')

    tasks = spec.get("tasks") or []
    if tasks and not allow_tasks:
        rep.err(where, "static figures cannot have tasks")
    task_ids = []
    for i, t in enumerate(tasks):
        w = f"{where}.tasks[{i}]"
        if not isinstance(t, dict):
            rep.err(w, "task must be an object")
            continue
        tid = t.get("id", f"t{i}")
        if tid in task_ids:
            rep.err(w, f'duplicate task id "{tid}"')
        task_ids.append(tid)
        kind = t.get("kind", "line")
        if kind not in ("line", "point"):
            rep.err(w, f'task kind must be "line" or "point" (got {kind!r})')
        if not t.get("label"):
            rep.warn(w, "task has no label")
        e = t.get("expect")
        if not isinstance(e, dict) or not e:
            rep.err(w, 'task needs a non-empty "expect"')
            continue

        def ref_ok(ref, allow_point=False):
            if isinstance(ref, dict):
                return is_num(ref.get("x")) and is_num(ref.get("y"))
            if not isinstance(ref, str):
                return False
            if ref.startswith("user:") or ref.startswith("model:"):
                return ref.split(":", 1)[1] in task_ids
            return ref in curve_ids or (allow_point and ref in point_ids)

        if kind == "line":
            if "slope" in e and e["slope"] not in SLOPES:
                rep.err(w, f'bad slope "{e["slope"]}"')
            if ("shiftOf" in e) != ("direction" in e):
                rep.err(w, "shiftOf and direction must be given together")
            if "shiftOf" in e:
                if not ref_ok(e["shiftOf"]):
                    rep.err(w, f'shiftOf refers to unknown curve/task "{e["shiftOf"]}" (must be defined earlier)')
                if e.get("direction") not in DIRS:
                    rep.err(w, f'bad direction "{e.get("direction")}"')
            if "through" in e:
                if not isinstance(e["through"], list) or not all(isinstance(p, dict) and is_num(p.get("x")) and is_num(p.get("y")) for p in e["through"]):
                    rep.err(w, "through must be a list of {x, y}")
            if not any(k in e for k in ("slope", "shiftOf", "through")):
                rep.err(w, "line expect needs at least one of slope / shiftOf+direction / through")
        else:
            targets = [k for k in ("near", "atIntersection", "onCurve", "region", "side") if k in e]
            if len(targets) > 1:
                rep.err(w, f"point expect should use a single target, got {targets}")
            if not targets and "relativeTo" not in e:
                rep.err(w, "point expect needs near / atIntersection / onCurve / region / side / relativeTo")
            if "side" in e:
                sd = e["side"]
                if not (isinstance(sd, dict) and ref_ok(sd.get("of")) and sd.get("which") in ("above", "below")):
                    rep.err(w, 'side must be {"of": <curve id>, "which": "above"|"below"}')
            if "near" in e and not (isinstance(e["near"], dict) and is_num(e["near"].get("x")) and is_num(e["near"].get("y"))):
                rep.err(w, "near must be {x, y}")
            if "atIntersection" in e:
                ai = e["atIntersection"]
                if not (isinstance(ai, list) and len(ai) == 2 and all(ref_ok(r) for r in ai)):
                    rep.err(w, f"atIntersection must name two known curves/tasks (got {ai})")
            if "onCurve" in e and not ref_ok(e["onCurve"]):
                rep.err(w, f'onCurve refers to unknown curve/task "{e["onCurve"]}"')
            if "region" in e and not isinstance(e["region"], dict):
                rep.err(w, "region must be an object")
            if "relativeTo" in e:
                r = e["relativeTo"]
                if not isinstance(r, dict) or not ref_ok(r.get("ref"), allow_point=True):
                    rep.err(w, f"relativeTo.ref must name a defined point or user:<task> (got {r})")
                for ax in ("x", "y"):
                    if ax in (r or {}) and r[ax] not in ("+", "-", "0", "any"):
                        rep.err(w, f'relativeTo.{ax} must be "+", "-", "0" or "any"')


def check_question(rep, bank, q, i, seen_ids):
    qid = q.get("id") or f"[{i}]"
    w = f"q {qid}"
    if not isinstance(q, dict):
        rep.err(w, "question must be an object")
        return
    if not q.get("id"):
        rep.warn(w, 'missing "id" (one will be generated, but stable ids are recommended)')
    elif q["id"] in seen_ids:
        rep.err(w, "duplicate question id")
    seen_ids.add(q.get("id"))

    t = q.get("type", "mc")
    if t not in TYPES:
        rep.err(w, f'unknown type "{t}"')
        return
    check_text(rep, w, q, "prompt")
    check_text(rep, w, q, "explanation", required=False)
    if not q.get("explanation"):
        rep.warn(w, "no explanation — every question should teach")
    unit = q.get("unit", bank.get("defaultUnit"))
    if unit is None:
        rep.warn(w, "no unit (will show as General and never be filtered by scope)")
    elif not isinstance(unit, int):
        rep.err(w, f"unit must be an integer (got {unit!r})")
    if "difficulty" in q and q["difficulty"] not in (1, 2, 3):
        rep.err(w, "difficulty must be 1, 2 or 3")
    src = q.get("source") or {}
    kind = (src.get("kind") or (bank.get("defaultSource") or {}).get("kind"))
    if kind and kind not in KINDS:
        rep.err(w, f'source.kind "{kind}" not in {sorted(KINDS)}')
    if q.get("scenario") and q["scenario"] not in (bank.get("scenarios") or {}):
        rep.err(w, f'scenario "{q["scenario"]}" is not defined in bank.scenarios')
    if "figure" in q:
        check_figure(rep, w, q["figure"])
    if "tags" in q and not (isinstance(q["tags"], list) and all(isinstance(x, str) for x in q["tags"])):
        rep.err(w, "tags must be a list of strings")

    if t in ("mc", "multi"):
        opts = q.get("options")
        if not isinstance(opts, list) or len(opts) < 2:
            rep.err(w, "needs >= 2 options")
            return
        ids = []
        for j, o in enumerate(opts):
            if isinstance(o, str):
                ids.append("abcdefghij"[j])
                text = o
            elif isinstance(o, dict):
                ids.append(o.get("id", "abcdefghij"[j]))
                text = o.get("text", "")
                if not text:
                    rep.err(w, f"option {j} has no text")
            else:
                rep.err(w, f"option {j} must be a string or object")
                continue
            if q.get("shuffleOptions") and isinstance(text, str) and ALL_OF_THE_ABOVE.search(text):
                rep.err(w, f'shuffleOptions is true but option "{text[:40]}" references other options')
        if len(set(ids)) != len(ids):
            rep.err(w, f"duplicate option ids {ids}")
        ans = q.get("answer")
        if t == "mc":
            if ans not in ids:
                rep.err(w, f"answer {ans!r} is not one of the option ids {ids}")
            if len(opts) != 4:
                rep.warn(w, f"{len(opts)} options (the real test uses 4)")
        else:
            if not (isinstance(ans, list) and ans and all(a in ids for a in ans)):
                rep.err(w, f"multi answer must be a non-empty list of option ids (got {ans!r})")
    elif t == "tf":
        if q.get("answer") not in (True, False, "true", "false", "a", "b"):
            rep.err(w, "tf answer must be true/false")
    elif t == "numeric":
        a = q.get("answer")
        if not isinstance(a, dict) or not is_num(a.get("value")):
            rep.err(w, 'numeric answer must be {"value": number, ...}')
        else:
            for k in ("tolerance", "tolerancePct"):
                if k in a and a[k] is not None and not is_num(a[k]):
                    rep.err(w, f"{k} must be numeric")
            if "accept" in a and not (isinstance(a["accept"], list) and all(is_num(v) for v in a["accept"])):
                rep.err(w, "accept must be a list of numbers")
    elif t == "graph":
        g = q.get("graph")
        if not isinstance(g, dict):
            rep.err(w, 'graph question needs a "graph" spec')
            return
        if not g.get("tasks"):
            rep.err(w, "graph question needs at least one task")
        check_graph_spec(rep, w + ".graph", g, allow_tasks=True)


def validate(path):
    rep = Report(str(path))
    try:
        data = json.loads(Path(path).read_text(encoding="utf-8"))
    except Exception as e:  # noqa: BLE001
        rep.err("file", f"invalid JSON: {e}")
        return rep
    if not isinstance(data, dict):
        rep.err("file", "top level must be an object")
        return rep
    if data.get("schema") != "practice-bank/v1":
        rep.warn("bank", 'schema should be "practice-bank/v1"')
    for k in ("id", "title"):
        if not data.get(k):
            rep.err("bank", f'missing "{k}"')
    ds = data.get("defaultSource")
    if ds is not None and (not isinstance(ds, dict) or not ds.get("label")):
        rep.err("bank", "defaultSource must be an object with a label")
    for sid, sc in (data.get("scenarios") or {}).items():
        w = f"scenario {sid}"
        if not isinstance(sc, dict):
            rep.err(w, "must be an object")
            continue
        if not any(sc.get(k) for k in ("body", "table", "figure")):
            rep.err(w, "needs body, table or figure")
        if sc.get("table"):
            check_table(rep, w, sc["table"])
        if sc.get("figure"):
            check_figure(rep, w, sc["figure"])
    qs = data.get("questions")
    if not isinstance(qs, list) or not qs:
        rep.err("bank", 'needs a non-empty "questions" array')
        return rep
    seen = set()
    for i, q in enumerate(qs):
        check_question(rep, data, q, i, seen)
    used = {q.get("scenario") for q in qs if isinstance(q, dict) and q.get("scenario")}
    for sid in (data.get("scenarios") or {}):
        if sid not in used:
            rep.warn(f"scenario {sid}", "defined but never used")
    return rep


def main(argv):
    if len(argv) < 2:
        print(__doc__)
        return 2
    ok = True
    for p in argv[1:]:
        rep = validate(p)
        n = 0
        try:
            n = len(json.loads(Path(p).read_text(encoding="utf-8")).get("questions", []))
        except Exception:  # noqa: BLE001
            pass
        status = "OK " if not rep.errors else "FAIL"
        print(f"[{status}] {p}  ({n} questions, {len(rep.errors)} errors, {len(rep.warnings)} warnings)")
        for e in rep.errors:
            print("   ERROR   " + e)
        for w in rep.warnings:
            print("   warn    " + w)
        ok = ok and not rep.errors
    return 0 if ok else 1


if __name__ == "__main__":
    sys.exit(main(sys.argv))
