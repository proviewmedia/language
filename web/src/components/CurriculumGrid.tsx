import { Reveal } from "@/components/Reveal";

const scenarios = [
  {
    title: "Arrival & the Airport",
    desc: "Passport, baggage, the exit, a SIM or taxi. Get through the airport and out the door on your own.",
    icon: <><rect x="2" y="7" width="20" height="14" rx="2" ry="2" /><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16" /></>,
  },
  {
    title: "Getting Around",
    desc: "Tell the driver where you're going, ask the fare, say \"stop here.\" Get where you're going and pay a fair price.",
    icon: <><path d="M5 11l1.5-4.5A2 2 0 0 1 8.4 5h7.2a2 2 0 0 1 1.9 1.5L19 11" /><rect x="3" y="11" width="18" height="7" rx="2" /><circle cx="7.5" cy="18" r="1.5" /><circle cx="16.5" cy="18" r="1.5" /></>,
  },
  {
    title: "Checking In",
    desc: "Reservation, breakfast, reporting a problem. Check in, ask about breakfast, and fix a room issue.",
    icon: <><circle cx="7" cy="15" r="4" /><path d="M10.5 11.5L21 1" /><path d="M15 6l3 3" /><path d="M18 3l3 3" /></>,
  },
  {
    title: "Eating & Drinking",
    free: true,
    desc: "Get a table, order, handle allergies, ask what's good, and pay. Eat like a local, not a tourist pointing at pictures.",
    icon: <><path d="M3 2v7c0 1.1.9 2 2 2h1a2 2 0 0 0 2-2V2" /><path d="M7 2v20" /><path d="M21 15V2a5 5 0 0 0-5 5v6c0 1.1.9 2 2 2h3z" /><path d="M18 15v7" /></>,
  },
  {
    title: "Shopping & Money",
    desc: "Ask the price, sizes, the polite haggle, card or cash. Ask prices, try things on, and pay your way.",
    icon: <><path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" /><line x1="3" y1="6" x2="21" y2="6" /><path d="M16 10a4 4 0 0 1-8 0" /></>,
  },
  {
    title: "Directions",
    desc: "Ask where, left/right/straight, near/far/blocks. Ask for directions and actually follow the answer.",
    icon: <><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" /><circle cx="12" cy="10" r="3" /></>,
  },
  {
    title: "Trouble",
    desc: "Pharmacy, feeling sick, lost or stolen, a doctor. Get help when you're sick, hurt, or something's lost.",
    icon: <><rect x="4" y="4" width="16" height="16" rx="2" /><line x1="12" y1="8" x2="12" y2="16" /><line x1="8" y1="12" x2="16" y2="12" /></>,
  },
  {
    title: "Connecting",
    desc: "Greet warmly, small talk, be a good guest. Break the ice and be a gracious guest.",
    icon: <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" />,
  },
];

export function CurriculumGrid() {
  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-accent">Curriculum</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-2 font-heading text-4xl font-bold text-foreground">
            What you'll <span className="font-logo italic font-normal text-accent">learn</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-3 max-w-[560px] font-body text-muted-foreground">
            First Words, Familiar Words, the 5 Magic Frames, and Eating &amp;
            Drinking are free. Here's the full course.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-2">
          {scenarios.map((s, i) => (
            <Reveal key={s.title} delay={i * 40}>
              <div className="flex gap-4 rounded-2xl border border-black/[0.07] p-5">
                <div className="flex h-8 w-8 shrink-0 items-center justify-center text-accent">
                  <svg viewBox="0 0 24 24" className="h-7 w-7" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
                    {s.icon}
                  </svg>
                </div>
                <div>
                  <h3 className="font-heading text-base font-bold text-foreground">
                    {s.title}
                    {s.free && <span className="ml-2 font-semibold text-accent">— Free</span>}
                  </h3>
                  <p className="mt-1 font-body text-sm text-muted-foreground">{s.desc}</p>
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
