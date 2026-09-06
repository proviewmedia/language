import { Check, Lock } from "lucide-react";
import type { Module } from "@/data/curriculum";

export function EnginePath({
  modules,
  completedIds,
  isPro,
  onLockedClick,
}: {
  modules: Module[];
  completedIds: Set<string>;
  isPro: boolean;
  onLockedClick: () => void;
}) {
  return (
    <div className="relative flex flex-col gap-3">
      {modules.map((mod, i) => {
        const key = `${mod.track}:${mod.id}`;
        const completed = completedIds.has(key);
        const locked = !mod.free && !isPro;
        const isNext =
          !completed && !locked && !modules.slice(0, i).some((m) => !completedIds.has(`${m.track}:${m.id}`) && (m.free || isPro));
        const href = `/app.html?module=${mod.track}:${mod.id}`;

        return (
          <a
            key={mod.id}
            href={locked ? undefined : href}
            onClick={locked ? (e) => { e.preventDefault(); onLockedClick(); } : undefined}
            className={`flex items-center gap-4 rounded-2xl border p-4 transition-colors ${
              locked
                ? "border-black/[0.06] bg-black/[0.02] opacity-60"
                : isNext
                  ? "border-accent bg-accent/5"
                  : "border-black/[0.07] bg-white hover:border-accent/40"
            }`}
          >
            <div
              className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-heading text-sm font-bold ${
                completed
                  ? "bg-accent text-white"
                  : locked
                    ? "bg-black/[0.06] text-muted-foreground"
                    : "border-2 border-accent text-accent"
              }`}
            >
              {completed ? <Check className="h-5 w-5" strokeWidth={3} /> : locked ? <Lock className="h-4 w-4" /> : i + 1}
            </div>
            <div className="min-w-0 flex-1">
              <div className="font-heading text-sm font-bold text-foreground">{mod.title}</div>
              <div className="font-body text-xs text-muted-foreground">{mod.goal ?? mod.desc}</div>
            </div>
            {isNext && (
              <span className="shrink-0 rounded-full bg-accent px-3 py-1 font-heading text-xs font-bold text-white">
                Next
              </span>
            )}
          </a>
        );
      })}
    </div>
  );
}
