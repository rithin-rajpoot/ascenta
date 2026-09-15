import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { LogOut, Sparkles, User as UserIcon, Bell } from "lucide-react";
import { logout } from "../store/slices/authSlice";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  toggleOpen,
  closePanel,
} from "../store/slices/notificationSlice";

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
  const { notifications, unreadCount, open } = useSelector((state) => state.notification);

  // Load notifications and refresh the unread badge periodically.
  useEffect(() => {
    if (!user) return undefined;
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 30000);
    return () => clearInterval(interval);
  }, [dispatch, user]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) dispatch(markNotificationRead(notification._id));
    dispatch(closePanel());
    if (notification.link) navigate(notification.link);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate("/");
  };

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
                {user && (
                  <div className="relative">
                    <button
                      onClick={() => dispatch(toggleOpen())}
                      className="relative rounded-lg px-2.5 py-2 text-text-secondary transition-colors hover:bg-surface hover:text-text-primary"
                      title="Notifications"
                    >
                      <Bell size={18} />
                      {unreadCount > 0 && (
                        <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-error px-1 text-[10px] font-bold text-white">
                          {unreadCount > 9 ? "9+" : unreadCount}
                        </span>
                      )}
                    </button>

                    {open && (
                      <>
                        <div
                          className="fixed inset-0 z-40"
                          onClick={() => dispatch(closePanel())}
                        />
                        <div className="absolute right-0 z-50 mt-2 w-80 rounded-xl border border-border bg-surface shadow-lg">
                          <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
                            <p className="text-sm font-semibold text-text-primary">Notifications</p>
                            {unreadCount > 0 && (
                              <button
                                onClick={() => dispatch(markAllNotificationsRead())}
                                className="text-xs font-medium text-primary hover:underline"
                              >
                                Mark all read
                              </button>
                            )}
                          </div>
                          <div className="max-h-80 overflow-y-auto">
                            {notifications.length === 0 ? (
                              <p className="px-4 py-8 text-center text-sm text-text-muted">
                                No notifications yet.
                              </p>
                            ) : (
                              notifications.map((n) => (
                                <button
                                  key={n._id}
                                  onClick={() => handleNotificationClick(n)}
                                  className={`block w-full border-b border-border px-4 py-3 text-left transition-colors last:border-0 hover:bg-background ${
                                    n.read ? "opacity-60" : ""
                                  }`}
                                >
                                  <span className="flex items-start gap-2">
                                    {!n.read && (
                                      <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-primary" />
                                    )}
                                    <span>
                                      <span className="block text-sm font-medium text-text-primary">
                                        {n.title}
                                      </span>
                                      {n.message && (
                                        <span className="mt-0.5 block text-xs text-text-secondary">
                                          {n.message}
                                        </span>
                                      )}
                                      <span className="mt-1 block text-[11px] text-text-muted">
                                        {new Date(n.createdAt).toLocaleString(undefined, {
                                          month: "short",
                                          day: "numeric",
                                          hour: "2-digit",
                                          minute: "2-digit",
                                        })}
                                      </span>
                                    </span>
                                  </span>
                                </button>
                              ))
                            )}
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                )}
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

      <main className="mx-auto max-w-6xl px-4 py-8 sm:px-6">
        <Outlet />
      </main>
    </div>
  );
}

export default MainLayout;