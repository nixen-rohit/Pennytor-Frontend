import { useAuthStore } from "@/store/auth.store";

export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(
    public status: number,
    message: string,
  ) {
    super(message);
    this.name = "ApiError";
  }
}

const MUTATING_METHODS = new Set(["POST", "PUT", "PATCH", "DELETE"]);

/**
 * Central API client.
 *
 * - Authentication is entirely cookie-based (`sid` HttpOnly cookie set by
 *   the backend). `credentials: "include"` makes the browser attach it;
 *   there is NO Authorization header and NO token in JavaScript.
 * - Every state-changing request also sends the CSRF token issued by the
 *   backend at login / /auth/me (see CsrfGuard on the API side).
 * - On 401 the in-memory session state is cleared; the AuthGuard wrapper
 *   reacts by redirecting to /login. API failures are never a security
 *   decision by themselves.
 */
export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const method = (options.method || "GET").toUpperCase();

  if (MUTATING_METHODS.has(method)) {
    const csrfToken = useAuthStore.getState().csrfToken;
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
    credentials: "include",
    cache: "no-store",
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    // A dead/expired/revoked session is a full logout: drop the in-memory
    // user. The guards watch the store and redirect.
    if (response.status === 401) {
      useAuthStore.getState().clearAuth();
    }
    throw new ApiError(
      response.status,
      data?.message || "Something went wrong",
    );
  }

  return data as T;
}

export function handleApiError(
  err: unknown,
  setErrorMsg: (msg: string) => void,
  customMessages: Record<number, string> = {},
) {
  if (err instanceof ApiError) {
    const custom = customMessages[err.status];
    if (custom) {
      setErrorMsg(custom);
      return;
    }
    switch (err.status) {
      case 400:
        setErrorMsg(
          err.message ||
            "Invalid details. Please check your information and try again.",
        );
        break;
      case 401:
        setErrorMsg("You are not authorized. Please log in again.");
        break;
      case 403:
        setErrorMsg(
          "Access denied. You do not have permission to perform this action.",
        );
        break;
      case 404:
        setErrorMsg("Resource not found. Please try again.");
        break;
      case 409:
        setErrorMsg(
          "A conflict occurred. Please check your information and try again.",
        );
        break;
      case 410:
        setErrorMsg("This link or code has expired. Please request a new one.");
        break;
      case 422:
        setErrorMsg("Some fields are invalid. Please review your information.");
        break;
      case 429:
        setErrorMsg("Too many attempts. Please wait a moment and try again.");
        break;
      case 500:
      case 502:
      case 503:
        setErrorMsg("Server error. Please try again later.");
        break;
      default:
        setErrorMsg(err.message || "Something went wrong. Please try again.");
    }
  } else {
    setErrorMsg(
      "Unable to connect. Please check your internet connection and try again.",
    );
  }
}