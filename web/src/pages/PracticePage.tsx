import { useState } from "react";
import { Search, Volume2 } from "lucide-react";
import { AppShell } from "@/components/app/AppShell";
import { BASICS, CRAM } from "@/data/curriculum";
import { playPhrase } from "@/lib/playPhrase";
import { useEspTalkSession } from "@/lib/useEspTalkSession";

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

export function PracticePage() {
  const { loading, name, state } = useEspTalkSession();
  const [query, setQuery] = useState("");

  if (loading) return null;

  const q = query.trim().toLowerCase();
  const filteredCram = CRAM.filter(
    (p) => !q || p.es.toLowerCase().includes(q) || p.en.toLowerCase().includes(q),
  );
  const filteredBasics = BASICS.map((section) => ({
    ...section,
    items: section.items.filter(
      (p) => !q || p.es.toLowerCase().includes(q) || p.en.toLowerCase().includes(q),
    ),
  })).filter((section) => section.items.length > 0);

  return (
    <AppShell name={name} streak={state.streak} xp={state.xp}>
      <h1 className="font-heading text-2xl font-bold text-foreground">Practice</h1>
      <p className="mt-1 font-body text-sm text-muted-foreground">
        Your phrasebook — search anything, tap to hear it.
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

      {filteredCram.length === 0 && filteredBasics.length === 0 && (
        <p className="mt-10 text-center font-body text-sm text-muted-foreground">
          Nothing matches "{query}".
        </p>
      )}
    </AppShell>
  );
}
