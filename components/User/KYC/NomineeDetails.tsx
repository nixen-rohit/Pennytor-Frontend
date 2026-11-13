import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { DateInput } from "@/components/ui/date-input";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormState } from "@/components/User/KYC/types";
import type { FieldErrors } from "./validation";
import { sanitizeAadhaar } from "@/utils/validation";

interface Props {
  data: FormState;
  errors?: FieldErrors;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export function NomineeDetails({ data, errors, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Nominee Details" />

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <Field label="Nominee Name" required error={errors?.nomineeName}>
          <Input
            placeholder="Nominee Full Legal Name"
            value={data.nomineeName}
            onChange={(e) => onChange("nomineeName", e.target.value)}
          />
        </Field>

        <div className="space-y-1.5">
          <Label>
            Date of Birth <span className="text-red-500">*</span>
          </Label>

          <DateInput
            value={data.nomineeDob}
            onChange={(date) => onChange("nomineeDob", date)}
            minDate={new Date(1900, 0, 1)}
            maxDate={new Date()}
          />
          {errors?.nomineeDob && (
            <ErrorMessage tone="dark" className="text-xs">
              {errors.nomineeDob}
            </ErrorMessage>
          )}
        </div>

        <div className="sm:col-span-2 space-y-1.5">
          <Field label="Aadhaar Number" error={errors?.nomineeAadhaar}>
            <Input
              placeholder="12-digit Aadhaar number"
              inputMode="numeric"
              value={data.nomineeAadhaar}
              onChange={(e) =>
                onChange("nomineeAadhaar", sanitizeAadhaar(e.target.value))
              }
              maxLength={12}
            />
          </Field>
          <p className="text-xs text-slate-400">Optional</p>
        </div>
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
