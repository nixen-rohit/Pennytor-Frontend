import { create } from "zustand";
import type { User } from "@/types/auth";

const USER_STORAGE_KEY = "pennytor_user";

const AUTH_COOKIE_NAME = "auth_session";
const AUTH_COOKIE_PATH = "/";
const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

function setAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=true;path=${AUTH_COOKIE_PATH};max-age=${AUTH_COOKIE_MAX_AGE};sameSite=lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=;path=${AUTH_COOKIE_PATH};max-age=0;sameSite=lax`;
}

function loadUser(): User | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(USER_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as User) : null;
  } catch {
    return null;
  }
}

function saveUser(user: User | null) {
  if (typeof window === "undefined") return;
  if (user) {
    localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(user));
  } else {
    localStorage.removeItem(USER_STORAGE_KEY);
  }
}

interface AuthState {
  accessToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (accessToken: string, user: User, persistSession?: boolean) => void;
  setAccessToken: (token: string) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  accessToken: null,
  user: loadUser(),
  isAuthenticated: false,
  isLoading: true,

  setAuth: (accessToken, user, persistSession = true) => {
    if (persistSession) {
      saveUser(user);
      setAuthCookie();
    }
    set({ accessToken, user, isAuthenticated: true, isLoading: false });
  },

  setAccessToken: (token) => set({ accessToken: token }),

  clearAuth: () => {
    saveUser(null);
    clearAuthCookie();
    set({
      accessToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));
