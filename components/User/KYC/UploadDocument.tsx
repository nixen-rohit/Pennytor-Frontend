import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";
import { FormState } from "@/components/User/KYC/types";
import { UploadField } from "./UploadField";
import type { FieldErrors } from "./validation";
import type { KycFileType } from "@/services/kyc.service";
import { FaIdCard, FaIdCardClip, FaSignature } from "react-icons/fa6";
import { BsCardHeading } from "react-icons/bs";
import { sanitizeAadhaar, sanitizePAN } from "@/utils/validation";

interface Props {
  data: FormState;
  errors?: FieldErrors;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
  /** Document types the server already holds for this application. */
  existingFiles?: ReadonlySet<KycFileType>;
}

const IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

export function UploadDocument({ data, errors, onChange, existingFiles }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
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
            <ErrorMessage tone="dark" className="text-xs">
              {errors.aadhaarNumber}
            </ErrorMessage>
          )}
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
        <UploadField
          label="Aadhaar Front Image"
          hint="JPG, PNG, WebP · Max 2 MB"
          accept="image/jpeg,image/png,image/webp"
          icon={FaIdCard}
          error={errors?.aadhaarFrontFile}
          file={data.aadhaarFrontFile}
          onSelect={(f) => onChange("aadhaarFrontFile", f)}
          onRemove={() => onChange("aadhaarFrontFile", null)}
          allowedTypes={IMAGE_TYPES}
          existing={existingFiles?.has("AADHAAR_FRONT")}
        />
        <UploadField
          label="Aadhaar Back Image"
          hint="JPG, PNG, WebP · Max 2 MB"
          accept="image/jpeg,image/png,image/webp"
          icon={BsCardHeading}
          error={errors?.aadhaarBackFile}
          file={data.aadhaarBackFile}
          onSelect={(f) => onChange("aadhaarBackFile", f)}
          onRemove={() => onChange("aadhaarBackFile", null)}
          allowedTypes={IMAGE_TYPES}
          existing={existingFiles?.has("AADHAAR_BACK")}
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
            <ErrorMessage tone="dark" className="text-xs">
              {errors.panNumber}
            </ErrorMessage>
          )}
        </div>
      </div>
      <div className="grid gap-6 grid-cols-1 sm:grid-cols-1">
        <UploadField
          label="PAN Card Image"
          hint="JPG, PNG, WebP · Max 2 MB"
          accept="image/jpeg,image/png,image/webp"
          icon={FaIdCardClip}
          error={errors?.panFile}
          file={data.panFile}
          onSelect={(f) => onChange("panFile", f)}
          onRemove={() => onChange("panFile", null)}
          allowedTypes={IMAGE_TYPES}
          existing={existingFiles?.has("PAN")}
        />
      </div>

      <SectionHeading title="Signature" />
      <p className="text-sm text-slate-400">
        Please upload a scanned image of your signature on a white paper.
      </p>
      <div className="max-w-md">
        <UploadField
          label="Signature Image"
          hint="JPG, PNG, WebP · Max 2 MB · White background"
          accept="image/jpeg,image/png,image/webp"
          icon={FaSignature}
          error={errors?.signatureFile}
          file={data.signatureFile}
          onSelect={(f) => onChange("signatureFile", f)}
          onRemove={() => onChange("signatureFile", null)}
          allowedTypes={IMAGE_TYPES}
          existing={existingFiles?.has("SIGNATURE")}
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
