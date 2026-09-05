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
  Clock,
  XCircle,
  CheckCircle2,
} from "lucide-react";

import { STEPS, initialFormState } from "./types";
import type { FormChange, FormErrors, FormState } from "./types";
import { StepDots } from "./StepDots";
import { WithdrawDetails } from "./WithdrawDetails";
import { OtpVerification } from "./OtpVerification";
import { ReviewWithdraw } from "./ReviewWithdraw";
import { Submitted } from "./Submitted";
import { WithdrawalService, type UserBankAccount, type MyWithdrawal } from "@/services/withdrawal.service";

const statusConfig: Record<
  string,
  { icon: React.ReactNode; title: string; subtitle: string; color: string }
> = {
  PENDING: {
    icon: <Clock className="h-14 w-14 text-amber-400" />,
    title: "Withdrawal request under review",
    subtitle:
      "Your withdrawal request has been submitted successfully. The amount has been debited from your wallet. Please wait while our admin team reviews your request.",
    color: "text-amber-400",
  },
  UNDER_REVIEW: {
    icon: <Clock className="h-14 w-14 text-blue-400" />,
    title: "Being reviewed by admin team",
    subtitle:
      "Your withdrawal is currently being reviewed. The amount remains debited from your wallet until a decision is made.",
    color: "text-blue-400",
  },
  VERIFIED: {
    icon: <CheckCircle2 className="h-14 w-14 text-green-400" />,
    title: "Withdrawal approved",
    subtitle:
      "Your withdrawal has been approved and the amount has been transferred to your account.",
    color: "text-green-400",
  },
  REJECTED: {
    icon: <XCircle className="h-14 w-14 text-red-400" />,
    title: "Withdrawal request rejected",
    subtitle:
      "Your withdrawal request was not approved. The amount has been refunded to your wallet. Please review the reason below.",
    color: "text-red-400",
  },
};

function WithdrawalStatusPage({
  withdrawal,
  onNewRequest,
}: {
  withdrawal: MyWithdrawal;
  onNewRequest: () => void;
}) {
  const config = statusConfig[withdrawal.status];

  return (
    <div className="mx-auto flex min-h-[560px] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center">
        {config.icon}
      </div>
      <h1 className={`text-lg font-medium ${config.color}`}>{config.title}</h1>
      <p className="mt-2 max-w-xs text-sm text-slate-400">{config.subtitle}</p>

      <div className="mt-6 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-left space-y-1">
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="text-sm text-slate-400">Amount</span>
          <span className="truncate text-right text-sm font-mono text-white">
            ₹{withdrawal.amount}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="text-sm text-slate-400">Method</span>
          <span className="truncate text-right text-sm text-white uppercase">
            {withdrawal.method}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="text-sm text-slate-400">Destination</span>
          <span className="truncate text-right text-sm text-white">
            {withdrawal.destination}
          </span>
        </div>
        <div className="flex items-center justify-between gap-4 py-2.5">
          <span className="text-sm text-slate-400">Status</span>
          <span
            className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
              withdrawal.status === "PENDING"
                ? "bg-amber-500/10 text-amber-300"
                : withdrawal.status === "UNDER_REVIEW"
                  ? "bg-blue-500/10 text-blue-300"
                  : withdrawal.status === "VERIFIED"
                    ? "bg-green-600/10 text-green-400"
                    : "bg-red-600/10 text-red-400"
            }`}
          >
            {withdrawal.status.replace("_", " ")}
          </span>
        </div>
        {withdrawal.reviewNote && (
          <div className="mt-3 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">
              Rejection Reason
            </p>
            <p className="text-sm text-slate-200 mt-1">{withdrawal.reviewNote}</p>
          </div>
        )}
      </div>

      {(withdrawal.status === "REJECTED" || withdrawal.status === "VERIFIED") && (
        <div className="mt-8 w-full">
          <button
            type="button"
            onClick={onNewRequest}
            className="w-full flex items-center justify-center gap-2 rounded-xl border border-indigo-500/30 bg-indigo-600/10 px-6 py-3 text-sm font-medium text-indigo-400 transition-all hover:bg-indigo-600/20 hover:border-indigo-500/50 hover:text-indigo-300"
          >
            <Wallet className="h-4 w-4" />
            {withdrawal.status === "REJECTED"
              ? "Submit New Withdrawal Request"
              : "Make Another Withdrawal"}
          </button>
        </div>
      )}
    </div>
  );
}

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

  const [loading, setLoading] = useState(true);
  const [activeWithdrawal, setActiveWithdrawal] = useState<MyWithdrawal | null>(null);
  const [hasActive, setHasActive] = useState(false);
  const [showForm, setShowForm] = useState(false);

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

  useEffect(() => {
    let cancelled = false;
    WithdrawalService.getMyLatest()
      .then((res) => {
        if (cancelled) return;
        if (res.withdrawal) {
          setActiveWithdrawal(res.withdrawal);
          setHasActive(res.hasActive);
        }
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoading(false);
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
      setActiveWithdrawal({
        id: res.id,
        amount: form.amount,
        method: form.method,
        destination: form.method === "upi" ? form.upiId.trim() : "Registered bank account",
        status: res.status as any,
        reviewNote: null,
        submittedAt: null,
        createdAt: new Date().toISOString(),
      });
      setHasActive(true);
      setShowForm(false);
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
    setShowForm(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen p-4">
        <div className="mx-auto max-w-5xl flex items-center justify-center py-20">
          <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
        </div>
      </div>
    );
  }

  if (!showForm && activeWithdrawal) {
    return (
      <div className="min-h-screen p-4">
        <div className="mx-auto max-w-5xl space-y-5">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
              Withdraw Funds
            </h1>
            <p className="mt-1 text-sm text-slate-400">
              Request a withdrawal to your bank or UPI
            </p>
          </div>
          <WithdrawalStatusPage withdrawal={activeWithdrawal} onNewRequest={resetForm} />
        </div>
      </div>
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
