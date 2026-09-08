import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

export function GoalStep({
  code,
  title,
  goal,
  icon: Icon,
  onComplete,
}: {
  code: string;
  title: string;
  goal: string;
  icon: LucideIcon;
  onComplete: () => void;
}) {
  return (
    <div className="flex flex-col items-center gap-6 text-center">
      <div className="rounded-3xl border border-black/[0.07] bg-white px-8 py-10">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
          <Icon className="h-6 w-6" strokeWidth={1.8} />
        </div>
        <div className="mt-4 font-mono text-xs font-semibold uppercase tracking-wide text-accent">
          {code} · {title}
        </div>
        <div className="mt-3 font-body text-xs font-semibold uppercase tracking-wide text-muted-foreground">
          By the end, you'll be able to:
        </div>
        <div className="mt-2 font-logo text-2xl italic text-foreground">{goal}</div>
      </div>
      <Button size="cta" className="w-full max-w-xs" onClick={onComplete}>
        Start
      </Button>
    </div>
  );
}
