"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShieldCheck, ChevronLeft, ChevronRight, Save, Loader2, AlertCircle, RotateCcw } from "lucide-react";

import { PHASES, FormState, initialFormState } from "@/components/User/KYC/types";
import { StepTimeline } from "@/components/User/KYC/StepTimeline";
import { PersonalInfo } from "@/components/User/KYC/PersonalInfo";
import { UploadDocument } from "@/components/User/KYC/UploadDocument";
import { BankDetails } from "@/components/User/KYC/BankDetails";
import { NomineeDetails } from "@/components/User/KYC/NomineeDetails";
import { ReviewStep } from "@/components/User/KYC/ReviewStep";
import { SubmissionSuccess } from "@/components/User/KYC/SubmissionSuccess";
import { validateStep, type FieldErrors } from "@/components/User/KYC/validation";
import { sanitizeText } from "@/utils/validation";
import { KycService, type KycFileType, type KycApplicationState } from "@/services/kyc.service";
import { AuthService } from "@/services/auth.service";

const FILE_UPLOADS: Array<{ key: keyof FormState; type: KycFileType }> = [
  { key: "selfieFile", type: "SELFIE" },
  { key: "aadhaarFrontFile", type: "AADHAAR_FRONT" },
  { key: "aadhaarBackFile", type: "AADHAAR_BACK" },
  { key: "panFile", type: "PAN" },
  { key: "signatureFile", type: "SIGNATURE" },
];

export default function KYCVerification() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState(1);
  const [submittedApp, setSubmittedApp] = useState<KycApplicationState | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const [form, setForm] = useState<FormState>(initialFormState);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [clientId, setClientId] = useState<string | null>(null);
  const [rejectionReason, setRejectionReason] = useState<string | null>(null);
  const [statusLoading, setStatusLoading] = useState(true);
  const [statusError, setStatusError] = useState(false);

  const loadStatus = async () => {
    setStatusLoading(true);
    setStatusError(false);
    try {
      const [me, app] = await Promise.all([
        AuthService.me(),
        KycService.myApplication(),
      ]);
      setClientId(me?.data?.user?.clientId ?? null);
      if (!app) {
        setRejectionReason(null);
        return;
      }
      if (
        app.status === "SUBMITTED" ||
        app.status === "UNDER_REVIEW" ||
        app.status === "VERIFIED"
      ) {
        // Already submitted — back from the OTP page or a returning visit.
        // The details are locked; show them read-only.
        setSubmittedApp(app);
      } else if (app.status === "REJECTED") {
        setRejectionReason(app.rejectionReason);
      }
    } catch {
      // A failed fetch must never look like a fresh, unsubmitted account.
      setStatusError(true);
    } finally {
      setStatusLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => void loadStatus(), 0);
    return () => clearTimeout(timeoutId);
  }, []);

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

  function handleSaveDraft() {
    console.log("Save draft:", form);
  }

  function buildPayload() {
    const {
      selfieFile,
      aadhaarFrontFile,
      aadhaarBackFile,
      panFile,
      signatureFile,
      confirmAccountNumber,
      ...rest
    } = form;
    // confirmAccountNumber is a client-side-only validation field — it is
    // never sent to the API.
    void selfieFile;
    void aadhaarFrontFile;
    void aadhaarBackFile;
    void panFile;
    void signatureFile;
    void confirmAccountNumber;
    return {
      ...rest,
      dob: rest.dob ? rest.dob.toISOString() : null,
      nomineeDob: rest.nomineeDob ? rest.nomineeDob.toISOString() : null,
    };
  }

  /**
   * Review & Submit: persists the structured data (DRAFT) and uploads every
   * selected document. Only after all of this succeeds does the user move to
   * the OTP page at /otp-verify/kyc-acount — nothing is submitted until the
   * OTP is verified.
   */
  async function handlePrepareSubmit() {
    setSubmitting(true);
    setSubmitError(null);
    try {
      const app = await KycService.createApplication(buildPayload());

      for (const { key, type } of FILE_UPLOADS) {
        const file = form[key] as File | null;
        if (file) {
          await KycService.uploadFile(app.id, type, file);
        }
      }

      router.push(`/otp-verify/kyc-acount?applicationId=${app.id}`);
    } catch (error) {
      setSubmitError(
        error instanceof Error ? error.message : "Failed to prepare submission. Please try again.",
      );
    } finally {
      setSubmitting(false);
    }
  }

  if (submittedApp) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto space-y-5">
          <Card className="shadow-sm">
            <CardContent className="p-6">
              <SubmissionSuccess app={submittedApp} />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (statusLoading) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white">
        <Loader2 className="h-6 w-6 animate-spin text-indigo-400" />
      </div>
    );
  }

  if (statusError) {
    return (
      <div className="min-h-screen p-4">
        <div className="max-w-3xl mx-auto">
          <Card className="shadow-sm">
            <CardContent className="flex flex-col items-center gap-4 p-10 text-center">
              <AlertCircle className="h-8 w-8 text-red-400" />
              <div>
                <h1 className="text-lg font-semibold text-slate-50">
                  Couldn&apos;t load your KYC status
                </h1>
                <p className="mt-1 text-sm text-slate-400">
                  A temporary problem fetching your application. Nothing
                  changed — try again.
                </p>
              </div>
              <Button
                type="button"
                onClick={() => void loadStatus()}
                className="bg-indigo-600 hover:bg-indigo-700 text-white"
              >
                <RotateCcw className="mr-2 h-4 w-4" />
                Retry
              </Button>
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
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-slate-50">
              KYC Verification
            </h1>
            {clientId && (
              <span className="inline-flex items-center rounded-full border border-indigo-400/30 bg-indigo-500/10 px-3 py-1 text-xs font-semibold text-indigo-300">
                Client ID: {clientId}
              </span>
            )}
          </div>
        </div>

        {rejectionReason && (
          <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4">
            <p className="text-xs font-semibold text-red-400 uppercase tracking-wide">
             Your KYC request was rejected
            </p>
            <p className="mt-1 rounded-lg bg-red-400/10 px-3 py-2 text-xs text-red-200/90">
              Reason: {rejectionReason}
            </p>
            <p className="mt-1 text-xs text-slate-400">
              Fix the issue above and resubmit your details to continue.
            </p>
          </div>
        )}

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
                      onClick={handlePrepareSubmit}
                      disabled={submitting}
                      className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5  border-white/20"
                    >
                      {submitting ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <ShieldCheck className="h-4 w-4" />
                      )}
                      {submitting ? "Uploading & Securing..." : "Review & Submit"}
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

              {submitError && (
                <p className="text-sm text-red-500 pt-3">{submitError}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
