"use client";

import { useCallback, useState } from "react";
import { Check, ChevronLeft, ChevronRight, Wallet, BadgeCheck, Loader2, AlertCircle } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

import {
  STEPS,
  BANK_DETAILS,
  initialFormState,
} from "./types";
import type { FormChange, FormErrors, FormState } from "./types";
import { currency } from "./format";
import { StepDots } from "./StepDots";
import { PaymentDetails } from "./PaymentDetails";
import { PaymentConfirmation } from "./PaymentConfirmation";
import { ReviewSubmit } from "./ReviewSubmit";
import { SubmitRequest } from "./SubmitRequest";
import { SlipRow } from "./SlipRow";
import { DepositService, type DepositStatus } from "@/services/deposit.service";
import {
  containsUnsafe,
  sanitizeAmount,
  sanitizeText,
  sanitizeTransactionId,
  AMOUNT_PATTERN,
  TRANSACTION_ID_PATTERN,
} from "@/utils/validation";

/**
 * AddPaymentPage
 * ---------------------------------------------------------------
 * Flow: Scan & pay -> confirm (txn id + screenshot) -> review -> submit.
 * The request is created server-side with the logged-in session user;
 * "User Name / User Type / Request Type" are display-only configuration.
 * ---------------------------------------------------------------
 */

export default function AddPaymentPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [result, setResult] = useState<{
    amount: string;
    txnId: string;
    status: DepositStatus;
  } | null>(null);

  const updateField: FormChange = useCallback((key, value) => {
    let safeValue: FormState[keyof FormState] = value;
    if (typeof safeValue === "string") {
      safeValue =
        key === "amount"
          ? (sanitizeAmount(safeValue) as FormState[keyof FormState])
          : key === "txnId"
            ? (sanitizeTransactionId(safeValue) as FormState[keyof FormState])
            : (sanitizeText(safeValue) as FormState[keyof FormState]);
    }
    setForm((prev) => ({ ...prev, [key]: safeValue }) as FormState);
    setErrors((prev) => {
      const next = { ...prev };
      if (key === "screenshot") {
        delete next.file;
      } else {
        delete next[key as keyof FormErrors];
      }
      return next;
    });
  }, []);

  const validateStep1 = () => {
    const errs: FormErrors = {};
    const amount = form.amount.trim();
    if (!amount || !AMOUNT_PATTERN.test(amount) || Number(amount) <= 0)
      errs.amount = "Enter a valid amount (e.g. 1000 or 2500.50).";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const validateStep2 = () => {
    const errs: FormErrors = {};
    const txnId = form.txnId.trim();
    if (containsUnsafe(txnId))
      errs.txnId = "Transaction id contains invalid characters.";
    else if (!txnId || !TRANSACTION_ID_PATTERN.test(txnId))
      errs.txnId =
        "Enter a valid UPI transaction id (6–40 letters, numbers, - . _).";
    if (!form.screenshot)
      errs.file = "Attach a screenshot of the payment confirmation.";
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.screenshot) return;
    setSubmitting(true);
    setSubmitError(null);
    try {
      const res = await DepositService.create({
        amount: form.amount.trim(),
        transactionId: form.txnId.trim(),
        screenshot: form.screenshot,
      });
      setResult({
        amount: res.amount,
        txnId: form.txnId,
        status: res.status,
      });
      setSubmitted(true);
    } catch (err) {
      setSubmitError(
        err instanceof Error ? err.message : "Failed to submit payment request",
      );
    } finally {
      setSubmitting(false);
    }
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setForm(initialFormState);
    setErrors({});
    setResult(null);
    setSubmitError(null);
  };

  if (submitted) {
    return (
      <div className="mx-auto flex min-h-[560px] max-w-md flex-col items-center justify-center px-6 text-center">
        <div className="mb-5 flex h-14 w-14 items-center justify-center ">
          <BadgeCheck className="h-14 w-14 text-emerald-400" />
        </div>
        <h1 className="text-lg font-medium text-slate-50">
          Payment request submitted
        </h1>
        <p className="mt-2 max-w-xs text-sm text-slate-400">
          We&apos;ve sent {currency(result?.amount ?? form.amount)} for review.
          You&apos;ll see it move to verified once the admin team confirms your
          transaction id and screenshot.
        </p>
        <div className="mt-6 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-left">
          <SlipRow label="Transaction id" value={form.txnId} mono />
          <SlipRow
            label="Status"
            value={(result?.status ?? "PENDING").replace("_", " ")}
            badge="pending"
          />
        </div>
        <button
          type="button"
          onClick={resetForm}
          className="mt-8 text-sm font-medium text-indigo-500 underline underline-offset-4"
        >
          Add another payment
        </button>
      </div>
    );
  }

  const isLast = step === STEPS.length;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            Add Funds
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Wallet className="h-5 w-5 text-indigo-600 shrink-0" />
              <h2 className="text-sm font-semibold text-slate-300">
                Scan, pay & confirm your deposit
              </h2>
            </div>
            <StepDots currentStep={step} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {step === 1 && (
                <PaymentDetails
                  data={form}
                  errors={errors}
                  onChange={updateField}
                />
              )}
              {step === 2 && (
                <PaymentConfirmation
                  data={form}
                  errors={errors}
                  onChange={updateField}
                />
              )}
              {step === 3 && <ReviewSubmit data={form} />}
              {step === 4 && <SubmitRequest data={form} />}

              {submitError && (
                <div className="flex items-start gap-2 rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{submitError}</span>
                </div>
              )}

              <div className="flex items-center justify-between gap-3 pt-5 border-t border-neutral-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={step === 1 || submitting}
                  className="flex items-center gap-1.5 border-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {isLast ? (
                  <Button
                    type="submit"
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                  >
                    {submitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Check className="h-4 w-4" />
                    )}
                    {submitting ? "Submitting…" : "Submit Payment Request"}
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goNext}
                    disabled={submitting}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                  >
                    {step === 1
                      ? "I've made the payment"
                      : step === 2
                        ? "Review Request"
                        : "Continue"}
                    <ChevronRight className="h-4 w-4" />
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