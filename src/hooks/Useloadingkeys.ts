import { useCallback, useState } from "react";

/**
 * Like useLoadingAction, but tracks loading per-key so multiple buttons in
 * the same list/group (category chips, FAQ items, per-row job actions) can
 * each show their own independent loading state.
 */
export function useLoadingKeys(delayMs = 4000) {
  const [loadingKeys, setLoadingKeys] = useState<Set<string>>(new Set());

  const run = useCallback(
    (key: string, action: () => void) => {
      setLoadingKeys((prev) => {
        if (prev.has(key)) return prev;
        const next = new Set(prev);
        next.add(key);
        return next;
      });
      window.setTimeout(() => {
        action();
        setLoadingKeys((prev) => {
          const next = new Set(prev);
          next.delete(key);
          return next;
        });
      }, delayMs);
    },
    [delayMs]
  );

  const isLoading = useCallback(
    (key: string) => loadingKeys.has(key),
    [loadingKeys]
  );

  return { run, isLoading };
}