"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Loader2,
  TriangleAlert,
  Lock,
  GraduationCap,
} from "lucide-react";

import { STEPS, initialFormState, formatINR, getSchemeById } from "./types";
import type { FormChange, FormErrors, FormState, SIPForChildSchemeData } from "./types";
import { StepDots } from "./StepDots";
import { SchemeDetails } from "./SchemeDetails";
import { PaymentAmount } from "./PaymentAmount";
import { OtpVerification } from "./OtpVerification";
import { Submitted } from "./Submitted";
import { SIPForChildService } from "@/services/sip-for-child.service";


interface Props {
  initialPlanId?: string;
}

export default function SIPForChildApplyPage({ initialPlanId }: Props) {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>({
    ...initialFormState,
    planId: initialPlanId ? (initialPlanId as "5000" | "2500") : null,
  });
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [ineligible, setIneligible] = useState<{ planId: string; lockInPeriod: string } | null>(null);
  const [balance, setBalance] = useState<number>(0);
  const [balanceLoaded, setBalanceLoaded] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [alreadyActive, setAlreadyActive] = useState<string | null>(null);
  const [submittedId, setSubmittedId] = useState<string | null>(null);
  const [submittedStatus, setSubmittedStatus] = useState<string | null>(null);

  // Derived scheme from form.planId (synchronous, no effect needed)
  const scheme = form.planId ? getSchemeById(form.planId) ?? null : null;

  // Check active applications
  useEffect(() => {
    let cancelled = false;
    if (!form.planId) return;
    SIPForChildService.myApplications()
      .then((res) => {
        if (cancelled) return;
        const planId = form.planId!;
        const hit = (res.items ?? []).find(
          (i) =>
            i.planId === planId &&
            (i.status === "PENDING" || i.status === "VERIFIED"),
        );
        if (hit) setAlreadyActive(planId);
      })
      .catch(() => undefined);
    return () => { cancelled = true; };
  }, [form.planId]);

  // Fetch balance
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
    if (!form.planId)
      errs.amount = "Select a plan first.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: FormErrors = {};
    const amountNum = form.amount ? Number(form.amount) : 0;
    const totalInvested = scheme ? scheme.monthlyInvestment * scheme.investmentYears * 12 : 0;

    if (!form.amount || amountNum <= 0)
      errs.amount = "Enter the amount you want to invest.";
    else if (amountNum < totalInvested)
      errs.amount = `Minimum investment is ${formatINR(totalInvested)}.`;
    else if (amountNum > balance)
      errs.amount = `Amount exceeds your available balance of ${formatINR(balance)}.`;

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
      await SIPForChildService.verifyPasswordAndSendOtp(
        form.password,
        form.planId!,
      );
    } catch (err) {
      setApiError(err instanceof Error ? err.message : "Failed to send OTP");
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
      if (!validateStep2()) return;
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
      const res = await SIPForChildService.createApplication({
        planId: form.planId!,
        amount: form.amount,
        password: form.password,
        otp: form.otp,
      });
      setSubmittedId(res.id);
      setSubmittedStatus(res.status);
      setSubmitted(true);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Failed to submit application";

      if (message.includes("already have an active") && message.includes("scheme application")) {
        const planMatch = message.match(/active\s+(\w+)\s+scheme/);
        const lockInMatch = message.match(/after\s+(.+)\s+when/);
        const planId = planMatch ? planMatch[1] : form.planId || '';
        const lockInPeriod = lockInMatch ? lockInMatch[1] : '10 Years';
        setIneligible({ planId, lockInPeriod });
        return;
      }

      setApiError(err instanceof Error ? err.message : "Failed to submit application");
      setErrors((prev) => ({ ...prev, otp: "Please request a fresh OTP and try again." }));
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setIneligible(null);
    setSubmittedId(null);
    setSubmittedStatus(null);
    setStep(1);
    setForm(initialFormState);
    setErrors({});
    setApiError(null);
  };

  if (alreadyActive) {
    return (
      <div className="min-h-screen p-4">
        <div className="mx-auto flex min-h-[560px] max-w-md flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 ring-1 ring-yellow-400/30">
            <Lock className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-50">
            Plan {alreadyActive} is already active
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            You already have an active application for Plan {alreadyActive}.
            You have to wait until the scheme ends before applying again.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
            >
              <Link href="/investment/all-schemes/sip-for-child/progress">
                View Progress
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-white/20"
            >
              <Link href="/investment/all-schemes/sip-for-child">
                Back to Schemes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (submitted && submittedId && submittedStatus) {
    return (
      <Submitted
        data={form}
        requestId={submittedId}
        status={submittedStatus}
        onReset={resetForm}
        ineligible={ineligible}
      />
    );
  }

  const isLast = step === STEPS.length;

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-5xl space-y-5">

        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            SIP For Child Application
          </h1>
        </div>


        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="mb-4 flex items-center gap-2">
              <GraduationCap className="h-5 w-5 shrink-0 text-orange-400" />
              <h2 className="text-sm font-semibold text-slate-300">
                Apply for Plan {form.planId}
              </h2>
            </div>
            <StepDots currentStep={step} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {schemeLoading ? (
                <div className="flex items-center justify-center py-16">
                  <Loader2 className="h-8 w-8 animate-spin text-orange-400" />
                </div>
              ) : scheme && step === 1 && (
                <SchemeDetails scheme={scheme} />
              )}

              {step === 2 && scheme && (
                <PaymentAmount
                  data={form}
                  errors={errors}
                  onChange={updateField}
                  scheme={scheme}
                  balance={balance}
                  balanceLoaded={balanceLoaded}
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
                    className="flex items-center gap-1.5 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {submitting ? "Submitting…" : "Submit Application"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={sendingOtp}
                    className="flex items-center gap-1.5 bg-orange-600 text-white hover:bg-orange-700 disabled:opacity-60"
                  >
                    {sendingOtp ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Sending OTP&hellip;
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