import { useState } from "react";
import { useOutletContext } from "react-router-dom";
import { Search, Volume2, Repeat, Layers } from "lucide-react";
import { DailyReview } from "@/components/app/DailyReview";
import { Flashcards } from "@/components/app/Flashcards";
import { BASICS, CRAM, PHRASE_SETS, VOCAB_BANK } from "@/data/curriculum";
import { PHRASE_SET_ICONS } from "@/lib/phraseSetIcons";
import { playPhrase } from "@/lib/playPhrase";
import type { EspTalkSession } from "@/lib/useEspTalkSession";

function PhraseRow({ es, en }: { es: string; en: string }) {
  return (
    <button
      onClick={() => playPhrase(es)}
      className="flex w-full items-center justify-between gap-3 rounded-xl border border-black/[0.06] bg-white px-4 py-3 text-left hover:border-accent/40"
    >
      <div className="min-w-0">
        <div className="font-body text-sm font-medium text-foreground">{es}</div>
        <div className="font-body text-xs text-muted-foreground">{en}</div>
      </div>
      <Volume2 className="h-4 w-4 shrink-0 text-accent" />
    </button>
  );
}

function StudyCard({
  icon: Icon,
  title,
  desc,
  count,
  onClick,
}: {
  icon: typeof Repeat;
  title: string;
  desc: string;
  count: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className="flex flex-col items-start gap-2 rounded-2xl border border-black/[0.07] bg-white p-5 text-left hover:border-accent/40"
    >
      <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent/10 text-accent">
        <Icon className="h-5 w-5" strokeWidth={1.8} />
      </div>
      <div className="font-heading text-base font-bold text-foreground">{title}</div>
      <div className="font-body text-sm text-muted-foreground">{desc}</div>
      <div className="font-body text-xs font-medium text-accent">{count} →</div>
    </button>
  );
}

export function PracticePage() {
  const { state, refresh } = useOutletContext<EspTalkSession>();
  const [query, setQuery] = useState("");
  const [mode, setMode] = useState<"home" | "review" | "flashcards">("home");

  if (mode === "review") {
    return (
      <DailyReview
        vocabStatus={state.vocabStatus}
        onExit={() => setMode("home")}
        onFinish={() => refresh()}
      />
    );
  }

  if (mode === "flashcards") {
    return <Flashcards onExit={() => setMode("home")} onFinish={() => refresh()} />;
  }

  const q = query.trim().toLowerCase();
  const matches = (es: string, en: string) => !q || es.toLowerCase().includes(q) || en.toLowerCase().includes(q);

  const filteredCram = CRAM.filter((p) => matches(p.es, p.en));
  const filteredBasics = BASICS.map((section) => ({
    ...section,
    items: section.items.filter((p) => matches(p.es, p.en)),
  })).filter((section) => section.items.length > 0);
  const filteredSets = PHRASE_SETS.map((set) => ({
    ...set,
    phrases: set.phrases.filter((p) => matches(p.es, p.en)),
  })).filter((set) => set.phrases.length > 0);

  const showStudyCards = !q;
  const nothingFound = q && filteredCram.length === 0 && filteredBasics.length === 0 && filteredSets.length === 0;

  return (
    <>
      <h1 className="font-heading text-2xl font-bold text-foreground">Practice</h1>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        Your phrasebook, always here — warm up, study, or search anything and tap to hear it.
      </p>

      <div className="relative mt-4">
        <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search a word or phrase…"
          className="w-full rounded-full border border-black/[0.08] bg-white py-3 pl-11 pr-4 font-body text-sm text-foreground outline-none focus:border-accent"
        />
      </div>

      {showStudyCards && (
        <div className="mt-6 grid gap-3 sm:grid-cols-2">
          <StudyCard
            icon={Repeat}
            title="Daily Review"
            desc="Spaced repetition of what you've learned."
            count={`${Math.min(8, VOCAB_BANK.length)} words ready`}
            onClick={() => setMode("review")}
          />
          <StudyCard
            icon={Layers}
            title="Flashcards"
            desc="Flip through your vocabulary."
            count={`${VOCAB_BANK.length} words`}
            onClick={() => setMode("flashcards")}
          />
        </div>
      )}

      {filteredCram.length > 0 && (
        <>
          <h2 className="mt-8 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
            Essentials
          </h2>
          <div className="mt-3 flex flex-col gap-2">
            {filteredCram.map((p) => (
              <PhraseRow key={p.es} es={p.es} en={p.en} />
            ))}
          </div>
        </>
      )}

      {filteredSets.map((set) => {
        const Icon = PHRASE_SET_ICONS[set.id];
        return (
          <div key={set.id}>
            <h2 className="mt-8 flex items-center gap-1.5 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
              {Icon && <Icon className="h-3.5 w-3.5" />} {set.title}
            </h2>
            <div className="mt-3 flex flex-col gap-2">
              {set.phrases.map((p) => (
                <PhraseRow key={p.es} es={p.es} en={p.en} />
              ))}
            </div>
          </div>
        );
      })}

      {filteredBasics.map((section) => (
        <div key={section.title}>
          <h2 className="mt-8 font-heading text-sm font-bold uppercase tracking-wide text-muted-foreground">
            {section.title}
          </h2>
          <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-3">
            {section.items.map((p) => (
              <PhraseRow key={p.es} es={p.es} en={p.en} />
            ))}
          </div>
        </div>
      ))}

      {nothingFound && (
        <p className="mt-10 text-center font-body text-sm text-muted-foreground">
          Nothing matches "{query}".
        </p>
      )}
    </>
  );
}
