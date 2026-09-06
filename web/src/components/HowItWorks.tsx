import { Reveal } from "@/components/Reveal";
import { Card, CardContent } from "@/components/ui/card";

const steps = [
  {
    title: "See it",
    desc: "Each phrase appears with a clear English translation. You see the Spanish, understand the meaning, and learn the pattern — no guessing games.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
        <circle cx="12" cy="12" r="3" />
      </svg>
    ),
  },
  {
    title: "Hear it",
    desc: "Every phrase has clear, native-accent audio at natural and slowed speed. Tap to hear it, then hear it again. Your ear trains alongside your brain.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
        <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
        <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
      </svg>
    ),
  },
  {
    title: "Use it",
    desc: "You get an English prompt and say the Spanish out loud yourself, then hear the correct pronunciation and rate how you did. No multiple choice, no typing — you produce it. That's what makes it stick.",
    icon: (
      <svg viewBox="0 0 24 24" className="h-[26px] w-[26px]" fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z" />
        <path d="M19 10v2a7 7 0 0 1-14 0v-2" />
        <line x1="12" y1="19" x2="12" y2="23" />
        <line x1="8" y1="23" x2="16" y2="23" />
      </svg>
    ),
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-[#f9f9f9] py-[100px]">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-accent">How it works</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-2 font-heading text-4xl font-bold text-foreground">
            A smarter way to <span className="font-logo italic font-normal text-accent">learn</span>
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mt-3 max-w-[480px] font-body text-muted-foreground">
            Three steps. No account required. Start speaking in minutes.
          </p>
        </Reveal>
        <div className="mt-12 grid gap-5 md:grid-cols-3">
          {steps.map((step, i) => (
            <Reveal key={step.title} delay={i * 80}>
              <Card className="h-full rounded-3xl border-black/[0.07] p-2 shadow-none">
                <CardContent className="px-4 py-2">
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl border border-black/[0.07] text-accent">
                    {step.icon}
                  </div>
                  <h3 className="mt-6 font-heading text-lg font-bold text-foreground">{step.title}</h3>
                  <p className="mt-2 font-body text-sm leading-relaxed text-muted-foreground">{step.desc}</p>
                </CardContent>
              </Card>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
