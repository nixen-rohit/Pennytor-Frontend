import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormState } from "@/components/User/KYC/types";
import { UploadField } from "./UploadField";

interface Props {
  data: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export function AadhaarUpload({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Aadhaar Card Details" />

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Aadhaar Number <Required /></Label>
          <Input
            placeholder="XXXX XXXX XXXX"
            value={data.aadhaarNumber}
            onChange={(e) => onChange("aadhaarNumber", e.target.value)}
            maxLength={14}
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <UploadField
          label="Aadhaar Front Image"
          hint="JPG, PNG · Max 2 MB"
          accept="image/*"
          file={data.aadhaarFrontFile}
          onSelect={(f) => onChange("aadhaarFrontFile", f)}
          onRemove={() => onChange("aadhaarFrontFile", null)}
        />
        <UploadField
          label="Aadhaar Back Image"
          hint="JPG, PNG · Max 2 MB"
          accept="image/*"
          file={data.aadhaarBackFile}
          onSelect={(f) => onChange("aadhaarBackFile", f)}
          onRemove={() => onChange("aadhaarBackFile", null)}
        />
      </div>
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

function Required() {
  return <span className="text-red-500 ml-0.5">*</span>;
}
