"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import LoginForm from "./LoginForm";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { AuthService } from "@/services/auth.service";
import { useAuthStore } from "@/store/auth.store";
import { handleApiError } from "@/services/api";

export default function LoginPage() {
  const router = useRouter();
  const setAuth = useAuthStore((s) => s.setAuth);

  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSignIn = async (data: LoginFormValues) => {
    setFormLoading(true);
    setErrorMsg("");

    try {
      const response = await AuthService.login(data);
      // The HttpOnly `sid` cookie was set by the API; only the user object
      // and the CSRF token ever touch the client.
      setAuth(response.data.user, response.data.csrfToken);
      router.push(response.data.user.role === "ADMIN" ? "/admin" : "/dashboard");
    } catch (err) {
      handleApiError(err, setErrorMsg);
    } finally {
      setFormLoading(false);
    }
  };

  const handleResetPassword = () => {
    router.push("/forgot-password");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="flex h-screen bg-white/95">
      {/* Left Side - Fixed */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-1/2">
        <AuthBanner />
      </div>

      {/* Right Side - Scrollable */}
      <div className="w-full lg:ml-[50%] lg:w-1/2 h-screen overflow-y-auto ">
        <div className="flex min-h-screen items-center justify-center p-8">
          <LoginForm
            form={form}
            onSubmit={handleSignIn}
            formLoading={formLoading}
            errorMsg={errorMsg}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onResetPassword={handleResetPassword}
            onRegister={handleRegister}
          />
        </div>
      </div>
    </div>
  );
}
