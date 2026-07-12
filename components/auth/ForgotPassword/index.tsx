"use client";

import React, { useState } from "react";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import ForgotPasswordForm from "@/components/auth/ForgotPassword/ForgotPasswordForm";
import { validateForgotPasswordForm, hasErrors } from "@/components/auth/ForgotPassword/ForgotPasswordValidation";
import type { ForgotPasswordFieldErrors } from "@/components/auth/ForgotPassword/ForgotPasswordTypes";

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

    await new Promise((resolve) => setTimeout(resolve, 2000));

    setIsSuccess(false);
    setFormLoading(false);
    setIsSuccess(true);
  };

  const handleResendEmail = () => {
    setFormLoading(true);
    setTimeout(() => {
      setFormLoading(false);
    }, 1000);
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
