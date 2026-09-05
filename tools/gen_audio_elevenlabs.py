#!/usr/bin/env python3
"""Generate EspTalk audio clips with an ElevenLabs AI voice.

Reads every phrase out of tools/recording-map.json (the canonical list built
from the current curriculum — see build_recording_v2.py), synthesizes each
with the ElevenLabs text-to-speech API, converts it to the same compact AAC
.m4a format the app already expects, and (re)writes audio-manifest.<voice>.json.

Setup:
  export ELEVENLABS_API_KEY=sk_...
  python3 tools/gen_audio_elevenlabs.py --list-voices     # find a voice id
  export ELEVENLABS_VOICE_ID=<id>
  export ELEVENLABS_VOICE_NAME=male                       # 'male' or 'female'
  python3 tools/gen_audio_elevenlabs.py                   # generate all clips

Clips land in audio/<voice-name>/ so male and female sets don't collide, and
the manifest is written to audio-manifest.<voice-name>.json. By default this
regenerates every clip. Pass --skip-existing to only fill in clips that don't
exist yet (e.g. resuming after a rate-limit error).
"""
import os, sys, json, subprocess, pathlib, urllib.request, urllib.error, time

ROOT = pathlib.Path(__file__).resolve().parent.parent
MAP_FILE = ROOT / "tools" / "recording-map.json"
API_KEY = os.environ.get("ELEVENLABS_API_KEY")
VOICE_ID = os.environ.get("ELEVENLABS_VOICE_ID")
VOICE_NAME = os.environ.get("ELEVENLABS_VOICE_NAME", "male")
MODEL_ID = os.environ.get("ELEVENLABS_MODEL_ID", "eleven_multilingual_v2")
OUT = ROOT / "audio" / VOICE_NAME
BASE = "https://api.elevenlabs.io/v1"


def api_get(path):
    req = urllib.request.Request(BASE + path, headers={"xi-api-key": API_KEY})
    with urllib.request.urlopen(req) as r:
        return json.loads(r.read())


def list_voices():
    data = api_get("/voices")
    for v in data.get("voices", []):
        labels = v.get("labels", {})
        print(f"{v['voice_id']}  {v['name']:<20} "
              f"{labels.get('language','')} {labels.get('accent','')} {labels.get('description','')}")


def synth(text: str, dst_mp3: pathlib.Path):
    url = f"{BASE}/text-to-speech/{VOICE_ID}"
    body = json.dumps({
        "text": text,
        "model_id": MODEL_ID,
        "voice_settings": {"stability": 0.5, "similarity_boost": 0.75},
    }).encode("utf-8")
    req = urllib.request.Request(url, data=body, method="POST", headers={
        "xi-api-key": API_KEY,
        "Content-Type": "application/json",
        "Accept": "audio/mpeg",
    })
    for attempt in range(3):
        try:
            with urllib.request.urlopen(req) as r:
                dst_mp3.write_bytes(r.read())
            return
        except urllib.error.HTTPError as e:
            if e.code == 429 and attempt < 2:
                time.sleep(5)
                continue
            raise RuntimeError(f"ElevenLabs error {e.code}: {e.read().decode(errors='replace')}")


def to_m4a(mp3_path: pathlib.Path, m4a_path: pathlib.Path):
    subprocess.run(
        ["ffmpeg", "-y", "-i", str(mp3_path), "-c:a", "aac", "-b:a", "96k",
         "-ar", "44100", "-ac", "1", str(m4a_path)],
        check=True, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)


def main():
    if "--list-voices" in sys.argv:
        if not API_KEY:
            sys.exit("Set ELEVENLABS_API_KEY first (elevenlabs.io -> Settings -> API keys).")
        list_voices()
        return

    if not API_KEY:
        sys.exit("Set ELEVENLABS_API_KEY first (elevenlabs.io -> Settings -> API keys).")
    if not VOICE_ID:
        sys.exit("Set ELEVENLABS_VOICE_ID first. Run with --list-voices to see options.")

    skip_existing = "--skip-existing" in sys.argv
    rows = json.load(open(MAP_FILE, encoding="utf-8"))
    OUT.mkdir(parents=True, exist_ok=True)

    manifest = {}
    made = 0
    for row in rows:
        fname = pathlib.Path(row["file"]).name  # e.g. hola.m4a
        m4a = OUT / fname
        rel = f"audio/{VOICE_NAME}/{fname}"
        manifest[row["phrase"]] = rel
        if skip_existing and m4a.exists():
            continue
        mp3 = m4a.with_suffix(".mp3")
        print(f"  … {row['phrase']!r}")
        synth(row["phrase"], mp3)
        to_m4a(mp3, m4a)
        mp3.unlink(missing_ok=True)
        made += 1

    manifest_path = ROOT / f"audio-manifest.{VOICE_NAME}.json"
    manifest_path.write_text(
        json.dumps(manifest, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"\nGenerated {made} clip(s), {len(rows)} total in {manifest_path.name} "
          f"(voice={VOICE_ID}, model={MODEL_ID}).")


if __name__ == "__main__":
    main()
