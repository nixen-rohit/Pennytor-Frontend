import { useAuthStore } from "@/store/auth.store";

/**
 * Full API base INCLUDING the `/api` prefix. The env key only needs the
 * host (e.g. `https://pennytor-backend.onrender.com` or
 * `http://localhost:3001`) — this normalizes the trailing part so callers
 * never have to write `/api` themselves.
 */
const rawApiUrl = process.env.NEXT_PUBLIC_API_URL;
export const API_URL = rawApiUrl
  ? `${rawApiUrl.replace(/\/+$/, "")}${rawApiUrl.endsWith("/api") ? "" : "/api"}`
  : "";

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

  const armCsrf = () => {
    const csrfToken = useAuthStore.getState().csrfToken;
    if (csrfToken) {
      headers.set("X-CSRF-Token", csrfToken);
    }
  };

  if (MUTATING_METHODS.has(method)) {
    armCsrf();
  }

  const send = () =>
    fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
      credentials: "include",
      cache: "no-store",
    });

  let response = await send();

  // A stale CSRF token (e.g. one rotated by a newer /auth/me response that
  // the store never saw) 403s the first mutation. Re-arm the token from the
  // server and retry the request once.
  if (response.status === 403 && MUTATING_METHODS.has(method)) {
    try {
      const meResponse = await fetch(`${API_URL}/auth/me`, {
        credentials: "include",
        cache: "no-store",
      });
      const meData = await meResponse.json().catch(() => null);
      const freshToken = meData?.data?.csrfToken;
      if (meResponse.ok && freshToken) {
        useAuthStore.getState().setCsrfToken(freshToken);
        armCsrf();
        response = await send();
      }
    } catch {
      // Network failure while re-arming — fall through with the original 403.
    }
  }

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