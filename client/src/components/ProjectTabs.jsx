import { NavLink } from "react-router-dom";

const tabs = [
  { to: (id) => `/project/${id}`, label: "Overview", end: true },
  { to: (id) => `/project/${id}/milestones`, label: "Milestones" },
  { to: (id) => `/project/${id}/tasks`, label: "Tasks" },
  { to: (id) => `/project/${id}/assistant`, label: "AI Assistant" },
];

// Shared project-workspace navigation. Rendered on every project page so
// students can move between the workspace sections from anywhere.
function ProjectTabs({ id }) {
  return (
    <nav className="flex flex-wrap items-center gap-1 rounded-xl border border-border bg-surface p-1.5">
      {tabs.map((tab) => (
        <NavLink
          key={tab.label}
          to={tab.to(id)}
          end={tab.end}
          className={({ isActive }) =>
            `rounded-lg px-3.5 py-2 text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-text-secondary hover:bg-background hover:text-text-primary"
            }`
          }
        >
          {tab.label}
        </NavLink>
      ))}
    </nav>
  );
}

export default ProjectTabs;