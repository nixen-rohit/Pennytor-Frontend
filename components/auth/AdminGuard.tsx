"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { AuthService } from "@/services/auth.service";

/**
 * Admin-area boundary. Same server-side restore as AuthGuard, plus a role
 * check. The role check here only decides WHAT TO RENDER — the NestJS API
 * independently enforces @Roles(Role.ADMIN) on every admin endpoint, so a
 * forged client state can never reach admin data.
 */
export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, setAuth, setLoading, clearAuth } =
    useAuthStore();

  const restoreSession = useCallback(async () => {
    if (isAuthenticated && user) {
      setLoading(false);
      if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
      return;
    }

    try {
      const meResponse = await AuthService.me();
      setAuth(meResponse.data.user, meResponse.data.csrfToken);
      if (meResponse.data.user.role !== "ADMIN") {
        router.push("/dashboard");
      }
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

  if (!isAuthenticated || !user || user.role !== "ADMIN") {
    return null;
  }

  return <>{children}</>;
}