import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import {
  BookOpen,
  Star,
  Trophy,
  Flame,
  Rocket,
  MessageCircle,
  Sparkles,
  GraduationCap,
  Medal,
  Flag,
  Layers,
} from "lucide-react";
import { Flashcards } from "@/components/app/Flashcards";
import { Button } from "@/components/ui/button";
import { ENGINE, SCENARIOS, TRIP_SIM, VOCAB_BANK } from "@/data/curriculum";
import type { EspTalkSession } from "@/lib/useEspTalkSession";
import type { VocabStatus } from "@/lib/localState";

function Achievement({
  icon: Icon,
  name,
  earned,
}: {
  icon: typeof Star;
  name: string;
  earned: boolean;
}) {
  return (
    <div className={`flex flex-col items-center gap-2 rounded-xl border p-3 text-center ${earned ? "border-accent/20 bg-accent/5" : "border-black/[0.06] bg-white"}`}>
      <div className={`flex h-9 w-9 items-center justify-center rounded-full ${earned ? "bg-accent/10 text-accent" : "bg-muted text-muted-foreground"}`}>
        <Icon className="h-4 w-4" strokeWidth={1.8} />
      </div>
      <div className={`font-body text-xs font-medium ${earned ? "text-foreground" : "text-muted-foreground"}`}>{name}</div>
    </div>
  );
}

const DAY_LABELS = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

