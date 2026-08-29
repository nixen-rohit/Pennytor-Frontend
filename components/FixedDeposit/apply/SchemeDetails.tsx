"use client";

import {
  WalletCards,
  TrendingUp,
  Lock,
  Clock,
  CheckCircle2,
  TriangleAlert,
  XCircle,
} from "lucide-react";
import { formatCurrency, type FDSchemeData } from "./types";

interface Props {
  scheme: FDSchemeData;
}

function SectionHeading({ children }: { children: React.ReactNode }) {
  return (
    <div className="mb-4 border-b border-white/10 pb-2">
      <h3 className="text-lg font-semibold text-white">{children}</h3>
    </div>
  );
}

export function SchemeDetails({ scheme }: Props) {
  const profit = scheme.totalPayout - scheme.depositAmount;

  return (
    <div className="animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading>Plan Details</SectionHeading>

      {/* Plan Header */}
      <div className="mb-6 flex items-center gap-3">
        <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-400/10">
          <WalletCards className="h-6 w-6 text-amber-400" />
        </div>
        <div>
          <h4 className="text-xl font-bold text-white">{scheme.name}</h4>
          <p className="text-sm text-zinc-400">Fixed Deposit with SWP</p>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="mb-6 grid grid-cols-2 gap-3 md:grid-cols-4">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Deposit Amount
          </p>
          <p className="mt-1 text-lg font-bold text-white">
            {formatCurrency(scheme.depositAmount)}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Lock-in Period
          </p>
          <div className="mt-1 flex items-center gap-1.5">
            <Lock className="h-4 w-4 text-amber-400" />
            <span className="text-lg font-bold text-white">
              {scheme.lockInMonths} months
            </span>
          </div>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            Payout Mode
          </p>
          <p className="mt-1 text-lg font-bold text-white capitalize">
            {scheme.payoutMode}
          </p>
        </div>
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">
            EMI Amount
          </p>
          <p className="mt-1 text-lg font-bold text-white">
            {formatCurrency(scheme.emiAmount)}
          </p>
        </div>
      </div>

      {/* Investment Breakdown */}
      <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        <div className="rounded-xl border border-white/10 bg-white/5 p-4">
          <p className="text-xs text-zinc-500">You Deposit</p>
          <p className="mt-1 text-xl font-bold text-white">
            {formatCurrency(scheme.depositAmount)}
          </p>
        </div>
        <div className="rounded-xl border border-emerald-500/20 bg-emerald-500/5 p-4">
          <p className="text-xs text-emerald-400">Total Profit</p>
          <p className="mt-1 text-xl font-bold text-emerald-400">
            +{formatCurrency(profit)}
          </p>
        </div>
        <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-4">
          <p className="text-xs text-amber-400">Total Payout</p>
          <p className="mt-1 text-xl font-bold text-amber-400">
            {formatCurrency(scheme.totalPayout)}
          </p>
        </div>
      </div>

      {/* How It Works */}
      <div className="mb-6">
        <h4 className="mb-3 text-sm font-semibold text-zinc-300">
          How It Works
        </h4>
        <div className="space-y-3">
          {[
            {
              step: 1,
              text: `Deposit ${formatCurrency(scheme.depositAmount)} upfront. Your wallet will be debited on admin approval.`,
            },
            {
              step: 2,
              text: `Lock-in period of ${scheme.lockInMonths} months. Your deposit is invested for the duration.`,
            },
            {
              step: 3,
              text: `Receive ${scheme.totalEmis} EMIs of ${formatCurrency(scheme.emiAmount)} each, paid ${scheme.payoutMode} to your wallet.`,
            },
            {
              step: 4,
              text: `Total payout of ${formatCurrency(scheme.totalPayout)} — a profit of ${formatCurrency(profit)}.`,
            },
          ].map(({ step, text }) => (
            <div key={step} className="flex items-start gap-3">
              <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-amber-400/10 text-xs font-bold text-amber-400">
                {step}
              </div>
              <p className="text-sm leading-6 text-zinc-400">{text}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Important Rules */}
      <div className="rounded-xl border-2 border-red-500/30 bg-red-500/5 p-5">
        <div className="mb-3 flex items-center gap-2">
          <TriangleAlert className="h-5 w-5 text-red-400" />
          <h4 className="text-sm font-bold text-red-400">
            Important Rules
          </h4>
        </div>
        <div className="space-y-2.5">
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <p className="text-sm text-zinc-300">
              Your deposit is debited from your wallet when admin approves the application.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
            <p className="text-sm text-zinc-300">
              EMIs are credited automatically on schedule — no action needed from you.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <TriangleAlert className="mt-0.5 h-4 w-4 shrink-0 text-amber-400" />
            <p className="text-sm text-zinc-300">
              Early withdrawal before lock-in completion may result in reduced payout.
            </p>
          </div>
          <div className="flex items-start gap-2.5">
            <XCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
            <p className="text-sm text-zinc-300">
              Rejection by admin results in no deduction — your wallet balance stays unchanged.
            </p>
          </div>
        </div>

        {/* Example */}
        <div className="mt-4 rounded-lg border border-white/10 bg-white/5 p-3">
          <p className="text-xs font-semibold text-zinc-400">Example:</p>
          <p className="mt-1 text-xs leading-5 text-zinc-500">
            You deposit {formatCurrency(scheme.depositAmount)}. Over{" "}
            {scheme.lockInMonths} months, you receive {scheme.totalEmis} EMIs of{" "}
            {formatCurrency(scheme.emiAmount)} each ({scheme.payoutMode}).
            Total back: {formatCurrency(scheme.totalPayout)}.
          </p>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="mt-4 text-[11px] leading-5 text-zinc-600">
        The returns shown above are fixed as per the scheme terms. Please review
        all terms and conditions before applying.
      </p>
    </div>
  );
}
