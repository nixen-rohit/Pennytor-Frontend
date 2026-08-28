"use client";

import {
  TrendingUp,
  Lock,
  CalendarClock,
  IndianRupee,
  TriangleAlert,
  PiggyBank,
  CheckCircle2,
  XCircle,
  ShieldAlert,
} from "lucide-react";
import { formatCurrency, type SIPSchemeData } from "./types";

interface Props {
  scheme: SIPSchemeData;
}

export function SchemeDetails({ scheme }: Props) {
  const totalInvested = scheme.monthlyInvestment * scheme.investmentYears * 12;
  const estimatedGrowth = scheme.fundValue - totalInvested;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Scheme Details" />

      {/* Plan header */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <div className="mb-4 flex items-center gap-3">
          <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
            <PiggyBank className="h-6 w-6 text-amber-400" />
          </span>
          <div>
            <h3 className="text-lg font-semibold text-slate-50">
              {scheme.name}
            </h3>
            <p className="text-sm text-slate-400">SIP for Child Future Plan</p>
          </div>
        </div>

        <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
          <InfoCard label="Monthly SIP" value={formatCurrency(scheme.monthlyInvestment) + "/-"} />
          <InfoCard
            label="Investment Period"
            value={`${scheme.investmentYears} Years`}
            icon={<CalendarClock className="h-5 w-5 text-amber-400" />}
          />
          <InfoCard
            label="Assumed Return"
            value={`${scheme.annualReturn}% p.a.`}
            valueClass="text-emerald-400"
          />
          <InfoCard
            label="Est. Fund Value"
            value={formatCurrency(scheme.fundValue)}
            valueClass="text-emerald-400"
          />
        </div>
      </div>

      {/* Investment breakdown */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <h4 className="mb-4 text-sm font-semibold text-slate-50">
          Investment Breakdown
        </h4>
        <div className="grid gap-4 md:grid-cols-3">
          <div className="rounded-lg border border-neutral-800 bg-neutral-900/50 p-4">
            <p className="text-xs text-slate-400">Total You Invest</p>
            <p className="mt-1 text-lg font-bold text-slate-50">
              {formatCurrency(totalInvested)}
            </p>
            <p className="text-[11px] text-slate-500">
              {scheme.monthlyInvestment.toLocaleString("en-IN")} x {scheme.investmentYears * 12} months
            </p>
          </div>
          <div className="rounded-lg border border-emerald-800/30 bg-emerald-950/20 p-4">
            <p className="text-xs text-emerald-400">Estimated Growth</p>
            <p className="mt-1 text-lg font-bold text-emerald-400">
              +{formatCurrency(estimatedGrowth)}
            </p>
            <p className="text-[11px] text-emerald-500/70">
              At {scheme.annualReturn}% annual return
            </p>
          </div>
          <div className="rounded-lg border border-amber-800/30 bg-amber-950/20 p-4">
            <p className="text-xs text-amber-400">Est. Fund Value</p>
            <p className="mt-1 text-lg font-bold text-amber-400">
              {formatCurrency(scheme.fundValue)}
            </p>
            <p className="text-[11px] text-amber-500/70">
              After {scheme.investmentYears} years
            </p>
          </div>
        </div>
      </div>

      {/* How it works */}
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <h4 className="mb-3 text-sm font-semibold text-slate-50">
          How SIP for Child Works
        </h4>
        <ol className="space-y-3">
          <Step num={1} text="Apply now — no money is deducted. Your application goes to admin for approval." />
          <Step num={2} text="Once approved, pay your first monthly premium (password + OTP) to activate the SIP." />
          <Step num={3} text="Pay ₹{scheme.monthlyInvestment.toLocaleString('en-IN')} every month. Each payment requires password + OTP verification." />
          <Step num={4} text={`Continue for ${scheme.investmentYears} years (120 months). Your fund grows to ~${formatCurrency(scheme.fundValue)}.`} />
        </ol>
      </div>

      {/* CRITICAL WARNING */}
      <div className="rounded-xl border-2 border-red-500/40 bg-red-500/5 p-5">
        <div className="flex items-start gap-3">
          <div className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-red-500/15">
            <ShieldAlert className="h-5 w-5 text-red-400" />
          </div>
          <div className="space-y-2">
            <h4 className="text-sm font-semibold text-red-300">
              Payment Rules — Read Carefully
            </h4>

            <ul className="space-y-1.5 text-sm leading-6 text-slate-400">
              <li className="flex items-start gap-2">
                <CheckCircle2 className="mt-1 h-3.5 w-3.5 shrink-0 text-emerald-400" />
                You must pay your monthly premium on time each month.
              </li>
              <li className="flex items-start gap-2">
                <TriangleAlert className="mt-1 h-3.5 w-3.5 shrink-0 text-amber-400" />
                You can miss up to{" "}
                <span className="font-semibold text-amber-300">3 payments</span>{" "}
                — your SIP will pause but not cancel.
              </li>
              <li className="flex items-start gap-2">
                <XCircle className="mt-1 h-3.5 w-3.5 shrink-0 text-red-400" />
                On the{" "}
                <span className="font-semibold text-red-300">
                  4th missed payment
                </span>
                , your SIP will be{" "}
                <span className="font-semibold text-red-300">
                  automatically rejected
                </span>{" "}
                and a{" "}
                <span className="font-semibold text-red-300">
                  full refund
                </span>{" "}
                of all paid premiums will be credited to your wallet.
              </li>
            </ul>

            <div className="mt-2 rounded-lg bg-red-500/10 border border-red-500/20 p-3">
              <p className="text-xs font-medium text-red-300">
                Example: If you miss payments in months 5, 8, and 11 — your SIP pauses.
                A 4th miss in any later month triggers auto-rejection + full refund.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Disclaimer */}
      <p className="text-[11px] leading-5 text-slate-500">
        * The assumed annual return of {scheme.annualReturn}% is illustrative and not guaranteed.
        Actual returns may vary. Past performance is not indicative of future results.
      </p>
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

function InfoCard({
  label,
  value,
  icon,
  valueClass,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
      <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <div className={`mt-1 flex items-center gap-2 text-lg font-bold ${valueClass || "text-slate-50"}`}>
        {icon}
        {value}
      </div>
    </div>
  );
}

function Step({ num, text }: { num: number; text: string }) {
  return (
    <li className="flex items-start gap-3">
      <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-500/20 text-xs font-bold text-amber-400">
        {num}
      </span>
      <p className="text-sm leading-6 text-slate-400">{text}</p>
    </li>
  );
}
