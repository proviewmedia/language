import { useState } from "react";
import { ArrowRight, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTitle, SheetTrigger } from "@/components/ui/sheet";

function StartFreeButton({ className = "" }: { className?: string }) {
  return (
    <Button
      className={`rounded-full pl-6 pr-1.5 py-1.5 h-auto font-heading font-bold ${className}`}
      render={
        <a href="/app.html">
          Start Free
          <span className="ml-3 flex h-9 w-9 items-center justify-center rounded-full bg-white text-accent">
            <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
          </span>
        </a>
      }
    />
  );
}

export function Nav() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="fixed inset-x-0 top-0 z-50 h-[72px] border-b border-black/[0.07] bg-white">
      <div className="mx-auto flex h-full max-w-[1200px] items-center justify-between px-6">
        <a href="/" className="font-heading text-xl font-black text-foreground">
          Esp<span className="font-logo italic font-normal text-accent">Talk</span>
        </a>
        <div className="hidden items-center gap-9 md:flex">
          <a href="#how" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground">How</a>
          <a href="#pricing" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground">Pricing</a>
          <a href="/app.html" className="font-body text-sm font-medium text-muted-foreground hover:text-foreground">Sign in</a>
        </div>
        <div className="hidden md:block">
          <StartFreeButton />
        </div>
        <Sheet open={open} onOpenChange={setOpen}>
          <SheetTrigger
            aria-label="Menu"
            className="p-2 text-foreground md:hidden"
          >
            <Menu className="h-6 w-6" />
          </SheetTrigger>
          <SheetContent side="top" className="border-b border-black/[0.07] pt-8">
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <div className="flex flex-col gap-5 px-2">
              <a href="#how" onClick={() => setOpen(false)} className="font-body text-base font-medium text-muted-foreground">How</a>
              <a href="#pricing" onClick={() => setOpen(false)} className="font-body text-base font-medium text-muted-foreground">Pricing</a>
              <a href="/app.html" onClick={() => setOpen(false)} className="font-body text-base font-medium text-muted-foreground">Sign in</a>
              <StartFreeButton className="self-start" />
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </nav>
  );
}
