import { useEffect, useState } from "react";
import { Flag, Mic, Volume2 } from "lucide-react";
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
  const [flagged, setFlagged] = useState(false);

  useEffect(() => {
    setRevealed(false);
    setFlagged(false);
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
            <div className="mt-3 flex flex-wrap justify-center gap-2">
              <Button variant="outline" size="sm" onClick={() => playPhraseAt(es, "natural")}>
                <Volume2 className="h-4 w-4" /> Natural
              </Button>
              <Button variant="outline" size="sm" onClick={() => playPhraseAt(es, "slow")}>
                <Volume2 className="h-4 w-4" /> Slow
              </Button>
              <Button
                variant="outline"
                size="sm"
                className={flagged ? "border-orange-300 bg-orange-50 text-orange-600 hover:bg-orange-50" : ""}
                onClick={() => setFlagged((f) => !f)}
              >
                <Flag className="h-4 w-4" /> {flagged ? "Flagged for practice" : "Need more practice?"}
              </Button>
            </div>
          </div>
        )}
      </div>

      {!revealed ? (
        <Button variant="outline" onClick={reveal}>
          Reveal answer
        </Button>
      ) : (
        <Button size="cta" className="w-full max-w-xs" onClick={onComplete}>
          Continue
        </Button>
      )}
    </div>
  );
}
