import { Link } from "react-router-dom";
import { Users, UserPlus, User } from "lucide-react";

const options = [
  {
    title: "Create a Team",
    description: "Create your own team and invite teammates.",
    action: "Create Team",
    to: "/team/create",
    icon: Users,
  },
  {
    title: "Join a Team",
    description: "Join an existing team.",
    action: "Join Team",
    to: "/team/join",
    icon: UserPlus,
  },
  {
    title: "Solo Project",
    description: "Work individually on your academic project.",
    action: "Continue",
    to: "/",
    icon: User,
  },
];

function TeamSetupPage() {
  return (
    <div className="mx-auto max-w-4xl">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-text-primary">
          How do you want to work?
        </h1>
        <p className="mt-2 text-text-secondary">
          Choose how you want to structure your academic project.
        </p>
      </div>

      <div className="mt-8 grid gap-6 sm:grid-cols-3">
        {options.map(({ title, description, action, to, icon: Icon }) => (
          <Link
            key={title}
            to={to}
            className="group rounded-2xl border border-border bg-surface p-6 shadow-sm transition-colors hover:border-primary"
          >
            <span className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary-light text-primary">
              <Icon size={24} />
            </span>
            <h2 className="mt-4 text-lg font-semibold text-text-primary">
              {title}
            </h2>
            <p className="mt-1 text-sm text-text-secondary">{description}</p>
            <span className="mt-4 inline-block text-sm font-medium text-primary group-hover:text-primary-dark">
              {action} →
            </span>
          </Link>
        ))}
      </div>
    </div>
  );
}

export default TeamSetupPage;