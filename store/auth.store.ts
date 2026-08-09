import { create } from "zustand";
import type { User } from "@/types/auth";

const SESSION_STORAGE_KEY = "pennytor_session";

const AUTH_COOKIE_NAME = "auth_session";
const AUTH_COOKIE_PATH = "/";
const AUTH_COOKIE_MAX_AGE = 30 * 24 * 60 * 60; // 30 days

interface StoredSession {
  accessToken: string;
  refreshToken: string;
  user: User;
}

function setAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=true;path=${AUTH_COOKIE_PATH};max-age=${AUTH_COOKIE_MAX_AGE};sameSite=lax`;
}

function clearAuthCookie() {
  if (typeof document === "undefined") return;
  document.cookie = `${AUTH_COOKIE_NAME}=;path=${AUTH_COOKIE_PATH};max-age=0;sameSite=lax`;
}

function loadSession(): StoredSession | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(SESSION_STORAGE_KEY);
    return raw ? (JSON.parse(raw) as StoredSession) : null;
  } catch {
    return null;
  }
}

function saveSession(session: StoredSession | null) {
  if (typeof window === "undefined") return;
  if (session) {
    localStorage.setItem(SESSION_STORAGE_KEY, JSON.stringify(session));
  } else {
    localStorage.removeItem(SESSION_STORAGE_KEY);
  }
}

interface AuthState {
  accessToken: string | null;
  refreshToken: string | null;
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setAuth: (accessToken: string, refreshToken: string, user: User) => void;
  setTokens: (accessToken: string, refreshToken: string) => void;
  restoreAuth: (accessToken: string, user: User) => void;
  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
}

const initialSession = loadSession();

export const useAuthStore = create<AuthState>((set, get) => ({
  accessToken: initialSession?.accessToken ?? null,
  refreshToken: initialSession?.refreshToken ?? null,
  user: initialSession?.user ?? null,
  isAuthenticated: false,
  isLoading: true,

  setAuth: (accessToken, refreshToken, user) => {
    saveSession({ accessToken, refreshToken, user });
    setAuthCookie();
    set({
      accessToken,
      refreshToken,
      user,
      isAuthenticated: true,
      isLoading: false,
    });
  },

  setTokens: (accessToken, refreshToken) => {
    const { user } = get();
    if (user) {
      saveSession({ accessToken, refreshToken, user });
    }
    set({ accessToken, refreshToken });
  },

  restoreAuth: (accessToken, user) => {
    set({ accessToken, user, isAuthenticated: true, isLoading: false });
  },

  clearAuth: () => {
    saveSession(null);
    clearAuthCookie();
    set({
      accessToken: null,
      refreshToken: null,
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  },

  setLoading: (isLoading) => set({ isLoading }),
}));