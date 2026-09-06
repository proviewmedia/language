import { NavLink } from "react-router-dom";
import { Flame, Home, LayoutGrid, LogOut, Sparkles, User as UserIcon } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const tabs = [
  { to: "/dashboard", label: "Home", icon: Home },
  { to: "/course", label: "Course", icon: LayoutGrid },
  { to: "/practice", label: "Practice", icon: Sparkles },
];

function NavTab({ to, label, icon: Icon }: { to: string; label: string; icon: typeof Home }) {
  return (
    <NavLink
      to={to}
      className={({ isActive }) =>
        `flex flex-col items-center gap-1 px-4 py-2 font-body text-xs font-medium transition-colors md:flex-row md:gap-2 md:text-sm ${
          isActive ? "text-accent" : "text-muted-foreground hover:text-foreground"
        }`
      }
    >
      <Icon className="h-5 w-5 md:h-4 md:w-4" />
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
    <div className="min-h-screen bg-[#f9f9f9]">
      <header className="sticky top-0 z-40 border-b border-black/[0.07] bg-white">
        <div className="mx-auto flex h-16 max-w-[720px] items-center justify-between px-4">
          <a href="/dashboard" className="font-heading text-lg font-black text-foreground">
            Esp<span className="font-logo italic font-normal text-accent">Talk</span>
          </a>
          <nav className="hidden items-center gap-1 md:flex">
            {tabs.map((t) => (
              <NavTab key={t.to} {...t} />
            ))}
          </nav>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1 font-body text-sm font-semibold text-foreground">
              <Flame className="h-4 w-4 text-orange-500" />
              {streak}
            </div>
            <div className="hidden items-center gap-1 font-body text-sm font-semibold text-foreground sm:flex">
              <Sparkles className="h-4 w-4 text-accent" />
              {xp} XP
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger aria-label="Account" className="flex items-center gap-2">
                <span className="hidden font-body text-sm font-medium text-foreground sm:inline">{name}</span>
                <Avatar className="h-8 w-8">
                  <AvatarFallback className="bg-accent/10 text-accent">
                    <UserIcon className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => supabase.auth.signOut().then(() => (window.location.href = "/app.html"))}>
                  <LogOut className="h-4 w-4" />
                  Sign out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[720px] px-4 pb-24 pt-8 md:pb-12 md:pt-10">{children}</main>

      <nav className="fixed inset-x-0 bottom-0 z-40 flex justify-around border-t border-black/[0.07] bg-white pb-[env(safe-area-inset-bottom)] md:hidden">
        {tabs.map((t) => (
          <NavTab key={t.to} {...t} />
        ))}
      </nav>
    </div>
  );
}
