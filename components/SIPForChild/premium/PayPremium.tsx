"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle2, Loader2, ArrowLeft, Check } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";
import {
  SIPForChildService,
  type MySIPInvestment,
} from "@/services/sip-for-child.service";
import {
  RESEND_COOLDOWN,
  STEP_META,
  getNextUnpaidMonth,
} from "./shared";
import { Step1PaymentDetails } from "./Step1PaymentDetails";
import { Step2VerifyPay } from "./Step2VerifyPay";
import { Step3Confirmation } from "./Step3Confirmation";

interface Props {
  application: MySIPInvestment;
  onPaid: () => void;
  onCancel: () => void;
}

export function PayPremium({ application, onPaid, onCancel }: Props) {
  const email = useAuthStore((s) => s.user?.email ?? "");
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [paidMonth, setPaidMonth] = useState<number | null>(null);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const monthlyAmount = Number(application.monthlyInvestment);
  const nextUnpaidMonth = getNextUnpaidMonth(application);

  const allPaid = nextUnpaidMonth > application.totalMonths;
  if (allPaid || application.status !== "VERIFIED") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-50 mb-2">
          {allPaid ? "All Premiums Paid" : "Application Not Active"}
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          {allPaid
            ? "You've completed all monthly premiums for this SIP."
            : "This application is no longer active."}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const isAdvancePayment = nextUnpaidMonth > application.monthsPaid + 1;

  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerifyPassword = async () => {
    setError(null);
    setSendingOtp(true);
    try {
      await SIPForChildService.verifyPasswordAndSendOtp(
        password,
        application.scheme,
      );
      setPasswordVerified(true);
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password is incorrect");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setSendingOtp(true);
    try {
      await SIPForChildService.verifyPasswordAndSendOtp(
        password,
        application.scheme,
      );
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handlePayPremium = async () => {
    if (!password || otp.length !== 6) {
      setError("Please enter password and 6-digit OTP");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await SIPForChildService.payPremium(
        application.id,
        password,
        otp,
      );
      setPaidMonth(result.monthNumber);
      setIsAdvanced(result.advanced);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setOtp("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090f] p-4">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Back button */}
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Progress
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {STEP_META.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step > s.num
                    ? "bg-emerald-500 text-white"
                    : step === s.num
                      ? "bg-amber-500 text-white"
                      : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {step > s.num ? (
                  <Check className="h-4 w-4" />
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`hidden sm:inline text-xs font-medium ${
                  step === s.num ? "text-white" : "text-zinc-500"
                }`}
              >
                {s.label}
              </span>
              {i < STEP_META.length - 1 && (
                <div
                  className={`w-8 h-px ${
                    step > s.num ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Payment Details */}
        {step === 1 && (
          <Step1PaymentDetails
            application={application}
            nextUnpaidMonth={nextUnpaidMonth}
            monthlyAmount={monthlyAmount}
            isAdvance={isAdvancePayment}
            now={now}
            onContinue={() => setStep(2)}
            onCancel={onCancel}
          />
        )}

        {/* Step 2: Verify & Pay */}
        {step === 2 && (
          <Step2VerifyPay
            application={application}
            nextUnpaidMonth={nextUnpaidMonth}
            monthlyAmount={monthlyAmount}
            email={email}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            passwordVerified={passwordVerified}
            otp={otp}
            setOtp={setOtp}
            sendingOtp={sendingOtp}
            sendingPassword={sendingOtp && !passwordVerified}
            cooldown={cooldown}
            error={error}
            setError={setError}
            submitting={submitting}
            onVerifyPassword={handleVerifyPassword}
            onResendOtp={handleResendOtp}
            onPay={handlePayPremium}
            onBack={() => setStep(1)}
          />
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Step3Confirmation
            application={application}
            paidMonth={paidMonth ?? nextUnpaidMonth}
            monthlyAmount={monthlyAmount}
            isAdvanced={isAdvanced}
            onComplete={onPaid}
          />
        )}
      </div>
    </div>
  );
}