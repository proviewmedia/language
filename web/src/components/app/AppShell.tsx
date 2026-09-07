import { NavLink } from "react-router-dom";
import {
  Flame,
  Home,
  LayoutGrid,
  Sparkles,
  BarChart3,
  Settings as SettingsIcon,
  LogOut,
  User as UserIcon,
} from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";

const tabs = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/course", label: "Course", icon: LayoutGrid },
  { to: "/practice", label: "Practice", icon: Sparkles },
  { to: "/progress", label: "Progress", icon: BarChart3 },
  { to: "/settings", label: "Settings", icon: SettingsIcon },
];

function signOut() {
  supabase.auth.signOut().then(() => (window.location.href = "/app.html"));
}

function SidebarLink({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex items-center gap-3 rounded-xl px-3 py-2.5 font-body text-sm font-medium transition-colors ${
          isActive ? "bg-accent/10 text-accent" : "text-muted-foreground hover:bg-black/[0.04] hover:text-foreground"
        }`
      }
    >
      <Icon className="h-[18px] w-[18px]" strokeWidth={1.8} />
      {label}
    </NavLink>
  );
}

function TabItem({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-1 flex-col items-center gap-1 py-2 font-body text-[10.5px] font-medium ${
          isActive ? "text-accent" : "text-muted-foreground"
        }`
      }
    >
      <Icon className="h-5 w-5" strokeWidth={1.8} />
      {label}
    </NavLink>
  );
}

export function AppShell({
  name,
  streak,
  xp,
  children,
}: {
  name: string;
  streak: number;
  xp: number;
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-[#f9f9f9] md:flex">
      <aside className="hidden md:sticky md:top-0 md:flex md:h-screen md:w-60 md:shrink-0 md:flex-col md:border-r md:border-black/[0.07] md:bg-white">
        <a href="/dashboard" className="px-5 pt-6 pb-4 font-heading text-lg font-black text-foreground">
          Esp<span className="font-logo italic font-normal text-accent">Talk</span>
        </a>

        <div className="mx-4 mb-4 flex items-center gap-3 rounded-xl border border-black/[0.07] bg-[#f9f9f9] p-3">
          <Avatar className="h-9 w-9">
            <AvatarFallback className="bg-accent/10 text-accent">
              <UserIcon className="h-4 w-4" />
            </AvatarFallback>
          </Avatar>
          <div className="min-w-0 flex-1">
            <div className="truncate font-body text-sm font-semibold text-foreground">{name}</div>
            <div className="mt-0.5 flex items-center gap-2.5 font-body text-xs text-muted-foreground">
              <span className="flex items-center gap-1">
                <Flame className="h-3.5 w-3.5 text-orange-500" /> {streak}
              </span>
              <span className="flex items-center gap-1">
                <Sparkles className="h-3.5 w-3.5 text-accent" /> {xp} XP
              </span>
            </div>
          </div>
        </div>

        <nav className="flex flex-1 flex-col gap-1 px-3">
          {tabs.map((t) => (
            <SidebarLink key={t.to} {...t} />
          ))}
        </nav>

        <div className="p-3">
          <Button variant="ghost" className="w-full justify-start gap-3 text-muted-foreground" onClick={signOut}>
            <LogOut className="h-[18px] w-[18px]" strokeWidth={1.8} />
            Sign out
          </Button>
        </div>
      </aside>

      <div className="flex min-h-screen flex-1 flex-col">
        <header className="sticky top-0 z-40 flex h-14 shrink-0 items-center justify-center border-b border-black/[0.07] bg-white md:hidden">
          <a href="/dashboard" className="font-heading text-lg font-black text-foreground">
            Esp<span className="font-logo italic font-normal text-accent">Talk</span>
          </a>
        </header>

        <main className="mx-auto w-full max-w-[720px] flex-1 px-4 pb-24 pt-6 md:pb-12 md:pt-10">{children}</main>

        <nav className="fixed inset-x-0 bottom-0 z-40 flex border-t border-black/[0.07] bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
          {tabs.map((t) => (
            <TabItem key={t.to} {...t} />
          ))}
        </nav>
      </div>
    </div>
  );
}
