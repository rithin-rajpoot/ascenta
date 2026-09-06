import { Link } from "react-router-dom";
import { ArrowRight, CheckCircle2, Layers, Rocket, Sparkles, Users, BookOpen } from "lucide-react";
import { useSelector } from "react-redux";

function HomePage() {
  const { user } = useSelector((state) => state.auth);

  if (!user) {
    return (
      <div className="mx-auto max-w-4xl">
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            <Sparkles size={14} />
            Phase 1 — Authentication Complete
          </span>

          <h1 className="mt-6 text-4xl font-bold tracking-tight text-text-primary">
            Welcome to Ascenta
          </h1>

          <p className="mt-4 text-lg leading-relaxed text-text-secondary">
            AI-assisted academic project lifecycle management platform.
          </p>

          <p className="mt-2 max-w-2xl text-sm leading-relaxed text-text-muted">
            Log in to continue planning your projects, building teams, and collaborating with faculty.
          </p>

          <div className="mt-8 flex flex-wrap gap-3">
            <Link
              to="/login"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
            >
              Sign In
              <ArrowRight size={16} />
            </Link>
            <Link
              to="/register"
              className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-text-primary transition-colors hover:bg-surface"
            >
              Register
            </Link>
          </div>
        </section>
      </div>
    );
  }

  if (user.role === "faculty") {
    return (
      <div className="mx-auto max-w-4xl">
        <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-12">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
            <BookOpen size={14} />
            Faculty Portal
          </span>

          <h1 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
            Welcome back, Prof. {user.name}
          </h1>

          <p className="mt-4 text-sm leading-relaxed text-text-secondary">
            Your assigned projects and student progress will appear here in upcoming phases (Phase 7).
          </p>
        </section>
      </div>
    );
  }

  // Student Dashboard
  return (
    <div className="mx-auto max-w-4xl">
      <section className="rounded-2xl border border-border bg-surface p-8 shadow-sm sm:p-12">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary-dark">
          <Sparkles size={14} />
          Student Dashboard
        </span>

        <h1 className="mt-6 text-3xl font-bold tracking-tight text-text-primary">
          Welcome back, {user.name}
        </h1>

        <p className="mt-4 text-sm leading-relaxed text-text-secondary">
          Continue your project planning journey. Build your team or jump straight into project ideation.
        </p>

        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <div className="rounded-xl border border-border bg-background p-5 hover:border-primary transition-colors">
            <Users size={24} className="text-primary" />
            <h3 className="mt-3 text-lg font-semibold text-text-primary">
              Team Management
            </h3>
            <p className="mt-1 text-sm text-text-muted mb-4">
              Create a new team, invite peers, or join an existing team.
            </p>
            <Link
              to="/teams"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Go to Teams →
            </Link>
          </div>

          <div className="rounded-xl border border-border bg-background p-5 hover:border-primary transition-colors">
            <Rocket size={24} className="text-secondary" />
            <h3 className="mt-3 text-lg font-semibold text-text-primary">
              Project Ideation
            </h3>
            <p className="mt-1 text-sm text-text-muted mb-4">
              Use AI to brainstorm ideas and generate a structured project blueprint.
            </p>
            <Link
              to="/project/setup"
              className="text-sm font-medium text-primary hover:text-primary-dark"
            >
              Start Project Setup →
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

export default HomePage;