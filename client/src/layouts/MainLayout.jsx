import { NavLink, Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-light text-primary-dark"
      : "text-text-secondary hover:bg-surface hover:text-text-primary"
  }`;

function MainLayout() {
  return (
    <div className="min-h-screen bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Sparkles size={18} />
            </span>
            <span className="text-lg font-bold text-text-primary">Ascenta</span>
          </NavLink>

          <nav className="flex items-center gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>
          </nav>
        </div>
      </header>

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;