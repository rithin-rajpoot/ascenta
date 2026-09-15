import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import * as notificationService from "../../services/notificationService";

const initialState = {
  notifications: [],
  unreadCount: 0,
  isLoading: false,
  error: null,
  open: false,
};

export const fetchNotifications = createAsyncThunk(
  "notification/fetch",
  async (_, { rejectWithValue }) => {
    try {
      return await notificationService.getNotifications();
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to load notifications");
    }
  }
);

export const markNotificationRead = createAsyncThunk(
  "notification/markRead",
  async (id, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(id);
      return id;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark as read");
    }
  }
);

export const markAllNotificationsRead = createAsyncThunk(
  "notification/markAllRead",
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return true;
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || "Failed to mark all as read");
    }
  }
);

const notificationSlice = createSlice({
  name: "notification",
  initialState,
  reducers: {
    toggleOpen: (state) => {
      state.open = !state.open;
    },
    closePanel: (state) => {
      state.open = false;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNotifications.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.isLoading = false;
        state.notifications = action.payload.notifications;
        state.unreadCount = action.payload.unreadCount;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      })
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.notifications = state.notifications.map((n) =>
          n._id === action.payload ? { ...n, read: true } : n
        );
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      })
      .addCase(markAllNotificationsRead.fulfilled, (state) => {
        state.notifications = state.notifications.map((n) => ({ ...n, read: true }));
        state.unreadCount = 0;
      });
  },
});

export const { toggleOpen, closePanel } = notificationSlice.actions;
export default notificationSlice.reducer;