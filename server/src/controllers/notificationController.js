import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
} from "../services/notificationService.js";

export const getNotifications = async (req, res, next) => {
  try {
    const [notifications, unreadCount] = await Promise.all([
      getUserNotifications(req.user._id),
      getUnreadCount(req.user._id),
    ]);
    res.status(200).json({ success: true, notifications, unreadCount });
  } catch (error) {
    next(error);
  }
};

export const getUnread = async (req, res, next) => {
  try {
    const unreadCount = await getUnreadCount(req.user._id);
    res.status(200).json({ success: true, unreadCount });
  } catch (error) {
    next(error);
  }
};

export const markRead = async (req, res, next) => {
  try {
    const notification = await markAsRead(req.params.id, req.user._id);
    res.status(200).json({ success: true, notification });
  } catch (error) {
    next(error);
  }
};

export const markAllRead = async (req, res, next) => {
  try {
    await markAllAsRead(req.user._id);
    res.status(200).json({ success: true, message: "All notifications marked as read" });
  } catch (error) {
    next(error);
  }
};