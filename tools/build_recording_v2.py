#!/usr/bin/env python3
"""Build the recording script from the NEW Engine + Scenario content.

Pulls every Spanish line a voice must record out of the ENGINE and SCENARIOS
data (present / listen_repeat / produce / frame_swap / scene / roleplay steps),
organized by module, deduped, numbered. Every line is recorded twice — a
natural take and a slow take — per the spec.

Reads /tmp/esptalk_modules.json (dump ENGINE+SCENARIOS there first) and writes
RECORDING-SCRIPT.md + tools/recording-map.json.
"""
import json, re, unicodedata, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
DATA = json.load(open("/tmp/esptalk_modules.json", encoding="utf-8"))

def slug(text):
    t = unicodedata.normalize("NFKD", text.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t or "clip"

def clean(s):
    return re.sub(r"\s{2,}", " ", (s or "").strip())

# collect (module_label, [(es, en)]) preserving order; a line's "en" is best-effort
def lines_for_module(m):
    out = []
    for s in m["steps"]:
        t = s["type"]
        if t in ("present", "listen_repeat"):
            out.append((clean(s.get("es","")), clean(s.get("en",""))))
        elif t == "produce":
            out.append((clean(s.get("es","")), clean(s.get("en",""))))
        elif t == "frame_swap":
            frame = s.get("frame","")
            for slot in s.get("slots",[]):
                full = frame.replace("___", slot.get("es",""))
                en = s.get("en","").replace("___", slot.get("en",""))
                out.append((clean(full), clean(en)))
        elif t == "scene":
            for l in s.get("lines",[]):
                out.append((clean(l.get("sp","")), clean(l.get("en",""))))
        elif t == "roleplay":
            for l in s.get("lines",[]):
                out.append((clean(l.get("es","")), clean(l.get("en",""))))
    return out

modules = [("Foundations · " + m["code"] + " " + m["title"], m) for m in DATA["ENGINE"]] \
        + [("The Trip · " + m["code"] + " " + m["title"], m) for m in DATA["SCENARIOS"]] \
        + [("Capstone · " + m["code"] + " " + m["title"], m) for m in DATA.get("CAPSTONES", [])]

# Practice reference words (Basics + Cram) as pseudo-modules so they're recorded too
if DATA.get("CRAM"):
    modules.append(("Practice · Cram essentials",
                    {"steps":[{"type":"present","es":c["es"],"en":c["en"]} for c in DATA["CRAM"]]}))
if DATA.get("BASICS"):
    items=[{"type":"present","es":it["es"],"en":it["en"]} for sec in DATA["BASICS"] for it in sec["items"]]
    modules.append(("Practice · Basics reference", {"steps":items}))

master = []
seen = {}
lines_out = ["# EspTalk — Recording Script (v2 · new course)", "",
    f"Record every line **twice**: once at **natural** speed, once **slow** "
    "(deliberate, with clear gaps to repeat). Name files by the number below; "
    "add `-slow` for the slow take (e.g. `007.m4a` and `007-slow.m4a`). "
    "Latin American neutral, quiet room, consistent mic.", "",
    "Same phrase used in two modules is listed once, at first appearance.", ""]

for label, m in modules:
    rows = []
    for es, en in lines_for_module(m):
        if not es:
            continue
        s = slug(es)
        if s in seen:
            continue
        seen[s] = f"{len(master)+1:03d}"
        master.append({"num": seen[s], "phrase": es, "en": en, "slug": s,
                       "file": f"audio/{s}.m4a"})
        rows.append((seen[s], es, en))
    if not rows:
        continue
    lines_out.append(f"## {label}")
    lines_out.append("")
    lines_out.append("| # | Say this (Spanish) | Meaning |")
    lines_out.append("|---|---|---|")
    for num, es, en in rows:
        lines_out.append(f"| {num} | **{es}** | {en} |")
    lines_out.append("")

(ROOT / "RECORDING-SCRIPT.md").write_text("\n".join(lines_out) + "\n", encoding="utf-8")
json.dump(master, open(ROOT / "tools" / "recording-map.json", "w", encoding="utf-8"),
          ensure_ascii=False, indent=2)
print(f"{len(master)} unique lines across {len([1 for l,m in modules if lines_for_module(m)])} modules")
print("Wrote RECORDING-SCRIPT.md and tools/recording-map.json")
