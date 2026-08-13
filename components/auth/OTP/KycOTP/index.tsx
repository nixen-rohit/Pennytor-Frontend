"use client";
import React, { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import KycOtpForm from "./KycOtpForm";
import {
  registeredOtpSchema,
  type RegisteredOtpFormValues,
} from "@/lib/validations";
import { KycService } from "@/services/kyc.service";
import { handleApiError } from "@/services/api";

interface KycOtpDialogProps {
  open: boolean;
  onOpenChange?: (open: boolean) => void;
  applicationId: string;
}

const noop = () => {};

export default function KycOtpDialog({
  open,
  onOpenChange = noop,
  applicationId,
}: KycOtpDialogProps) {
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

  // Request the KYC submission OTP as soon as the screen opens.
  useEffect(() => {
    if (!open || !applicationId) return;
    const timeoutId = setTimeout(() => {
      KycService.sendSubmissionOtp(applicationId)
        .then(() => setErrorMsg(""))
        .catch((err: unknown) => handleApiError(err, setErrorMsg));
    }, 0);
    return () => clearTimeout(timeoutId);
  }, [open, applicationId]);

  const handleSubmit = async (data: RegisteredOtpFormValues) => {
    setFormLoading(true);
    setErrorMsg("");

    try {
      await KycService.submit(applicationId, data.otp);
      resetState();
      router.push("/account-kyc");
    } catch (err: unknown) {
      handleApiError(err, setErrorMsg, {
        400: "Invalid or expired code. Please check and try again.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    try {
      await KycService.sendSubmissionOtp(applicationId);
      setResendCooldown(60);
      setErrorMsg("");
    } catch (err: unknown) {
      handleApiError(err, setErrorMsg);
    }
  }, [applicationId]);

  return (
    <KycOtpForm
      open={open}
      onOpenChange={handleOpenChange}
      form={form}
      onSubmit={handleSubmit}
      formLoading={formLoading}
      errorMsg={errorMsg}
      onResend={handleResend}
      resendCooldown={resendCooldown}
    />
  );
}