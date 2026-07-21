"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/auth.store";
import { AuthService } from "@/services/auth.service";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isAuthenticated, isLoading, user, setAuth, setLoading, clearAuth } =
    useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user) {
      setLoading(false);
      return;
    }

    const restoreSession = async () => {
      try {
        const { accessToken } = await AuthService.refresh();
        if (user) {
          setAuth(accessToken, user);
        } else {
          clearAuth();
          router.push("/login");
        }
      } catch {
        clearAuth();
        router.push("/login");
      }
    };

    restoreSession();
  }, [isAuthenticated, user, setLoading, setAuth, clearAuth, router]);

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
