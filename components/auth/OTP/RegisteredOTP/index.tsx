"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisteredOtpForm from "./RegisteredOtpForm";
import {
  registeredOtpSchema,
  type RegisteredOtpFormValues,
} from "@/lib/validations";
import { OtpService } from "@/services/otp.service";

interface RegisteredOtpDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  email: string;
}

export default function RegisteredOtpDialog({
  open,
  onOpenChange,
  email,
}: RegisteredOtpDialogProps) {
  const router = useRouter();

  const [formLoading, setFormLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  const form = useForm<RegisteredOtpFormValues>({
    resolver: zodResolver(registeredOtpSchema),
    defaultValues: { otp: "" },
  });

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resetState = useCallback(() => {
    form.reset({ otp: "" });
    setErrorMsg("");
    setFormLoading(false);
  }, [form]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) resetState();
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetState],
  );

  const handleSubmit = async (data: RegisteredOtpFormValues) => {
    setFormLoading(true);
    setErrorMsg("");

    try {
      await OtpService.verifyOtp({ email, otp: data.otp });
      handleOpenChange(false);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Verification failed. Please try again.";
      setErrorMsg(message);
    } finally {
      setFormLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    try {
      await OtpService.resendOtp({ email });
      setResendCooldown(60);
    } catch (err: unknown) {
      const message =
        err instanceof Error
          ? err.message
          : "Failed to resend code. Please try again.";
      setErrorMsg(message);
    }
  }, [email]);

  return (
    <RegisteredOtpForm
      open={open}
      onOpenChange={handleOpenChange}
      form={form}
      onSubmit={handleSubmit}
      formLoading={formLoading}
      errorMsg={errorMsg}
      email={email}
      onResend={handleResend}
      resendCooldown={resendCooldown}
    />
  );
}
