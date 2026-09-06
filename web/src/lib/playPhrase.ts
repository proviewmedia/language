import maleManifest from "@/data/audio-manifest.male.json";
import femaleManifest from "@/data/audio-manifest.female.json";
import { readEspTalkPrefs } from "@/lib/localState";

const MANIFESTS: Record<"male" | "female", Record<string, string>> = {
  male: maleManifest,
  female: femaleManifest,
};

let currentAudio: HTMLAudioElement | null = null;

export function playPhrase(text: string, onEnd?: () => void) {
  const { voice, speed } = readEspTalkPrefs();
  const manifest = MANIFESTS[voice] ?? MANIFESTS.male;
  const src = manifest[text];
  if (!src) return;

  currentAudio?.pause();
  const audio = new Audio(`/${src}`);
  currentAudio = audio;
  audio.playbackRate = speed === "slow" ? 0.75 : 1;
  audio.onended = () => onEnd?.();
  audio.play().catch(() => onEnd?.());
}
