import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormState } from "@/components/User/KYC/types";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon } from "lucide-react";
import { format } from "date-fns";

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

const Nominee_Relationship = [
  "Spouse",
  "Child",
  "Parent",
  "Sibling",
  "Friend",
  "Other",
];

export function NomineeDetails({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Nominee Details" />

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <Field label="Nominee Name" required>
          <Input
            placeholder="Nominee Full Legal Name"
            value={data.nomineeName}
            onChange={(e) => onChange("nomineeName", e.target.value)}
          />
        </Field>

        <Field label="Nominee Relationship" required>
          <SelectNative
            value={data.nomineeRelation}
            onChange={(v) => onChange("nomineeRelation", v)}
            placeholder="Select Relationship"
            options={Nominee_Relationship}
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
        </div>

        <Field label="Phone Number">
          <Input
            type="tel"
            inputMode="tel"
            placeholder="+91 XXXXX XXXXX"
            value={data.nomineePhone}
            onChange={(e) => onChange("nomineePhone", e.target.value)}
          />
        </Field>
        <Field label="Aadhaar Number" required>
          <Input
            placeholder="XXXX XXXX XXXX"
            value={data.nomineeAadhaar}
            onChange={(e) => onChange("nomineeAadhaar", e.target.value)}
            maxLength={14}
          />
        </Field>
        <Field label="Allocation %" required>
          <Input
            type="number"
            placeholder="e.g. 100%"
            value={data.nomineeAllocation}
            onChange={(e) => onChange("nomineeAllocation", e.target.value)}
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
