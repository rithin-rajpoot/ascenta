import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Layers, Rocket, Sparkles } from "lucide-react";

function HomePage() {
  return (
    <div className="mx-auto max-w-4xl">
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
          <Sparkles size={14} />
          Phase 0 — Project Foundation
        </span>

        <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary">
          Ascenta
        </h1>

        <p className="mt-4 text-lg leading-relaxed text-text-secondary">
          AI-assisted academic project lifecycle management platform.
        </p>

        <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
          This page confirms that React, Vite, Tailwind CSS, and React Router are
          configured and working. UI follows the Ascenta design system in
          DESIGN.md — Inter font, primary color #6366F1, and a clean light theme.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-border bg-background p-4">
            <CheckCircle2 size={20} className="text-success" />
            <p className="mt-3 text-sm font-semibold text-text-primary">
              React + Vite
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Fast development server and HMR.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <Layers size={20} className="text-primary" />
            <p className="mt-3 text-sm font-semibold text-text-primary">
              Tailwind CSS
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Design system utilities active.
            </p>
          </div>

          <div className="rounded-xl border border-border bg-background p-4">
            <Rocket size={20} className="text-secondary" />
            <p className="mt-3 text-sm font-semibold text-text-primary">
              React Router
            </p>
            <p className="mt-1 text-xs text-text-muted">
              Client-side routing configured.
            </p>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/about"
            className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            About Ascenta
            <ArrowRight size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
}

export default HomePage;