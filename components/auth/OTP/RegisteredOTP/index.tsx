"use client";
import React, { useState, useCallback, useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import RegisteredOtpForm from "./RegisteredOtpForm";
import {
  registeredOtpSchema,
  type RegisteredOtpFormValues,
} from "@/lib/validations";
import { AuthService } from "@/services/auth.service";
import { handleApiError } from "@/services/api";
export default function RegisteredOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

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

  const handleSubmit = async (data: RegisteredOtpFormValues) => {
    setFormLoading(true);
    setErrorMsg("");

    try {
      await AuthService.verifyEmail({ email, otp: data.otp });
      resetState();
      router.push("/login");
    } catch (err: unknown) {
      handleApiError(err, setErrorMsg, {
        400: "Invalid verification code. Please check and try again.",
        410: "This code has expired. Please request a new one.",
      });
    } finally {
      setFormLoading(false);
    }
  };

  const handleResend = useCallback(async () => {
    try {
      await AuthService.resendOtp({ email });
      setResendCooldown(60);
      setErrorMsg("");
    } catch (err: unknown) {
      handleApiError(err, setErrorMsg);
    }
  }, [email]);

  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-linear-to-b from-foreground to-mainground p-4 md:p-12">
      {/* Background circles */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -bottom-20 -left-20 h-[600px] w-[600px] rounded-full border border-white" />

        <div className="absolute -bottom-10 -left-10 h-[600px] w-[600px] rounded-full border border-white" />

        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full border border-white" />
      </div>

      {/* OTP Form Card */}
      <div className="relative z-10 mx-auto w-full max-w-md">
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
          onLogin={() => {
            resetState();
            router.push("/login");
          }}
        />
      </div>
    </section>
  );
}
