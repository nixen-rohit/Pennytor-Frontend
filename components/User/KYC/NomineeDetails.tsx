import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormState } from "@/components/User/KYC/types";
import type { FieldErrors } from "./validation";

import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";
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

          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="w-full justify-start text-left font-normal"
              >
                <CalendarIcon className="mr-2 h-4 w-4 text-slate-400 shrink-0" />

                {data.nomineeDob
                  ? format(data.nomineeDob, "dd MMM yyyy")
                  : "Select Date of Birth"}
              </Button>
            </PopoverTrigger>

            <PopoverContent className="w-auto p-0" align="start">
              <Calendar
                mode="single"
                selected={data.nomineeDob ?? undefined}
                onSelect={(date) => date && onChange("nomineeDob", date)}
                captionLayout="dropdown"
                startMonth={new Date(1900, 0)}
                endMonth={new Date()}
              />
            </PopoverContent>
          </Popover>
          {errors?.nomineeDob && (
            <p className="text-xs text-red-500">{errors.nomineeDob}</p>
          )}
        </div>

       
        <Field label="Aadhaar Number" required error={errors?.nomineeAadhaar}>
          <Input
            placeholder="12-digit Aadhaar number"
            inputMode="numeric"
            value={data.nomineeAadhaar}
            onChange={(e) => onChange("nomineeAadhaar", sanitizeAadhaar(e.target.value))}
            maxLength={12}
          />
        </Field>
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
      {error && <p className="text-xs text-red-500">{error}</p>}
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
