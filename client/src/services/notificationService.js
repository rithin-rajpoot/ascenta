import api from "./api";

// --- Notifications (Phase 10) ---

export const getNotifications = async () => {
  const { data } = await api.get("/notifications");
  return data;
};

export const getUnreadCount = async () => {
  const { data } = await api.get("/notifications/unread");
  return data;
};

export const markAsRead = async (id) => {
  const { data } = await api.put(`/notifications/${id}/read`);
  return data;
};

export const markAllAsRead = async () => {
  const { data } = await api.put("/notifications/read-all");
  return data;
};