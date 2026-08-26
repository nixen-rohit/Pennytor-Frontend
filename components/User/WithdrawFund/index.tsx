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
import { WithdrawalService, type UserBankAccount } from "@/services/withdrawal.service";

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
  const [userBankAccount, setUserBankAccount] = useState<UserBankAccount | null>(null);
  const [bankAccountLoading, setBankAccountLoading] = useState(false);
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

  // Fetch user's bank account from KYC when method is "bank"
  useEffect(() => {
    const id = setTimeout(() => {
      if (form.method !== "bank") {
        setUserBankAccount(null);
        return;
      }
      setBankAccountLoading(true);
      WithdrawalService.getUserBankAccount()
        .then((bank) => {
          setUserBankAccount(bank);
          setBankAccountLoading(false);
        })
        .catch(() => {
          setUserBankAccount(null);
          setBankAccountLoading(false);
        });
    }, 0);
    return () => clearTimeout(id);
  }, [form.method]);

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
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep3 = () => {
    const errs: FormErrors = {};
    if (!form.password)
      errs.password = "Enter your password.";
    if (form.otp.trim().length !== 6)
      errs.otp = "Enter the 6-digit OTP sent to your email.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const sendOtp = async () => {
    setSendingOtp(true);
    setApiError(null);
    try {
      // Verifies the password server-side FIRST, then emails the OTP.
      await WithdrawalService.verifyPasswordAndSendOtp(form.password);
    } catch (err) {
      const message =
        err instanceof Error ? err.message : "Failed to verify password";
      setApiError(message);
      // Re-throw so OtpVerification stays on the password step and shows
      // the inline error instead of moving to the OTP input.
      throw err;
    } finally {
      setSendingOtp(false);
    }
  };

  const goNext = () => {
    setApiError(null);
    if (step === 1) {
      if (!validateStep1()) return;
      setStep(2);
      return;
    }
    if (step === 2) {
      setStep(3);
      return;
    }
    if (step === 3 && !validateStep3()) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => {
    setApiError(null);
    setStep((s) => Math.max(s - 1, 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step !== STEPS.length) return;
    if (!validateStep3()) return;
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
                <ReviewWithdraw
                  data={form}
                  userBankAccount={userBankAccount}
                  bankAccountLoading={bankAccountLoading}
                />
              )}

              {step === 3 && (
                <OtpVerification
                  data={form}
                  errors={errors}
                  onChange={updateField}
                  onResend={sendOtp}
                  resendBusy={sendingOtp}
                  onSendOtp={sendOtp}
                  sendingOtp={sendingOtp}
                />
              )}

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
                        {step === 1 ? "Continue" : step === 2 ? "Authenticate" : "Continue"}
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