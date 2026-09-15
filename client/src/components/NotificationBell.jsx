import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Bell } from "lucide-react";
import {
  fetchNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  toggleOpen,
  closePanel,
} from "../store/slices/notificationSlice";

/**
 * Notification bell + dropdown panel.
 * Self-contained so it can be dropped into any header (desktop nav / mobile bar).
 * Polls the unread badge every 30s while the user is signed in.
 */
function NotificationBell() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { notifications, unreadCount, open } = useSelector((state) => state.notification);

  useEffect(() => {
    dispatch(fetchNotifications());
    const interval = setInterval(() => dispatch(fetchNotifications()), 30000);
    return () => clearInterval(interval);
  }, [dispatch]);

  // Accessibility: the panel can be dismissed with Escape.
  useEffect(() => {
    if (!open) return undefined;
    const onKeyDown = (event) => {
      if (event.key === "Escape") dispatch(closePanel());
    };
    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [open, dispatch]);

  const handleNotificationClick = (notification) => {
    if (!notification.read) dispatch(markNotificationRead(notification._id));
    dispatch(closePanel());
    if (notification.link) navigate(notification.link);
  };

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => dispatch(toggleOpen())}
        aria-label={
          unreadCount > 0 ? `Notifications, ${unreadCount} unread` : "Notifications"
        }
        aria-haspopup="dialog"
        aria-expanded={open}
        className="relative rounded-lg px-2.5 py-2 text-text-secondary transition-colors hover:bg-background hover:text-text-primary"
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
          <div className="fixed inset-0 z-40" onClick={() => dispatch(closePanel())} />
          <div
            role="dialog"
            aria-label="Notifications"
            className="absolute right-0 z-50 mt-2 w-80 max-w-[calc(100vw-2rem)] rounded-xl border border-border bg-surface shadow-lg"
          >
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
                  You're all caught up. Invites, task assignments, deadlines and faculty
                  feedback will appear here.
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
  );
}

export default NotificationBell;