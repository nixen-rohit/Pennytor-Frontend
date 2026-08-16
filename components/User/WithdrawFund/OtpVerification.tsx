"use client";

import { useEffect, useState } from "react";
import { Loader2, Mail, ShieldCheck } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/store/auth.store";

import type { FormChange, FormErrors, FormState } from "./types";

interface Props {
  data: FormState;
  errors: FormErrors;
  onChange: FormChange;
  onResend: () => Promise<void>;
  resendBusy: boolean;
}

const RESEND_COOLDOWN = 30;

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
}

export function OtpVerification({
  data,
  errors,
  onChange,
  onResend,
  resendBusy,
}: Props) {
  const email = useAuthStore((s) => s.user?.email ?? "");
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [sending, setSending] = useState(false);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleResend = async () => {
    setSending(true);
    try {
      await onResend();
      setCooldown(RESEND_COOLDOWN);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Email OTP verification" />

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <div className="mb-5 flex items-center gap-3">
          <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20">
            <Mail className="h-5 w-5 text-indigo-400" />
          </span>
          <div>
            <p className="text-sm font-medium text-slate-100">
              Enter the OTP sent to your email
            </p>
            <p className="text-xs text-slate-400">
              We sent a 6-digit code to{" "}
              <span className="font-medium text-slate-200">
                {maskEmail(email)}
              </span>
            </p>
          </div>
        </div>

        <div className="flex justify-center py-2">
          <InputOTP
            maxLength={6}
            pattern={REGEXP_ONLY_DIGITS}
            value={data.otp}
            onChange={(v) => onChange("otp", v)}
          >
            <InputOTPGroup >
              {[0, 1, 2, 3, 4, 5].map((index) => (
                <InputOTPSlot
                  key={index}
                  index={index}
                  className="h-15 w-13 border-neutral-700 bg-black/40 text-lg"
                />
              ))}
            </InputOTPGroup>
          </InputOTP>
        </div>

        {errors.otp && (
          <p className="mt-2 text-center text-xs text-red-500">{errors.otp}</p>
        )}

        <div className="mt-4 flex items-center justify-between gap-3 text-xs text-slate-400">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-3.5 w-3.5 shrink-0 text-emerald-400" />
            OTP expires in 5 minutes
          </span>
          {cooldown > 0 ? (
            <span>Resend in {cooldown}s</span>
          ) : (
            <button
              type="button"
              onClick={() => void handleResend()}
              disabled={sending || resendBusy}
              className="flex items-center gap-1.5 font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
            >
              {(sending || resendBusy) && (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              )}
              Resend OTP
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="border-b pb-2">
      <h3 className="text-base font-semibold text-slate-50">{title}</h3>
    </div>
  );
}
