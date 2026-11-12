import { FormState } from "@/components/User/KYC/types";
import type { KycFileType } from "@/services/kyc.service";

interface Props {
  data: FormState;
  /** Document types the server already holds for this application. */
  existingFiles?: ReadonlySet<KycFileType>;
}

function formatDate(d: Date | null) {
  if (!d) return "Not provided";
  // Date-only values are pinned to 00:00 UTC — format the UTC calendar day so
  // the display matches what was typed in every timezone.
  const day = String(d.getUTCDate()).padStart(2, "0");
  const month = MONTHS_SHORT[d.getUTCMonth()];
  return `${day} ${month} ${d.getUTCFullYear()}`;
}

const MONTHS_SHORT = [
  "Jan",
  "Feb",
  "Mar",
  "Apr",
  "May",
  "Jun",
  "Jul",
  "Aug",
  "Sep",
  "Oct",
  "Nov",
  "Dec",
];

function formatFile(f: File | null, existing: boolean) {
  if (f) return f.name;
  return existing ? "On file (unchanged)" : "Not uploaded";
}

export function ReviewStep({ data, existingFiles }: Props) {
  const onFile = (type: KycFileType) => existingFiles?.has(type) ?? false;
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Review Your Details" />
      <p className="text-sm text-slate-400 -mt-4">
        Please review all the information below before proceeding to verify.
      </p>

      <Section title="Personal Information">
        <Row label="Full Name" value={data.fullName} />
        <Row label="Phone Number" value={data.phone} />
        <Row label="Date of Birth" value={formatDate(data.dob)} />
        <Row label="Gender" value={data.gender || "Not provided"} />
        <Row label="Marital Status" value={data.maritalStatus || "Not provided"} />
        <Row label="Selfie" value={formatFile(data.selfieFile, onFile("SELFIE"))} />
      </Section>

      <Section title="Documents">
        <Row label="Aadhaar Number" value={data.aadhaarNumber} />
        <Row label="Aadhaar Front" value={formatFile(data.aadhaarFrontFile, onFile("AADHAAR_FRONT"))} />
        <Row label="Aadhaar Back" value={formatFile(data.aadhaarBackFile, onFile("AADHAAR_BACK"))} />
        <Row label="PAN Number" value={data.panNumber} />
        <Row label="PAN Card" value={formatFile(data.panFile, onFile("PAN"))} />
        <Row label="Signature" value={formatFile(data.signatureFile, onFile("SIGNATURE"))} />
      </Section>

      <Section title="Bank Details">
        <Row label="Account Holder" value={data.accountHolderName} />
        <Row label="Account Number" value={data.accountNumber} />
        <Row label="Confirm Account Number" value={data.confirmAccountNumber} />
        <Row label="IFSC Code" value={data.ifscCode} />
        <Row label="Bank Name" value={data.bankName} />
        <Row label="Branch Name" value={data.branchName} />
        <Row label="Account Type" value={data.accountType || "Not provided"} />
        <Row label="Branch Address" value={data.branchAddress || "Not provided"} />
      </Section>

      <Section title="Nominee Details">
        <Row label="Nominee Name" value={data.nomineeName} />
        <Row label="Date of Birth" value={formatDate(data.nomineeDob)} />
        <Row label="Aadhaar Number" value={data.nomineeAadhaar || "Not provided"} />
      </Section>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
      <h4 className="text-sm font-semibold text-indigo-500 mb-3">{title}</h4>
      <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 border-b border-neutral-900 last:border-0">
      <span className="text-sm text-slate-400 shrink-0">{label}</span>
      <span className="text-sm text-slate-100 text-right break-all">
        {value || "—"}
      </span>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="border-b pb-2">
      <h3 className="text-base font-semibold text-slate-50">{title}</h3>
    </div>
  );
}
