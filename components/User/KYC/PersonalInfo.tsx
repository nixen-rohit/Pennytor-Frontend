import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormState } from "@/components/User/KYC/types";

interface Props {
  data: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

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
      <option value="" disabled>
        {placeholder}
      </option>
      {options.map((o) => (
        <option key={o} value={o}>
          {o}
        </option>
      ))}
    </select>
  );
}

const GENDERS = ["Male", "Female", "Other"];
const MARITAL_STATUSES = ["Single", "Married", "Divorced", "Widowed"];

export function PersonalInfo({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Personal Information" />

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <Field label="Full Legal Name" required>
          <Input
            placeholder="Full Name"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
          />
        </Field>
        <Field label="Date of Birth" required>
          <Input
            type="date"
            value={data.dob}
            onChange={(e) => onChange("dob", e.target.value)}
          />
        </Field>

        <Field label="Gender">
          <SelectNative
            value={data.gender}
            onChange={(v) => onChange("gender", v)}
            placeholder="Select Gender"
            options={GENDERS}
          />
        </Field>

        <Field label="Marital Status">
          <SelectNative
            value={data.maritalStatus}
            onChange={(v) => onChange("maritalStatus", v)}
            placeholder="Select Marital Status"
            options={MARITAL_STATUSES}
          />
        </Field>
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
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
