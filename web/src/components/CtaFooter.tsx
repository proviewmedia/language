import { ArrowRight } from "lucide-react";
import { Reveal } from "@/components/Reveal";
import { Button } from "@/components/ui/button";

export function CtaSection() {
  return (
    <section className="bg-[#f9f9f9] py-[100px] text-center">
      <div className="mx-auto max-w-[1200px] px-6">
        <Reveal>
          <h2 className="font-heading text-4xl font-bold text-foreground">
            Ready to speak <span className="font-logo italic font-normal text-accent">Spanish</span>?
          </h2>
        </Reveal>
        <Reveal delay={60}>
          <p className="mx-auto mt-3 max-w-[420px] font-body text-muted-foreground">
            Free to start. No account, no credit card. Just open it and start
            learning.
          </p>
        </Reveal>
        <Reveal delay={120}>
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

export function Footer() {
  return (
    <footer className="border-t border-black/[0.07] py-10">
      <div className="mx-auto flex max-w-[1200px] flex-col items-center gap-4 px-6 text-center md:flex-row md:justify-between md:text-left">
        <a href="/" className="font-heading text-lg font-black text-foreground">
          Esp<span className="font-logo italic font-normal text-accent">Talk</span>
        </a>
        <div className="flex flex-wrap justify-center gap-6 font-body text-sm text-muted-foreground">
          <a href="#how" className="hover:text-foreground">How it works</a>
          <a href="#pricing" className="hover:text-foreground">Pricing</a>
          <a href="/app.html" className="hover:text-foreground">Open app</a>
          <a href="/privacy.html" className="hover:text-foreground">Privacy</a>
        </div>
        <div className="font-body text-sm text-muted-foreground">
          Created by{" "}
          <a href="https://proviewstudio.com" target="_blank" rel="noopener" className="hover:text-accent">
            Proview Studio
          </a>
        </div>
      </div>
    </footer>
  );
}
