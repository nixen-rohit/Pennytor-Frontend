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
import RegisteredOtpDialog from "@/components/auth/OTP/RegisteredOTP";

export default function RegisterPage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
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
      const response = await AuthService.register({
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        password: data.password,
        referralCode: data.referralCode || undefined,
        acceptTerms: true, // backend expects boolean, form validation already ensures checkbox is checked
      });

      if (response && (response.data?.accessToken || response.success || response.message)) {
        if (response.data?.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken);
        }
        if (response.data?.refreshToken) {
          localStorage.setItem("refreshToken", response.data.refreshToken);
        }
        if (response.data?.user) {
          localStorage.setItem("user", JSON.stringify(response.data.user));
        }
        // Show OTP verification dialog on successful registration
        setOpen(true);
      } else {
        setErrorMsg("Registration failed. Please try again.");
      }
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
    <div className="flex h-screen">
      {/* Left Side - Fixed */}
      <div className="hidden lg:fixed lg:left-0 lg:top-0 lg:flex lg:h-screen lg:w-1/2">
        <AuthBanner />
      </div>
      <RegisteredOtpDialog
        open={open}
        onOpenChange={setOpen}
        email={form.getValues("email")}
      />
      {/* Right Side - Scrollable */}
      <div className="w-full lg:ml-[50%] lg:w-1/2 h-screen overflow-y-auto bg-white">
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
