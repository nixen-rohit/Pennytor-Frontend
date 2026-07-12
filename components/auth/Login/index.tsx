"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import LoginForm from "./LoginForm";
import { validateLoginForm, hasErrors } from "./LoginValidation";
import type { LoginFieldErrors } from "./LoginTypes";
import { AuthService } from "@/services/auth.service";

export default function LoginPage() {
  const router = useRouter();

  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [keepSignedIn, setKeepSignedIn] = useState(true);
  const [fieldErrors, setFieldErrors] = useState<LoginFieldErrors>({});

  const handleSignIn = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg("");
    setFieldErrors({});

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );
    const email = formData.email as string;
    const password = formData.password as string;

    const errors = validateLoginForm({ email, password });
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    try {
      const response = await AuthService.login({ email, password });
      
      // Assume the response contains the token
      if (response.data && response.data.accessToken) {
        localStorage.setItem("accessToken", response.data.accessToken);
        if (response.data.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        
        // Store user data if needed
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
    <div className="h-full flex">
      <AuthBanner />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <LoginForm
          onSubmit={handleSignIn}
          formLoading={formLoading}
          errorMsg={errorMsg}
          showPassword={showPassword}
          keepSignedIn={keepSignedIn}
          fieldErrors={fieldErrors}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleKeepSignedIn={() => setKeepSignedIn(!keepSignedIn)}
          onResetPassword={handleResetPassword}
          onGoogleSignIn={handleGoogleSignIn}
          onRegister={handleRegister}
        />
      </div>
    </div>
  );
}