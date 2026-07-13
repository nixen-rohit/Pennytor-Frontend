"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import RegisterForm from "./RegisterForm";
import { validateRegisterForm, hasErrors } from "./RegisterValidation";
import type { RegisterFieldErrors } from "./RegisterTypes";
import { AuthService } from "@/services/auth.service";

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
      referralCode: (formData.referralCode as string) || undefined,
      agreeToTerms: formData.agreeToTerms === "on",
      subscribeNewsletter: formData.subscribeNewsletter === "on",
    };

    const errors = validateRegisterForm(values);
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    try {
      const response = await AuthService.register({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
        referralCode: values.referralCode,
      });

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
        setErrorMsg("Registration failed. Please try again.");
      }
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred during registration.");
    } finally {
      setFormLoading(false);
    }
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
