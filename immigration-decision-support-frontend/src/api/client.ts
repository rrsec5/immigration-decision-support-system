import axios, { AxiosError } from "axios";
import { toast } from "sonner";

const client = axios.create({
  baseURL: "/api",
  headers: { "Content-Type": "application/json" },
});

// Attach JWT token to every request
client.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  const userId = localStorage.getItem("userId");
  if (userId) {
    config.headers["X-User-Id"] = userId;
  }
  return config;
});

// Global error handling
client.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; error?: string }>) => {
    if (error.response) {
      const status = error.response.status;
      const msg =
        error.response.data?.message ||
        error.response.data?.error ||
        "Something went wrong";

      // =========================
      // 400 — validation / bad request
      // =========================
      if (status === 400) {
        return Promise.reject(new ApiError(msg, status));
      }

      // =========================
      // 401 — unauthorized
      // Only here we logout user
      // =========================
      if (status === 401) {
        // Avoid redirect loop on auth pages
        if (
          window.location.pathname.startsWith("/login") ||
          window.location.pathname.startsWith("/register")
        ) {
          return Promise.reject(new ApiError(msg, status));
        }

        // Clear auth storage
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        localStorage.removeItem("email");
        localStorage.removeItem("profileComplete");

        toast.error("Session expired. Please log in again.");

        window.location.href = "/login";

        return Promise.reject(new ApiError(msg, status));
      }

      // =========================
      // 403 — forbidden
      // Do not logout user
      // =========================
      if (status === 403) {
        toast.error(msg || "Access denied");

        return Promise.reject(new ApiError(msg, status));
      }

      // =========================
      // 409 — conflict
      // =========================
      if (status === 409) {
        return Promise.reject(new ApiError(msg, status));
      }

      // Server errors
      if (status >= 500) {
        toast.error("Server error. Please try again later.");
        return Promise.reject(new ApiError(msg, status));
      }

      // Everything else
      return Promise.reject(new ApiError(msg, status));
    }

    if (error.request) {
      toast.error("Cannot reach the server. Is the backend running?");
    }

    return Promise.reject(error);
  },
);

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

export default client;
