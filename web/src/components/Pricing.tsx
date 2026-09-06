import { ArrowRight, Check } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

const freeFeatures = [
  "First Words, Familiar Words & the 5 Magic Frames",
  "The full Eating & Drinking scenario",
  "No account required",
  "Offline support",
];

const proFeatures = [
  "All 8 real travel scenarios",
  "The Trip Simulation capstone",
  "Native-accent audio, adjustable speed",
  "Choice of two voices",
  "Lifetime access",
];

function FeatureRow({ text }: { text: string }) {
  return (
    <div className="flex items-center gap-3 font-body text-sm text-foreground">
      <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
        <Check className="h-3 w-3 text-accent" strokeWidth={2.5} />
      </span>
      {text}
    </div>
  );
}

export function Pricing() {
  return (
    <section id="pricing" className="bg-[#f9f9f9] py-[100px] text-center">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <p className="font-heading text-sm font-bold uppercase tracking-wider text-accent">Pricing</p>
        </Reveal>
        <Reveal delay={60}>
          <h2 className="mt-2 font-heading text-4xl font-bold text-foreground">
            Simple, <span className="font-logo italic font-normal text-accent">honest</span> pricing
          </h2>
        </Reveal>
        <Reveal delay={120}>
          <p className="mx-auto mt-3 max-w-[480px] font-body text-muted-foreground">
            No subscriptions. No trials that auto-charge. Pay once, own it
            forever.
          </p>
        </Reveal>
        <div className="mx-auto mt-12 grid max-w-[820px] gap-6 text-left md:grid-cols-2">
          <Reveal>
            <div className="flex h-full flex-col rounded-3xl border border-black/[0.07] bg-white p-8">
              <div className="font-heading text-sm font-bold text-muted-foreground">Free</div>
              <div className="mt-2 font-heading text-4xl font-bold text-foreground">$0</div>
              <div className="mt-1 font-body text-xs text-muted-foreground">Forever</div>
              <div className="mt-6 flex flex-col gap-3">
                {freeFeatures.map((f) => <FeatureRow key={f} text={f} />)}
              </div>
              <Button
                variant="outline"
                className="mt-8 w-full rounded-full py-5 font-heading font-bold"
                render={<a href="/app.html">Get Started</a>}
              />
            </div>
          </Reveal>
          <Reveal delay={80}>
            <div className="relative flex h-full flex-col rounded-3xl border-2 border-accent bg-white p-8">
              <Badge className="absolute -top-3 left-8 bg-accent font-heading text-xs font-bold uppercase tracking-wide">
                Most Popular
              </Badge>
              <div className="font-heading text-sm font-bold text-muted-foreground">Pro</div>
              <div className="mt-2 font-heading text-4xl font-bold text-foreground">$9.99</div>
              <div className="mt-1 font-body text-xs text-muted-foreground">One-time payment</div>
              <div className="mt-6 flex flex-col gap-3">
                {proFeatures.map((f) => <FeatureRow key={f} text={f} />)}
              </div>
              <Button
                className="mt-8 w-full rounded-full py-5 font-heading font-bold"
                render={
                  <a href="/app.html" className="flex items-center justify-center gap-2">
                    Get Pro <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
                  </a>
                }
              />
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
