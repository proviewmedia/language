import { useState } from "react";
import { Check, Lock, Volume2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import type { Module } from "@/data/curriculum";
import { playPhrase } from "@/lib/playPhrase";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";

function samplePhrases(mod: Module): { es: string; en: string }[] {
  const out: { es: string; en: string }[] = [];
  for (const step of mod.steps) {
    const es = (step as { es?: string }).es;
    const en = (step as { en?: string }).en;
    if (typeof es === "string" && typeof en === "string" && es && en) {
      out.push({ es, en });
      if (out.length >= 4) break;
    }
  }
  return out;
}

export function ModuleCard({
  module: mod,
  icon: Icon,
  completed,
  locked,
  onLockedClick,
}: {
  module: Module;
  icon: LucideIcon;
  completed: boolean;
  locked: boolean;
  onLockedClick: () => void;
}) {
  const [open, setOpen] = useState(false);
  const phrases = samplePhrases(mod);
  const href = `/app.html?module=${mod.track}:${mod.id}`;

  return (
    <>
      <button
        onClick={() => (locked ? onLockedClick() : setOpen(true))}
        className="flex w-full items-start gap-4 rounded-2xl border border-black/[0.07] bg-white p-5 text-left transition-colors hover:border-accent/40"
      >
        <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${locked ? "bg-muted text-muted-foreground" : "bg-accent/10 text-accent"}`}>
          {locked ? <Lock className="h-5 w-5" /> : <Icon className="h-5 w-5" strokeWidth={1.8} />}
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-heading text-base font-bold text-foreground">{mod.title}</h3>
            {mod.free && !completed && (
              <span className="rounded-full bg-accent/10 px-2 py-0.5 font-heading text-[10px] font-bold uppercase tracking-wide text-accent">
                Free
              </span>
            )}
            {completed && <Check className="h-4 w-4 shrink-0 text-accent" strokeWidth={2.5} />}
          </div>
          <p className="mt-1 font-body text-sm text-muted-foreground">{mod.desc ?? mod.goal}</p>
        </div>
      </button>

      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="bottom" className="mx-auto max-h-[85dvh] max-w-[560px] overflow-y-auto rounded-t-3xl">
          <SheetHeader>
            <SheetTitle className="font-heading text-xl font-bold">{mod.title}</SheetTitle>
            <SheetDescription className="font-body">{mod.goal ?? mod.desc}</SheetDescription>
          </SheetHeader>
          {phrases.length > 0 && (
            <div className="mt-4 flex flex-col gap-2 px-4">
              {phrases.map((p) => (
                <button
                  key={p.es}
                  onClick={() => playPhrase(p.es)}
                  className="flex items-center justify-between gap-3 rounded-xl border border-black/[0.06] px-4 py-3 text-left hover:border-accent/40"
                >
                  <div>
                    <div className="font-body text-sm font-medium text-foreground">{p.es}</div>
                    <div className="font-body text-xs text-muted-foreground">{p.en}</div>
                  </div>
                  <Volume2 className="h-4 w-4 shrink-0 text-accent" />
                </button>
              ))}
            </div>
          )}
          <div className="mt-6 px-4 pb-6">
            <Button
              className="w-full rounded-full py-5 font-heading font-bold"
              render={<a href={href}>{completed ? "Review" : "Start"}</a>}
            />
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
}
