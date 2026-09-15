import { Inbox } from "lucide-react";

/**
 * Consistent empty state used across the app so "nothing here yet"
 * looks the same everywhere (PHASES.md Phase 12 — "Empty states").
 * Pass `compact` for tight spots such as Kanban columns.
 */
function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  action = null,
  compact = false,
}) {
  return (
    <div
      className={`rounded-2xl border border-dashed border-border bg-surface text-center ${
        compact ? "px-3 py-6" : "px-6 py-10"
      }`}
    >
      <span
        className={`mx-auto inline-flex items-center justify-center rounded-xl bg-background text-text-muted ${
          compact ? "h-8 w-8" : "h-11 w-11"
        }`}
      >
        <Icon size={compact ? 16 : 20} />
      </span>
      {title && (
        <p className={`${compact ? "mt-2 text-xs" : "mt-3 text-sm"} font-semibold text-text-primary`}>
          {title}
        </p>
      )}
      {description && (
        <p
          className={`mx-auto mt-1 max-w-sm text-text-secondary ${
            compact ? "text-[11px]" : "text-sm"
          }`}
        >
          {description}
        </p>
      )}
      {action && <div className="mt-4 flex justify-center">{action}</div>}
    </div>
  );
}

export default EmptyState;
