"use client";

import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import ForgotPasswordForm from "@/components/auth/ForgotPassword/ForgotPasswordForm";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormValues,
} from "@/lib/validations";
import { AuthService } from "@/services/auth.service";
import { handleApiError } from "@/services/api";

export default function ForgotPasswordPage() {
  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [isSuccess, setIsSuccess] = useState(false);

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: "" },
  });

  const handleSubmit = async (data: ForgotPasswordFormValues) => {
    setFormLoading(true);
    setErrorMsg("");

    try {
      await AuthService.forgotPassword({ email: data.email });
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
      await AuthService.forgotPassword({ email: form.getValues("email") });
    } catch (err: any) {
      setErrorMsg(
        err.message || "An error occurred while resending the email.",
      );
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-white">
      <AuthBanner />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 ">
        <ForgotPasswordForm
          form={form}
          onSubmit={handleSubmit}
          formLoading={formLoading}
          errorMsg={errorMsg}
          isSuccess={isSuccess}
          onResendEmail={handleResendEmail}
        />
      </div>
    </div>
  );
}
