import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Reveal } from "@/components/Reveal";

export function Hero() {
  return (
    <section className="pb-[100px] pt-[196px] text-center">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <h1 className="font-heading text-6xl font-bold leading-[1.08] tracking-tight text-foreground md:text-[72px]">
            Learn Survival
            <br />
            <span className="font-logo italic font-normal text-accent">Spanish</span>
          </h1>
        </Reveal>
        <Reveal delay={80}>
          <p className="mx-auto mt-6 max-w-[560px] font-body text-lg text-muted-foreground">
            Everything you need to greet, order, navigate, and survive — in one
            week. No fluff, no subscriptions, no 200-day streaks.
          </p>
        </Reveal>
        <Reveal delay={160}>
          <div className="mt-8">
            <Button
              size="lg"
              className="rounded-full pl-8 pr-2 py-2 h-auto font-heading text-base font-bold"
              render={
                <a href="/app.html">
                  Start Free
                  <span className="ml-4 flex h-11 w-11 items-center justify-center rounded-full bg-white text-accent">
                    <ArrowRight className="h-5 w-5" strokeWidth={2.5} />
                  </span>
                </a>
              }
            />
          </div>
        </Reveal>
      </div>
    </section>
  );
}
