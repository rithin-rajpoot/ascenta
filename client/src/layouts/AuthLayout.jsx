import { Link, Outlet } from "react-router-dom";
import { Sparkles } from "lucide-react";

function AuthLayout() {
  return (
    <div className="flex min-h-screen flex-col bg-background">
      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-4 py-4 sm:px-6">
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Sparkles size={18} />
            </span>
            <span className="text-lg font-bold text-text-primary">Ascenta</span>
          </Link>
        </div>
      </header>

      <main className="flex flex-1 items-center justify-center px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default AuthLayout;