export function ProgressPage() {
  const { state, completedIds, refresh } = useOutletContext<EspTalkSession>();
  const [tab, setTab] = useState<"stats" | "words">("stats");
  const [studying, setStudying] = useState(false);
  const [wordFilter, setWordFilter] = useState<"all" | VocabStatus>("all");

  if (studying) {
    return <Flashcards onExit={() => setStudying(false)} onFinish={() => refresh()} />;
  }

  const allEngineDone = ENGINE.every((m) => completedIds.has(`${m.track}:${m.id}`));
  const allScenariosDone = SCENARIOS.every((m) => completedIds.has(`${m.track}:${m.id}`));
  const capstoneDone = completedIds.has(`${TRIP_SIM.track}:${TRIP_SIM.id}`);
  const wordsStudied = Object.keys(state.vocabStatus).length;

  const achievements = [
    { icon: BookOpen, name: "First module", earned: completedIds.size >= 1 },
    { icon: Star, name: "50 XP", earned: state.xp >= 50 },
    { icon: Star, name: "200 XP", earned: state.xp >= 200 },
    { icon: Trophy, name: "500 XP", earned: state.xp >= 500 },
    { icon: Flame, name: "3-day streak", earned: state.streak >= 3 },
    { icon: Flame, name: "7-day streak", earned: state.streak >= 7 },
    { icon: Rocket, name: "30-day streak", earned: state.streak >= 30 },
    { icon: MessageCircle, name: "First practice session", earned: wordsStudied > 0 },
    { icon: Sparkles, name: "10 modules complete", earned: completedIds.size >= 10 },
    { icon: GraduationCap, name: "Foundations complete", earned: allEngineDone },
    { icon: Medal, name: "Trip ready", earned: allScenariosDone },
    { icon: Flag, name: "Capstone complete", earned: capstoneDone },
  ];

  const maxWeekly = Math.max(...state.weekly, 1);
  const todayIdx = (() => {
    const d = new Date().getDay();
    return d === 0 ? 6 : d - 1;
  })();

  const vocab = VOCAB_BANK.map((v) => ({ ...v, status: state.vocabStatus[v.spanish] ?? "new" }));
  const mastered = vocab.filter((v) => v.status === "mastered").length;
  const learning = vocab.filter((v) => v.status === "learning").length;
  const filteredVocab = wordFilter === "all" ? vocab : vocab.filter((v) => v.status === wordFilter);

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-foreground">Progress</h1>

      <div className="mt-4 flex gap-1 rounded-full bg-black/[0.04] p-1">
        <button
          onClick={() => setTab("stats")}
          className={`flex-1 rounded-full py-2 font-body text-sm font-semibold transition-colors ${tab === "stats" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          Stats
        </button>
        <button
          onClick={() => setTab("words")}
          className={`flex-1 rounded-full py-2 font-body text-sm font-semibold transition-colors ${tab === "words" ? "bg-white text-foreground shadow-sm" : "text-muted-foreground"}`}
        >
          Words
        </button>
      </div>

      {tab === "stats" ? (
        <>
          <div className="mt-6 grid grid-cols-3 gap-3">
            <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
              <div className="font-body text-xs text-muted-foreground">Total XP</div>
              <div className="mt-1 font-heading text-xl font-bold text-foreground">{state.xp}</div>
            </div>
            <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
              <div className="font-body text-xs text-muted-foreground">Streak</div>
              <div className="mt-1 font-heading text-xl font-bold text-foreground">{state.streak}d</div>
            </div>
            <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
              <div className="font-body text-xs text-muted-foreground">Modules done</div>
              <div className="mt-1 font-heading text-xl font-bold text-foreground">{completedIds.size}</div>
            </div>
          </div>

          <h2 className="mt-8 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Weekly XP
          </h2>
          <div className="mt-3 flex h-24 items-end gap-2 rounded-2xl border border-black/[0.07] bg-white p-4">
            {DAY_LABELS.map((d, i) => {
              const val = state.weekly[i] ?? 0;
              const barH = Math.max(Math.round((val / maxWeekly) * 56), val > 0 ? 4 : 2);
              const isToday = i === todayIdx;
              return (
                <div key={d} className="flex flex-1 flex-col items-center gap-1.5">
                  <div className="flex h-14 w-full items-end justify-center">
                    <div
                      className={`w-full rounded-t ${val > 0 ? "bg-accent" : "bg-black/[0.08]"}`}
                      style={{ height: barH }}
                    />
                  </div>
                  <span className={`font-body text-[10px] ${isToday ? "font-bold text-accent" : "text-muted-foreground"}`}>{d}</span>
                </div>
              );
            })}
          </div>

          <h2 className="mt-8 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Achievements
          </h2>
          <div className="mt-3 grid grid-cols-3 gap-2 sm:grid-cols-4">
            {achievements.map((a) => (
              <Achievement key={a.name} {...a} />
            ))}
          </div>
        </>
      ) : (
        <>
          <div className="mt-6 flex items-center justify-between">
            <div className="flex gap-1.5">
              {(["all", "new", "learning", "mastered"] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setWordFilter(f)}
                  className={`rounded-full border px-3 py-1.5 font-body text-xs font-medium capitalize transition-colors ${
                    wordFilter === f ? "border-accent bg-accent/10 text-accent" : "border-black/[0.08] text-muted-foreground"
                  }`}
                >
                  {f}
                </button>
              ))}
            </div>
            <Button size="sm" onClick={() => setStudying(true)}>
              <Layers className="h-4 w-4" /> Study
            </Button>
          </div>
          <p className="mt-2 font-body text-xs text-muted-foreground">
            {mastered} mastered · {learning} learning · {vocab.length} total
          </p>
          <div className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {filteredVocab.map((v) => (
              <div key={v.spanish} className="rounded-xl border border-black/[0.06] bg-white p-3">
                <div className="font-body text-sm font-semibold text-foreground">{v.spanish}</div>
                <div className="font-body text-xs text-muted-foreground">{v.english}</div>
                <span
                  className={`mt-1.5 inline-block rounded-full px-1.5 py-0.5 font-body text-[10px] font-medium capitalize ${
                    v.status === "mastered"
                      ? "bg-accent/10 text-accent"
                      : v.status === "learning"
                        ? "bg-orange-50 text-orange-600"
                        : "bg-black/[0.05] text-muted-foreground"
                  }`}
                >
                  {v.status}
                </span>
              </div>
            ))}
          </div>
          {filteredVocab.length === 0 && (
            <p className="mt-10 text-center font-body text-sm text-muted-foreground">No words in this category yet.</p>
          )}
        </>
      )}
    </>
  );
}
