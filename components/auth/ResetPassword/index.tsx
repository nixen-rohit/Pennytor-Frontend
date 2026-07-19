"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthBanner from "@/components/auth/Banner/AuthBanner";
import ResetPasswordForm from "./ResetPasswordForm";
import {
  resetPasswordSchema,
  type ResetPasswordFormValues,
} from "@/lib/validations";
import { AuthService } from "@/services/auth.service";
import { handleApiError } from "@/services/api";

interface ResetPasswordPageProps {
  token?: string;
  email?: string;
}

export default function ResetPasswordPage({
  token,
  email,
}: ResetPasswordPageProps) {
  const router = useRouter();

  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const isValidToken = Boolean(token && email);

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isSuccess) {
      const timer = setTimeout(() => {
        router.push("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isSuccess, router]);

  const handleSubmit = async (data: ResetPasswordFormValues) => {
    setFormLoading(true);
    setErrorMsg("");

    try {
      await AuthService.resetPassword({
        token,
        email,
        newPassword: data.password,
      });
      setIsSuccess(true);
    } catch (err: any) {
      handleApiError(err, setErrorMsg, {
        400: "Invalid or expired reset link. Please request a new one.",
        404: "User not found. Please try again.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen flex">
        <AuthBanner />
        <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
          <div className="w-full max-w-md space-y-6 text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
              <span className="text-2xl">✅</span>
            </div>
            <div>
              <h2 className="text-3xl font-bold text-slate-900 mb-2">
                Password reset successful
              </h2>
              <p className="text-slate-600">
                Your password has been reset. Redirecting to sign in...
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex">
      <AuthBanner />
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <ResetPasswordForm
          form={form}
          onSubmit={handleSubmit}
          formLoading={formLoading}
          errorMsg={errorMsg}
          showPassword={showPassword}
          showConfirmPassword={showConfirmPassword}
          onTogglePassword={() => setShowPassword(!showPassword)}
          onToggleConfirmPassword={() =>
            setShowConfirmPassword(!showConfirmPassword)
          }
          isValidToken={isValidToken}
        />
      </div>
    </div>
  );
}
