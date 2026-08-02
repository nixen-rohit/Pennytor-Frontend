"use client";

import { useCallback, useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Check, ChevronLeft, ChevronRight, Wallet } from "lucide-react";

import { STEPS, initialFormState } from "./types";
import type { FormChange, FormErrors, FormState } from "./types";
import { StepDots } from "./StepDots";
import { WithdrawDetails } from "./WithdrawDetails";
import { OtpVerification } from "./OtpVerification";
import { ReviewWithdraw } from "./ReviewWithdraw";
import { Submitted } from "./Submitted";

export default function WithdrawFundPage() {
  const [step, setStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FormErrors>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField: FormChange = useCallback((key, value) => {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((prev) => {
      const next = { ...prev };
      delete next[key as keyof FormErrors];
      return next;
    });
  }, []);

  const validateStep1 = () => {
    const errs: FormErrors = {};
    if (form.method === "upi" && !form.upiId.trim())
      errs.upiId = "Enter your active UPI ID.";
    if (!form.amount || Number(form.amount) <= 0)
      errs.amount = "Enter the amount you want to withdraw.";
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

  const goNext = () => {
    if (step === 1 && !validateStep1()) return;
    if (step === 2 && !validateStep2()) return;
    setStep((s) => Math.min(s + 1, STEPS.length));
  };

  const goBack = () => setStep((s) => Math.max(s - 1, 1));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      method: form.method,
      destination: form.method === "upi" ? form.upiId : "Registered bank account",
      amount: Number(form.amount),
      currentStatus: "Pending",
    };
    // TODO: replace with real submit, e.g.
    // await axios.post("/api/withdrawals", payload);
    console.log("submitting withdrawal request", payload);
    setSubmitted(true);
  };

  const resetForm = () => {
    setSubmitted(false);
    setStep(1);
    setForm(initialFormState);
    setErrors({});
  };

  if (submitted) {
    return <Submitted data={form} onReset={resetForm} />;
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
                <WithdrawDetails data={form} errors={errors} onChange={updateField} />
              )}
              {step === 2 && (
                <OtpVerification data={form} errors={errors} onChange={updateField} />
              )}
              {step === 3 && <ReviewWithdraw data={form} />}

              <div className="flex items-center justify-between gap-3 border-t border-neutral-800 pt-5">
                <Button
                  type="button"
                  variant="outline"
                  onClick={goBack}
                  disabled={step === 1}
                  className="flex items-center gap-1.5 border-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {isLast ? (
                  <Button
                    type="submit"
                    className="flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    <Check className="h-4 w-4" />
                    Submit Withdrawal
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={goNext}
                    className="flex items-center gap-1.5 bg-indigo-600 text-white hover:bg-indigo-700"
                  >
                    {step === 1 ? "Send OTP" : "Continue"}
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
