"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ChevronLeft, ChevronRight, Check, Save } from "lucide-react";

import { PHASES, FormState, initialFormState } from "@/components/User/KYC/types";
import { StepTimeline } from "@/components/User/KYC/StepTimeline";
import { PersonalInfo } from "@/components/User/KYC/PersonalInfo";
import { UploadDocument } from "@/components/User/KYC/UploadDocument";
import { BankDetails } from "@/components/User/KYC/BankDetails";
import { NomineeDetails } from "@/components/User/KYC/NomineeDetails";

export default function KYCVerification() {
  const [currentStep, setCurrentStep] = useState(1);
  const [form, setForm] = useState<FormState>(initialFormState);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  const isFirst = currentStep === 1;
  const isLast = currentStep === PHASES.length;

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    console.log("Submit KYC:", form);
  }

  function handleSaveDraft() {
    console.log("Save draft:", form);
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
            <StepTimeline
              currentStep={currentStep}
              onStepClick={(step) => step < currentStep && setCurrentStep(step)}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <form onSubmit={handleSubmit} className="space-y-6" noValidate>
              {currentStep === 1 && (
                <PersonalInfo data={form} onChange={updateField} />
              )}
              {currentStep === 2 && (
                <UploadDocument data={form} onChange={updateField} />
              )}
              {currentStep === 3 && (
                <BankDetails data={form} onChange={updateField} />
              )}
              {currentStep === 4 && (
                <NomineeDetails data={form} onChange={updateField} />
              )}

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
                      type="submit"
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5  border-white/20"
                    >
                      <Check className="h-4 w-4" />
                      Submit KYC
                    </Button>
                  ) : (
                    <Button
                      type="button"
                      onClick={() => setCurrentStep((s) => s + 1)}
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
