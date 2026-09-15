import { Loader2 } from "lucide-react";

/**
 * Single, consistent page-level loading state.
 * Every route uses this so loaders never jump around between pages
 * (PHASES.md Phase 12 — "Loading states").
 */
function PageLoader({ label = "Loading…", minHeight = "400px" }) {
  return (
    <div
      role="status"
      aria-live="polite"
      className="flex flex-col items-center justify-center gap-3"
      style={{ minHeight }}
    >
      <Loader2 size={32} className="animate-spin text-primary" />
      <p className="text-sm text-text-secondary">{label}</p>
    </div>
  );
}

export default PageLoader;
