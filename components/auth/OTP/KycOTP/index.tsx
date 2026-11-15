"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import KycOtpForm from "./KycOtpForm";
import {
  registeredOtpSchema,
  type RegisteredOtpFormValues,
} from "@/lib/validations";
import { KycService } from "@/services/kyc.service";
import { handleApiError } from "@/services/api";

export default function KycOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId") ?? "";

  const [open, setOpen] = React.useState(true);
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
      setOpen(nextOpen);
    },
    [resetState],
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
    <section className="h-screen relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-linear-to-b from-foreground to-mainground p-4 md:p-12">
      {/* Background circles */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -bottom-20 -left-20 h-[600px] w-[600px] rounded-full border border-white" />

        <div className="absolute -bottom-10 -left-10 h-[600px] w-[600px] rounded-full border border-white" />

        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full border border-white" />
      </div>

      {/* OTP Form Card */}
      <div className="relative z-10 mx-auto w-full max-w-md">
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
      </div>
    </section>
  );
}
