import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { FormState } from "@/components/User/KYC/types";

interface Props {
  data: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

const ACCOUNT_TYPES = ["Savings Account", "Current Account", "Salary Account"];

function SelectNative({
  value,
  onChange,
  placeholder,
  options,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder: string;
  options: string[];
}) {
  return (
    <select
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="flex h-10 w-full rounded-md border px-3 py-2 text-sm disabled:cursor-not-allowed disabled:opacity-50 border-neutral-700 bg-neutral-950 text-slate-100"
    >
      <option value="" disabled>{placeholder}</option>
      {options.map((o) => (
        <option key={o} value={o}>{o}</option>
      ))}
    </select>
  );
}

export function BankDetails({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Bank Account Details" />
      <p className="text-sm text-slate-400 -mt-4">
        All fields marked with <span className="text-red-500">*</span> are required
      </p>

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <Field label="Account Holder Name" required>
          <Input
            placeholder="Name as per bank account"
            value={data.accountHolderName}
            onChange={(e) => onChange("accountHolderName", e.target.value)}
          />
        </Field>
        <div className="sm:col-span-2" />

        <Field label="Account Number" required>
          <Input
            inputMode="numeric"
            placeholder="9-18 digit account number"
            value={data.accountNumber}
            onChange={(e) => onChange("accountNumber", e.target.value)}
          />
        </Field>
        <Field label="Confirm Account Number" required>
          <Input
            inputMode="numeric"
            placeholder="Re-enter account number"
            value={data.confirmAccountNumber}
            onChange={(e) => onChange("confirmAccountNumber", e.target.value)}
          />
        </Field>

        <Field label="IFSC Code" required>
          <Input
            className="uppercase"
            maxLength={11}
            placeholder="HDFC0001234"
            value={data.ifscCode}
            onChange={(e) => onChange("ifscCode", e.target.value)}
          />
          <p className="text-xs text-slate-400 mt-1">
            11-character code (e.g., HDFC0001234)
          </p>
        </Field>
        <Field label="Bank Name" required>
          <Input
            placeholder="e.g., HDFC Bank, SBI"
            value={data.bankName}
            onChange={(e) => onChange("bankName", e.target.value)}
          />
        </Field>
        <Field label="Branch Name" required>
          <Input
            placeholder="e.g., MG Road Branch"
            value={data.branchName}
            onChange={(e) => onChange("branchName", e.target.value)}
          />
        </Field>

        <Field label="Account Type">
          <SelectNative
            value={data.accountType}
            onChange={(v) => onChange("accountType", v)}
            placeholder="Select Account Type"
            options={ACCOUNT_TYPES}
          />
        </Field>

        <div className="sm:col-span-2 space-y-1.5">
          <Label>Branch Address</Label>
          <Textarea
            placeholder="Complete address of your bank branch"
            rows={3}
            value={data.branchAddress}
            onChange={(e) => onChange("branchAddress", e.target.value)}
          />
          <p className="text-xs text-slate-400">Optional but recommended</p>
        </div>
      </div>
    </div>
  );
}

function Field({ label, required, children }: { label: string; required?: boolean; children: React.ReactNode }) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
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
