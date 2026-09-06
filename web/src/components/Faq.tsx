import { useState } from "react";
import { Reveal } from "@/components/Reveal";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    q: "Do I need any Spanish experience to start?",
    a: "Not at all. EspTalk starts from absolute zero. First words, first phrases, pronunciation from lesson one. It's designed for complete beginners who need practical Spanish fast.",
  },
  {
    q: "How is EspTalk different from Duolingo?",
    a: "Duolingo is a subscription designed to keep you subscribed. EspTalk is a one-time purchase designed to get you speaking. Short lessons, real travel phrases, native-accent audio on everything, and a method built around saying it out loud — not tapping multiple choice.",
  },
  {
    q: "Can I really learn useful Spanish in a week?",
    a: "You won't be fluent, and we'd never claim that. But you can absolutely learn to greet people, order food, ask for directions, handle numbers, and navigate basic conversations. That's what survival Spanish means.",
  },
  {
    q: "Is there a subscription?",
    a: "No. Pro is a one-time payment of $9.99. You pay once and own access forever — no monthly charges, no renewals, no cancellation traps.",
  },
  {
    q: "Does EspTalk work offline?",
    a: "Yes. EspTalk can be installed to your home screen as a PWA and used offline. Lessons, vocabulary, and phrasebooks all work without an internet connection — perfect for flights and travel.",
  },
];

export function Faq() {
  const [open, setOpen] = useState<string[]>([]);

  return (
    <section className="py-[100px]">
      <div className="mx-auto max-w-[760px] px-6">
        <div className="text-center">
          <Reveal>
            <p className="font-heading text-sm font-bold uppercase tracking-wider text-accent">FAQ</p>
          </Reveal>
          <Reveal delay={60}>
            <h2 className="mt-2 font-heading text-4xl font-bold text-foreground">
              Common <span className="font-logo italic font-normal text-accent">questions</span>
            </h2>
          </Reveal>
        </div>
        <Reveal delay={120} className="mt-10">
          <Accordion
            value={open}
            onValueChange={(value) => setOpen(value.slice(-1) as string[])}
            className="w-full"
          >
            {faqs.map((item, i) => (
              <AccordionItem key={item.q} value={`item-${i}`}>
                <AccordionTrigger className="font-heading text-base font-bold text-foreground">
                  {item.q}
                </AccordionTrigger>
                <AccordionContent className="font-body text-muted-foreground">
                  {item.a}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </Reveal>
      </div>
    </section>
  );
}
