import { Loader2, AlertTriangle } from "lucide-react";

/**
 * Confirmation dialog for destructive actions.
 * DESIGN.md §25 — "Use modals for: Confirmations".
 * Native window.confirm() is never used so the dialog stays themed,
 * accessible and consistent with the rest of the app.
 */
function ConfirmModal({
  open,
  title,
  message,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  onConfirm,
  onCancel,
  isLoading = false,
}) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/40"
        onClick={isLoading ? undefined : onCancel}
        aria-hidden="true"
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
        className="relative w-full max-w-sm rounded-2xl border border-border bg-surface p-6 shadow-lg"
      >
        <div className="flex items-start gap-3">
          <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-error-light text-error">
            <AlertTriangle size={20} />
          </span>
          <div>
            <h2 id="confirm-modal-title" className="text-base font-bold text-text-primary">
              {title}
            </h2>
            {message && <p className="mt-1 text-sm text-text-secondary">{message}</p>}
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-border-hover disabled:opacity-50"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className="inline-flex items-center gap-2 rounded-lg bg-error px-4 py-2 text-sm font-medium text-white transition-opacity hover:opacity-90 disabled:opacity-50"
          >
            {isLoading && <Loader2 size={14} className="animate-spin" />}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmModal;
