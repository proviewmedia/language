import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/lib/supabase";

export interface AuthState {
  loading: boolean;
  user: User | null;
  name: string;
  isPro: boolean;
}

/**
 * Requires a signed-in Supabase session. Auth UI itself isn't rebuilt yet
 * (Phase 2a) — sign-in stays on app.html, so an unauthenticated visitor is
 * sent there instead of seeing a broken/empty screen here.
 */
export function useRequireAuth(): AuthState {
  const [state, setState] = useState<AuthState>({
    loading: true,
    user: null,
    name: "",
    isPro: false,
  });

  useEffect(() => {
    let cancelled = false;

    async function load() {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        window.location.href = "/app.html";
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_pro")
        .eq("id", session.user.id)
        .single();

      if (!cancelled) {
        const displayName =
          (session.user.user_metadata?.display_name as string | undefined) ||
          session.user.email?.split("@")[0] ||
          "";
        setState({
          loading: false,
          user: session.user,
          name: displayName,
          isPro: !!profile?.is_pro,
        });
      }
    }

    load();
    return () => {
      cancelled = true;
    };
  }, []);

  return state;
}
