"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { IndianRupee, TrendingUp } from "lucide-react";
import { formatINR, type FormState, type FormErrors } from "./types";

interface Props {
  data: FormState;
  errors: FormErrors;
  onChange: (key: keyof FormState, value: string) => void;
  scheme: ReturnType<typeof getSchemeById>;
  balance: number;
  balanceLoaded: boolean;
}

export function PaymentAmount({ data, errors, onChange, scheme, balance, balanceLoaded }: Props) {
  if (!scheme) return null;

  const totalMonths = scheme.investmentYears * 12;
  const totalInvested = scheme.monthlyInvestment * totalMonths;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <IndianRupee className="h-5 w-5 shrink-0 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Payment Details</h3>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Monthly SIP</p>
            <p className="mt-1 text-xl font-bold text-white">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(scheme.monthlyInvestment)}/-
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Total Investment</p>
            <p className="mt-1 text-xl font-bold text-white">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(totalInvested)}/-
            </p>
            <p className="mt-1 text-xs text-zinc-500">{totalMonths} months</p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
          <p className="text-xs text-zinc-500">Wallet Balance</p>
          <p className="mt-1 text-xl font-bold text-emerald-400">
            <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(balance)}/-
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="text-sm font-semibold text-white">Investment Amount</h4>

        <div className="mt-4">
          <Label htmlFor="amount" className="block text-sm font-medium text-white">
            Amount to Invest (Total)
          </Label>
          <div className="mt-2 relative">
            <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
              <IndianRupee className="h-5 w-5" />
            </span>
            <Input
              id="amount"
              type="number"
              min={totalInvested}
              step={1000}
              value={data.amount}
              onChange={(e) => onChange("amount", e.target.value)}
              className="pl-10"
              placeholder="Enter total investment amount"
              aria-invalid={!!errors.amount}
              aria-describedby={errors.amount ? "amount-error" : undefined}
              disabled={!balanceLoaded}
            />
          </div>
          {errors.amount && (
            <p id="amount-error" className="mt-1.5 text-sm text-red-400" role="alert">
              {errors.amount}
            </p>
          )}
          <p className="mt-2 text-xs text-zinc-500">
            Minimum investment: <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(totalInvested)}/-
          </p>
          <p className="mt-1 text-xs text-zinc-500">
            This amount will be debited from your wallet upon submission.
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          Projected Returns
        </h4>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Projected Fund Value</p>
            <p className="mt-1 text-xl font-bold text-white">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(scheme.fundValue)}/-
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Assumed Annual Return</p>
            <p className="mt-1 text-xl font-bold text-orange-400">{scheme.annualReturn}% p.a.</p>
          </div>
        </div>
      </div>
    </div>
  );
}