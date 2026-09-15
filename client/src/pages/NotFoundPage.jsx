import { Link } from "react-router-dom";
import { Compass, ArrowLeft } from "lucide-react";

/**
 * 404 page for unknown routes (PHASES.md Phase 12 — "Error states").
 */
function NotFoundPage() {
  return (
    <div className="mx-auto flex min-h-[60vh] max-w-md flex-col items-center justify-center text-center">
      <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-primary-light text-primary">
        <Compass size={26} />
      </span>
      <p className="mt-5 text-5xl font-bold text-text-primary">404</p>
      <h1 className="mt-2 text-lg font-semibold text-text-primary">Page not found</h1>
      <p className="mt-2 text-sm text-text-secondary">
        The page you're looking for doesn't exist or may have been moved.
      </p>
      <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
        <Link
          to="/"
          className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
        >
          <ArrowLeft size={16} />
          Back to home
        </Link>
        <Link
          to="/dashboard"
          className="inline-flex items-center gap-2 rounded-lg border border-border bg-surface px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:border-primary hover:text-primary"
        >
          Go to dashboard
        </Link>
      </div>
    </div>
  );
}

export default NotFoundPage;
