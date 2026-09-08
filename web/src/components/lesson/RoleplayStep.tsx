import { useEffect, useState } from "react";
import { MessageCircle, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playPhrase, playPhraseAt } from "@/lib/playPhrase";

export function RoleplayStep({
  title,
  lines,
  onComplete,
  onSubProgress,
}: {
  title?: string;
  lines: { who: "them" | "you"; es: string; en: string }[];
  onComplete: () => void;
  onSubProgress: (idx: number) => void;
}) {
  const [idx, setIdx] = useState(0);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    setIdx(0);
    setRevealed(false);
    onSubProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [title]);

  const line = lines[idx];
  const isYou = line.who === "you";

  useEffect(() => {
    setRevealed(false);
    if (!isYou) {
      const t = setTimeout(() => playPhrase(line.es), 300);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx]);

  function next() {
    if (idx < lines.length - 1) {
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      onSubProgress(nextIdx);
    } else {
      onComplete();
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <MessageCircle className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]" /> {title || "Role-play"}
      </div>
      <div className="w-full rounded-3xl border border-black/[0.07] bg-white px-6 py-10">
        <div className={`font-heading text-xs font-bold uppercase tracking-wide ${isYou ? "text-accent" : "text-muted-foreground"}`}>
          {isYou ? "Your line" : "They say"}
        </div>

        {isYou ? (
          <>
            <div className="mt-3 font-body text-lg text-foreground">{line.en}</div>
            {revealed && (
              <div className="mt-4 rounded-2xl bg-[#f9f9f9] p-4">
                <div className="font-heading text-xl font-bold text-foreground">{line.es}</div>
                <div className="mt-3 flex justify-center gap-2">
                  <Button variant="outline" size="sm" onClick={() => playPhraseAt(line.es, "natural")}>
                    <Volume2 className="h-4 w-4" /> Natural
                  </Button>
                  <Button variant="outline" size="sm" onClick={() => playPhraseAt(line.es, "slow")}>
                    <Volume2 className="h-4 w-4" /> Slow
                  </Button>
                </div>
              </div>
            )}
          </>
        ) : (
          <div className="mt-3 rounded-2xl bg-[#f9f9f9] p-4">
            <div className="font-heading text-xl font-bold text-foreground">{line.es}</div>
            <div className="mt-1 font-body text-sm text-muted-foreground">{line.en}</div>
            <Button variant="outline" size="sm" className="mt-3" onClick={() => playPhrase(line.es)}>
              <Volume2 className="h-4 w-4" /> Again
            </Button>
          </div>
        )}
      </div>

      {isYou && !revealed ? (
        <Button variant="outline" onClick={() => setRevealed(true)}>
          Reveal
        </Button>
      ) : (
        <Button size="cta" className="w-full max-w-xs" onClick={next}>
          Next
        </Button>
      )}
    </div>
  );
}
