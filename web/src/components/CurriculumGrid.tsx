import {
  Briefcase,
  Car,
  BedDouble,
  UtensilsCrossed,
  ShoppingBag,
  MapPin,
  LifeBuoy,
  MessageCircle,
  type LucideIcon,
} from "lucide-react";
import { Reveal } from "@/components/Reveal";

const scenarios: { title: string; free?: boolean; desc: string; icon: LucideIcon }[] = [
  {
    title: "Arrival & the Airport",
    desc: "Passport, baggage, the exit, a SIM or taxi. Get through the airport and out the door on your own.",
    icon: Briefcase,
  },
  {
    title: "Getting Around",
    desc: "Tell the driver where you're going, ask the fare, say \"stop here.\" Get where you're going and pay a fair price.",
    icon: Car,
  },
  {
    title: "Checking In",
    desc: "Reservation, breakfast, reporting a problem. Check in, ask about breakfast, and fix a room issue.",
    icon: BedDouble,
  },
  {
    title: "Eating & Drinking",
    free: true,
    desc: "Get a table, order, handle allergies, ask what's good, and pay. Eat like a local, not a tourist pointing at pictures.",
    icon: UtensilsCrossed,
  },
  {
    title: "Shopping & Money",
    desc: "Ask the price, sizes, the polite haggle, card or cash. Ask prices, try things on, and pay your way.",
    icon: ShoppingBag,
  },
  {
    title: "Directions",
    desc: "Ask where, left/right/straight, near/far/blocks. Ask for directions and actually follow the answer.",
    icon: MapPin,
  },
  {
    title: "Trouble",
    desc: "Pharmacy, feeling sick, lost or stolen, a doctor. Get help when you're sick, hurt, or something's lost.",
    icon: LifeBuoy,
  },
  {
    title: "Connecting",
    desc: "Greet warmly, small talk, be a good guest. Break the ice and be a gracious guest.",
    icon: MessageCircle,
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
                  <s.icon className="h-7 w-7" strokeWidth={1.8} />
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
