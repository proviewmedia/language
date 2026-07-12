#!/usr/bin/env python3
"""Import your own voice recordings and swap them in for the phrase clips.

Drop your recordings in  audio-src/  named by their number: 01.m4a, 02.wav,
03.mp3 ... (any common audio format, matching RECORDING-SCRIPT.md). Then run:

    python3 tools/import_recordings.py

For each file it: trims leading/trailing silence, normalizes loudness so all
clips sound even, converts to a compact AAC .m4a, and writes it to audio/ under
the correct phrase slug. Raw originals stay in audio-src/ so we always own the
source. Prints a report of what was imported and what's still missing.
"""
import os, re, json, subprocess, pathlib, sys

ROOT = pathlib.Path(__file__).resolve().parent.parent
SRC = ROOT / "audio-src"
OUT = ROOT / "audio"
MAP = json.load(open(ROOT / "tools" / "recording-map.json", encoding="utf-8"))
by_num = {row["num"]: row for row in MAP}

AUDIO_EXTS = {".m4a", ".wav", ".mp3", ".aiff", ".aif", ".caf", ".flac", ".ogg", ".webm", ".mp4", ".aac"}

def find_source(num):
    # accept 01, 1, phrase-01, etc.; first audio file whose stem ends in the number
    cands = []
    for f in SRC.iterdir():
        if f.suffix.lower() not in AUDIO_EXTS:
            continue
        digits = re.findall(r"\d+", f.stem)
        if digits and int(digits[-1]) == int(num):
            cands.append(f)
    return sorted(cands)[0] if cands else None

def convert(src: pathlib.Path, dst: pathlib.Path):
    # trim silence both ends, normalize loudness, encode AAC
    af = ("silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB,"
          "areverse,"
          "silenceremove=start_periods=1:start_silence=0.1:start_threshold=-45dB,"
          "areverse,"
          "loudnorm=I=-16:TP=-1.5:LRA=11")
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(src), "-af", af,
         "-c:a", "aac", "-b:a", "96k", "-ar", "44100", "-ac", "1", str(dst)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)

def main():
    if not SRC.exists():
        SRC.mkdir()
        print(f"Created {SRC}. Drop your numbered recordings here, then re-run.")
        return
    OUT.mkdir(exist_ok=True)
    done, missing = [], []
    for num, row in sorted(by_num.items()):
        src = find_source(num)
        dst = OUT / pathlib.Path(row["file"]).name
        if src is None:
            missing.append(num)
            continue
        convert(src, dst)
        done.append((num, row["phrase"], src.name))
        print(f"  ✓ {num}  {row['phrase']!r:34} <- {src.name}  ->  {row['file']}")
    print(f"\nImported {len(done)}/{len(by_num)} recordings.")
    if missing:
        print("Still missing numbers: " + ", ".join(missing))
    else:
        print("All phrases covered by your own voice. 🎙️")

if __name__ == "__main__":
    main()
