"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import LoginForm from "./LoginForm";
import { validateLoginForm, hasErrors } from "./LoginValidation";
import type { LoginFieldErrors } from "./LoginTypes";

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

    const validEmail = process.env.NEXT_PUBLIC_VALID_EMAIL;
    const validPassword = process.env.NEXT_PUBLIC_VALID_PASSWORD;

    setTimeout(() => {
      if (email === validEmail && password === validPassword) {
        router.push("/dashboard");
      } else {
        setErrorMsg("Invalid email or password.");
      }
      setFormLoading(false);
    }, 600);
  };

  const handleGoogleSignIn = () => {
    setErrorMsg("Google sign-in is disabled in prototype mode.");
  };

  const handleResetPassword = () => {
    router.push("/forgot");
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