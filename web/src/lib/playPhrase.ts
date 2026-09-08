import maleManifest from "@/data/audio-manifest.male.json";
import femaleManifest from "@/data/audio-manifest.female.json";
import { readEspTalkPrefs } from "@/lib/localState";

const MANIFESTS: Record<"male" | "female", Record<string, string>> = {
  male: maleManifest,
  female: femaleManifest,
};

// Some curriculum data capitalizes a phrase differently than it was recorded
// (e.g. the Practice phrasebook's "A la derecha" vs. the lesson step's
// "a la derecha") — case-fold the lookup so those still resolve to the same
// clip instead of silently playing nothing.
const LOWERCASE_INDEX: Record<"male" | "female", Record<string, string>> = {
  male: Object.fromEntries(Object.entries(maleManifest).map(([k, v]) => [k.toLowerCase(), v])),
  female: Object.fromEntries(Object.entries(femaleManifest).map(([k, v]) => [k.toLowerCase(), v])),
};

let currentAudio: HTMLAudioElement | null = null;

function play(text: string, rate: number, onEnd?: () => void) {
  const { voice } = readEspTalkPrefs();
  const manifest = MANIFESTS[voice] ?? MANIFESTS.male;
  const src = manifest[text] ?? LOWERCASE_INDEX[voice]?.[text.toLowerCase()];
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
