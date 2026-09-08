import { MessageCircle, Play, Volume2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { playPhrase } from "@/lib/playPhrase";

export function SceneStep({
  title,
  lines,
  onComplete,
}: {
  title?: string;
  lines: { sp: string; en: string }[];
  onComplete: () => void;
}) {
  function playScene() {
    lines.forEach((l, i) => setTimeout(() => playPhrase(l.sp), i * 2000));
  }

  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="font-heading text-xs font-bold uppercase tracking-wide text-muted-foreground">
        <MessageCircle className="mr-1.5 inline-block h-3.5 w-3.5 align-[-2px]" /> Listen to the scene
      </div>
      <div className="w-full rounded-3xl border border-black/[0.07] bg-white px-6 py-8">
        {title && <div className="mb-4 font-heading text-sm font-bold text-foreground">{title}</div>}
        <div className="flex flex-col gap-3 text-left">
          {lines.map((l, i) => (
            <div key={i} className="flex items-center gap-3">
              <button
                onClick={() => playPhrase(l.sp)}
                className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent hover:bg-accent/20"
              >
                <Volume2 className="h-4 w-4" />
              </button>
              <div>
                <div className="font-body text-sm font-medium text-foreground">{l.sp}</div>
                <div className="font-body text-xs text-muted-foreground">{l.en}</div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="mt-5" onClick={playScene}>
          <Play className="h-4 w-4" /> Play whole scene
        </Button>
      </div>
      <Button size="cta" className="w-full max-w-xs" onClick={onComplete}>
        Continue
      </Button>
    </div>
  );
}
