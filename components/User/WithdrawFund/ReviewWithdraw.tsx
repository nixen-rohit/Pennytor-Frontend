import { TriangleAlert, Loader2 } from "lucide-react";

import type { FormState } from "./types";
import { SlipRow } from "./SlipRow";
import { currency } from "./format";
import type { UserBankAccount } from "@/services/withdrawal.service";

interface Props {
  data: FormState;
  userBankAccount: UserBankAccount | null;
  bankAccountLoading: boolean;
}

export function ReviewWithdraw({ data, userBankAccount, bankAccountLoading }: Props) {
  const destination = data.method === "upi"
    ? data.upiId
    : userBankAccount
      ? `${userBankAccount.bankName} •••• ${userBankAccount.accountNumber}`
      : bankAccountLoading
        ? "Loading..."
        : "Bank account not found (complete KYC first)";

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
          {data.method === "bank" && userBankAccount && (
            <>
              <SlipRow label="Account Holder" value={userBankAccount.accountHolderName} />
              <SlipRow label="Bank" value={userBankAccount.bankName} />
              <SlipRow label="Branch" value={userBankAccount.branchName} />
              <SlipRow label="IFSC" value={userBankAccount.ifscCode} mono />
              <SlipRow label="Account Type" value={userBankAccount.accountType || "Not specified"} />
            </>
          )}
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