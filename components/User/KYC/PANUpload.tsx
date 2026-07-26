import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormState } from "@/components/User/KYC/types";
import { UploadField } from "./UploadField";

interface Props {
  data: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export function PANUpload({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="PAN Card Details" />

      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>PAN Number <Required /></Label>
          <Input
            placeholder="ABCDE1234F"
            className="uppercase"
            value={data.panNumber}
            onChange={(e) => onChange("panNumber", e.target.value)}
            maxLength={10}
          />
        </div>
      </div>

      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1">
        <UploadField
          label="PAN Card Image"
          hint="JPG, PNG · Max 2 MB"
          accept="image/*"
          file={data.panFile}
          onSelect={(f) => onChange("panFile", f)}
          onRemove={() => onChange("panFile", null)}
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
