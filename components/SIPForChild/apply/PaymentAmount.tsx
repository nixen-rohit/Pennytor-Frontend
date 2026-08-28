"use client";

import { Loader2, TriangleAlert, IndianRupee } from "lucide-react";
import { formatCurrency, type SIPSchemeData } from "./types";
import type { FormChange, FormErrors, FormState } from "./types";

interface Props {
  data: FormState;
  errors: FormErrors;
  onChange: FormChange;
  scheme: SIPSchemeData;
  balance: number;
  balanceLoaded: boolean;
}

export function PaymentAmount({
  data,
  errors,
  onChange,
  scheme,
  balance,
  balanceLoaded,
}: Props) {
  const withinBalance = scheme.monthlyInvestment <= balance;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Monthly Premium" />

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Monthly Premium Amount
        </label>

        <div className="flex items-center gap-2 rounded-lg border border-neutral-700 bg-neutral-900 px-3 py-3">
          <span className="text-slate-400">₹</span>
          <span className="font-mono text-lg text-slate-50">
            {formatCurrency(scheme.monthlyInvestment)}
          </span>
          <span className="text-sm text-slate-400">/- per month</span>
        </div>

        <p className="mt-3 text-xs text-slate-400">
          This is your fixed monthly premium for the{" "}
          <span className="font-medium text-amber-300">{scheme.name}</span> plan.
        </p>

        {!withinBalance && (
          <div className="mt-3 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <TriangleAlert className="h-4 w-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">
              Insufficient wallet balance. You need at least {formatCurrency(scheme.monthlyInvestment)} to pay this premium.
            </p>
          </div>
        )}

        <div className="mt-4 flex items-center justify-between rounded-lg border border-neutral-800 bg-neutral-900 px-4 py-3">
          <span className="text-sm text-slate-400">Available Balance</span>
          <span className="font-medium text-green-500">
            {balanceLoaded
              ? formatCurrency(balance)
              : (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    loading...
                  </span>
                )}
          </span>
        </div>

        <div className="mt-4 rounded-lg border border-blue-500/20 bg-blue-500/5 p-3">
          <p className="text-xs text-blue-300">
            <span className="font-semibold">Note:</span> This amount will be deducted from your wallet when you pay your premium. 
            No amount is deducted now — this is just the application submission.
          </p>
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
