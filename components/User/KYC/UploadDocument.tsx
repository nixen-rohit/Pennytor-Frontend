import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { FormState } from "@/components/User/KYC/types";
import { UploadField } from "./UploadField";
import type { FieldErrors } from "./validation";
import { FaIdCard,  FaIdCardClip, FaSignature, FaCamera } from "react-icons/fa6";
import { BsCardHeading } from "react-icons/bs";
import { sanitizeAadhaar, sanitizePAN } from "@/utils/validation";

interface Props {
  data: FormState;
  errors?: FieldErrors;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export function UploadDocument({ data, errors, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Selfie / Profile Photo" />
      <p className="text-sm text-slate-400 -mt-4">
        Upload a clear front-facing selfie of your face.
      </p>
      <div className="max-w-md">
        <UploadField
          label="Selfie"
          hint="JPG, PNG · Max 2 MB"
          accept="image/*"
          icon={FaCamera}
          error={errors?.selfieFile}
          file={data.selfieFile}
          onSelect={(f) => onChange("selfieFile", f)}
          onRemove={() => onChange("selfieFile", null)}
        />
      </div>

      <SectionHeading title="Aadhaar Card" />
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>Aadhaar Number <Required /></Label>
          <Input
            placeholder="12-digit Aadhaar number"
            inputMode="numeric"
            value={data.aadhaarNumber}
            onChange={(e) => onChange("aadhaarNumber", sanitizeAadhaar(e.target.value))}
            maxLength={12}
          />
          {errors?.aadhaarNumber && (
            <p className="text-xs text-red-500">{errors.aadhaarNumber}</p>
          )}
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <UploadField
          label="Aadhaar Front Image"
          hint="JPG, PNG · Max 2 MB"
          accept="image/*"
          icon={FaIdCard}
          error={errors?.aadhaarFrontFile}
          file={data.aadhaarFrontFile}
          onSelect={(f) => onChange("aadhaarFrontFile", f)}
          onRemove={() => onChange("aadhaarFrontFile", null)}
          
        />
        <UploadField
          label="Aadhaar Back Image"
          hint="JPG, PNG · Max 2 MB"
          accept="image/*"
          icon={BsCardHeading}
          error={errors?.aadhaarBackFile}
          file={data.aadhaarBackFile}
          onSelect={(f) => onChange("aadhaarBackFile", f)}
          onRemove={() => onChange("aadhaarBackFile", null)}
        />
      </div>

      <SectionHeading title="PAN Card" />
      <div className="grid gap-5 grid-cols-1 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label>PAN Number <Required /></Label>
          <Input
            placeholder="ABCDE1234F"
            className="uppercase"
            value={data.panNumber}
            onChange={(e) => onChange("panNumber", sanitizePAN(e.target.value))}
            maxLength={10}
          />
          {errors?.panNumber && (
            <p className="text-xs text-red-500">{errors.panNumber}</p>
          )}
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1">
        <UploadField
          label="PAN Card Image"
          hint="JPG, PNG · Max 2 MB"
          accept="image/*"
          icon={FaIdCardClip}
          error={errors?.panFile}
          file={data.panFile}
          onSelect={(f) => onChange("panFile", f)}
          onRemove={() => onChange("panFile", null)}
        />
      </div>

      <SectionHeading title="Signature" />
      <p className="text-sm text-slate-400">
        Please upload a scanned image of your signature on a white paper.
      </p>
      <div className="max-w-md">
        <UploadField
          label="Signature Image"
          hint="JPG, PNG · Max 2 MB · White background"
          accept="image/*"
          icon={FaSignature}
          error={errors?.signatureFile}
          file={data.signatureFile}
          onSelect={(f) => onChange("signatureFile", f)}
          onRemove={() => onChange("signatureFile", null)}
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
