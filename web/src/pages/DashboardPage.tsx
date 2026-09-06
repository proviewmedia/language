import { ArrowRight, Flame } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ENGINE, SCENARIOS } from "@/data/curriculum";
import { useEspTalkSession } from "@/lib/useEspTalkSession";

export function DashboardPage() {
  const { loading, name, state, completedIds, isPro } = useEspTalkSession();

  if (loading) return null;

  const allModules = [...ENGINE, ...SCENARIOS];
  const unlocked = allModules.filter((m) => m.free || isPro);
  const nextModule =
    unlocked.find((m) => !completedIds.has(`${m.track}:${m.id}`)) ?? unlocked[0];
  const doneCount = allModules.filter((m) => completedIds.has(`${m.track}:${m.id}`)).length;
  const pct = Math.round((doneCount / allModules.length) * 100);
  const weeklyTotal = state.weekly.reduce((a, b) => a + b, 0);

  return (
    <AppShell name={name} streak={state.streak} xp={state.xp}>
      <h1 className="font-heading text-2xl font-bold text-foreground">
        Let's keep going
      </h1>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        {state.streak > 0
          ? `${state.streak}-day streak — don't break it.`
          : "Start a streak today."}
      </p>

      {nextModule && (
        <div className="mt-6 flex flex-col items-start gap-4 rounded-3xl border border-accent/30 bg-accent/5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="font-heading text-xs font-bold uppercase tracking-wide text-accent">
              Continue where you left off
            </div>
            <div className="mt-1 font-heading text-lg font-bold text-foreground">
              {nextModule.title}
            </div>
            <div className="font-body text-sm text-muted-foreground">
              {nextModule.goal ?? nextModule.desc}
            </div>
          </div>
          <Button
            className="w-full shrink-0 rounded-full py-5 font-heading font-bold sm:w-auto"
            render={
              <a href={`/app.html?module=${nextModule.track}:${nextModule.id}`} className="flex items-center justify-center gap-2">
                Continue <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
              </a>
            }
          />
        </div>
      )}

      <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
          <div className="flex items-center gap-1.5 font-body text-xs text-muted-foreground">
            <Flame className="h-3.5 w-3.5 text-orange-500" /> Streak
          </div>
          <div className="mt-1 font-heading text-2xl font-bold text-foreground">{state.streak} days</div>
        </div>
        <div className="rounded-2xl border border-black/[0.07] bg-white p-4">
          <div className="font-body text-xs text-muted-foreground">This week</div>
          <div className="mt-1 font-heading text-2xl font-bold text-foreground">{weeklyTotal} XP</div>
        </div>
        <div className="col-span-2 rounded-2xl border border-black/[0.07] bg-white p-4 sm:col-span-1">
          <div className="font-body text-xs text-muted-foreground">Course progress</div>
          <div className="mt-2 flex items-center gap-2">
            <Progress value={pct} className="h-2" />
            <span className="font-body text-xs font-semibold text-foreground">{pct}%</span>
          </div>
        </div>
      </div>

      <div className="mt-8 flex items-center justify-between">
        <h2 className="font-heading text-lg font-bold text-foreground">Your course</h2>
        <a href="/course" className="font-body text-sm font-medium text-accent">
          See all →
        </a>
      </div>
      <div className="mt-3 flex flex-col gap-2">
        {allModules.slice(0, 4).map((m) => {
          const key = `${m.track}:${m.id}`;
          const done = completedIds.has(key);
          return (
            <div key={key} className="flex items-center justify-between rounded-xl border border-black/[0.06] bg-white px-4 py-3">
              <span className="font-body text-sm font-medium text-foreground">{m.title}</span>
              <span className={`font-body text-xs ${done ? "text-accent" : "text-muted-foreground"}`}>
                {done ? "Done" : m.free || isPro ? "Not started" : "Locked"}
              </span>
            </div>
          );
        })}
      </div>
    </AppShell>
  );
}
