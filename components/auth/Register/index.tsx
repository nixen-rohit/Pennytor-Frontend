"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import RegisterForm from "./RegisterForm";
import { validateRegisterForm, hasErrors } from "./RegisterValidation";
import type { RegisterFieldErrors } from "./RegisterTypes";

export default function RegisterPage() {
  const router = useRouter();

  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});

  const handleRegister = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg("");
    setFieldErrors({});

    const formData = Object.fromEntries(
      new FormData(e.currentTarget).entries(),
    );

    const values = {
      firstName: formData.firstName as string,
      lastName: formData.lastName as string,
      email: formData.email as string,
      password: formData.password as string,
      agreeToTerms: formData.agreeToTerms === "on",
      subscribeNewsletter: formData.subscribeNewsletter === "on",
    };

    const errors = validateRegisterForm(values);
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    setTimeout(() => {
      router.push("/dashboard");
    }, 600);
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="h-full flex">
      <AuthBanner />

      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <RegisterForm
          onSubmit={handleRegister}
          formLoading={formLoading}
          errorMsg={errorMsg}
          showPassword={showPassword}
          fieldErrors={fieldErrors}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onLogin={handleLogin}
        />
      </div>
    </div>
  );
}
