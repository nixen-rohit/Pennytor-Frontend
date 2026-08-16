"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import RegisterForm from "./RegisterForm";
import { registerSchema, type RegisterFormValues } from "@/lib/validations";
import { AuthService } from "@/services/auth.service";
import { handleApiError } from "@/services/api";

export default function RegisterPage() {
  const router = useRouter();
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      referralCode: "",
      agreeToTerms: false,
      subscribeNewsletter: false,
    },
  });

  const handleRegister = async (data: RegisterFormValues) => {
    setFormLoading(true);
    setErrorMsg("");

    try {
      await AuthService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        referralCode: data.referralCode,
        acceptTerms: true,
        marketingEmails: data.subscribeNewsletter,
      });
      router.push(
        `/otp-verify/register-acount?email=${encodeURIComponent(data.email)}`,
      );
    } catch (err) {
      handleApiError(err, setErrorMsg, {
        409: "This email is already registered. Please log in or use a different email.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleLogin = () => {
    router.push("/login");
  };

  return (
    <div className="flex h-screen  ">
      {/* Left Side - Fixed */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-1/2">
        <AuthBanner />
      </div>
      {/* Right Side - Scrollable */}
      <div className="w-full lg:ml-[50%] lg:w-1/2 h-screen overflow-y-auto bg-white/95">
        <div className="flex min-h-screen items-center justify-center p-8">
          <RegisterForm
            form={form}
            onSubmit={handleRegister}
            formLoading={formLoading}
            errorMsg={errorMsg}
            showPassword={showPassword}
            onTogglePassword={() => setShowPassword(!showPassword)}
            onLogin={handleLogin}
          />
        </div>
      </div>
    </div>
  );
}
