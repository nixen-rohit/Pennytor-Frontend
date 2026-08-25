"use client";

import {
  TrendingUp,
  Lock,
  Percent,
  IndianRupee,
  TriangleAlert,
} from "lucide-react";
import { formatCurrency, type InvestmentSchemeData } from "./types";

interface Props {
  scheme: InvestmentSchemeData;
}

export function SchemeDetails({ scheme }: Props) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Scheme Details" />

      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
            <TrendingUp className="h-6 w-6 text-amber-400" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-50">
              Scheme {scheme.scheme}
            </h3>
            <p className="text-sm text-slate-400">Investment Fund Scheme</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Investment Amount
            </p>
            <p className="mt-1 font-bold text-lg text-slate-50">
              {formatCurrency(scheme.minAmount)} -{" "}
              {formatCurrency(scheme.maxAmount)}
            </p>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Lock-in Period
            </p>
            <div className="mt-1 flex items-center gap-2 text-lg font-bold text-slate-50">
              <Lock className="h-5 w-5 text-amber-400" />
              {scheme.lockInPeriod}
            </div>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monthly ROI
            </p>
            <div className="mt-1 flex items-center gap-2 text-lg font-bold text-emerald-400">
             
              {scheme.roi} %
            </div>
          </div>

          <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Monthly Returns
            </p>
            <p className="mt-1 font-bold text-base text-emerald-400">
              {formatCurrency(
                Math.round(scheme.minAmount * (scheme.roi / 100)),
              )}{" "}
              -{" "}
              {formatCurrency(
                Math.round(scheme.maxAmount * (scheme.roi / 100)),
              )}
            </p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
  <div className="flex items-start gap-3">
    <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-500/10">
      <TriangleAlert className="h-5 w-5 text-amber-400" />
    </div>

    <div className="space-y-2">
      <h4 className="text-sm font-semibold text-amber-300">
        Important Information
      </h4>

      <p className="text-sm leading-6 text-slate-400">
        Once submitted, your investment will remain active for{" "}
        <span className="font-semibold text-amber-300">
          {scheme.lockInPeriod}
        </span>
        . Payouts will be creadited at your wallet after the applicable payout period start.
      </p>

      <p className="text-sm leading-6 text-slate-400">
        After the lock-in period ends, you will be eligible to withdraw your
        investment amount, subject to the applicable terms and conditions.
      </p>
    </div>
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
