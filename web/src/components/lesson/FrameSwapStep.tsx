import { useEffect, useState } from "react";
import { Layers, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playPhrase, playPhraseAt } from "@/lib/playPhrase";

export function FrameSwapStep({
  frame,
  en,
  slots,
  onComplete,
  onSubProgress,
}: {
  frame: string;
  en: string;
  slots: { es: string; en: string }[];
  onComplete: () => void;
  onSubProgress: (idx: number) => void;
}) {
  // idx = -1 shows the bare frame ("Quiero ...") so it isn't spoken twice in a
  // row with the listen_repeat step right before it that already taught the
  // first slot's full phrase; idx 0..slots.length-1 fills the frame in.
  const [idx, setIdx] = useState(-1);

  useEffect(() => {
    setIdx(-1);
    onSubProgress(0);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [frame]);

  const showingFrame = idx === -1;
  const slot = showingFrame ? null : slots[idx];
  const full = slot ? frame.replace("___", slot.es) : frame.replace("___", "...");
  const fullEn = slot ? en.replace("___", slot.en) : en.replace("___", "...");

  useEffect(() => {
    if (showingFrame) return;
    const t = setTimeout(() => playPhrase(full), 250);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [idx, frame]);

  function next() {
    if (idx < slots.length - 1) {
      const nextIdx = idx + 1;
      setIdx(nextIdx);
      onSubProgress(nextIdx + 1);
    } else {
      onComplete();
    }
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Layers className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]" /> Swap it into the frame
      </div>
      <div className="w-full rounded-3xl border border-black/[0.07] bg-white px-6 py-10">
        <div className="font-heading text-xl font-bold text-foreground">
          {frame.split("___")[0]}
          <span className={showingFrame ? "text-muted-foreground" : "text-accent"}>
            {showingFrame ? "..." : slot!.es}
          </span>
          {frame.split("___")[1]}
        </div>
        <div className="mt-3 font-body text-base text-muted-foreground">{fullEn}</div>
        {!showingFrame && (
          <div className="mt-4 flex justify-center gap-2">
            <Button variant="outline" size="sm" onClick={() => playPhraseAt(full, "natural")}>
              <Volume2 className="h-4 w-4" /> Natural
            </Button>
            <Button variant="outline" size="sm" onClick={() => playPhraseAt(full, "slow")}>
              <Volume2 className="h-4 w-4" /> Slow
            </Button>
          </div>
        )}
        <div className="mt-4 font-body text-xs text-muted-foreground">
          {showingFrame ? "Fill in the blank" : `${idx + 1} / ${slots.length} · say it out loud`}
        </div>
      </div>
      <Button size="cta" className="w-full max-w-xs" onClick={next}>
        {showingFrame ? "Continue" : idx < slots.length - 1 ? "Next word" : "Done"}
      </Button>
    </div>
  );
}
