import { useEffect, useState } from "react";
import { Outlet, useSearchParams } from "react-router-dom";
import { AppShell } from "@/components/app/AppShell";
import { PaywallDialog } from "@/components/app/PaywallDialog";
import { useEspTalkSession, type EspTalkSession } from "@/lib/useEspTalkSession";

export type AppOutletContext = EspTalkSession & { openPaywall: () => void };

// Shared layout for every authenticated route (Dashboard/Course/Practice/
// Progress/Settings). Rendered once by the router and kept mounted across
// navigations between those pages — only <Outlet/> swaps — so the sidebar
// doesn't remount (and visibly flash) on every tab click.
export function AppLayout() {
  const session = useEspTalkSession();
  const [searchParams, setSearchParams] = useSearchParams();
  const [paywallOpen, setPaywallOpen] = useState(false);
  const [paywallMode, setPaywallMode] = useState<"plan" | "confirming">("plan");

  useEffect(() => {
    if (session.loading) return;
    const paywall = searchParams.get("paywall");
    const checkout = searchParams.get("checkout");
    if (paywall) {
      setPaywallMode("plan");
      setPaywallOpen(true);
    } else if (checkout === "success") {
      setPaywallMode("confirming");
      setPaywallOpen(true);
    }
    if (paywall || checkout) {
      const next = new URLSearchParams(searchParams);
      next.delete("paywall");
      next.delete("checkout");
      setSearchParams(next, { replace: true });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [session.loading]);

  if (session.loading) return null;

  const context: AppOutletContext = {
    ...session,
    openPaywall: () => {
      setPaywallMode("plan");
      setPaywallOpen(true);
    },
  };

  return (
    <AppShell name={session.name} streak={session.state.streak} xp={session.state.xp}>
      <Outlet context={context} />
      <PaywallDialog open={paywallOpen} onOpenChange={setPaywallOpen} mode={paywallMode} user={session.user} />
    </AppShell>
  );
}
