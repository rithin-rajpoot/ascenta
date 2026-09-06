import { Link, useLocation } from "react-router-dom";
import { Sparkles, Edit3, ArrowLeft } from "lucide-react";

function ProjectSetupPage() {
  const location = useLocation();
  const teamId = location.state?.teamId || null;

  const linkState = teamId ? { teamId } : undefined;

  return (
    <div className="mx-auto max-w-4xl">
      <Link
        to="/teams"
        className="inline-flex items-center gap-1.5 text-sm font-medium text-text-secondary hover:text-text-primary"
      >
        <ArrowLeft size={16} />
        Back to Teams
      </Link>

      <div className="mt-8 text-center">
        <h1 className="text-3xl font-bold text-text-primary">Create Your Project</h1>
        <p className="mt-3 text-text-secondary">
          How would you like to start?
        </p>
      </div>

      <div className="mt-12 grid gap-6 sm:grid-cols-2">
        <div className="flex flex-col rounded-2xl border border-border bg-surface p-8 shadow-sm transition-all hover:border-primary hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Sparkles size={24} />
          </div>
          <h2 className="mt-6 text-xl font-bold text-text-primary">
            Generate an Idea with AI
          </h2>
          <p className="mt-2 flex-1 text-sm text-text-secondary">
            I need help finding a suitable project idea based on my interests and preferred technologies.
          </p>
          <Link
            to={{ pathname: "/project/ideas", state: linkState }}
            className="mt-8 inline-flex justify-center rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
          >
            Generate Ideas
          </Link>
        </div>

        <div className="flex flex-col rounded-2xl border border-border bg-surface p-8 shadow-sm transition-all hover:border-primary hover:shadow-md">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
            <Edit3 size={24} />
          </div>
          <h2 className="mt-6 text-xl font-bold text-text-primary">
            I Already Have an Idea
          </h2>
          <p className="mt-2 flex-1 text-sm text-text-secondary">
            I already know what I want to build and want to create a structured project blueprint.
          </p>
          <Link
            to={{ pathname: "/project/blueprint", state: linkState }}
            className="mt-8 inline-flex justify-center rounded-lg border border-border bg-background px-4 py-2.5 text-sm font-medium text-text-primary transition-colors hover:bg-surface"
          >
            Use My Idea
          </Link>
        </div>
      </div>
    </div>
  );
}

export default ProjectSetupPage;
