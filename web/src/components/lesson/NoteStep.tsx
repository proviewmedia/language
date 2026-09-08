import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

export function NoteStep({ text, onComplete }: { text: string; onComplete: () => void }) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="rounded-3xl border border-black/[0.07] bg-white px-8 py-10">
        <div className="mx-auto flex h-11 w-11 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Sparkles className="h-5 w-5" strokeWidth={1.8} />
        </div>
        <p className="mx-auto mt-4 max-w-[420px] font-body text-base leading-relaxed text-foreground">{text}</p>
      </div>
      <Button size="cta" className="w-full max-w-xs" onClick={onComplete}>
        Continue
      </Button>
    </div>
  );
}
