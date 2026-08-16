import { QrCode as IconQrcode, Landmark as IconBuildingBank } from "lucide-react";
import { BANK_DETAILS, QUICK_AMOUNTS } from "./types";
import type { FormChange, FormErrors, FormState } from "./types";
import { CopyField } from "./CopyField";
import { currency } from "./format";
import Image from "next/image";

interface PaymentDetailsProps {
  data: FormState;
  errors: FormErrors;
  onChange: FormChange;
}

export function PaymentDetails({
  data,
  errors,
  onChange,
}: PaymentDetailsProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Pay using any UPI app" />

      <div className="grid gap-10 sm:grid-cols-[200px_1fr]">
        <div className="p-3 flex flex-col items-center rounded-xl border border-neutral-800 bg-neutral-950 ">
          <div className="flex h-40 w-40 items-center justify-center rounded-lg bg-neutral-900">
            <Image width={200} height={200} src="/img/bankQr.png" alt="bankQr"/>
          </div>
          <p className="mt-3 text-center text-sm font-semibold text-yellow-500">
            Scan with any UPI app to pay for add your balance
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-4">
          <div className="mb-1 flex items-center gap-2 text-xs font-medium text-white">
            <IconBuildingBank className="h-4 w-4 text-indigo-600" />
            Bank details for confirmation
          </div>
          <div className="divide-y divide-neutral-800">
            <CopyField label="IFSC code" value={BANK_DETAILS.ifsc} />
            <CopyField
              label="Account number"
              value={BANK_DETAILS.accountNumber}
            />
            <CopyField
              label="Beneficiary name"
              value={BANK_DETAILS.beneficiaryName}
              mono={false}
            />
            <CopyField
              label="Bank / branch"
              value={`${BANK_DETAILS.bankName}, ${BANK_DETAILS.branchAddress}`}
              mono={false}
            />
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          How much are you adding? *
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-700 px-3 focus-within:border-indigo-500">
          <span className="text-slate-400">₹</span>
          <input
            inputMode="numeric"
            value={data.amount}
            onChange={(e) =>
              onChange("amount", e.target.value.replace(/[^0-9]/g, ""))
            }
            placeholder="Enter amount"
            className="h-11 w-full bg-transparent font-mono text-lg text-slate-50 outline-none placeholder:text-slate-500"
          />
        </div>
        {errors.amount && (
          <p className="mt-1.5 text-xs text-red-500">{errors.amount}</p>
        )}
        <div className="mt-3 flex flex-wrap gap-2">
          {QUICK_AMOUNTS.map((a) => (
            <button
              key={a}
              type="button"
              onClick={() => onChange("amount", String(a))}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition ${
                String(a) === data.amount
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-neutral-700 text-slate-400 hover:border-neutral-600 hover:text-slate-200"
              }`}
            >
              {currency(a)}
            </button>
          ))}
        </div>
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
