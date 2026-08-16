import { BadgeCheck } from "lucide-react";

import { BANK_ACCOUNT } from "./types";
import type { FormState } from "./types";
import { SlipRow } from "./SlipRow";
import { currency } from "./format";

interface Props {
  data: FormState;
  requestId: string;
  status: string;
  onReset: () => void;
}

export function Submitted({ data, requestId, status, onReset }: Props) {
  const destination =
    data.method === "upi"
      ? data.upiId
      : `${BANK_ACCOUNT.bankName} •••• ${BANK_ACCOUNT.accountNumber.slice(-4)}`;

  return (
    <div className="mx-auto flex min-h-[560px] max-w-md flex-col items-center justify-center px-6 text-center">
      <div className="mb-5 flex h-14 w-14 items-center justify-center">
        <BadgeCheck className="h-14 w-14 text-emerald-400" />
      </div>
      <h1 className="text-lg font-medium text-slate-50">
        Withdrawal request submitted
      </h1>
      <p className="mt-2 max-w-xs text-sm text-slate-400">
        We&apos;ve sent{" "}
        <span className="font-medium text-slate-200">
          {data.amount ? currency(data.amount) : "your amount"}
        </span>{" "}
        to{" "}
        <span className="font-medium text-slate-200">{destination}</span> for
        review. You&apos;ll see it move to verified once the admin team confirms
        it.
      </p>
      <div className="mt-6 w-full rounded-xl border border-neutral-800 bg-neutral-950 px-4 py-3 text-left">
        <SlipRow label="Request ID" value={requestId} mono />
        <SlipRow label="Amount" value={data.amount ? currency(data.amount) : "-"} />
        <SlipRow label="Status" value="Pending review" badge="pending" />
      </div>
      <button
        type="button"
        onClick={onReset}
        className="mt-8 text-sm font-medium text-indigo-500 underline underline-offset-4"
      >
        Make another withdrawal
      </button>
    </div>
  );
}