import { useEffect, useState } from "react";
import { Check, Mic, Repeat, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playPhrase, playPhraseAt } from "@/lib/playPhrase";

export function ProduceStep({
  es,
  ph,
  en,
  onComplete,
}: {
  es: string;
  ph?: string;
  en: string;
  onComplete: () => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const [rated, setRated] = useState<"good" | "bad" | null>(null);

  useEffect(() => {
    setRevealed(false);
    setRated(null);
  }, [es]);

  function reveal() {
    setRevealed(true);
    playPhrase(es);
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Mic className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]" /> Say it in Spanish
      </div>
      <div className="w-full rounded-3xl border border-black/[0.07] bg-white px-6 py-10">
        <div className="font-body text-lg text-foreground">{en}</div>
        <p className="mt-2 font-body text-xs text-muted-foreground">Say it out loud, then reveal to check yourself.</p>

        {revealed && (
          <div className="mt-5 rounded-2xl bg-[#f9f9f9] p-4">
            <div className="font-heading text-xl font-bold text-foreground">{es}</div>
            {ph && <div className="mt-1 font-mono text-sm text-muted-foreground">{ph}</div>}
            <div className="mt-3 flex justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => playPhraseAt(es, "natural")}>
                <Volume2 className="h-4 w-4" /> Natural
              </Button>
              <Button variant="outline" size="sm" onClick={() => playPhraseAt(es, "slow")}>
                <Volume2 className="h-4 w-4" /> Slow
              </Button>
            </div>
          </div>
        )}

        {revealed && !rated && (
          <div className="mt-4 flex items-center justify-center gap-3">
            <span className="font-body text-xs text-muted-foreground">How did you do?</span>
            <Button variant="outline" size="sm" onClick={() => setRated("bad")}>
              Missed it
            </Button>
            <Button size="sm" onClick={() => setRated("good")}>
              Got it
            </Button>
          </div>
        )}

        {rated && (
          <div className="mt-4 flex items-center justify-center gap-2 font-body text-sm text-foreground">
            {rated === "good" ? <Check className="h-4 w-4 text-accent" /> : <Repeat className="h-4 w-4 text-muted-foreground" />}
            {rated === "good" ? "¡Bien! You said it." : "No worries — repeat it a couple times, then continue."}
          </div>
        )}
      </div>

      {!revealed ? (
        <Button variant="outline" onClick={reveal}>
          Reveal answer
        </Button>
      ) : (
        <Button size="cta" className="w-full max-w-xs" disabled={!rated} onClick={onComplete}>
          Continue
        </Button>
      )}
    </div>
  );
}
