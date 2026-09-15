import Notification from "../models/Notification.js";

// Never let notification side effects break the primary flow — callers wrap
// events with this helper.
const safe = (fn) => {
  Promise.resolve()
    .then(fn)
    .catch((err) => console.error("[Notification] failed:", err.message));
};

export const createNotification = (data) => Notification.create(data);

// Fire-and-forget creation that cannot throw for the caller.
export const notify = (data) => safe(() => createNotification(data));

export const notifyMany = (recipients, data) => {
  const unique = [...new Set(recipients.map(String))].filter(Boolean);
  for (const userId of unique) {
    safe(() => createNotification({ ...data, user: userId }));
  }
};

export const getUserNotifications = (userId, limit = 30) =>
  Notification.find({ user: userId }).sort("-createdAt").limit(limit).populate("project", "title");

export const getUnreadCount = (userId) =>
  Notification.countDocuments({ user: userId, read: false });

export const markAsRead = async (notificationId, userId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, user: userId },
    { read: true },
    { new: true }
  );
  if (!notification) {
    const error = new Error("Notification not found");
    error.status = 404;
    throw error;
  }
  return notification;
};

export const markAllAsRead = (userId) =>
  Notification.updateMany({ user: userId, read: false }, { read: true });