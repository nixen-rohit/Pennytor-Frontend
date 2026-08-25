import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import type { FormChange, FormErrors, FormState } from "./types";
import { UploadField } from "./UploadField";

interface PaymentConfirmationProps {
  data: FormState;
  errors: FormErrors;
  onChange: FormChange;
}

export function PaymentConfirmation({
  data,
  errors,
  onChange,
}: PaymentConfirmationProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Confirm your payment" />

      <div className="space-y-1.5">
        <Label>
          UPI transaction id <Required />
        </Label>
        <p className="text-xs text-slate-400">
          Found in your Google Pay / PhonePe / Paytm payment confirmation
          screen.
        </p>
        <Input
          value={data.txnId}
          onChange={(e) => onChange("txnId", e.target.value)}
          placeholder="e.g. 402917583920"
          className="h-11 font-mono"
        />
        {errors.txnId && (
          <p className="text-xs text-red-500">{errors.txnId}</p>
        )}
      </div>

      <div className="space-y-1.5">
        <Label>
          Payment screenshot <Required />
        </Label>
        <UploadField
          file={data.screenshot}
          error={errors.file}
          onSelect={(f) => onChange("screenshot", f)}
          onRemove={() => onChange("screenshot", null)}
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