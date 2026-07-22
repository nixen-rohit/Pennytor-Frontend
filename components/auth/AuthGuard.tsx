"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { AuthService } from "@/services/auth.service";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, setAuth, setLoading, clearAuth } =
    useAuthStore();

  const restoreSession = useCallback(async () => {
    if (isAuthenticated && user) {
      setLoading(false);
      return;
    }

    try {
      const refreshResponse = await AuthService.refresh();
      const accessToken = refreshResponse.data.accessToken;
      if (user) {
        setAuth(accessToken, user);
        return;
      }
    } catch {
      // refresh failed — not authenticated
    }
    clearAuth();
    router.push("/login");
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
