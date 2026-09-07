import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Volume2, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import { VOCAB_BANK } from "@/data/curriculum";
import { writeEspTalkProgress, type VocabStatus } from "@/lib/localState";
import { playPhrase } from "@/lib/playPhrase";

export function Flashcards({
  onExit,
  onFinish,
}: {
  onExit: () => void;
  onFinish: (updates: Record<string, VocabStatus>) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [updates, setUpdates] = useState<Record<string, VocabStatus>>({});
  const finished = useRef(false);

  const done = idx >= VOCAB_BANK.length;

  useEffect(() => {
    if (done && !finished.current) {
      finished.current = true;
      writeEspTalkProgress({ vocabStatus: updates });
      onFinish(updates);
    }
  }, [done, updates, onFinish]);

  if (done) {
    return (
      <div className="mx-auto flex max-w-[420px] flex-col items-center py-10 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Layers className="h-7 w-7" />
        </div>
        <h2 className="font-heading text-xl font-bold text-foreground">Flashcard review done!</h2>
        <Button size="cta" className="mt-8 w-full" onClick={onExit}>
          Back to practice
        </Button>
      </div>
    );
  }

  const word = VOCAB_BANK[idx];

  function answer(knew: boolean) {
    setUpdates((u) => ({ ...u, [word.spanish]: knew ? "mastered" : "learning" }));
    setFlipped(false);
    setIdx((i) => i + 1);
  }

  return (
    <div className="mx-auto max-w-[420px]">
      <div className="mb-5 flex items-center gap-3">
        <button onClick={onExit} className="flex items-center gap-1 font-body text-sm text-muted-foreground hover:text-foreground">
          <ArrowLeft className="h-4 w-4" /> Back
        </button>
        <div className="flex-1 text-center font-body text-xs text-muted-foreground">
          Card {idx + 1} of {VOCAB_BANK.length}
        </div>
        <div className="w-12" />
      </div>

      <button
        onClick={() => setFlipped((f) => !f)}
        className="flex min-h-[220px] w-full flex-col items-center justify-center rounded-3xl border border-black/[0.07] bg-white px-6 py-10 text-center"
      >
        {!flipped ? (
          <>
            <div className="font-heading text-3xl font-bold text-foreground">{word.spanish}</div>
            <div className="mt-1 font-body text-sm text-muted-foreground">{word.phonetic}</div>
            <span
              role="button"
              tabIndex={0}
              onClick={(e) => {
                e.stopPropagation();
                playPhrase(word.spanish);
              }}
              className="mt-4 inline-flex items-center gap-1.5 rounded-full border border-black/[0.08] bg-muted px-3 py-1.5 font-body text-xs text-muted-foreground hover:border-accent hover:text-accent"
            >
              <Volume2 className="h-3.5 w-3.5" /> Hear it
            </span>
            <div className="mt-6 font-body text-xs text-muted-foreground">Tap card to reveal</div>
          </>
        ) : (
          <>
            <div className="font-body text-xl text-foreground">{word.english}</div>
            {word.example && <div className="mt-2 font-body text-sm italic text-muted-foreground">"{word.example}"</div>}
          </>
        )}
      </button>

      {flipped && (
        <div className="mt-4 grid grid-cols-2 gap-2">
          <Button variant="outline" onClick={() => answer(false)}>Still learning</Button>
          <Button onClick={() => answer(true)}>Got it</Button>
        </div>
      )}
    </div>
  );
}
