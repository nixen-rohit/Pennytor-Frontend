"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ChevronLeft, ChevronRight, Save } from "lucide-react";

import { PHASES, FormState, initialFormState } from "@/components/User/KYC/types";
import { StepTimeline } from "@/components/User/KYC/StepTimeline";
import { PersonalInfo } from "@/components/User/KYC/PersonalInfo";
import { UploadDocument } from "@/components/User/KYC/UploadDocument";
import { BankDetails } from "@/components/User/KYC/BankDetails";
import { NomineeDetails } from "@/components/User/KYC/NomineeDetails";
import { ReviewStep } from "@/components/User/KYC/ReviewStep";
import { OtpVerification } from "@/components/User/KYC/OtpVerification";
import { SubmissionSuccess } from "@/components/User/KYC/SubmissionSuccess";
import { validateStep, type FieldErrors } from "@/components/User/KYC/validation";
import { sanitizeText } from "@/utils/validation";

export default function KYCVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [showOtp, setShowOtp] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FieldErrors>({});

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    const safeValue = typeof value === "string" ? sanitizeText(value) : value;
    setForm((prev) => ({ ...prev, [key]: safeValue }));
    setErrors((prev) => {
      if (!(key in prev)) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  }

  const isFirst = currentStep === 1;
  const isLast = currentStep === PHASES.length;

  function handleNext() {
    const errs = validateStep(currentStep, form);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setCurrentStep((s) => s + 1);
    }
  }

  function handleSubmit() {
    console.log("Submit KYC:", form);
  }

  function handleSaveDraft() {
    console.log("Save draft:", form);
  }

  function handleOtpVerified(otp: string) {
    console.log("OTP verified:", otp);
    handleSubmit();
    setSubmitted(true);
  }

  if (submitted) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto space-y-5">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <SubmissionSuccess />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showOtp) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto space-y-5">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <OtpVerification
                onBack={() => setShowOtp(false)}
                onVerified={handleOtpVerified}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4 ">
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            KYC Verification
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <ShieldCheck className="h-5 w-5 text-indigo-600 shrink-0" />
              <h2 className="text-sm font-semibold text-slate-300">
                Identity & Document Verification
              </h2>
            </div>
            <StepTimeline currentStep={currentStep} />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6" noValidate>
              {currentStep === 1 && (
                <PersonalInfo data={form} errors={errors} onChange={updateField} />
              )}
              {currentStep === 2 && (
                <UploadDocument data={form} errors={errors} onChange={updateField} />
              )}
              {currentStep === 3 && (
                <BankDetails data={form} errors={errors} onChange={updateField} />
              )}
              {currentStep === 4 && (
                <NomineeDetails data={form} errors={errors} onChange={updateField} />
              )}
              {currentStep === 5 && <ReviewStep data={form} />}

              <div className="flex items-center justify-between gap-3 pt-5 border-t border-neutral-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  disabled={isFirst}
                  className="flex items-center gap-1.5 border-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    className="flex items-center gap-1.5  border-white/20"
                  >
                    <Save className="h-4 w-4" />
                    Save as Draft
                  </Button>

                  {isLast ? (
                    <Button
                      type="button"
                      onClick={() => setShowOtp(true)}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5  border-white/20"
                    >
                      <ShieldCheck className="h-4 w-4" />
                      Review & Submit
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5  border-white/20"
                    >
                      Continue
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
