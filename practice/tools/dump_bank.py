#!/usr/bin/env python3
"""Print a bank as readable text for auditing. Usage: python dump_bank.py bank.json [id-prefix]"""
import json, sys
sys.stdout.reconfigure(encoding="utf-8")
d = json.load(open(sys.argv[1], encoding="utf-8"))
pref = sys.argv[2] if len(sys.argv) > 2 else ""
if d.get("scenarios"):
    print("## SCENARIOS")
    for k, v in d["scenarios"].items():
        print(f"[{k}] {v.get('title','')}\n  {v.get('body','')}")
        if v.get("table"): print("  TABLE:", json.dumps(v["table"], ensure_ascii=False))
        if v.get("figure"): print("  FIGURE:", json.dumps(v["figure"], ensure_ascii=False)[:400])
for q in d["questions"]:
    if not q.get("id", "").startswith(pref): continue
    src = q.get("source", {})
    print(f"\n### {q['id']} [{q['type']}] unit {q.get('unit', d.get('defaultUnit'))} · {q.get('topic')} · d{q.get('difficulty')} · {src.get('ref')}" + (f" · scenario={q['scenario']}" if q.get('scenario') else "") + (f" · {q.get('scopeNote')}" if q.get('scopeNote') else ""))
    if q.get("figure"): print("FIGURE:", json.dumps(q["figure"], ensure_ascii=False)[:500])
    print("PROMPT:", q["prompt"])
    if q["type"] in ("mc", "multi"):
        for i, o in enumerate(q["options"]):
            t = o if isinstance(o, str) else o["text"]
            print(f"  {'abcdefgh'[i]}) {t}")
        print("ANSWER:", q["answer"], "| shuffle:", q.get("shuffleOptions"))
    elif q["type"] == "tf":
        print("ANSWER:", q["answer"])
    elif q["type"] == "numeric":
        print("ANSWER:", json.dumps(q["answer"], ensure_ascii=False))
    elif q["type"] == "graph":
        print("GRAPH:", json.dumps(q["graph"], ensure_ascii=False))
    print("EXPL:", q.get("explanation"))
