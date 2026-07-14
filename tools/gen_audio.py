#!/usr/bin/env python3
"""Generate bundled human-voice audio clips for every EspTalk phrase.

Reads the Spanish phrase strings straight out of app.html (both the
phrasebook `es:'...'` entries and the lesson `spanish:'...'` entries) so the
audio set always stays in sync with the app. For each phrase it synthesizes a
clip with the macOS `say` command and converts it to a compact AAC .m4a.

Voice is configurable:  VOICE=Paulina python3 tools/gen_audio.py
Swap VOICE to a downloaded Premium Spanish (Mexico) Siri voice to upgrade.
"""
import os, re, sys, json, subprocess, unicodedata, pathlib

ROOT = pathlib.Path(__file__).resolve().parent.parent
APP = ROOT / "app.html"
OUT = ROOT / "audio"
VOICE = os.environ.get("VOICE", "Paulina")
RATE = os.environ.get("RATE", "165")  # words per minute; slightly deliberate

def extract_phrases(html: str):
    """Prefer the master recording map (full curriculum); fall back to grepping
    app.html for phrasebook/vocab strings if the map isn't built yet."""
    mapf = ROOT / "tools" / "recording-map.json"
    if mapf.exists():
        rows = json.load(open(mapf, encoding="utf-8"))
        return sorted({r["phrase"] for r in rows})
    keys = set()
    for m in re.finditer(r"\{es:'([^']*)'", html):
        keys.add(m.group(1))
    for m in re.finditer(r"spanish:'([^']*)'", html):
        keys.add(m.group(1))
    return sorted(keys)

def slug(text: str) -> str:
    t = unicodedata.normalize("NFKD", text.lower())
    t = "".join(c for c in t if not unicodedata.combining(c))
    t = re.sub(r"[^a-z0-9]+", "-", t).strip("-")
    return t or "clip"

def speech_text(text: str) -> str:
    """Normalize display text so it's spoken naturally."""
    t = text.replace("/", ", ").replace("·", ", ")
    t = t.replace("…", "...")
    t = re.sub(r"\s*\.\.\.\s*", " ... ", t)   # even pause around ellipses
    t = re.sub(r"\s{2,}", " ", t).strip()
    return t

def main():
    html = APP.read_text(encoding="utf-8")
    phrases = extract_phrases(html)
    OUT.mkdir(exist_ok=True)
    manifest = {}
    made = {}  # slug -> filename, so identical audio is only generated once
    for p in phrases:
        s = slug(p)
        fname = f"{s}.m4a"
        if s not in made:
            spoken = speech_text(p)
            aiff = OUT / f"{s}.aiff"
            m4a = OUT / fname
            subprocess.run(["say", "-v", VOICE, "-r", RATE, "-o", str(aiff), spoken], check=True)
            subprocess.run(["afconvert", str(aiff), str(m4a), "-f", "m4af", "-d", "aac", "-q", "127"],
                           check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            aiff.unlink(missing_ok=True)
            made[s] = fname
            print(f"  ✓ {p!r:40} -> audio/{fname}   ({spoken!r})")
        manifest[p] = f"audio/{fname}"

    (ROOT / "audio-manifest.json").write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\n{len(phrases)} phrase keys -> {len(made)} unique clips (voice={VOICE})")
    print(f"Manifest: {ROOT/'audio-manifest.json'}")

if __name__ == "__main__":
    main()
