"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import RegisterForm from "./RegisterForm";
import { validateRegisterForm, hasErrors } from "./RegisterValidation";
import type { RegisterFieldErrors } from "./RegisterTypes";
import { AuthService } from "@/services/auth.service";
import { handleApiError } from "@/services/api";
import RegisteredOtpDialog from "@/components/auth/OTP/RegisteredOTP";

export default function RegisterPage() {
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<RegisterFieldErrors>({});
  const [registeredEmail, setRegisteredEmail] = useState("");

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
        setRegisteredEmail(values.email);
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
      <RegisteredOtpDialog open={open} onOpenChange={setOpen} email={registeredEmail} />
      {/* Right Side - Scrollable */}
      <div className="w-full lg:ml-[50%] lg:w-1/2 h-screen overflow-y-auto bg-white">
        <div className="flex min-h-screen items-center justify-center p-8">
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
    </div>




  );
}
