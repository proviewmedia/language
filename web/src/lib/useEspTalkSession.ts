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

  return { ...auth, isPro, state, completedIds };
}

function goToPaywall() {
  window.location.href = "/app.html?paywall=1";
}

export { goToPaywall };
