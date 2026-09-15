import toast from "react-hot-toast";

/**
 * Translate any API/network error into a human-readable sentence.
 * Follows DESIGN.md §29 (Error States) — never surface raw HTTP codes.
 */
export function getErrorMessage(error) {
  const data = error?.response?.data;
  const status = error?.response?.status;

  if (typeof data === "string" && data.trim()) return data;
  if (data?.message) return data.message;
  if (data?.error) return data.error;

  if (!error?.response) {
    return "Can't reach the Ascenta server. Check your connection and try again.";
  }

  switch (status) {
    case 400:
      return "Some of the information you submitted isn't valid. Please review it and try again.";
    case 401:
      return "Your session has expired. Please sign in again.";
    case 403:
      return "You don't have permission to perform this action.";
    case 404:
      return "We couldn't find what you were looking for.";
    case 409:
      return "That action conflicts with existing data. Please refresh and try again.";
    default:
      if (status >= 500) {
        return "Something went wrong on our side. Please try again in a moment.";
      }
      return "Something went wrong. Please try again.";
  }
}

const baseOptions = { duration: 4000 };

export function notifySuccess(message, options = {}) {
  return toast.success(message, { ...baseOptions, ...options });
}

export function notifyError(message, options = {}) {
  return toast.error(message, { ...baseOptions, duration: 5000, ...options });
}

export function notifyInfo(message, options = {}) {
  return toast(message, { ...baseOptions, ...options });
}

/**
 * Show an error toast for a failed request.
 * The backend message (when present) wins, otherwise the caller's
 * context-specific fallback is used, otherwise a generic friendly message.
 */
export function notifyErrorFrom(error, fallback) {
  if (typeof error === "string" && error.trim()) return notifyError(error);

  const detailed =
    (typeof error?.response?.data === "string" && error.response.data) ||
    error?.response?.data?.message ||
    error?.response?.data?.error;

  return notifyError(detailed || fallback || getErrorMessage(error));
}

export { toast };
