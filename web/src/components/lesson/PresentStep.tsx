import { useEffect } from "react";
import { Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playPhrase } from "@/lib/playPhrase";

export function PresentStep({
  es,
  ph,
  en,
  note,
  onComplete,
}: {
  es: string;
  ph?: string;
  en: string;
  note?: string;
  onComplete: () => void;
}) {
  useEffect(() => {
    const t = setTimeout(() => playPhrase(es), 300);
    return () => clearTimeout(t);
  }, [es]);

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <Volume2 className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]" /> Listen
      </div>
      <div className="w-full rounded-3xl border border-black/[0.07] bg-white px-6 py-10">
        <div className="font-heading text-2xl font-bold text-foreground">{es}</div>
        {ph && <div className="mt-1 font-mono text-sm text-muted-foreground">{ph}</div>}
        <Button variant="outline" size="sm" className="mt-4" onClick={() => playPhrase(es)}>
          <Volume2 className="h-4 w-4" /> Hear it
        </Button>
        <div className="mt-4 font-body text-base text-muted-foreground">{en}</div>
        {note && <div className="mt-3 font-body text-xs italic text-muted-foreground">{note}</div>}
      </div>
      <p className="font-body text-xs text-muted-foreground">Listen closely, then continue.</p>
      <Button size="cta" className="w-full max-w-xs" onClick={onComplete}>
        Continue
      </Button>
    </div>
  );
}
