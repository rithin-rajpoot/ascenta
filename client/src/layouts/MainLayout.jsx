import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Sparkles, User as UserIcon } from "lucide-react";
import { logout } from "../store/slices/authSlice";
import { notifyInfo } from "../utils/toast";
import NotificationBell from "../components/NotificationBell";

const navLinkClass = ({ isActive }) =>
  `rounded-lg px-3 py-2 text-sm font-medium transition-colors ${
    isActive
      ? "bg-primary-light text-primary-dark"
      : "text-text-secondary hover:bg-surface hover:text-text-primary"
  }`;

function MainLayout() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
    notifyInfo("You've been signed out.");
    navigate("/");
  };

  return (
    <div className="min-h-screen bg-background">
      <a
        href="#main-content"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-50 focus:rounded-lg focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:font-medium focus:text-white"
      >
        Skip to main content
      </a>

      <header className="border-b border-border bg-surface">
        <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-y-2 px-4 py-4 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-white">
              <Sparkles size={18} />
            </span>
            <span className="text-lg font-bold text-text-primary">Ascenta</span>
          </NavLink>

          <nav aria-label="Main navigation" className="flex flex-wrap items-center justify-end gap-1">
            <NavLink to="/" className={navLinkClass} end>
              Home
            </NavLink>
            <NavLink to="/about" className={navLinkClass}>
              About
            </NavLink>

            {user ? (
              <>
                {user.role === "student" && (
                  <>
                    <NavLink to="/dashboard" className={navLinkClass} end={false}>
                      Dashboard
                    </NavLink>
                    <NavLink to="/teams" className={navLinkClass}>
                      Teams
                    </NavLink>
                  </>
                )}
                {user.role === "faculty" && (
                  <NavLink to="/faculty" className={navLinkClass}>
                    Dashboard
                  </NavLink>
                )}
                {user && <NotificationBell />}
                <NavLink to="/profile" className={navLinkClass}>
                  <span className="flex items-center gap-1.5">
                    <UserIcon size={14} />
                    {user.name.split(" ")[0]}
                  </span>
                </NavLink>
                <button
                  onClick={handleLogout}
                  className="ml-1 rounded-lg px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-error-light hover:text-error"
                >
                  <span className="flex items-center gap-1.5">
                    <LogOut size={14} />
                    Logout
                  </span>
                </button>
              </>
            ) : (
              <>
                <NavLink to="/login" className={navLinkClass}>
                  Login
                </NavLink>
                <NavLink
                  to="/register"
                  className="ml-1 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-primary-dark"
                >
                  Register
                </NavLink>
              </>
            )}
          </nav>
        </div>
      </header>

      <main id="main-content" className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;