"use client";

import { useState } from "react";
import { useRouter, useParams } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
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
  ZoomIn,
} from "lucide-react";
import { format } from "date-fns";
import { CLIENT_ID_PATTERN } from "@/utils/validation";

import {
  initialProfileRequests,
  type ProfileRequest,
  type ReviewStatus,
} from "../types";

const statusStyles: Record<ReviewStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  APPROVED: "bg-green-600/20 text-green-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

/** Masks identifiers the same way the backend does: only the last 4 digits
 * remain, e.g. `********7412`. Full values are never displayed — the
 * uploaded document images are the verification source of truth. */
const maskIdentifier = (value: string): string => {
  const digits = value.replace(/\s+/g, "");
  if (!digits) return value;
  return `${"*".repeat(Math.max(4, digits.length - 4))}${digits.slice(-4)}`;
};

export default function ProfileReview() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const [localStatus, setLocalStatus] = useState<ReviewStatus | null>(null);

  const request: ProfileRequest | undefined = initialProfileRequests.find(
    (r) => r.id === params.id,
  );

  if (!request) {
    return (
      <div className="min-h-screen p-4 bg-black">
        <div className="max-w-3xl mx-auto space-y-5">
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <ShieldCheck className="mx-auto h-12 w-12 text-red-400" />
              <h1 className="text-xl font-semibold text-slate-50">
                Profile request not found
              </h1>
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-slate-300"
                onClick={() => router.push("/admin/request/profile")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Profile Requests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  const status = localStatus ?? request.status;

  const isClientIdValid = CLIENT_ID_PATTERN.test(request.clientId);
  const isClientIdUnique =
    initialProfileRequests.filter((r) => r.clientId === request.clientId)
      .length === 1;

  const handleDecision = (decision: "APPROVED" | "REJECTED") => {
    setLocalStatus(decision);
    console.log(`Decision for ${request.clientId}: ${decision}`);
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-slate-300"
            onClick={() => router.push("/admin/request/profile")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Button>
          <Badge status={status} />
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div>
                <h1 className="text-2xl font-semibold text-slate-50">
                  Profile Details
                </h1>
                <p className="mt-1 font-bold text-sm text-slate-500">
                  Client ID:{" "}
                  <span className="font-mono text-slate-200">
                    {request.clientId}
                  </span>
                  <span
                    className={`ml-2 inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                      isClientIdValid && isClientIdUnique
                        ? "bg-green-600/20 text-green-400"
                        : "bg-red-600/20 text-red-400"
                    }`}
                  >
                    {isClientIdUnique ? "Unique" : "Duplicate"} ·{" "}
                    {isClientIdValid ? "Valid Format" : "Invalid Format"}
                  </span>
                </p>

                <p className="text-xs text-slate-500 mt-1">
                  Recieved{" "}
                  <span className="font-mono text-slate-200">
                    {format(request.submittedAt, "dd MMM yyyy, hh:mm a")}
                  </span>
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <Section title="Personal Information" icon={User}>
                <Row label="Full Name" value={request.fullName} />
                <Row label="Date of Birth" value={request.dob} />
                <Row label="Gender" value={request.gender} />
                <Row label="Marital Status" value={request.maritalStatus} />
                <Row label="Phone Number" value={request.phone} />
                <Row label="Email" value={request.email} />
              </Section>

              <Section title="Documents" icon={FileText}>
                <Row
                  label="Selfie"
                  value={
                    request.selfie ? (
                      <DocImage
                        src={request.selfie}
                        alt="Selfie"
                        className="h-20 w-20 rounded-full object-cover border-2 border-neutral-700"
                        previewClassName="rounded-full"
                      />
                    ) : (
                      "Not uploaded"
                    )
                  }
                />
                <Row label="Aadhaar Card Number" value={maskIdentifier(request.aadhaarNumber)} />
                <Row
                  label="Aadhaar Card Front "
                  value={
                    request.aadhaarFront ? (
                      <DocImage
                        src={request.aadhaarFront}
                        alt="Aadhaar Card Front"
                        className="h-20 rounded-md border border-neutral-700 object-cover"
                      />
                    ) : (
                      "Not uploaded"
                    )
                  }
                />
                <Row
                  label="Aadhaar Card Back"
                  value={
                    request.aadhaarBack ? (
                      <DocImage
                        src={request.aadhaarBack}
                        alt="Aadhaar Card Back"
                        className="h-20 rounded-md border border-neutral-700 object-cover"
                      />
                    ) : (
                      "Not uploaded"
                    )
                  }
                />
                <Row label="PAN Number" value={maskIdentifier(request.panNumber)} />
                <Row
                  label="PAN Card"
                  value={
                    request.panImage ? (
                      <DocImage
                        src={request.panImage}
                        alt="PAN Card"
                        className="h-20 rounded-md border border-neutral-700 object-cover"
                      />
                    ) : (
                      "Not uploaded"
                    )
                  }
                />
                <Row
                  label="Signature"
                  value={
                    request.signatureImage ? (
                      <DocImage
                        src={request.signatureImage}
                        alt="Signature"
                        className="h-20 rounded-md border border-neutral-700 object-cover"
                      />
                    ) : (
                      "Not uploaded"
                    )
                  }
                />
              </Section>

              <Section title="Bank Details" icon={Landmark}>
                <Row
                  label="Account Holder"
                  value={request.accountHolderName}
                />
                <Row label="Account Number" value={maskIdentifier(request.accountNumber)} />
                <Row label="IFSC Code" value={maskIdentifier(request.ifscCode)} />
                <Row label="Bank Name" value={request.bankName} />
                <Row label="Branch Name" value={request.branchName} />
                <Row label="Account Type" value={request.accountType} />
                <Row label="Branch Address" value={request.branchAddress} />
              </Section>

              <Section title="Nominee Details" icon={Users}>
                <Row label="Nominee Name" value={request.nomineeName} />
                <Row label="Date of Birth" value={request.nomineeDob} />
                <Row label="Phone" value={request.nomineePhone} />
                <Row label="Aadhaar" value={maskIdentifier(request.nomineeAadhaar)} />
              </Section>
            </div>

            <div className="border-t border-neutral-800 mt-8 pt-6">
              {localStatus ? (
                <div
                  className={`flex items-center justify-center gap-2 rounded-lg border border-neutral-800 py-6 ${
                    localStatus === "APPROVED"
                      ? "bg-green-600/10 text-green-400"
                      : "bg-red-600/10 text-red-400"
                  }`}
                >
                  {localStatus === "APPROVED" ? (
                    <CheckCircle2 className="h-6 w-6" />
                  ) : (
                    <XCircle className="h-6 w-6" />
                  )}
                  <p className="font-semibold">
                    Request {localStatus === "APPROVED" ? "Approved" : "Rejected"}
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  <p className="text-sm text-slate-400 sm:mr-auto">
                    Review the details above before approving this request.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-600/40 text-red-400 hover:bg-red-600/10"
                    onClick={() => handleDecision("REJECTED")}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Reject
                  </Button>
                  <Button
                    type="button"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => handleDecision("APPROVED")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Approve
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
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

function DocImage({
  src,
  alt,
  className,
  previewClassName,
}: {
  src: string;
  alt: string;
  className?: string;
  previewClassName?: string;
}) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          className="group relative inline-flex cursor-zoom-in"
          aria-label={`View ${alt}`}
        >
          <img
            src={src}
            alt={alt}
            className={className}
          />
          <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
            <ZoomIn className="h-6 w-6 text-white" />
          </span>
        </button>
      </DialogTrigger>
      <DialogContent
        className="max-w-[90vw] sm:max-w-3xl border-neutral-800"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="flex flex-col items-center gap-3 p-2">
          <img
            src={src}
            alt={alt}
            className={`max-h-[80vh] w-auto object-contain rounded-md ${previewClassName ?? ""}`}
          />
          <p className="text-sm text-slate-400">{alt}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}