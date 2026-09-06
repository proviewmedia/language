// Reads the same localStorage state app.html writes (key: esptalk_v1).
// Phase 2a only reads this — app.html remains the sole writer of lesson
// progress until the lesson player itself is rebuilt (Phase 2b).

export interface EspTalkState {
  xp: number;
  streak: number;
  weekly: number[];
  modules: string[]; // "track:id" strings, e.g. "engine:e1"
  isPro: boolean;
}

const DEFAULT_STATE: EspTalkState = {
  xp: 0,
  streak: 0,
  weekly: [0, 0, 0, 0, 0, 0, 0],
  modules: [],
  isPro: false,
};

export function readEspTalkState(): EspTalkState {
  try {
    const raw = localStorage.getItem("esptalk_v1");
    if (!raw) return DEFAULT_STATE;
    const d = JSON.parse(raw);
    return {
      xp: typeof d.xp === "number" ? d.xp : 0,
      streak: typeof d.streak === "number" ? d.streak : 0,
      weekly: Array.isArray(d.weekly) ? d.weekly : DEFAULT_STATE.weekly,
      modules: Array.isArray(d.modules) ? d.modules : [],
      isPro: !!d.isPro,
    };
  } catch {
    return DEFAULT_STATE;
  }
}

export interface EspTalkPrefs {
  voice: "male" | "female";
  speed: "normal" | "slow";
}

export function readEspTalkPrefs(): EspTalkPrefs {
  try {
    const raw = localStorage.getItem("esptalk_prefs");
    if (!raw) return { voice: "male", speed: "normal" };
    const d = JSON.parse(raw);
    return {
      voice: d.voice === "female" ? "female" : "male",
      speed: d.speed === "slow" ? "slow" : "normal",
    };
  } catch {
    return { voice: "male", speed: "normal" };
  }
}
