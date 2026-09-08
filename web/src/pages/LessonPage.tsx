import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ChevronLeft, PartyPopper, Star, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ENGINE, SCENARIOS, CAPSTONES, type Module, type StepBase } from "@/data/curriculum";
import { MODULE_ICONS } from "@/lib/moduleIcons";
import { lessonProgress } from "@/lib/lessonProgress";
import { writeEspTalkProgress } from "@/lib/localState";
import { useEspTalkSession, goToPaywall } from "@/lib/useEspTalkSession";
import { GoalStep } from "@/components/lesson/GoalStep";
import { NoteStep } from "@/components/lesson/NoteStep";
import { PresentStep } from "@/components/lesson/PresentStep";
import { ListenRepeatStep } from "@/components/lesson/ListenRepeatStep";
import { ProduceStep } from "@/components/lesson/ProduceStep";
import { FrameSwapStep } from "@/components/lesson/FrameSwapStep";
import { SceneStep } from "@/components/lesson/SceneStep";
import { RoleplayStep } from "@/components/lesson/RoleplayStep";

const ALL_MODULES = [...ENGINE, ...SCENARIOS, ...CAPSTONES];

function renderStep(
  step: StepBase,
  mod: Module,
  onComplete: () => void,
  onSubProgress: (i: number) => void,
) {
  switch (step.type) {
    case "goal":
      return (
        <GoalStep
          code={mod.code}
          title={mod.title}
          goal={mod.goal ?? mod.desc ?? ""}
          icon={MODULE_ICONS[mod.id] ?? MODULE_ICONS.trip}
          onComplete={onComplete}
        />
      );
    case "note":
      return <NoteStep text={(step.text as string) ?? (step.en as string) ?? ""} onComplete={onComplete} />;
    case "present":
      return (
        <PresentStep
          es={step.es as string}
          ph={step.ph as string | undefined}
          en={step.en as string}
          note={step.note as string | undefined}
          onComplete={onComplete}
        />
      );
    case "listen_repeat":
      return <ListenRepeatStep es={step.es as string} ph={step.ph as string | undefined} en={step.en as string} onComplete={onComplete} />;
    case "produce":
      return <ProduceStep es={step.es as string} ph={step.ph as string | undefined} en={step.en as string} onComplete={onComplete} />;
    case "frame_swap":
      return (
        <FrameSwapStep
          frame={step.frame as string}
          en={step.en as string}
          slots={step.slots as { es: string; en: string }[]}
          onComplete={onComplete}
          onSubProgress={onSubProgress}
        />
      );
    case "scene":
      return (
        <SceneStep
          title={step.title as string | undefined}
          lines={step.lines as { sp: string; en: string }[]}
          onComplete={onComplete}
        />
      );
    case "roleplay":
      return (
        <RoleplayStep
          title={step.title as string | undefined}
          lines={step.lines as { who: "them" | "you"; es: string; en: string }[]}
          onComplete={onComplete}
          onSubProgress={onSubProgress}
        />
      );
    default:
      return null;
  }
}

export function LessonPage() {
  const { track, id } = useParams<{ track: string; id: string }>();
  const navigate = useNavigate();
  const { loading, isPro, refresh } = useEspTalkSession();
  const [si, setSi] = useState(0);
  const [subIdx, setSubIdx] = useState(0);
  const [done, setDone] = useState(false);

  const mod = ALL_MODULES.find((m) => m.track === track && m.id === id);
  const locked = !!mod && !mod.free && !isPro;

  useEffect(() => {
    if (loading) return;
    if (!mod) {
      navigate("/course", { replace: true });
      return;
    }
    if (locked) goToPaywall();
  }, [loading, mod, locked, navigate]);

  if (loading || !mod || locked) return null;

  const steps: StepBase[] = [
    { type: "goal", code: mod.code, title: mod.title, goal: mod.goal ?? mod.desc ?? "" },
    ...mod.steps,
  ];
  const moduleKey = `${mod.track}:${mod.id}`;

  function advance() {
    setSubIdx(0);
    if (si + 1 >= steps.length) {
      writeEspTalkProgress({ xpDelta: 20, moduleKey });
      refresh();
      setDone(true);
    } else {
      setSi((s) => s + 1);
    }
  }

  function goBack() {
    if (si > 0) {
      setSubIdx(0);
      setSi((s) => s - 1);
    }
  }

  if (done) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center gap-4 bg-[#f9f9f9] px-6 text-center">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-accent/10 text-accent">
          <PartyPopper className="h-7 w-7" />
        </div>
        <h1 className="font-heading text-2xl font-bold text-foreground">Module complete!</h1>
        <p className="max-w-xs font-body text-sm text-muted-foreground">
          You followed along and produced it out loud — that's the whole method.
        </p>
        <div className="flex items-center gap-1.5 font-heading text-sm font-bold text-accent">
          <Star className="h-4 w-4" /> +20 XP
        </div>
        <Button size="cta" className="mt-2 w-full max-w-xs" onClick={() => navigate("/course")}>
          Back to course
        </Button>
      </div>
    );
  }

  const { current, total } = lessonProgress(steps, si, subIdx);
  const step = steps[si];

  return (
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-black/[0.07] bg-white px-4 py-3">
        <button onClick={() => navigate("/course")} className="text-muted-foreground hover:text-foreground" aria-label="Exit lesson">
          <X className="h-5 w-5" />
        </button>
        <button
          onClick={goBack}
          className={`text-muted-foreground hover:text-foreground ${si === 0 ? "invisible" : ""}`}
          aria-label="Previous step"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-black/[0.06]">
          <div
            className="h-full rounded-full bg-accent transition-all"
            style={{ width: `${((current - 1) / total) * 100}%` }}
          />
        </div>
        <span className="font-mono text-xs text-muted-foreground">
          {current} / {total}
        </span>
      </header>

      <main className="mx-auto max-w-[560px] px-4 py-10">{renderStep(step, mod, advance, setSubIdx)}</main>
    </div>
  );
}
