import { useEffect } from "react";
import { Repeat, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playPhrase, playPhraseAt } from "@/lib/playPhrase";

export function ListenRepeatStep({
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
  useEffect(() => {
    const t = setTimeout(() => playPhrase(es), 300);
    return () => clearTimeout(t);
  }, [es]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Repeat className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]" /> Listen &amp; repeat
      </div>
      <div className="w-full rounded-3xl border border-black/[0.07] bg-white px-6 py-10">
        <div className="font-heading text-2xl font-bold text-foreground">{es}</div>
        {ph && <div className="mt-1 font-mono text-sm text-muted-foreground">{ph}</div>}
        <div className="mt-4 font-body text-base text-muted-foreground">{en}</div>
        <div className="mt-5 flex justify-center gap-2">
          <Button variant="outline" size="sm" onClick={() => playPhraseAt(es, "natural")}>
            <Volume2 className="h-4 w-4" /> Natural
          </Button>
          <Button variant="outline" size="sm" onClick={() => playPhraseAt(es, "slow")}>
            <Volume2 className="h-4 w-4" /> Slow
          </Button>
        </div>
        <p className="mt-4 font-body text-sm font-medium text-foreground">Now say it out loud.</p>
      </div>
      <Button size="cta" className="w-full max-w-xs" onClick={onComplete}>
        Continue
      </Button>
    </div>
  );
}
