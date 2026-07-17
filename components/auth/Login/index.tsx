"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import LoginForm from "./LoginForm";
import { loginSchema, type LoginFormValues } from "@/lib/validations";
import { AuthService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);

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

      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }

        if (response.data.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }

        router.push("/dashboard");
      } else {
        setErrorMsg("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during login.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleGoogleSignIn = () => {
    setErrorMsg("Google sign-in is disabled in prototype mode.");
  };

  const handleResetPassword = () => {
    router.push("/forgot-password");
  };

  const handleRegister = () => {
    router.push("/register");
  };

  return (
    <div className="flex h-screen">
      {/* Left Side - Fixed */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-1/2">
        <AuthBanner />
      </div>

      {/* Right Side - Scrollable */}
      <div className="w-full lg:ml-[50%] lg:w-1/2 h-screen overflow-y-auto bg-white">
        <div className="flex min-h-screen items-center justify-center p-8">
          <LoginForm
            form={form}
            onSubmit={handleSignIn}
            formLoading={formLoading}
            errorMsg={errorMsg}
            showPassword={showPassword}
            keepSignedIn={keepSignedIn}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onToggleKeepSignedIn={() => setKeepSignedIn(!keepSignedIn)}
            onResetPassword={handleResetPassword}
            onGoogleSignIn={handleGoogleSignIn}
            onRegister={handleRegister}
          />
        </div>
      </div>
    </div>
  );
}
