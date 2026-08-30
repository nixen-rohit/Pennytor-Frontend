"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  CheckCircle2,
  AlertCircle,
  Wallet,
  CreditCard,
  ArrowLeft,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp";
import { type MySIPInvestment } from "@/services/sip-for-child.service";
import { formatINR, maskEmail } from "./shared";

export function Step2VerifyPay({
  application,
  nextUnpaidMonth,
  monthlyAmount,
  email,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  passwordVerified,
  otp,
  setOtp,
  sendingOtp,
  sendingPassword,
  cooldown,
  error,
  setError,
  submitting,
  onVerifyPassword,
  onResendOtp,
  onPay,
  onBack,
}: {
  application: MySIPInvestment;
  nextUnpaidMonth: number;
  monthlyAmount: number;
  email: string;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((prev: boolean) => boolean)) => void;
  passwordVerified: boolean;
  otp: string;
  setOtp: (v: string) => void;
  sendingOtp: boolean;
  sendingPassword: boolean;
  cooldown: number;
  error: string | null;
  setError: (v: string | null) => void;
  submitting: boolean;
  onVerifyPassword: () => void;
  onResendOtp: () => void;
  onPay: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
          Verify & Pay
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your password and OTP to authorize the payment.
        </p>
      </div>

      {/* Mini summary */}
      <Card className="border-white/10 bg-[#111217]">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-xs text-zinc-500">
                Month {nextUnpaidMonth} Premium
              </p>
              <p className="text-lg font-bold text-green-400">
                {formatINR(monthlyAmount)}/-
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
            {application.scheme}
          </span>
        </CardContent>
      </Card>

      {/* Auth card */}
      <Card className="border-white/10 bg-[#111217] shadow-xl">
        <CardContent className="p-6 space-y-5">
          {!passwordVerified ? (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <p className="text-xs text-zinc-500">
                  Enter your account password to verify identity.
                </p>
              </div>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && password) onVerifyPassword();
                  }}
                  className="h-11 bg-black/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                type="button"
                onClick={onVerifyPassword}
                disabled={sendingPassword || !password}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {sendingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying & Sending OTP...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Verify Password & Send OTP
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 text-green-400 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">
                  Password verified! OTP sent to your email.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    Enter the OTP
                  </p>
                  <p className="text-xs text-slate-400">
                    Sent to{" "}
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
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    setError(null);
                  }}
                >
                  <InputOTPGroup>
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

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  OTP expires in 5 minutes
                </span>
                {cooldown > 0 ? (
                  <span>Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={onResendOtp}
                    disabled={sendingOtp}
                    className="flex items-center gap-1.5 font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                  >
                    {sendingOtp && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border-white/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onPay}
          disabled={!passwordVerified || otp.length !== 6 || submitting}
          className="flex-1 bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60 shadow-lg shadow-amber-500/20"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Pay {formatINR(monthlyAmount)}/-
            </>
          )}
        </Button>
      </div>
    </div>
  );
}