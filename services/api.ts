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

/**
 * Single-flight refresh: every caller (fetchApi 401 handler, AuthGuard,
 * AdminGuard) shares ONE refresh request. The backend rotates the refresh
 * token on every call, so concurrent refreshes would invalidate each other.
 */
let refreshPromise: Promise<string> | null = null;

export function refreshSession(): Promise<string> {
  if (!refreshPromise) {
    refreshPromise = refreshAccessToken().finally(() => {
      refreshPromise = null;
    });
  }
  return refreshPromise;
}

async function refreshAccessToken(): Promise<string> {
  const { refreshToken } = useAuthStore.getState();
  if (!refreshToken) {
    throw new ApiError(401, "No refresh token available");
  }

  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ refreshToken }),
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Refresh failed");
    }

    const data = await response.json();
    const newToken = data.data.accessToken;
    const newRefreshToken = data.data.refreshToken;

    useAuthStore.getState().setTokens(newToken, newRefreshToken);

    return newToken;
  } catch (err) {
    useAuthStore.getState().clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw err;
  }
}

export async function fetchApi<T = unknown>(
  endpoint: string,
  options: RequestInit = {},
): Promise<T> {
  const headers = new Headers(options.headers || {});
  headers.set("Content-Type", "application/json");

  const token = useAuthStore.getState().accessToken;
  if (token) {
    headers.set("Authorization", `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
    try {
      const newToken = await refreshSession();
      headers.set("Authorization", `Bearer ${newToken}`);

      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
      });

      const retryData = await retryResponse.json().catch(() => null);

      if (!retryResponse.ok) {
        throw new ApiError(
          retryResponse.status,
          retryData?.message || "Something went wrong",
        );
      }

      return retryData as T;
    } catch {
      // refresh failed or retry failed — re-throw
    }
  }

  const data = await response.json().catch(() => null);

  if (!response.ok) {
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
