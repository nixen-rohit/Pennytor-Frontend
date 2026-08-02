"use client";

import { useState } from "react";
import { Check, Eye, EyeOff, Landmark } from "lucide-react";
import { Input } from "@/components/ui/input";

import {
  BANK_ACCOUNT,
  MAX_WITHDRAWAL,
  QUICK_AMOUNTS,
  WITHDRAW_METHODS,
} from "./types";
import type { FormChange, FormErrors, FormState } from "./types";
import { SlipRow } from "./SlipRow";
import { currency } from "./format";
import { cn } from "@/lib/utils";

interface Props {
  data: FormState;
  errors: FormErrors;
  onChange: FormChange;
}

export function WithdrawDetails({ data, errors, onChange }: Props) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Withdraw to" />

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {WITHDRAW_METHODS.map((method) => {
          const Icon = method.icon;
          const selected = data.method === method.id;
          return (
            <button
              key={method.id}
              type="button"
              onClick={() => onChange("method", method.id)}
              className={cn(
                "flex items-center gap-3 rounded-xl border p-4 text-left transition",
                selected
                  ? "border-indigo-600 bg-indigo-600/10"
                  : "border-neutral-800 bg-neutral-950 hover:border-neutral-700",
              )}
            >
              <span
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-lg",
                  selected
                    ? "bg-indigo-600 text-white"
                    : "bg-neutral-800 text-slate-400",
                )}
              >
                <Icon className="h-5 w-5" />
              </span>
              <span className="min-w-0">
                <span className="block text-sm font-medium text-slate-100">
                  {method.label}
                </span>
                <span className="block text-xs text-slate-400">
                  {method.description}
                </span>
              </span>
              {selected && <Check className="ml-auto h-4 w-4 shrink-0 text-indigo-400" />}
            </button>
          );
        })}
      </div>

      {data.method === "bank" ? (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <div className="mb-2 flex items-center gap-2 text-xs font-medium text-white">
            <Landmark className="h-4 w-4 text-indigo-600" />
            Registered bank account
          </div>
          <div className="divide-y divide-neutral-800">
            <SlipRow
              label="Account holder"
              value={BANK_ACCOUNT.accountHolderName}
            />
            <SlipRow
              label="Bank / branch"
              value={`${BANK_ACCOUNT.bankName}, ${BANK_ACCOUNT.branch}`}
            />
            <SlipRow label="Account number" value={BANK_ACCOUNT.accountNumber} mono />
            <SlipRow label="IFSC code" value={BANK_ACCOUNT.ifsc} mono />
          </div>
          <p className="mt-3 text-xs text-slate-400">
            The amount will be credited to this account. No changes are needed here.
          </p>
        </div>
      ) : (
        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
          <label className="mb-2 block text-sm font-medium text-slate-200">
            Active UPI ID *
          </label>
          <Input
            placeholder="e.g. alok@okhdfcbank"
            value={data.upiId}
            onChange={(e) => onChange("upiId", e.target.value)}
            className="h-11 bg-black/40"
          />
          {errors.upiId && (
            <p className="mt-1.5 text-xs text-red-500">{errors.upiId}</p>
          )}
          <p className="mt-2 text-xs text-slate-400">
            Funds will be transferred to this UPI ID after verification.
          </p>
        </div>
      )}

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          How much do you want to withdraw? *
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
              className={cn(
                "rounded-full border px-3 py-1 text-xs font-medium transition",
                String(a) === data.amount
                  ? "border-indigo-600 bg-indigo-600 text-white"
                  : "border-neutral-700 text-slate-400 hover:border-neutral-600 hover:text-slate-200",
              )}
            >
              {currency(a)}
            </button>
          ))}
        </div>
        <p className="mt-3 text-xs text-slate-400">
          Available balance:{" "}
          <span className="font-medium text-slate-200">
            {currency(MAX_WITHDRAWAL)}
          </span>
        </p>
      </div>

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <label className="mb-2 block text-sm font-medium text-slate-200">
          Password *
        </label>
        <div className="relative flex items-center">
          <Input
            type={showPassword ? "text" : "password"}
            placeholder="Enter your password"
            value={data.password}
            onChange={(e) => onChange("password", e.target.value)}
            className="h-11 bg-black/40 pr-10"
          />
          <button
            type="button"
            onClick={() => setShowPassword((s) => !s)}
            className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:text-slate-200"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
        {errors.password && (
          <p className="mt-1.5 text-xs text-red-500">{errors.password}</p>
        )}
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
