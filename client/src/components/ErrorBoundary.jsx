import { Component } from "react";
import { AlertTriangle, RefreshCw } from "lucide-react";

/**
 * Catches unexpected render errors so a single broken view can never
 * leave the user with a blank white screen (PHASES.md Phase 12 —
 * "Error states"). Errors are logged for debugging.
 */
class ErrorBoundary extends Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, message: "" };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, message: error?.message || "Unexpected error" };
  }

  componentDidCatch(error, info) {
    console.error("[Ascenta] Unhandled UI error:", error, info?.componentStack);
  }

  handleReload = () => {
    window.location.reload();
  };

  render() {
    if (!this.state.hasError) return this.props.children;

    return (
      <div className="flex min-h-screen items-center justify-center bg-background px-4">
        <div className="w-full max-w-md rounded-2xl border border-border bg-surface p-8 text-center shadow-sm">
          <span className="mx-auto inline-flex h-12 w-12 items-center justify-center rounded-xl bg-error-light text-error">
            <AlertTriangle size={24} />
          </span>
          <h1 className="mt-4 text-xl font-bold text-text-primary">Something went wrong</h1>
          <p className="mt-2 text-sm text-text-secondary">
            The page couldn't be displayed. Your work is safe — reloading usually fixes this.
          </p>
          <button
            type="button"
            onClick={this.handleReload}
            className="mt-6 inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            <RefreshCw size={16} />
            Reload page
          </button>
        </div>
      </div>
    );
  }
}

export default ErrorBoundary;
