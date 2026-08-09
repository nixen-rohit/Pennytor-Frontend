"use client";

import { useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { AuthService } from "@/services/auth.service";

export default function AdminGuard({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const {
    isAuthenticated,
    isLoading,
    user,
    restoreAuth,
    setLoading,
    clearAuth,
  } = useAuthStore();

  const restoreSession = useCallback(async () => {
    if (isAuthenticated && user) {
      setLoading(false);
      if (user.role !== "ADMIN") {
        router.push("/dashboard");
      }
      return;
    }

    try {
      const refreshResponse = await AuthService.refresh();
      const accessToken = refreshResponse.data.accessToken;
      if (user) {
        restoreAuth(accessToken, user);
        if (user.role !== "ADMIN") {
          router.push("/dashboard");
        }
        return;
      }
    } catch {
      // refresh failed — not authenticated
    }
    clearAuth();
    router.push("/login");
  }, [isAuthenticated, user, restoreAuth, setLoading, clearAuth, router]);

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
