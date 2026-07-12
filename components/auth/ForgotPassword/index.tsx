"use client";

import React, { useState } from "react";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import ForgotPasswordForm from "@/components/auth/ForgotPassword/ForgotPasswordForm";
import { validateForgotPasswordForm, hasErrors } from "@/components/auth/ForgotPassword/ForgotPasswordValidation";
import type { ForgotPasswordFieldErrors } from "@/components/auth/ForgotPassword/ForgotPasswordTypes";
import { AuthService } from "@/services/auth.service";

export default function ForgotPasswordPage() {
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);
  const [email, setEmail] = useState("");
  const [fieldErrors, setFieldErrors] = useState<ForgotPasswordFieldErrors>({});

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg("");
    setFieldErrors({});

    const errors = validateForgotPasswordForm({ email });
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    try {
      await AuthService.forgotPassword({ email });
      setIsSuccess(true);
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred. Please try again.");
    } finally {
      setFormLoading(false);
    }
  };

  const handleResendEmail = async () => {
    setFormLoading(true);
    try {
      await AuthService.forgotPassword({ email });
    } catch (err: any) {
      setErrorMsg(err.message || "An error occurred while resending the email.");
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      <AuthBanner />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <ForgotPasswordForm
          onSubmit={handleSubmit}
          formLoading={formLoading}
          errorMsg={errorMsg}
          isSuccess={isSuccess}
          email={email}
          fieldErrors={fieldErrors}
          onEmailChange={setEmail}
          onResendEmail={handleResendEmail}
        />
      </div>
    </div>
  );
}
