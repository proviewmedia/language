import maleManifest from "@/data/audio-manifest.male.json";
import femaleManifest from "@/data/audio-manifest.female.json";
import { readEspTalkPrefs } from "@/lib/localState";

const MANIFESTS: Record<"male" | "female", Record<string, string>> = {
  male: maleManifest,
  female: femaleManifest,
};

let currentAudio: HTMLAudioElement | null = null;

function play(text: string, rate: number, onEnd?: () => void) {
  const { voice } = readEspTalkPrefs();
  const manifest = MANIFESTS[voice] ?? MANIFESTS.male;
  const src = manifest[text];
  if (!src) return;

  currentAudio?.pause();
  const audio = new Audio(`/${src}`);
  currentAudio = audio;
  audio.playbackRate = rate;
  audio.onended = () => onEnd?.();
  audio.play().catch(() => onEnd?.());
}

// Plays at the user's saved default speed preference.
export function playPhrase(text: string, onEnd?: () => void) {
  const { speed } = readEspTalkPrefs();
  play(text, speed === "slow" ? 0.75 : 1, onEnd);
}

// Forces a specific rate regardless of the saved preference — used by the
// explicit Natural/Slow buttons in the lesson player, matching app.html's
// speakPhrase() (rate 1) / speakPhraseSlow() (rate 0.62) distinction.
export function playPhraseAt(text: string, rate: "natural" | "slow", onEnd?: () => void) {
  play(text, rate === "slow" ? 0.62 : 1, onEnd);
}
