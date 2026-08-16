"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { AuthService } from "@/services/auth.service";

/**
 * Authentication boundary for the user area.
 *
 * The session is restored SERVER-SIDE: GET /auth/me is answered by NestJS
 * after it validates the HttpOnly session cookie. The client only renders
 * what the API says; there is no token to check locally and no client-side
 * decision that can bypass the backend.
 *
 * An ADMIN session is bounced to /admin — the user dashboard is for
 * regular users only.
 */
export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, setAuth, setLoading, clearAuth } =
    useAuthStore();

  const restoreSession = useCallback(async () => {
    if (isAuthenticated && user) {
      setLoading(false);
      if (user.role === "ADMIN") {
        router.push("/admin");
      }
      return;
    }

    try {
      const meResponse = await AuthService.me();
      if (meResponse.data.user.role === "ADMIN") {
        setAuth(meResponse.data.user, meResponse.data.csrfToken);
        setLoading(false);
        router.push("/admin");
        return;
      }
      setAuth(meResponse.data.user, meResponse.data.csrfToken);
    } catch {
      const redirect = useAuthStore.getState().logoutRedirect;
      useAuthStore.getState().setLogoutRedirect(null);
      clearAuth();
      router.push(redirect ?? "/login");
    }
  }, [isAuthenticated, user, setAuth, setLoading, clearAuth, router]);

  useEffect(() => {
    restoreSession();
  }, [restoreSession]);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent" />
      </div>
    );
  }

  if (!isAuthenticated || !user) {
    return null;
  }

  return <>{children}</>;
}