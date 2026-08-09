import { create } from "zustand";
import type { User } from "@/types/auth";

/**
 * Auth state lives ENTIRELY in memory. There is deliberately no token or
 * session identifier in localStorage/sessionStorage: the server-side
 * session is carried by an HttpOnly cookie that JavaScript cannot read,
 * so reloading the page restores auth through GET /auth/me, never through
 * a client-held secret.
 */

const AUTH_COOKIE_NAME = "auth_session";
const AUTH_COOKIE_PATH = "/";
const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

/**
 * UI-only marker cookie read by Next.js middleware/proxy to decide the
 * login redirect BEFORE the client bundle loads. It is NOT a security
 * boundary — the NestJS API independently authenticates every request.
 */
export function setAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=true;path=${AUTH_COOKIE_PATH};max-age=${AUTH_COOKIE_MAX_AGE};sameSite=lax`;
}

export function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=;path=${AUTH_COOKIE_PATH};max-age=0;sameSite=lax`;
}

interface AuthState {
  user: User | null;
  csrfToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (user: User, csrfToken: string) => void;
  setCsrfToken: (csrfToken: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  csrfToken: null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (user, csrfToken) => {
    setAuthCookie();
    set({
      user,
      csrfToken,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setCsrfToken: (csrfToken) => set({ csrfToken }),

  clearAuth: () => {
    clearAuthCookie();
    set({
      user: null,
      csrfToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));