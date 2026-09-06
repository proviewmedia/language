import { Flag } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { EnginePath } from "@/components/app/EnginePath";
import { ModuleCard } from "@/components/app/ModuleCard";
import { ENGINE, SCENARIOS, TRIP_SIM } from "@/data/curriculum";
import { SCENARIO_ICONS } from "@/lib/scenarioIcons";
import { useEspTalkSession, goToPaywall } from "@/lib/useEspTalkSession";

export function CoursePage() {
  const { loading, name, state, completedIds, isPro } = useEspTalkSession();

  if (loading) return null;

  const capstoneKey = `${TRIP_SIM.track}:${TRIP_SIM.id}`;
  const capstoneLocked = !isPro;
  const capstoneCompleted = completedIds.has(capstoneKey);

  return (
    <AppShell name={name} streak={state.streak} xp={state.xp}>
      <h1 className="font-heading text-2xl font-bold text-foreground">Course</h1>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        Work through Foundations in order. Jump into any Travel Scenario
        whenever you need it.
      </p>

      <h2 className="mt-8 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Foundations
      </h2>
      <div className="mt-3">
        <EnginePath
          modules={ENGINE}
          completedIds={completedIds}
          isPro={isPro}
          onLockedClick={goToPaywall}
        />
      </div>

      <h2 className="mt-10 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Travel Scenarios
      </h2>
      <p className="mt-1 font-body text-xs text-muted-foreground">
        Independent topics — tap any one, anytime, no order required.
      </p>
      <div className="mt-3 grid gap-3 sm:grid-cols-2">
        {SCENARIOS.map((mod) => (
          <ModuleCard
            key={mod.id}
            module={mod}
            icon={SCENARIO_ICONS[mod.id]}
            completed={completedIds.has(`${mod.track}:${mod.id}`)}
            locked={!mod.free && !isPro}
            onLockedClick={goToPaywall}
          />
        ))}
      </div>

      <h2 className="mt-10 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
        Capstone
      </h2>
      <div className="mt-3">
        <button
          onClick={() => (capstoneLocked ? goToPaywall() : (window.location.href = `/app.html?module=${TRIP_SIM.track}:${TRIP_SIM.id}`))}
          className="flex w-full items-center gap-4 rounded-2xl border border-black/[0.07] bg-white p-5 text-left hover:border-accent/40"
        >
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-accent/10 text-accent">
            <Flag className="h-5 w-5" strokeWidth={1.8} />
          </div>
          <div className="min-w-0 flex-1">
            <h3 className="font-heading text-base font-bold text-foreground">{TRIP_SIM.title}</h3>
            <p className="mt-1 font-body text-sm text-muted-foreground">{TRIP_SIM.desc}</p>
          </div>
          {capstoneCompleted && <span className="shrink-0 font-body text-xs font-semibold text-accent">Done</span>}
        </button>
      </div>
    </AppShell>
  );
}
