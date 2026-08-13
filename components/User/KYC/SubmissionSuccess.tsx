import { Button } from "@/components/ui/button";
import { Home, Lock, User, FileText, Landmark, Users, BadgeCheck   } from "lucide-react";
import Link from "next/link";
import { format } from "date-fns";
import type { KycApplicationState, KycFileType } from "@/services/kyc.service";

const FILE_LABELS: Record<KycFileType, string> = {
  SELFIE: "Selfie",
  AADHAAR_FRONT: "Aadhaar Card Front",
  AADHAAR_BACK: "Aadhaar Card Back",
  PAN: "PAN Card",
  SIGNATURE: "Signature",
};

export function SubmissionSuccess({ app }: { app: KycApplicationState }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col items-center justify-center py-4 text-center space-y-3 animate-in fade-in-0 duration-300">
        <h3 className="inline-flex items-center gap-2 text-xl font-semibold text-slate-50">
           <BadgeCheck  className="h-7 w-7 text-green-500" /> Your KYC Details 
        </h3>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-[11px] font-medium text-slate-400">
          <Lock className="h-3 w-3" />
          These details are locked and can no longer be changed
        </span>

         


        
      </div>

      <div className="space-y-4 border-t border-neutral-800 pt-6">
        <Section title="Personal Information" icon={User}>
          <Row label="Full Name" value={app.personal.fullName} />
          <Row label="Phone" value={app.personal.phone} />
          <Row label="Date of Birth" value={formatDate(app.personal.dob)} />
          <Row label="Gender" value={app.personal.gender || "Not provided"} />
          <Row
            label="Marital Status"
            value={app.personal.maritalStatus || "Not provided"}
          />
        </Section>

        <Section title="Documents" icon={FileText}>
          <Row label="Aadhaar Number" value={app.documents.aadhaarNumber} />
          <Row label="PAN Number" value={app.documents.panNumber} />
          <Row
            label="Documents Uploaded"
            value={app.files.map((f) => FILE_LABELS[f.type]).join(", ")}
          />
        </Section>

        <Section title="Bank Details" icon={Landmark}>
          <Row label="Account Holder" value={app.bank.accountHolderName} />
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
          <Row label="Date of Birth" value={formatDate(app.nominee.nomineeDob)} />
          <Row
            label="Phone"
            value={app.nominee.nomineePhone || "Not provided"}
          />
          <Row label="Aadhaar" value={app.nominee.nomineeAadhaar} />
        </Section>
      </div>

      <div className="flex justify-center pt-2">
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
        >
          <Link href="/dashboard">
            <Home className="h-4 w-4" />
            Go to Dashboard
          </Link>
        </Button>
      </div>
    </div>
  );
}

function formatDate(d: string) {
  return d ? format(new Date(d), "dd MMM yyyy") : "Not provided";
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