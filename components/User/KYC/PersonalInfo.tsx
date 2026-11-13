import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormState } from "@/components/User/KYC/types";
import { UploadField } from "./UploadField";
import type { FieldErrors } from "./validation";
import type { KycFileType } from "@/services/kyc.service";
import { FaCamera } from "react-icons/fa6";
import { sanitizePhone } from "@/utils/validation";

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

interface Props {
  data: FormState;
  errors?: FieldErrors;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  /** Document types the server already holds for this application. */
  existingFiles?: ReadonlySet<KycFileType>;
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

export function PersonalInfo({ data, errors, onChange, existingFiles }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Personal Information" />

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <Field label="Full Legal Name" required error={errors?.fullName}>
          <Input
            placeholder="Full Name"
            value={data.fullName}
            onChange={(e) => onChange("fullName", e.target.value)}
          />
        </Field>

        <Field label="Phone Number" required error={errors?.phone}>
          <Input
            type="tel"
            inputMode="tel"
            placeholder="+91 98XXX XXXXX"
            value={data.phone}
            onChange={(e) => onChange("phone", sanitizePhone(e.target.value))}
          />
        </Field>
        <div className="space-y-1.5">
          <Label>
            Date of Birth <span className="text-red-500">*</span>
          </Label>

          <DateInput
            value={data.dob}
            onChange={(date) => onChange("dob", date)}
            minDate={new Date(1900, 0, 1)}
            maxDate={new Date()}
          />
          {errors?.dob && (
            <ErrorMessage tone="dark" className="text-xs">
              {errors.dob}
            </ErrorMessage>
          )}
        </div>

        <Field required label="Gender">
          <SelectNative
            value={data.gender}
            onChange={(v) => onChange("gender", v)}
            placeholder="Select Gender"
            options={GENDERS}
          />
        </Field>

        <Field required label="Marital Status">
          <SelectNative
            value={data.maritalStatus}
            onChange={(v) => onChange("maritalStatus", v)}
            placeholder="Select Marital Status"
            options={MARITAL_STATUSES}
          />
        </Field>
      </div>

      <SectionHeading title="Selfie / Profile Photo" />
      <p className="text-sm text-slate-400">
        Upload a clear front-facing selfie of your face.
      </p>
      <div className="max-w-md">
        <UploadField
        
          label="Selfie"
          hint="JPG, PNG, WebP · Max 2 MB"
          accept="image/jpeg,image/png,image/webp"
          icon={FaCamera}
          error={errors?.selfieFile}
          file={data.selfieFile}
          onSelect={(f) => onChange("selfieFile", f)}
          onRemove={() => onChange("selfieFile", null)}
          allowedTypes={IMAGE_TYPES}
          existing={existingFiles?.has("SELFIE")}
        />
      </div>
    </div>
  );
}

function Field({
  label,
  required,
  error,
  children,
}: {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <Label>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}
      </Label>
      {children}
      {error && <ErrorMessage tone="dark" className="text-xs">{error}</ErrorMessage>}
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
