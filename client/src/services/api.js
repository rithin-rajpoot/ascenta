import axios from "axios";
import { notifyError } from "../utils/toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Attach JWT token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Guards so a burst of failing requests only reports the problem once.
let sessionExpiredHandled = false;
let lastNetworkErrorAt = 0;

/**
 * Central safety net for failed requests:
 * - expired/invalid sessions clear local auth and return the user to login
 * - unreachable backend produces one friendly toast (never a raw HTTP code)
 */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status;

    if (status === 401) {
      const hadToken = Boolean(localStorage.getItem("token"));
      localStorage.removeItem("token");
      localStorage.removeItem("user");

      if (hadToken && !sessionExpiredHandled) {
        sessionExpiredHandled = true;
        notifyError("Your session has expired. Please sign in again.");

        const { pathname } = window.location;
        if (pathname !== "/login" && pathname !== "/register") {
          window.location.assign("/login");
        }
      }
    } else if (!error?.response) {
      const now = Date.now();
      if (now - lastNetworkErrorAt > 8000) {
        lastNetworkErrorAt = now;
        notifyError(
          "Can't reach the Ascenta server. Check your connection and try again."
        );
      }
    }

    return Promise.reject(error);
  }
);

export default api;