import { TriangleAlert } from "lucide-react";

import { BANK_ACCOUNT, USER_EMAIL } from "./types";
import type { FormState } from "./types";
import { SlipRow } from "./SlipRow";
import { currency } from "./format";

interface Props {
  data: FormState;
}

export function ReviewWithdraw({ data }: Props) {
  const destination =
    data.method === "upi"
      ? data.upiId
      : `${BANK_ACCOUNT.bankName} •••• ${BANK_ACCOUNT.accountNumber.slice(-4)}`;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <div className="mb-3 flex items-center gap-2 text-md font-bold text-yellow-600">
          <TriangleAlert className="h-6 w-6" />
          Everything looks right?
        </div>

        <p className="mb-2 flex items-center justify-end border-b pb-2 font-bold text-4xl">
          <span className="mr-auto">Amount</span>
          <span className="text-red-500">
            {data.amount ? `- ${currency(data.amount)}` : "NONE"}
          </span>
        </p>
        <div className="divide-y divide-neutral-800">
          <SlipRow
            label="Withdraw to"
            value={data.method === "bank" ? "Bank Account" : "UPI"}
          />
          <SlipRow
            label="Destination"
            value={destination}
            mono={data.method === "upi"}
          />
          <SlipRow label="Amount" value={data.amount ? currency(data.amount) : "-"} />
          <SlipRow label="Email verified" value={USER_EMAIL} />
        </div>
      </div>

      <p className="text-sm text-slate-400">
        Once submitted, this request goes to the admin dashboard as{" "}
        <span className="font-medium text-yellow-400">Pending</span> until the
        amount is transferred to your account.
      </p>
    </div>
  );
}
