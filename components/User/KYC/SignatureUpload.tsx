import { Label } from "@/components/ui/label";
import { FormState } from "@/components/User/KYC/types";
import { UploadField } from "./UploadField";

interface Props {
  data: FormState;
  onChange: <K extends keyof FormState>(key: K, value: FormState[K]) => void;
}

export function SignatureUpload({ data, onChange }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Signature Upload" />

      <p className="text-sm text-slate-400">
        Please upload a scanned image of your signature on a white paper.
      </p>

      <div className="max-w-md">
        <UploadField
          label="Signature Image"
          hint="JPG, PNG · Max 2 MB · White background"
          accept="image/*"
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
