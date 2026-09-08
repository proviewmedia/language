import { useEffect, useState } from "react";
import { useRequireAuth } from "@/lib/useAuth";
import { readEspTalkState, type EspTalkState } from "@/lib/localState";

/** Auth + locally-tracked progress, refreshed on focus so returning from a
 * lesson in app.html shows up-to-date state without a manual reload. */
export function useEspTalkSession() {
  const auth = useRequireAuth();
  const [state, setState] = useState<EspTalkState>(() => readEspTalkState());

  useEffect(() => {
    const refresh = () => setState(readEspTalkState());
    window.addEventListener("focus", refresh);
    document.addEventListener("visibilitychange", refresh);
    return () => {
      window.removeEventListener("focus", refresh);
      document.removeEventListener("visibilitychange", refresh);
    };
  }, []);

  const isPro = auth.isPro || state.isPro;
  const completedIds = new Set(state.modules);
  const refresh = () => setState(readEspTalkState());

  return { ...auth, isPro, state, completedIds, refresh };
}

export type EspTalkSession = ReturnType<typeof useEspTalkSession>;

// Only for routes rendered outside AppLayout (currently just LessonPage,
// deliberately full-screen/focused with no dialog of its own) — everything
// inside the layout should use the openPaywall() from outlet context instead,
// which opens the dialog in place with no navigation.
function goToPaywall() {
  window.location.href = "/course?paywall=1";
}

export { goToPaywall };
