// Reads the same localStorage state app.html writes (key: esptalk_v1).
// Phase 2a only reads this — app.html remains the sole writer of lesson
// progress until the lesson player itself is rebuilt (Phase 2b).

export type VocabStatus = "new" | "learning" | "mastered";

export interface EspTalkState {
  xp: number;
  streak: number;
  weekly: number[];
  modules: string[]; // "track:id" strings, e.g. "engine:e1"
  isPro: boolean;
  vocabStatus: Record<string, VocabStatus>;
}

const DEFAULT_STATE: EspTalkState = {
  xp: 0,
  streak: 0,
  weekly: [0, 0, 0, 0, 0, 0, 0],
  modules: [],
  isPro: false,
  vocabStatus: {},
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
      vocabStatus: d.vocabStatus && typeof d.vocabStatus === "object" ? d.vocabStatus : {},
    };
  } catch {
    return DEFAULT_STATE;
  }
}

// Same day-of-week indexing app.html uses for the weekly XP bars (Monday = 0).
function todayDayIdx(): number {
  const d = new Date().getDay();
  return d === 0 ? 6 : d - 1;
}

// Merges XP + vocab-status changes into the shared esptalk_v1 blob without
// touching any other field app.html owns (lessons, exams, activity log, etc.)
export function writeEspTalkProgress(update: {
  xpDelta?: number;
  vocabStatus?: Record<string, VocabStatus>;
}): void {
  try {
    const raw = localStorage.getItem("esptalk_v1");
    const d = raw ? JSON.parse(raw) : {};
    if (update.xpDelta) {
      d.xp = (typeof d.xp === "number" ? d.xp : 0) + update.xpDelta;
      const weekly: number[] = Array.isArray(d.weekly) ? [...d.weekly] : [0, 0, 0, 0, 0, 0, 0];
      const idx = todayDayIdx();
      weekly[idx] = (weekly[idx] || 0) + update.xpDelta;
      d.weekly = weekly;
    }
    if (update.vocabStatus) {
      d.vocabStatus = { ...(d.vocabStatus || {}), ...update.vocabStatus };
    }
    localStorage.setItem("esptalk_v1", JSON.stringify(d));
  } catch {
    // localStorage unavailable — progress just won't persist this session
  }
}

export interface EspTalkPrefs {
  voice: "male" | "female";
  speed: "normal" | "slow";
  reminders: boolean;
  sound: boolean;
  auto: boolean;
  dailyGoal: number;
  difficulty: "adaptive" | "easy" | "normal" | "hard";
}

const DEFAULT_PREFS: EspTalkPrefs = {
  voice: "male",
  speed: "normal",
  reminders: false,
  sound: true,
  auto: false,
  dailyGoal: 25,
  difficulty: "adaptive",
};

export function readEspTalkPrefs(): EspTalkPrefs {
  try {
    const raw = localStorage.getItem("esptalk_prefs");
    if (!raw) return DEFAULT_PREFS;
    const d = JSON.parse(raw);
    return {
      voice: d.voice === "female" ? "female" : "male",
      speed: d.speed === "slow" ? "slow" : "normal",
      reminders: !!d.reminders,
      sound: d.sound !== false,
      auto: !!d.auto,
      dailyGoal: typeof d.dailyGoal === "number" ? d.dailyGoal : 25,
      difficulty: ["adaptive", "easy", "normal", "hard"].includes(d.difficulty) ? d.difficulty : "adaptive",
    };
  } catch {
    return DEFAULT_PREFS;
  }
}

// Merges one or more preference changes into the shared esptalk_prefs blob
// (same key app.html's savePref()/toggleSetting() write to).
export function writeEspTalkPrefs(update: Partial<EspTalkPrefs>): void {
  try {
    const current = readEspTalkPrefs();
    localStorage.setItem("esptalk_prefs", JSON.stringify({ ...current, ...update }));
  } catch {
    // localStorage unavailable — prefs just won't persist this session
  }
}
