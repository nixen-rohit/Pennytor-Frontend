"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  User,
  FileText,
  Landmark,
  Users,
  Loader2,
  RefreshCcw,
} from "lucide-react";
import { format } from "date-fns";
import {
  KycAdminService,
  KycFileMeta,
  KycFileType,
  KycStatus,
  type KycApplicationDetail as KycApplicationDetailData,
} from "@/services/kyc-admin.service";
import { PrivateFileImage } from "./PrivateFileImage";

const statusStyles: Record<KycStatus, string> = {
  DRAFT: "bg-neutral-600/20 text-neutral-300",
  SUBMITTED: "bg-yellow-500/20 text-yellow-400",
  UNDER_REVIEW: "bg-blue-500/20 text-blue-400",
  VERIFIED: "bg-green-600/20 text-green-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

const FILE_LABELS: Record<KycFileType, string> = {
  SELFIE: "Selfie",
  AADHAAR_FRONT: "Aadhaar Card Front",
  AADHAAR_BACK: "Aadhaar Card Back",
  PAN: "PAN Card",
  SIGNATURE: "Signature",
};

export default function KycApplicationDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const applicationId = params.id;

  const [app, setApp] = useState<KycApplicationDetailData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [deciding, setDeciding] = useState<KycStatus | null>(null);
  const [replacingFileId, setReplacingFileId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setApp(await KycAdminService.getApplication(applicationId));
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load application",
      );
    } finally {
      setLoading(false);
    }
  }, [applicationId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => void load(), 0);
    return () => clearTimeout(timeoutId);
  }, [load]);

  const decide = async (status: KycStatus) => {
    setDeciding(status);
    try {
      await KycAdminService.updateStatus(
        applicationId,
        status,
        note.trim() || undefined,
      );
      await load();
      setRejecting(false);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setDeciding(null);
    }
  };

  const replaceFile = async (
    file: KycFileMeta,
    newFile: File,
    reason: string,
  ) => {
    setReplacingFileId(file.id);
    setError(null);
    try {
      await KycAdminService.replaceFile({
        applicationId,
        fileId: file.id,
        file: newFile,
        reason,
      });
      await load();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to replace file");
    } finally {
      setReplacingFileId(null);
    }
  };

  const fileOf = (type: KycFileType) => app?.files.find((f) => f.type === type);

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error && !app) {
    return (
      <div className="min-h-screen p-4 bg-black">
        <div className="max-w-3xl mx-auto space-y-5">
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <ShieldCheck className="mx-auto h-12 w-12 text-red-400" />
              <h1 className="text-xl font-semibold text-slate-50">
                KYC application not found
              </h1>
              <p className="text-sm text-red-500">{error}</p>
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-slate-300"
                onClick={() => router.push("/admin/kyc/applications")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Applications
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-slate-300"
            onClick={() => router.push("/admin/kyc/applications")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Applications
          </Button>
          <div className="text-center h-10 w-auto border border-white/20  rounded-md flex   items-center justify-center">
            <h2 className="p-2 text-white ">KYC Status : </h2>
            <div className="p-2">
              <Badge status={app.status} />
            </div>
          </div>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-slate-50">
                  KYC Application
                </h1>
                <div className="mt-3 grid gap-2 grid-cols-2 sm:grid-cols-4 max-w-xl">
                  <InfoBlock label="Client ID" value={app.clientId ?? "N/A"} />
                  <InfoBlock label="Application ID" value={app.id} />
                  <InfoBlock
                    label="Submitted"
                    value={
                      app.submittedAt
                        ? format(
                            new Date(app.submittedAt),
                            "dd MMM yyyy, hh:mm a",
                          )
                        : "N/A"
                    }
                  />
                  <InfoBlock
                    label="Last Action"
                    value={
                      app.reviewedAt
                        ? format(
                            new Date(app.reviewedAt),
                            "dd MMM yyyy, hh:mm a",
                          )
                        : "—"
                    }
                  />
                </div>
              </div>
              <ShieldCheck className="h-10 w-10 text-indigo-600 shrink-0" />
            </div>

            <div className="space-y-6">
              <Section title="Personal Information" icon={User}>
                <Row label="Full Name" value={app.personal.fullName} />
                <Row label="Phone" value={app.personal.phone} />
                <Row
                  label="Date of Birth"
                  value={formatDate(app.personal.dob)}
                />
                <Row
                  label="Gender"
                  value={app.personal.gender || "Not provided"}
                />
                <Row
                  label="Marital Status"
                  value={app.personal.maritalStatus || "Not provided"}
                />
              </Section>

              <Section title="Documents" icon={FileText}>
                <DocRow
                  label="Selfie"
                  file={fileOf("SELFIE")}
                  applicationId={app.id}
                  onReplaceFile={replaceFile}
                  replacing={replacingFileId === fileOf("SELFIE")?.id}
                />
                <Row
                  label="Aadhaar Number"
                  value={app.documents.aadhaarNumber}
                />
                <DocRow
                  label="Aadhaar Card Front"
                  file={fileOf("AADHAAR_FRONT")}
                  applicationId={app.id}
                  onReplaceFile={replaceFile}
                  replacing={replacingFileId === fileOf("AADHAAR_FRONT")?.id}
                />
                <DocRow
                  label="Aadhaar Card Back"
                  file={fileOf("AADHAAR_BACK")}
                  applicationId={app.id}
                  onReplaceFile={replaceFile}
                  replacing={replacingFileId === fileOf("AADHAAR_BACK")?.id}
                />
                <Row label="PAN Number" value={app.documents.panNumber} />
                <DocRow
                  label="PAN Card"
                  file={fileOf("PAN")}
                  applicationId={app.id}
                  onReplaceFile={replaceFile}
                  replacing={replacingFileId === fileOf("PAN")?.id}
                />
                <DocRow
                  label="Signature"
                  file={fileOf("SIGNATURE")}
                  applicationId={app.id}
                  onReplaceFile={replaceFile}
                  replacing={replacingFileId === fileOf("SIGNATURE")?.id}
                />
              </Section>

              <Section title="Bank Details" icon={Landmark}>
                <Row
                  label="Account Holder"
                  value={app.bank.accountHolderName}
                />
                <Row label="Account Number" value={app.bank.accountNumber} />
                <Row label="IFSC Code" value={app.bank.ifscCode} />
                <Row label="Bank Name" value={app.bank.bankName} />
                <Row label="Branch Name" value={app.bank.branchName} />
                <Row
                  label="Account Type"
                  value={app.bank.accountType || "Not provided"}
                />
                <Row
                  label="Branch Address"
                  value={app.bank.branchAddress || "Not provided"}
                />
              </Section>

              <Section title="Nominee Details" icon={Users}>
                <Row label="Nominee Name" value={app.nominee.nomineeName} />
                <Row
                  label="Date of Birth"
                  value={formatDate(app.nominee.nomineeDob)}
                />
                <Row
                  label="Phone"
                  value={app.nominee.nomineePhone || "Not provided"}
                />
                <Row label="Aadhaar" value={app.nominee.nomineeAadhaar || "Not provided"} />
              </Section>
            </div>

            {app.reviewNote && (
              <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  {app.status === "REJECTED"
                    ? "Rejection Reason"
                    : "Last Decision"}
                </p>
                <p className="text-sm text-slate-200 mt-1">{app.reviewNote}</p>
                {app.reviewedAt && (
                  <p className="text-xs text-slate-500 mt-2">
                    Decided on{" "}
                    {format(new Date(app.reviewedAt), "dd MMM yyyy, hh:mm a")}
                  </p>
                )}
              </div>
            )}

            <div className="border-t border-neutral-800 mt-8 pt-6 space-y-4">
              <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <p className="text-sm text-slate-400 sm:mr-auto">
                  {app.status === "VERIFIED" || app.status === "REJECTED"
                    ? "Final decision locked. The user can resubmit to reopen this application."
                    : "Verify identity documents before deciding."}
                </p>

                <Button
                  type="button"
                  variant={app.status === "REJECTED" ? "default" : "outline"}
                  className={
                    app.status === "REJECTED"
                      ? "bg-red-600 text-white ring-2 ring-red-400/50 cursor-not-allowed"
                      : "border-red-600/40 text-red-400 hover:bg-red-600/10"
                  }
                  disabled={
                    deciding !== null ||
                    app.status === "VERIFIED" ||
                    app.status === "REJECTED"
                  }
                  onClick={() => {
                    setNote("");
                    setRejecting(true);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {app.status === "REJECTED" ? "Rejected" : "Reject"}
                </Button>
                <Button
                  type="button"
                  variant={app.status === "VERIFIED" ? "default" : "default"}
                  className={
                    app.status === "VERIFIED"
                      ? "bg-green-600 text-white ring-2 ring-green-400/50 cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white"
                  }
                  disabled={
                    deciding !== null ||
                    app.status === "VERIFIED" ||
                    app.status === "REJECTED"
                  }
                  onClick={() => decide("VERIFIED")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  {app.status === "VERIFIED" ? "Approved" : "Approve"}
                </Button>
              </div>

              {rejecting && (
                <div className="rounded-lg border border-red-600/40 bg-red-600/5 p-4 space-y-3 animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">
                      Note for this decision{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      autoFocus
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Aadhaar number does not match selfie"
                      className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                    />
                    <p className="text-xs text-slate-500">
                      Required — this reason is stored and emailed to the user
                      so they can correct and resubmit.
                    </p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 text-slate-300"
                      disabled={deciding !== null}
                      onClick={() => setRejecting(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={deciding !== null || !note.trim()}
                      onClick={() => decide("REJECTED")}
                    >
                      {deciding === "REJECTED" ? (
                        <Spinner />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Confirm Reject
                    </Button>
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Spinner() {
  return <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />;
}

function Badge({ status }: { status: KycStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className="mt-0.5 font-mono text-sm text-slate-100 truncate"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function formatDate(d: string | null | undefined) {
  if (!d) return "Not provided";
  // DOB is stored as a date-only UTC value; format the calendar day directly
  // so it never shifts with the viewer's timezone.
  const [year, month, day] = d.slice(0, 10).split("-").map(Number);
  if (!year || !month || !day) return "Not provided";
  return format(new Date(year, month - 1, day), "dd MMM yyyy");
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-indigo-500" />
        <h4 className="text-sm font-semibold text-indigo-500">{title}</h4>
      </div>
      <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 border-b border-neutral-900 last:border-0">
      <span className="text-sm text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-slate-100 text-right break-all">
        {value || "—"}
      </span>
    </div>
  );
}

/** Document row: view / update (replace) actions. */
function DocRow({
  label,
  file,
  applicationId,
  onReplaceFile,
  replacing,
}: {
  label: string;
  file?: KycFileMeta;
  applicationId: string;
  onReplaceFile: (file: KycFileMeta, newFile: File, reason: string) => void;
  replacing?: boolean;
}) {
  if (!file) {
    return <Row label={label} value="Not uploaded" />;
  }
  return (
    <Row
      label={label}
      value={
        <span className="flex items-center justify-end gap-4">
          <PrivateFileImage
            applicationId={applicationId}
            fileId={file.id}
            alt={FILE_LABELS[file.type]}
            buttonLabel="View"
          />
          <ReplaceFileButton
            onReplace={(newFile, reason) =>
              onReplaceFile(file, newFile, reason)
            }
            replacing={replacing}
          />
        </span>
      }
    />
  );
}

function ReplaceFileButton({
  onReplace,
  replacing = false,
}: {
  onReplace: (file: File, reason: string) => Promise<void> | void;
  replacing?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [reason, setReason] = useState("");
  const [picked, setPicked] = useState<File | null>(null);
  const [localError, setLocalError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const MAX_BYTES = 2 * 1024 * 1024;
  const ALLOWED = ["image/jpeg", "image/png", "image/webp", "application/pdf"];

  const pickFile = (file: File | null) => {
    setLocalError(null);
    if (!file) {
      setPicked(null);
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      setLocalError("Supported formats: JPG, PNG, WebP, PDF.");
      setPicked(null);
      return;
    }
    if (file.size > MAX_BYTES) {
      setLocalError("File is larger than 2 MB.");
      setPicked(null);
      return;
    }
    setPicked(file);
  };

  const reset = () => {
    setReason("");
    setPicked(null);
    setLocalError(null);
    if (inputRef.current) inputRef.current.value = "";
  };

  const canSubmit = picked !== null && reason.trim().length >= 3;

  return (
    <Dialog
      open={open}
      onOpenChange={(next) => {
        setOpen(next);
        if (!next) reset();
      }}
    >
      <DialogTrigger asChild>
        <button
          type="button"
          className="inline-flex items-center gap-1 text-xs text-green-400 hover:text-green-300"
          title="Update document"
        >
          <RefreshCcw className="h-3.5 w-3.5" />
          Update
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-sm border-neutral-800">
        <DialogTitle className="text-slate-50">
          Update this document
        </DialogTitle>
        <p className="text-sm text-slate-400">
          Upload a new image below. When the new image is uploaded, the old
          image will be deleted from the server. The swap is recorded in the
          audit trail and the application status does not change. A short
          reason is required.
        </p>

        <div className="space-y-3 pt-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,application/pdf"
            onChange={(e) => pickFile(e.target.files?.[0] ?? null)}
            className="block w-full cursor-pointer rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-xs text-slate-300 file:mr-3 file:rounded file:border-0 file:bg-neutral-800 file:px-2 file:py-1 file:text-xs file:text-slate-200"
          />
          <textarea
            rows={2}
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="e.g. Customer re-sent a clearer Aadhaar photo"
            maxLength={500}
            className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
          />
          <div className="flex items-center justify-between text-xs text-slate-500">
            <span>{reason.trim().length}/500 · min 3</span>
            {picked ? <span className="text-green-400">File selected</span> : null}
          </div>
          {localError ? (
            <p className="text-xs text-red-400">{localError}</p>
          ) : null}
        </div>

        <div className="flex justify-end gap-3 pt-3">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-slate-300"
            onClick={() => setOpen(false)}
          >
            Cancel
          </Button>
          <Button
            type="button"
            className="bg-green-600 hover:bg-green-700 text-white"
            disabled={replacing || !canSubmit}
            onClick={async () => {
              if (!picked) return;
              await onReplace(picked, reason.trim());
              setOpen(false);
            }}
          >
            {replacing ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : null}
            Update
No Fixed Deposits Yet
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

