"use client";

import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import RegisteredOtpForm from "./RegisteredOtpForm";
import { validateRegisteredOtpForm, hasErrors } from "./RegisteredValidation";
import { OtpService } from "@/services/otp.service";
import type { RegisteredOtpFieldErrors } from "./RegisteredTypes";

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
  const [fieldErrors, setFieldErrors] = useState<RegisteredOtpFieldErrors>({});
  const [otpValue, setOtpValue] = useState("");
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = setTimeout(() => setResendCooldown(resendCooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [resendCooldown]);

  const resetState = useCallback(() => {
    setOtpValue("");
    setErrorMsg("");
    setFieldErrors({});
    setFormLoading(false);
  }, []);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      if (!nextOpen) resetState();
      onOpenChange(nextOpen);
    },
    [onOpenChange, resetState],
  );

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormLoading(true);
    setErrorMsg("");
    setFieldErrors({});

    const errors = validateRegisteredOtpForm({ otp: otpValue });
    if (hasErrors(errors)) {
      setFieldErrors(errors);
      setFormLoading(false);
      return;
    }

    try {
      await OtpService.verifyOtp({ email, otp: otpValue });
      handleOpenChange(false);
      router.push("/dashboard");
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "Verification failed. Please try again.";
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
      const message = err instanceof Error ? err.message : "Failed to resend code. Please try again.";
      setErrorMsg(message);
    }
  }, [email]);

  return (
    <RegisteredOtpForm
      open={open}
      onOpenChange={handleOpenChange}
      onSubmit={handleSubmit}
      formLoading={formLoading}
      errorMsg={errorMsg}
      fieldErrors={fieldErrors}
      otpValue={otpValue}
      onOtpChange={setOtpValue}
      email={email}
      onResend={handleResend}
      resendCooldown={resendCooldown}
    />
  );
}
