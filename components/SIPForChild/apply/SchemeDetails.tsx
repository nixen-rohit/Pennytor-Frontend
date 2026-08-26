"use client";

import { GraduationCap, IndianRupee, TrendingUp } from "lucide-react";
import { formatINR } from "./types";

interface Props {
  scheme: ReturnType<typeof getSchemeById>;
}

export function SchemeDetails({ scheme }: Props) {
  if (!scheme) return null;

  const totalMonths = scheme.investmentYears * 12;
  const totalInvested = scheme.monthlyInvestment * totalMonths;
  const estimatedGrowth = scheme.fundValue - totalInvested;
  const totalSWPWithdrawals = scheme.withdrawalMonthly * scheme.withdrawalYears * 12;

  return (
    <div className="space-y-6">
      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <div className="flex items-center gap-2">
          <GraduationCap className="h-5 w-5 shrink-0 text-orange-400" />
          <h3 className="text-sm font-semibold text-white">{scheme.name}</h3>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Monthly SIP</p>
            <p className="mt-1 text-xl font-bold text-white">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(scheme.monthlyInvestment)}/-
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Investment Period</p>
            <p className="mt-1 text-xl font-bold text-white">{scheme.investmentYears} Years</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Assumed Return</p>
            <p className="mt-1 text-xl font-bold text-orange-400">{scheme.annualReturn}% p.a.</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Projected Fund Value</p>
            <p className="mt-1 text-xl font-bold text-white">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(scheme.fundValue)}/-
            </p>
          </div>
        </div>

        <div className="mt-4 grid gap-4 sm:grid-cols-2">
          <div className="rounded-lg border border-orange-400/20 bg-orange-400/[0.04] p-4">
            <p className="text-xs text-zinc-500">Total Invested</p>
            <p className="mt-1 text-xl font-bold text-white">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(totalInvested)}/-
            </p>
            <p className="mt-1 text-xs text-zinc-500">{totalMonths} monthly contributions</p>
          </div>

          <div className="rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
            <p className="text-xs text-zinc-500">Estimated Growth</p>
            <p className="mt-1 text-xl font-bold text-emerald-400">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(estimatedGrowth)}/-
            </p>
            <p className="mt-1 text-xs text-zinc-500">Over invested amount</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="text-sm font-semibold text-white flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-emerald-400" />
          SWP Phase (After {scheme.investmentYears} Years)
        </h4>

        <div className="mt-4 grid gap-4 sm:grid-cols-3">
          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Monthly SWP</p>
            <p className="mt-1 text-xl font-bold text-white">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(scheme.withdrawalMonthly)}/-
            </p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">SWP Period</p>
            <p className="mt-1 text-xl font-bold text-white">{scheme.withdrawalYears} Years</p>
          </div>

          <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
            <p className="text-xs text-zinc-500">Total SWP Withdrawals</p>
            <p className="mt-1 text-xl font-bold text-white">
              <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(totalSWPWithdrawals)}/-
            </p>
          </div>
        </div>

        <div className="mt-4 rounded-lg border border-emerald-400/20 bg-emerald-400/[0.04] p-4">
          <p className="text-xs text-zinc-500">Final Amount After {scheme.investmentYears + scheme.withdrawalYears} Years</p>
          <p className="mt-1 text-2xl font-bold text-emerald-400">
            <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(scheme.finalAmount)}/-
          </p>
        </div>
      </div>

      <div className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
        <h4 className="text-sm font-semibold text-white">Investment Journey</h4>

        <div className="mt-4 space-y-3">
          <JourneyStep
            phase="Phase 1"
            title="Build the Corpus"
            description="Invest a fixed amount every month"
            amount={`₹${formatINR(scheme.monthlyInvestment)}/month`}
            duration={`${scheme.investmentYears} years`}
            color="orange"
          />
          <JourneyStep
            phase="Phase 2"
            title="Corpus Created"
            description="Your SIP grows based on the illustrative return"
            amount={`₹${formatINR(scheme.fundValue)}/-`}
            duration={`After ${scheme.investmentYears} years`}
            color="orange"
            highlight
          />
          <JourneyStep
            phase="Phase 3"
            title="Start Monthly SWP"
            description="Withdraw a fixed amount from the accumulated corpus"
            amount={`₹${formatINR(scheme.withdrawalMonthly)}/month`}
            duration={`${scheme.withdrawalYears} years`}
            color="emerald"
          />
          <JourneyStep
            phase="Result"
            title="Remaining Corpus"
            description="Illustrative value after the SWP period"
            amount={`₹${formatINR(scheme.finalAmount)}/-`}
            duration={`After ${scheme.withdrawalYears} years`}
            color="emerald"
            highlight
          />
        </div>
      </div>
    </div>
  );
}

function JourneyStep({
  phase,
  title,
  description,
  amount,
  duration,
  color,
  highlight = false,
}: {
  phase: string;
  title: string;
  description: string;
  amount: string;
  duration: string;
  color: "orange" | "emerald";
  highlight?: boolean;
}) {
  const colors = {
    orange: {
      bg: "bg-orange-400/[0.03] border-orange-400/20",
      badge: "border-orange-400/20 bg-orange-400/10 text-orange-300",
      amount: "text-orange-400",
    },
    emerald: {
      bg: "bg-emerald-400/[0.03] border-emerald-400/20",
      badge: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      amount: "text-emerald-400",
    },
  };

  const c = colors[color];

  return (
    <div className={`flex items-center gap-4 rounded-lg border p-4 ${highlight ? c.bg : "bg-white/[0.03] border-white/10"}`}>
      <span className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${c.badge} shrink-0`}>
        {phase}
      </span>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-white truncate">{title}</p>
        <p className="mt-1 text-xs text-zinc-500 truncate">{description}</p>
      </div>
      <div className="text-right shrink-0">
        <p className={`font-bold ${c.amount}`}>{amount}</p>
        <p className="mt-0.5 text-xs text-zinc-500">{duration}</p>
      </div>
    </div>
  );
}