import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Repeat, Sparkles, Star, Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { VOCAB_BANK, type VocabWord } from "@/data/curriculum";
import { writeEspTalkProgress, type VocabStatus } from "@/lib/localState";
import { playPhrase } from "@/lib/playPhrase";

const STATUS_LABEL: Record<VocabStatus, { label: string; icon: typeof Sparkles }> = {
  new: { label: "New word", icon: Sparkles },
  learning: { label: "Learning", icon: Repeat },
  mastered: { label: "Mastered", icon: Check },
};

function buildQueue(vocabStatus: Record<string, VocabStatus>): VocabWord[] {
  const order: Record<VocabStatus, number> = { new: 0, learning: 1, mastered: 2 };
  return [...VOCAB_BANK]
    .sort((a, b) => {
      const as = vocabStatus[a.spanish] ?? "new";
      const bs = vocabStatus[b.spanish] ?? "new";
      if (order[as] !== order[bs]) return order[as] - order[bs];
      return Math.random() - 0.5;
    })
    .slice(0, 8);
}

export function DailyReview({
  vocabStatus,
  onExit,
  onFinish,
}: {
  vocabStatus: Record<string, VocabStatus>;
  onExit: () => void;
  onFinish: (updates: Record<string, VocabStatus>) => void;
}) {
  const [queue] = useState(() => buildQueue(vocabStatus));
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);
  const [sessionStatus, setSessionStatus] = useState<Record<string, VocabStatus>>({});
  const [mastered, setMastered] = useState(0);

  const word = queue[idx];
  const status = sessionStatus[word?.spanish] ?? vocabStatus[word?.spanish] ?? "new";
  const StatusIcon = STATUS_LABEL[status].icon;

  const done = idx >= queue.length;
  const finished = useRef(false);

  useEffect(() => {
    if (done && !finished.current) {
      finished.current = true;
      writeEspTalkProgress({ xpDelta: 10, vocabStatus: sessionStatus });
      onFinish(sessionStatus);
    }
  }, [done, sessionStatus, onFinish]);

  if (done) {
    return (
      <div className="mx-auto flex max-w-[420px] flex-col items-center py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Repeat className="h-7 w-7" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">Review done!</h2>
        <p className="mt-2 font-body text-sm text-muted-foreground">
          {mastered} word{mastered !== 1 ? "s" : ""} mastered · keep it up daily for best results.
        </p>
        <p className="mt-3 font-heading text-sm font-bold text-accent">+10 XP</p>
        <Button size="cta" className="mt-8 w-full" onClick={onExit}>
          Back to practice
        </Button>
      </div>
    );
  }

  function rate(rating: "hard" | "good" | "easy") {
    const next: VocabStatus = rating === "easy" ? "mastered" : rating === "good" ? (status === "mastered" ? "mastered" : "learning") : "learning";
    setSessionStatus((s) => ({ ...s, [word.spanish]: next }));
    if (next === "mastered") setMastered((m) => m + 1);
    setRevealed(false);
    setIdx((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-[480px]">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={onExit} className="flex items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex-1">
          <Progress value={Math.round((idx / queue.length) * 100)} />
        </div>
        <span className="font-body text-xs text-muted-foreground">{idx + 1}/{queue.length}</span>
      </div>

      <div className="flex items-center justify-center gap-1.5 font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <StatusIcon className="h-3.5 w-3.5" /> {STATUS_LABEL[status].label}
      </div>

      <button
        onClick={() => {
          if (!revealed) {
            setRevealed(true);
            playPhrase(word.spanish);
          }
        }}
        className="mt-3 flex w-full flex-col items-center rounded-3xl border border-black/[0.07] bg-white px-6 py-10 text-center"
      >
        <div className="font-heading text-3xl font-bold text-foreground">{word.spanish}</div>
        <div className="mt-1 font-body text-sm text-muted-foreground">{word.phonetic}</div>
        {revealed ? (
          <>
            <div className="mt-6 font-body text-lg text-foreground">{word.english}</div>
            {word.example && <div className="mt-2 font-body text-sm italic text-muted-foreground">"{word.example}"</div>}
          </>
        ) : (
          <div className="mt-6 rounded-lg bg-muted px-3 py-2 font-body text-sm text-muted-foreground">Tap to reveal meaning</div>
        )}
      </button>

      {revealed && (
        <div className="mt-5">
          <p className="mb-3 text-center font-body text-sm text-muted-foreground">How well did you know it?</p>
          <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="border-red-200 text-red-500 hover:bg-red-50" onClick={() => rate("hard")}>
              <Repeat className="h-4 w-4" /> Still learning
            </Button>
            <Button variant="outline" className="border-accent/30 text-accent hover:bg-accent/5" onClick={() => rate("good")}>
              <Check className="h-4 w-4" /> Got it
            </Button>
          </div>
          <Button variant="outline" className="mt-2 w-full border-green-200 text-green-600 hover:bg-green-50" onClick={() => rate("easy")}>
            <Star className="h-4 w-4" /> Know it cold
          </Button>
        </div>
      )}
    </div>
  );
}
