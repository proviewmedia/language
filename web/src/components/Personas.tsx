import { Reveal } from "@/components/Reveal";

const personas = [
  {
    title: "The Traveler",
    desc: "Trip booked, zero Spanish. You want to order food, ask for directions, and not feel helpless. EspTalk gets you there in a week.",
    icon: <><line x1="22" y1="2" x2="11" y2="13" /><polygon points="22 2 15 22 11 13 2 9 22 2" /></>,
  },
  {
    title: "The Rusty Restarter",
    desc: "You took Spanish in high school. It's mostly gone. EspTalk brings it back — fast, focused, and without starting from \"el gato.\"",
    icon: <><polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" /></>,
  },
  {
    title: "The Curious Starter",
    desc: "No trip planned, just curious. You want to learn something useful without committing to a 6-month course or $15/month subscription.",
    icon: <><path d="M9 18h6" /><path d="M10 22h4" /><path d="M12 2a7 7 0 0 0-4 12.7c.6.5 1 1.2 1 2.3h6c0-1.1.4-1.8 1-2.3A7 7 0 0 0 12 2z" /></>,
  },
];

export function Personas() {
  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-accent">Who it's for</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-2 font-heading text-4xl font-bold text-foreground">
            Built for <span className="font-logo italic font-normal text-accent">real</span> people
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-3 max-w-[480px] font-body text-muted-foreground">
            You don't need to "love languages" to use EspTalk. You just need a
            reason.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {personas.map((p, i) => (
            <Reveal key={p.title} delay={i * 80}>
              <div className="h-full rounded-3xl border border-black/[0.07] p-6">
                <svg viewBox="0 0 24 24" className="h-9 w-9 text-accent" fill="none" stroke="currentColor" strokeWidth={1.6} strokeLinecap="round" strokeLinejoin="round">
                  {p.icon}
                </svg>
                <h3 className="mt-5 font-heading text-lg font-bold text-foreground">{p.title}</h3>
                <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
