"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Wallet,
  TriangleAlert,
} from "lucide-react";

import { STEPS, initialFormState } from "./types";
import type { FormChange, FormErrors, FormState } from "./types";
import { StepDots } from "./StepDots";
import { WithdrawDetails } from "./WithdrawDetails";
import { OtpVerification } from "./OtpVerification";
import { ReviewWithdraw } from "./ReviewWithdraw";
import { Submitted } from "./Submitted";
import { WithdrawalService } from "@/services/withdrawal.service";

export default function WithdrawFundPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoaded, setBalanceLoaded] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const submittedRef = useRef<{ id: string; status: string } | null>(null);

  useEffect(() => {
    let cancelled = false;
    void WithdrawalService.myWithdrawals()
      .then((res) => {
        if (!cancelled) {
          setBalance(Number(res.balance) || 0);
          setBalanceLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setBalanceLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const updateField: FormChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as keyof FormErrors];
      return next;
    });
    setApiError(null);
  }, []);

  const validateStep1 = () => {
    const errs: FormErrors = {};
    if (form.method === "upi" && !form.upiId.trim())
      errs.upiId = "Enter your active UPI ID.";
    if (!form.amount || Number(form.amount) <= 0)
      errs.amount = "Enter the amount you want to withdraw.";
    else if (Number(form.amount) > balance)
      errs.amount = `Amount exceeds your available balance of ₹${balance.toLocaleString("en-IN")}.`;
    if (!form.password)
      errs.password = "Enter your password to continue.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: FormErrors = {};
    if (form.otp.trim().length !== 6)
      errs.otp = "Enter the 6-digit OTP sent to your email.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sendOtp = async () => {
    setSendingOtp(true);
    setApiError(null);
    try {
      await WithdrawalService.sendOtp();
      setStep(2);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to send OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const goNext = () => {
    setApiError(null);
    if (step === 1) {
      if (!validateStep1()) return;
      void sendOtp();
      return;
    }
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setApiError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== STEPS.length) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const res = await WithdrawalService.create({
        method: form.method,
        destination:
          form.method === "upi" ? form.upiId.trim() : "Registered bank account",
        amount: form.amount,
        password: form.password,
        otp: form.otp,
      });
      submittedRef.current = { id: res.id, status: res.status };
      setSubmitted(true);
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to submit request");
      setStep(2);
      setErrors((prev) => ({ ...prev, otp: "Please request a fresh OTP and try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    submittedRef.current = null;
    setStep(1);
    setForm(initialFormState);
    setErrors({});
    setApiError(null);
  };

  if (submitted && submittedRef.current) {
    return (
      <Submitted
        data={form}
        requestId={submittedRef.current.id}
        status={submittedRef.current.status}
        onReset={resetForm}
      />
    );
  }

  const isLast = step === STEPS.length;

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-5xl space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            Withdraw Funds
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <Wallet className="h-5 w-5 shrink-0 text-indigo-600" />
              <h2 className="text-sm font-semibold text-slate-300">
                Request a withdrawal to your bank or UPI
              </h2>
            </div>
            <StepDots currentStep={step} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {step === 1 && (
                <WithdrawDetails
                  data={form}
                  errors={errors}
                  onChange={updateField}
                  balance={balance}
                  balanceLoaded={balanceLoaded}
                />
              )}
              {step === 2 && (
                <OtpVerification
                  data={form}
                  errors={errors}
                  onChange={updateField}
                  onResend={sendOtp}
                  resendBusy={sendingOtp}
                />
              )}
              {step === 3 && <ReviewWithdraw data={form} />}

              {apiError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-400">
                  <TriangleAlert className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{apiError}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 border-t border-neutral-800 pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={step === 1 || sendingOtp || submitting}
                  className="flex items-center gap-1.5 border-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {isLast ? (
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {submitting ? "Submitting…" : "Submit Withdrawal"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={sendingOtp}
                    className="flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
                  >
                    {sendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending OTP…
                      </>
                    ) : (
                      <>
                        {step === 1 ? "Send OTP" : "Continue"}
                        <ChevronRight className="h-4 w-4" />
                      </>
                    )}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}