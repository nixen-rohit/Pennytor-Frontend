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

let isRefreshing = false;
let pendingRequests: Array<{
  resolve: (token: string) => void;
  reject: (err: unknown) => void;
}> = [];

async function refreshAccessToken(): Promise<string> {
  if (isRefreshing) {
    return new Promise((resolve, reject) => {
      pendingRequests.push({ resolve, reject });
    });
  }

  isRefreshing = true;
  try {
    const response = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
    });

    if (!response.ok) {
      throw new ApiError(response.status, "Refresh failed");
    }

    const data = await response.json();
    const newToken = data.accessToken;

    useAuthStore.getState().setAccessToken(newToken);

    pendingRequests.forEach(({ resolve }) => resolve(newToken));
    pendingRequests = [];

    return newToken;
  } catch (err) {
    pendingRequests.forEach(({ reject }) => reject(err));
    pendingRequests = [];
    useAuthStore.getState().clearAuth();
    if (typeof window !== "undefined") {
      window.location.href = "/login";
    }
    throw err;
  } finally {
    isRefreshing = false;
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
    credentials: "include",
  });

  if (response.status === 401 && !endpoint.includes("/auth/refresh")) {
    try {
      const newToken = await refreshAccessToken();
      headers.set("Authorization", `Bearer ${newToken}`);

      const retryResponse = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers,
        credentials: "include",
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
