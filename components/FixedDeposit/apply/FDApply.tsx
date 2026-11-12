"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  ChevronLeft,
  ChevronRight,
  Loader2,
} from "lucide-react";
import { FixedDepositService, type FDPlanId } from "@/services/fixed-deposit.service";

import { StepDots } from "./StepDots";
import { SchemeDetails } from "./SchemeDetails";
import { OtpVerification } from "./OtpVerification";
import { Submitted } from "./Submitted";
import {
  STEPS,
  initialFormState,
  getSchemeById,
  FD_SCHEMES,
} from "./types";
import type { FormChange, FormErrors, FormState, FDSchemeData } from "./types";

interface Props {
  planId: string;
  planDetails: {
    amount: string;
    lockInPeriod: string;
    payoutMode: string;
    emi: string;
    totalPayout: string;
  };
}

export default function FDApply({ planId, planDetails }: Props) {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    ...initialFormState,
    planId: planId || null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [ineligible, setIneligible] = useState(false);
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoaded, setBalanceLoaded] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [scheme, setScheme] = useState<FDSchemeData | null>(null);
  const [schemeLoading, setSchemeLoading] = useState(true);
  const [alreadyActive, setAlreadyActive] = useState(false);
  const submittedRef = useRef<{ id: string; status: string } | null>(null);

  // Resolve scheme data on mount
  useEffect(() => {
    if (planId) {
      const schemeData = getSchemeById(planId);
      if (schemeData) setScheme(schemeData);
    }
    setSchemeLoading(false);
  }, [planId]);

  // Check for already active application
  useEffect(() => {
    let cancelled = false;
    FixedDepositService.myApplications()
      .then((apps) => {
        if (cancelled || !planId) return;
        const active = apps.find(
          (a) => a.planId === planId && (a.status === "PENDING" || a.status === "VERIFIED"),
        );
        if (active) setAlreadyActive(true);
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, [planId]);

  // Fetch wallet balance
  useEffect(() => {
    let cancelled = false;
    void fetch(`${process.env.NEXT_PUBLIC_API_URL}/withdrawals/mine`, {
      credentials: "include",
      cache: "no-store",
    })
      .then((res) => res.json())
      .then((res) => {
        if (!cancelled) {
          setBalance(Number(res.balance) || 0);
          setBalanceLoaded(true);
        }
      })
      .catch(() => {
        if (!cancelled) setBalanceLoaded(true);
      });
    return () => { cancelled = true; };
  }, []);

  const onChange: FormChange = useCallback(
    (key, value) => {
      setForm((prev) => ({ ...prev, [key]: value }));
      setErrors((prev) => ({ ...prev, [key]: undefined }));
      setApiError(null);
    },
    [],
  );

  const validate = useCallback(
    (currentStep: number): boolean => {
      const e: FormErrors = {};
      if (currentStep === 1) {
        if (!form.planId) {
          setApiError("Please select a plan");
          return false;
        }
      }
      if (currentStep === 3) {
        if (!form.password) e.password = "Password is required";
        if (form.otp.length !== 6) e.otp = "Enter the 6-digit OTP";
      }
      setErrors(e);
      return Object.keys(e).length === 0;
    },
    [form],
  );

  const goNext = useCallback(() => {
    if (!validate(step)) return;
    setStep((s) => Math.min(s + 1, 3));
  }, [step, validate]);

  const goBack = useCallback(() => {
    setStep((s) => Math.max(s - 1, 1));
    setApiError(null);
  }, []);

  const handleSendOtp = useCallback(async () => {
    if (!form.password || !form.planId) return;
    setSendingOtp(true);
    setApiError(null);
    try {
      await FixedDepositService.verifyPasswordAndSendOtp(
        form.password,
        form.planId as FDPlanId,
      );
    } catch (err) {
      throw err;
    } finally {
      setSendingOtp(false);
    }
  }, [form.password, form.planId]);

  const handleResendOtp = useCallback(async () => {
    if (!form.password || !form.planId) return;
    setSendingOtp(true);
    try {
      await FixedDepositService.verifyPasswordAndSendOtp(
        form.password,
        form.planId as FDPlanId,
      );
    } finally {
      setSendingOtp(false);
    }
  }, [form.password, form.planId]);

  const handleSubmit = useCallback(async () => {
    if (!validate(3) || !form.planId) return;
    setSubmitting(true);
    setApiError(null);
    try {
      const result = await FixedDepositService.createApplication(
        form.planId as FDPlanId,
        form.password,
        form.otp,
      );
      submittedRef.current = result;
      setSubmitted(true);
      setStep(3);
    } catch (err: any) {
      const msg = err?.message || "Failed to submit application";
      setApiError(msg);
      if (msg.toLowerCase().includes("already have an active")) {
        setIneligible(true);
      }
    } finally {
      setSubmitting(false);
    }
  }, [form, validate]);

  const resetForm = useCallback(() => {
    setForm({ ...initialFormState, planId: planId || null });
    setStep(1);
    setSubmitted(false);
    setIneligible(false);
    setApiError(null);
    submittedRef.current = null;
  }, [planId]);

  // Loading state
  if (schemeLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b]">
        <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
      </div>
    );
  }

  // Already active guard
  if (alreadyActive) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#09090b] p-4">
        <div className="mx-auto max-w-md space-y-6 text-center">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/20">
            <svg className="h-10 w-10 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-slate-50">Already Applied</h1>
          <p className="text-sm text-slate-400">
            You already have an active Fixed Deposit application for this plan.
          </p>
          <div className="flex gap-3">
            <Link href="/investment/all-schemes/fixed-deposite" className="flex-1">
              <Button variant="outline" className="w-full border-white/20 text-white">
                Back to Plans
              </Button>
            </Link>
            <Link href="/investment/all-schemes/fixed-deposite/progress" className="flex-1">
              <Button className="w-full bg-amber-400 text-black hover:bg-amber-300">
                View Progress
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Submitted state
  if (submitted) {
    return (
      <Submitted
        scheme={scheme}
        requestId={submittedRef.current?.id || ""}
        status={submittedRef.current?.status || "PENDING"}
        ineligible={ineligible}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-4 lg:px-6 py-8 text-white ">
      <div className="mx-auto max-w-4xl">
        {/* Back link */}
        <Link
          href="/investment/all-schemes/fixed-deposite"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Plans
        </Link>

        {/* Step dots */}
        <StepDots currentStep={step} />

        {/* API error */}
        {apiError && (
          <div className="mb-4 flex items-center gap-2 rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-400">
            {apiError}
          </div>
        )}

        {/* Step content */}
        {step === 1 && scheme && (
          <Card className="border-white/10 bg-[#111217]">
            <CardContent className="p-6">
              <SchemeDetails scheme={scheme} />
              <Button
                onClick={goNext}
                className="mt-6 w-full bg-amber-400 text-black hover:bg-amber-300"
              >
                Continue
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </CardContent>
          </Card>
        )}

        {step === 2 && scheme && (
          <Card className="border-white/10 bg-[#111217]">
            <CardContent className="p-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
              <div className="mb-4 border-b border-white/10 pb-2">
                <h3 className="text-base font-semibold text-slate-50">Payment Summary</h3>
              </div>

              <div className="space-y-4">
                {/* Deposit Amount */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-5">
                  <p className="text-xs text-zinc-500">Deposit Amount (one-time)</p>
                  <p className="mt-1 text-3xl font-bold text-emerald-400">
                    {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(scheme.depositAmount)}
                  </p>
                  <p className="mt-1 text-xs text-zinc-500">
                    This amount will be debited from your wallet on admin approval.
                  </p>
                </div>

                {/* Summary grid */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">Lock-in</p>
                    <p className="mt-0.5 text-sm font-bold text-white">{scheme.lockInMonths} months</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">Payout Mode</p>
                    <p className="mt-0.5 text-sm font-bold text-white capitalize">{scheme.payoutMode}</p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">EMI Amount</p>
                    <p className="mt-0.5 text-sm font-bold text-white">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(scheme.emiAmount)}
                    </p>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] uppercase tracking-wider text-zinc-500">Total Payout</p>
                    <p className="mt-0.5 text-sm font-bold text-emerald-400">
                      {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(scheme.totalPayout)}
                    </p>
                  </div>
                </div>

                {/* Available Balance */}
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-zinc-400">Available Balance</span>
                    {balanceLoaded ? (
                      <span className={`text-sm font-bold ${balance >= scheme.depositAmount ? "text-emerald-400" : "text-red-400"}`}>
                        {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(balance)}
                      </span>
                    ) : (
                      <Loader2 className="h-4 w-4 animate-spin text-zinc-500" />
                    )}
                  </div>
                  {!balanceLoaded || balance >= scheme.depositAmount ? null : (
                    <p className="mt-2 text-xs text-red-400">
                      Insufficient balance. You need {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(scheme.depositAmount)} to apply.
                    </p>
                  )}
                </div>

                {/* Note */}
                <div className="rounded-xl border border-blue-500/20 bg-blue-500/5 p-4">
                  <p className="text-xs leading-5 text-blue-400">
                    No money is deducted now. Your wallet will be debited only when an admin approves your application.
                  </p>
                </div>
              </div>

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={goBack}
                  variant="outline"
                  className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={goNext}
                  disabled={!balanceLoaded || balance < scheme.depositAmount}
                  className="flex-1 bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-50"
                >
                  Continue
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        )}

        {step === 3 && (
          <Card className="border-white/10 bg-[#111217]">
            <CardContent className="p-6">
              <OtpVerification
                data={form}
                errors={errors}
                onChange={onChange}
                onResend={handleResendOtp}
                resendBusy={sendingOtp}
                onSendOtp={handleSendOtp}
                sendingOtp={sendingOtp}
              />

              <div className="mt-6 flex gap-3">
                <Button
                  onClick={goBack}
                  variant="outline"
                  className="flex-1 border-white/10 bg-white/5 text-white hover:bg-white/10"
                >
                  <ChevronLeft className="mr-2 h-4 w-4" />
                  Previous
                </Button>
                <Button
                  onClick={handleSubmit}
                  disabled={submitting || form.otp.length !== 6}
                  className="flex-1 bg-amber-400 text-black hover:bg-amber-300 disabled:opacity-50"
                >
                  {submitting ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Submit Application
                      <ChevronRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
