import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { ArrowRight, Check, Loader2, Lock, PartyPopper } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";

const FEATURES = [
  "All 8 real travel scenarios",
  "The Trip Simulation capstone",
  "Native-accent audio, adjustable speed",
  "Choice of two voices",
  "No subscription — pay once, keep forever",
];

type Step = "plan" | "redirecting" | "confirming" | "success";

export function PaywallDialog({
  open,
  onOpenChange,
  mode,
  user,
}: {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "plan" | "confirming";
  user: User | null;
}) {
  const [step, setStep] = useState<Step>(mode);
  const [stillWaiting, setStillWaiting] = useState(false);

  useEffect(() => {
    if (open) {
      setStep(mode);
      setStillWaiting(false);
    }
  }, [open, mode]);

  useEffect(() => {
    if (step !== "confirming") return;
    let cancelled = false;
    (async () => {
      for (let i = 0; i < 10; i++) {
        if (cancelled) return;
        const {
          data: { user: freshUser },
        } = await supabase.auth.getUser();
        if (freshUser) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("is_pro")
            .eq("id", freshUser.id)
            .single();
          if (profile?.is_pro) {
            if (!cancelled) setStep("success");
            return;
          }
        }
        await new Promise((r) => setTimeout(r, 1500));
      }
      if (!cancelled) setStillWaiting(true);
    })();
    return () => {
      cancelled = true;
    };
  }, [step]);

  async function startCheckout() {
    if (!user) return;
    setStep("redirecting");
    try {
      const res = await fetch("/api/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id, email: user.email }),
      });
      const data = await res.json();
      if (!res.ok || !data.url) throw new Error(data.error || "Checkout could not start");
      window.location.href = data.url;
    } catch (err) {
      console.error("startCheckout failed", err);
      setStep("plan");
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        {step === "plan" && (
          <div className="px-2 py-2 text-center">
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-accent/10 text-accent">
              <Lock className="h-5 w-5" strokeWidth={1.8} />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-foreground">Upgrade to Pro</h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              Unlock the full course. Pay once, yours forever.
            </p>

            <div className="mt-5 flex flex-col gap-2.5 text-left">
              {FEATURES.map((f) => (
                <div key={f} className="flex items-center gap-2.5 font-body text-sm text-foreground">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-accent/10">
                    <Check className="h-3 w-3 text-accent" strokeWidth={2.5} />
                  </span>
                  {f}
                </div>
              ))}
            </div>

            <div className="mt-6 font-heading text-3xl font-bold text-foreground">
              $9.99 <span className="font-body text-base font-normal text-muted-foreground">one-time</span>
            </div>
            <div className="mt-1 font-body text-xs text-muted-foreground">
              one payment · yours forever · no renewals
            </div>

            <Button size="cta" className="mt-6 w-full" onClick={startCheckout}>
              Continue to payment <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Button>
            <Button variant="ghost" className="mt-2 w-full" onClick={() => onOpenChange(false)}>
              Maybe later
            </Button>
          </div>
        )}

        {(step === "redirecting" || step === "confirming") && (
          <div className="px-2 py-6 text-center">
            <Loader2 className="mx-auto h-8 w-8 animate-spin text-accent" />
            <h2 className="mt-4 font-heading text-lg font-bold text-foreground">
              {step === "redirecting" ? "Redirecting to secure checkout…" : "Confirming your payment…"}
            </h2>
            <p className="mt-2 font-body text-sm text-muted-foreground">
              {step === "redirecting"
                ? "One moment — you'll land back here once payment is complete."
                : stillWaiting
                  ? "Your payment went through, but it's taking a bit longer than usual to confirm. Refresh in a moment — if Pro still isn't unlocked, contact support with your receipt."
                  : "This only takes a second."}
            </p>
            <p className="mt-4 font-body text-xs text-muted-foreground">
              Secure payment via Stripe. One-time charge. No subscription.
            </p>
            {step === "redirecting" && (
              <Button variant="ghost" className="mt-4" onClick={() => setStep("plan")}>
                ← Back
              </Button>
            )}
          </div>
        )}

        {step === "success" && (
          <div className="px-2 py-4 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
              <PartyPopper className="h-6 w-6" strokeWidth={1.8} />
            </div>
            <h2 className="mt-4 font-heading text-xl font-bold text-foreground">You're Pro!</h2>
            <p className="mt-1 font-body text-sm text-muted-foreground">
              The full course is now unlocked. ¡Vamos!
            </p>
            <Button size="cta" className="mt-6 w-full" onClick={() => (window.location.href = "/course")}>
              Start learning <ArrowRight className="h-4 w-4" strokeWidth={2.5} />
            </Button>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}
