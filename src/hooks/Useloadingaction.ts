import { useCallback, useState } from "react";

/**
 * Wraps a click/submit action with a loading state that stays true for a
 * fixed delay before the action actually runs. Used across SkillNear so
 * every button gives visible feedback instead of feeling instant/dead.
 */
export function useLoadingAction(delayMs = 4000) {
  const [loading, setLoading] = useState(false);

  const run = useCallback(
    (action: () => void) => {
      if (loading) return;
      setLoading(true);
      window.setTimeout(() => {
        action();
        setLoading(false);
      }, delayMs);
    },
    [loading, delayMs]
  );

  return { loading, run };
}