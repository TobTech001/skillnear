import type { ButtonHTMLAttributes, ReactNode } from "react";
import Spinner from "./Spinner";

interface LoadingButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  loading: boolean;
  /** Text shown in place of children while loading (e.g. "Signing in\u2026"). */
  loadingLabel?: ReactNode;
  /** Extra classes for the spinner, e.g. to match text color on a dark button. */
  spinnerClassName?: string;
}

/**
 * Wraps a normal <button> with the loading pattern used across SkillNear:
 * disabled + spinner + swapped label while an action is in flight. Pair
 * with useLoadingAction (single button) or useLoadingKeys (per-item
 * buttons in a list) for the actual delay/state logic.
 */
export default function LoadingButton({
  loading,
  loadingLabel,
  spinnerClassName,
  disabled,
  className = "",
  children,
  ...rest
}: LoadingButtonProps) {
  return (
    <button
      disabled={disabled || loading}
      className={`flex items-center justify-center gap-2 disabled:opacity-60 ${className}`}
      {...rest}
    >
      {loading && <Spinner className={spinnerClassName} />}
      {loading && loadingLabel !== undefined ? loadingLabel : children}
    </button>
  );
}