"use client";

import { useState } from "react";
import { Loader2, TriangleAlert, Info, IndianRupee } from "lucide-react";
import { Input } from "@/components/ui/input";
import { formatCurrency, type InvestmentSchemeData } from "./types";
import type { FormChange, FormErrors, FormState } from "./types";

interface Props {
  data: FormState;
  errors: FormErrors;
  onChange: FormChange;
  scheme: InvestmentSchemeData;
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
  const [showPassword, setShowPassword] = useState(false);

  const amountNum = data.amount ? Number(data.amount) : 0;
  const isValidAmount = amountNum >= scheme.minAmount && amountNum <= scheme.maxAmount;
  const withinBalance = amountNum <= balance;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Process Payment" />

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Investment Amount *
        </label>
        <div className="flex items-center gap-2 rounded-lg border border-neutral-700 px-3 focus-within:border-emerald-500">
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

        {!isValidAmount && data.amount && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-amber-500/30 bg-amber-500/10 p-3">
            <TriangleAlert className="h-4 w-4 text-amber-400 shrink-0" />
            <p className="text-sm text-amber-300">
              Amount must be between {formatCurrency(scheme.minAmount)} and{" "}
              {formatCurrency(scheme.maxAmount)}
            </p>
          </div>
        )}

        {!withinBalance && data.amount && (
          <div className="mt-2 flex items-center gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-3">
            <TriangleAlert className="h-4 w-4 text-red-400 shrink-0" />
            <p className="text-sm text-red-300">
              Amount exceeds your available balance of {formatCurrency(balance)}
            </p>
          </div>
        )}

        <div className="mt-3 flex flex-wrap gap-2">
          {[
            scheme.minAmount,
            Math.round((scheme.minAmount + scheme.maxAmount) / 2),
            scheme.maxAmount,
          ].map((amt) => (
            <button
              key={amt}
              type="button"
              onClick={() => onChange("amount", String(amt))}
              className={
                String(amt) === data.amount
                  ? "rounded-full border px-3 py-1 text-xs font-medium border-emerald-600 bg-emerald-600 text-white"
                  : "rounded-full border px-3 py-1 text-xs font-medium border-neutral-700 text-slate-400 hover:border-neutral-600 hover:text-slate-200"
              }
            >
              {formatCurrency(amt)}
            </button>
          ))}
        </div>

        <p className="mt-3 text-xs text-slate-400">
          Available balance:{" "}
          <span className="font-medium text-green-500">
            {balanceLoaded
              ? formatCurrency(balance)
              : (
                  <span className="inline-flex items-center gap-1">
                    <Loader2 className="h-3 w-3 animate-spin" />
                    loading…
                  </span>
                )}
          </span>
        </p>

        
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