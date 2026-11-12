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
  // Document types already stored server-side for this application. They count
  // as present in validation so editing never forces a re-upload.
  const [existingFiles, setExistingFiles] = useState<Set<KycFileType>>(
    new Set(),
  );
  const [draftSaving, setDraftSaving] = useState(false);
  const [draftNotice, setDraftNotice] = useState<string | null>(null);

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
        setExistingFiles(new Set());
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
      } else if (app.status === "REJECTED" || app.status === "DRAFT") {
        // Pre-fill form with existing data so user only fixes what's needed.
        setRejectionReason(app.rejectionReason);
        setForm(mapAppToFormState(app));
        setExistingFiles(new Set(app.files.map((f) => f.type)));
      }
    } catch {
      // A failed fetch must never look like a fresh, unsubmitted account.
      setStatusError(true);
    } finally {
      setStatusLoading(false);
    }
  };

  function mapAppToFormState(app: KycApplicationState): FormState {
    // Backend returns uppercase enum values; convert to frontend expected values
    const genderMap: Record<string, string> = {
      MALE: "Male",
      FEMALE: "Female",
      OTHER: "Other",
    };
    const maritalMap: Record<string, string> = {
      SINGLE: "Single",
      MARRIED: "Married",
      DIVORCED: "Divorced",
      WIDOWED: "Widowed",
    };
    const accountTypeMap: Record<string, string> = {
      SAVINGS: "Savings Account",
      CURRENT: "Current Account",
      SALARY: "Salary Account",
    };

    return {
      fullName: app.personal.fullName ?? "",
      phone: app.personal.phone ?? "",
      dob: app.personal.dob ? new Date(app.personal.dob) : null,
      gender: app.personal.gender ? genderMap[app.personal.gender] ?? "" : "",
      maritalStatus: app.personal.maritalStatus ? maritalMap[app.personal.maritalStatus] ?? "" : "",
      aadhaarNumber: app.documents.aadhaarNumber ?? "",
      panNumber: app.documents.panNumber ?? "",
      accountHolderName: app.bank.accountHolderName ?? "",
      accountNumber: app.bank.accountNumber ?? "",
      confirmAccountNumber: app.bank.accountNumber ?? "",
      ifscCode: app.bank.ifscCode ?? "",
      bankName: app.bank.bankName ?? "",
      branchName: app.bank.branchName ?? "",
      accountType: app.bank.accountType ? accountTypeMap[app.bank.accountType] ?? "" : "",
      branchAddress: app.bank.branchAddress ?? "",
      nomineeName: app.nominee.nomineeName ?? "",
      nomineeDob: app.nominee.nomineeDob ? new Date(app.nominee.nomineeDob) : null,
      nomineePhone: app.nominee.nomineePhone ?? "",
      nomineeAadhaar: app.nominee.nomineeAadhaar ?? "",
      // Files are not pre-filled (they need to be re-uploaded if changed),
      // but the backend keeps the existing files unless replaced.
      selfieFile: null,
      aadhaarFrontFile: null,
      aadhaarBackFile: null,
      panFile: null,
      signatureFile: null,
    };
  }

  useEffect(() => {
    const timeoutId = setTimeout(() => void loadStatus(), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  function updateField<K extends keyof FormState>(key: K, value: FormState[K]) {
    const safeValue = typeof value === "string" ? sanitizeText(value) : value;
    setForm((prev) => ({ ...prev, [key]: safeValue }));
    setDraftNotice(null);
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
    const errs = validateStep(currentStep, form, existingFiles);
    setErrors(errs);
    if (Object.keys(errs).length === 0) {
      setCurrentStep((s) => s + 1);
    }
  }

  /**
   * Persists a resumable DRAFT. The API expects the full application object,
   * so every step is validated first; on the first invalid step the wizard
   * jumps there instead of failing silently.
   */
  async function handleSaveDraft() {
    const allErrors: FieldErrors = {};
    let firstBadStep = 0;

    for (const phase of PHASES) {
      const stepErrors = validateStep(phase.step, form, existingFiles);
      if (Object.keys(stepErrors).length > 0) {
        if (firstBadStep === 0) firstBadStep = phase.step;
        Object.assign(allErrors, stepErrors);
      }
    }

    if (firstBadStep !== 0) {
      setErrors(allErrors);
      setCurrentStep(firstBadStep);
      setDraftNotice(null);
      setSubmitError(
        "Complete the highlighted fields before saving a draft.",
      );
      return;
    }

    setDraftSaving(true);
    setSubmitError(null);
    setDraftNotice(null);
    try {
      await KycService.createApplication(buildPayload());
      setDraftNotice(
        "Draft saved. Your documents will be uploaded when you submit for verification.",
      );
    } catch (error) {
      setSubmitError(
        error instanceof Error
          ? error.message
          : "Could not save the draft. Please try again.",
      );
    } finally {
      setDraftSaving(false);
    }
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
            <p className="mt-2 text-sm text-slate-300">
              Your previous details have been loaded below. Please correct the highlighted
              issues and resubmit. You only need to re-upload documents that were rejected.
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
                <PersonalInfo
                  data={form}
                  errors={errors}
                  onChange={updateField}
                  existingFiles={existingFiles}
                />
              )}
              {currentStep === 2 && (
                <UploadDocument
                  data={form}
                  errors={errors}
                  onChange={updateField}
                  existingFiles={existingFiles}
                />
              )}
              {currentStep === 3 && (
                <BankDetails data={form} errors={errors} onChange={updateField} />
              )}
              {currentStep === 4 && (
                <NomineeDetails data={form} errors={errors} onChange={updateField} />
              )}
              {currentStep === 5 && (
                <ReviewStep data={form} existingFiles={existingFiles} />
              )}

              <div className="flex flex-col-reverse sm:flex-row sm:items-center justify-between gap-3 pt-5 border-t border-neutral-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  disabled={isFirst}
                  className="flex w-full items-center justify-center gap-1.5 border-white/20 sm:w-auto"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                <div className="flex w-full flex-col-reverse sm:w-auto sm:flex-row sm:items-center gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={handleSaveDraft}
                    disabled={draftSaving || submitting}
                    className="flex w-full items-center justify-center gap-1.5 border-white/20 sm:w-auto"
                  >
                    {draftSaving ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                    {draftSaving ? "Saving..." : "Save as Draft"}
                  </Button>

                  {isLast ? (
                    <Button
                      type="button"
                      onClick={handlePrepareSubmit}
                      disabled={submitting}
                      className="flex w-full items-center justify-center gap-1.5 border-white/20 bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto"
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
                      className="flex w-full items-center justify-center gap-1.5 border-white/20 bg-indigo-600 text-white hover:bg-indigo-700 sm:w-auto"
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

              {draftNotice && (
                <p className="text-sm text-green-400 pt-3">{draftNotice}</p>
              )}
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
