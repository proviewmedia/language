import { Outlet } from "react-router-dom";
import { AppShell } from "@/components/app/AppShell";
import { useEspTalkSession } from "@/lib/useEspTalkSession";

// Shared layout for every authenticated route (Dashboard/Course/Practice/
// Progress/Settings). Rendered once by the router and kept mounted across
// navigations between those pages — only <Outlet/> swaps — so the sidebar
// doesn't remount (and visibly flash) on every tab click.
export function AppLayout() {
  const session = useEspTalkSession();

  if (session.loading) return null;

  return (
    <AppShell name={session.name} streak={session.state.streak} xp={session.state.xp}>
      <Outlet context={session} />
    </AppShell>
  );
}
