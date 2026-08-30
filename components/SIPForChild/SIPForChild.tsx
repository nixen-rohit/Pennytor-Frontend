"use client";

import { useEffect, useState } from "react";
import {
  GraduationCap,
  Phone,
  ShieldCheck,
  ChartNoAxesCombined,
  CalendarClock,
  IndianRupee,
  ArrowRight,
  BadgeCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { SIPForChildService } from "@/services/sip-for-child.service";
import { useAuthStore } from "@/store/auth.store";

type SIPExample = {
  id: number;
  planId: "PLAN_5000" | "PLAN_2500";
  planName: string;
  monthlyInvestment: number;
  investmentYears: number;
  annualReturn: number;

  // Value shown in the provided design
  fundValue: number;

  withdrawalMonthly: number;
  withdrawalYears: number;

  // Final value shown in the provided design
  finalAmount: number;
};

const SIP_EXAMPLES: SIPExample[] = [
  {
    id: 1,
    planId: "PLAN_5000",
    planName: "SIP PLAN A",
    monthlyInvestment: 5000,
    investmentYears: 10,
    annualReturn: 22,
    fundValue: 2179000,
    withdrawalMonthly: 50000,
    withdrawalYears: 10,
    finalAmount: 1117000,
  },
  {
    id: 2,
    planId: "PLAN_2500",
    planName: "SIP PLAN B",
    monthlyInvestment: 2500,
    investmentYears: 10,
    annualReturn: 22,
    fundValue: 1089000,
    withdrawalMonthly: 25000,
    withdrawalYears: 10,
    finalAmount: 400000,
  },
];

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const Rupee = () => (
  <IndianRupee className="inline-block h-[1em] w-[1em]" aria-hidden="true" />
);

type Row = {
  label: string;
  value: React.ReactNode;
  valueClass?: string;
  detail: string;
  highlight?: "orange" | "emerald";
};

function SummaryTable({ rows }: { rows: Row[] }) {
  return (
    <>
      {/* Table: md and up */}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#18181b]">
              <th className="px-5 py-4 text-left font-semibold text-zinc-400">
                Particular
              </th>
              <th className="px-5 py-4 text-right font-semibold text-zinc-400">
                Value
              </th>
              <th className="px-5 py-4 text-left font-semibold text-zinc-400">
                Details
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {rows.map((row) => (
              <tr
                key={row.label}
                className={
                  row.highlight === "orange"
                    ? "bg-orange-400/[0.04] hover:bg-orange-400/[0.07]"
                    : row.highlight === "emerald"
                      ? "bg-emerald-400/[0.03] hover:bg-emerald-400/[0.06]"
                      : "hover:bg-white/[0.02]"
                }
              >
                <td className="px-5 py-4 font-medium text-white">
                  {row.label}
                </td>
                <td
                  className={`px-5 py-4 text-right font-bold ${
                    row.valueClass ?? "text-white"
                  }`}
                >
                  {row.value}
                </td>
                <td className="px-5 py-4 text-zinc-500">{row.detail}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked cards: below md */}
      <div className="space-y-2.5 md:hidden">
        {rows.map((row) => (
          <div
            key={row.label}
            className={`rounded-xl border border-white/10 px-4 py-3 ${
              row.highlight === "orange"
                ? "bg-orange-400/[0.05]"
                : row.highlight === "emerald"
                  ? "bg-emerald-400/[0.04]"
                  : "bg-[#111113]"
            }`}
          >
            <div className="flex items-start justify-between gap-3">
              <p className="text-sm font-medium text-white">{row.label}</p>
              <p
                className={`shrink-0 text-right text-sm font-bold ${
                  row.valueClass ?? "text-white"
                }`}
              >
                {row.value}
              </p>
            </div>
            <p className="mt-1 text-xs text-zinc-500">{row.detail}</p>
          </div>
        ))}
      </div>
    </>
  );
}

type Stage = {
  tag: string;
  tagClass: string;
  title: string;
  desc: string;
  amount: React.ReactNode;
  amountClass: string;
  duration: string;
  rowClass: string;
};

function JourneyTable({ stages }: { stages: Stage[] }) {
  return (
    <>
      {/* Table: md and up */}
      <div className="hidden overflow-x-auto rounded-2xl border border-white/10 md:block">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-white/10 bg-[#18181b]">
              <th className="px-5 py-4 text-left text-zinc-400">Stage</th>
              <th className="px-5 py-4 text-left text-zinc-400">
                What Happens?
              </th>
              <th className="px-5 py-4 text-right text-zinc-400">Amount</th>
              <th className="px-5 py-4 text-left text-zinc-400">Duration</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/10">
            {stages.map((stage) => (
              <tr key={stage.tag + stage.title} className={stage.rowClass}>
                <td className="px-5 py-5">
                  <span
                    className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${stage.tagClass}`}
                  >
                    {stage.tag}
                  </span>
                </td>
                <td className="px-5 py-5">
                  <p className="font-semibold text-white">{stage.title}</p>
                  <p className="mt-1 text-xs text-zinc-500">{stage.desc}</p>
                </td>
                <td
                  className={`px-5 py-5 text-right font-bold ${stage.amountClass}`}
                >
                  {stage.amount}
                </td>
                <td className="px-5 py-5 text-zinc-400">{stage.duration}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Stacked cards: below md */}
      <div className="space-y-3 md:hidden">
        {stages.map((stage) => (
          <div
            key={stage.tag + stage.title}
            className="rounded-xl border border-white/10 bg-[#111113] p-4"
          >
            <span
              className={`inline-flex rounded-full border px-3 py-1 text-xs font-semibold ${stage.tagClass}`}
            >
              {stage.tag}
            </span>
            <p className="mt-2.5 font-semibold text-white">{stage.title}</p>
            <p className="mt-1 text-xs text-zinc-500">{stage.desc}</p>
            <div className="mt-3 flex items-center justify-between border-t border-white/5 pt-2.5">
              <p className={`text-sm font-bold ${stage.amountClass}`}>
                {stage.amount}
              </p>
              <p className="text-xs text-zinc-400">{stage.duration}</p>
            </div>
          </div>
        ))}
      </div>
    </>
  );
}

export function SIPForChild() {
  const [activeTab, setActiveTab] = useState<number>(1);
  const isAuthenticated = useAuthStore((s) => s.isAuthenticated);
  const [activeSchemes, setActiveSchemes] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (!isAuthenticated) return;
    let cancelled = false;
    SIPForChildService.myApplications()
      .then((res) => {
        if (cancelled) return;
        setActiveSchemes(
          new Set(
            (res.items ?? [])
              .filter((i) => i.status === "PENDING" || i.status === "VERIFIED")
              .map((i) => i.scheme),
          ),
        );
      })
      .catch(() => undefined);
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  const isSchemeActive = (planId: string) => activeSchemes.has(planId);

  const selectedExample =
    SIP_EXAMPLES.find((item) => item.id === activeTab) ?? SIP_EXAMPLES[0];

  const data = selectedExample;

  /* ========================= SIP Calculations ========================= */
  const totalMonths = data.investmentYears * 12;
  const totalInvested = data.monthlyInvestment * totalMonths;
  const estimatedGrowth = data.fundValue - totalInvested;

  /* ========================= SWP Calculations ========================= */
  const totalSWPWithdrawals =
    data.withdrawalMonthly * data.withdrawalYears * 12;
  const totalJourneyYears = data.investmentYears + data.withdrawalYears;

  const summaryRows: Row[] = [
    {
      label: "Monthly SIP",
      value: (
        <>
          <CalendarClock className="mr-2 inline-block h-5 w-5 text-orange-400" />
          <Rupee /> {formatINR(data.monthlyInvestment)}/-
        </>
      ),
      valueClass: "text-orange-400",
      detail: "Monthly investment",
    },
    {
      label: "Investment Period",
      value: `${data.investmentYears} Years`,
      detail: `${totalMonths} monthly contributions`,
    },
    {
      label: "Total Invested",
      value: (
        <>
          <Rupee /> {formatINR(totalInvested)}/-
        </>
      ),
      detail: "Principal amount invested",
    },
    {
      label: "Assumed Return",
      value: `${data.annualReturn}% p.a.`,
      valueClass: "text-orange-400",
      detail: "Illustrative annual return",
    },
    {
      label: "Fund Value",
      value: (
        <>
          <Rupee /> {formatINR(data.fundValue)}/-
        </>
      ),
      valueClass: "text-lg text-orange-400",
      detail: `Value after ${data.investmentYears} years`,
      highlight: "orange",
    },
    {
      label: "Estimated Growth",
      value: (
        <>
          <ChartNoAxesCombined className="mr-2 inline-block h-5 w-5 text-emerald-400" />
          <Rupee /> {formatINR(estimatedGrowth)}/-
        </>
      ),
      valueClass: "text-emerald-400",
      detail: "Growth over invested amount",
    },
    {
      label: "Monthly SWP",
      value: (
        <>
          <Rupee /> {formatINR(data.withdrawalMonthly)}/-
        </>
      ),
      detail: "Planned monthly withdrawal",
    },
    {
      label: "SWP Period",
      value: `${data.withdrawalYears} Years`,
      detail: `${data.withdrawalYears * 12} monthly withdrawals`,
    },
    {
      label: "Total SWP Withdrawals",
      value: (
        <>
          <Rupee /> {formatINR(totalSWPWithdrawals)}/-
        </>
      ),
      detail: "Total planned withdrawals",
    },
    {
      label: "Final Amount",
      value: (
        <>
          <Rupee /> {formatINR(data.finalAmount)}/-
        </>
      ),
      valueClass: "text-lg text-emerald-400",
      detail: `At the end of ${totalJourneyYears} years`,
      highlight: "emerald",
    },
  ];

  const stages: Stage[] = [
    {
      tag: "Phase 1",
      tagClass: "border-orange-400/20 bg-orange-400/10 text-orange-300",
      title: "Build the Corpus",
      desc: "Invest a fixed amount every month.",
      amount: (
        <>
          <Rupee /> {formatINR(data.monthlyInvestment)}/month
        </>
      ),
      amountClass: "text-white",
      duration: `${data.investmentYears} years`,
      rowClass: "hover:bg-white/[0.02]",
    },
    {
      tag: "Phase 2",
      tagClass: "border-orange-400/20 bg-orange-400/10 text-orange-300",
      title: "Corpus Created",
      desc: "Your SIP grows based on the illustrative return.",
      amount: (
        <>
          <Rupee /> {formatINR(data.fundValue)}/-
        </>
      ),
      amountClass: "text-orange-400",
      duration: `After ${data.investmentYears} years`,
      rowClass: "bg-orange-400/[0.03] hover:bg-orange-400/[0.07]",
    },
    {
      tag: "Phase 3",
      tagClass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      title: "Start Monthly SWP",
      desc: "Withdraw a fixed amount from the accumulated corpus.",
      amount: (
        <>
          <Rupee /> {formatINR(data.withdrawalMonthly)}/month
        </>
      ),
      amountClass: "text-white",
      duration: `${data.withdrawalYears} years`,
      rowClass: "hover:bg-white/[0.02]",
    },
    {
      tag: "Result",
      tagClass: "border-emerald-400/20 bg-emerald-400/10 text-emerald-300",
      title: "Remaining Corpus",
      desc: "Illustrative value after the SWP period.",
      amount: (
        <>
          <Rupee /> {formatINR(data.finalAmount)}/-
        </>
      ),
      amountClass: "text-emerald-400",
      duration: `After ${data.withdrawalYears} years`,
      rowClass: "bg-emerald-400/[0.03] hover:bg-emerald-400/[0.06]",
    },
  ];

  return (
    <section
      aria-labelledby="sip-child-heading"
      className="w-full bg-[#09090b] px-3 py-8 text-white xs:px-4 sm:px-6 sm:py-12 lg:px-8"
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* ===================== HERO ===================== */}
        <div className="relative overflow-hidden rounded-2xl border border-white/10 bg-gradient-to-br from-[#18131f] via-[#110f16] to-[#09090b] px-4 py-7 shadow-2xl sm:rounded-3xl sm:px-8 sm:py-10 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative max-w-6xl">
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
              <GraduationCap className="h-4 w-4 shrink-0" aria-hidden="true" />
              Child Future Planning
            </div>

            <h2
              id="sip-child-heading"
              className="text-3xl font-bold leading-[1.1] tracking-tight text-white xs:text-4xl sm:text-5xl lg:text-6xl"
            >
              SIP For Child{" "}
              <span className="text-orange-400">Future Secure</span>
            </h2>

            <p className="mt-4 max-w-5xl text-sm leading-6 text-zinc-400 sm:text-base">
              Build a future corpus through a monthly SIP and use a planned SWP
              for your future financial needs.
            </p>
          </div>
        </div>

        {/* ===================== SIP TABS & APPLY BUTTONS ===================== */}
        <div className="mt-6">
          <div className="mx-auto flex w-full max-w-xl rounded-2xl border border-white/10 bg-[#111113] p-1.5">
            {SIP_EXAMPLES.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  aria-pressed={isActive}
                  className={`flex-1 font-bold rounded-xl px-2.5 py-2.5 text-xs transition-all duration-200 sm:px-4 sm:py-3 sm:text-sm ${
                    isActive
                      ? "bg-orange-400 text-black shadow-lg shadow-orange-400/10"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  {item.planName}
                </button>
              );
            })}
          </div>
        </div>

        {/* ===================== ACTIVE PLAN HEADER ===================== */}
        <div className="mt-6 ">
          <p className="text-sm font-medium text-orange-400">Selected Plan</p>
          <h3 className="mt-1 flex flex-wrap items-baseline gap-x-2 text-xl font-bold text-white sm:text-2xl lg:text-3xl">
            <span>{data.planName}</span>
            <span className="text-zinc-500">
              (<Rupee />{" "}
              <span className="text-orange-400">
                {formatINR(data.monthlyInvestment)}
              </span>{" "}
              /- per month)
            </span>
          </h3>
        </div>

        {/* ===================== QUICK SUMMARY CARDS ===================== */}
        <div className="mt-6 grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
          <Card className="border-white/10 bg-[#111113] text-white">
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:text-xs">
                Monthly SIP
              </p>
              <p className="mt-2 text-lg font-bold sm:text-2xl">
                <Rupee />
                {formatINR(data.monthlyInvestment)}/-
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                for {data.investmentYears} years
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#111113] text-white">
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:text-xs">
                Total Invested
              </p>
              <p className="mt-2 text-lg font-bold sm:text-2xl">
                <Rupee />
                {formatINR(totalInvested)}/-
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                {totalMonths} monthly contributions
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#111113] text-white">
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:text-xs">
                Assumed Return
              </p>
              <p className="mt-2 text-lg font-bold text-orange-400 sm:text-2xl">
                {data.annualReturn}% p.a.
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                illustrative assumption
              </p>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#111113] text-white">
            <CardContent className="p-4 sm:p-5">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500 sm:text-xs">
                Fund Value
              </p>
              <p className="mt-2 text-lg font-bold sm:text-2xl">
                <Rupee />
                {formatINR(data.fundValue)}/-
              </p>
              <p className="mt-1 text-xs text-zinc-500">
                after {data.investmentYears} years
              </p>
            </CardContent>
          </Card>
        </div>

        {/* ===================== INVESTMENT SUMMARY ===================== */}
        <Card className="mt-6 border-white/10 bg-[#111113] text-white shadow-xl">
          <CardHeader className="px-4 sm:px-6">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="min-w-0 flex-1">
                <CardTitle className="text-xl sm:text-2xl">
                  Investment Summary
                </CardTitle>

                <p className="mt-1 max-w-2xl text-sm leading-6 text-zinc-500">
                  A simple breakdown of your SIP investment, estimated fund
                  value, and SWP plan.
                </p>
              </div>

              {/* Single Apply Button for Selected Scheme */}
              <div>
                {isSchemeActive(selectedExample.planId) ? (
                  <Button
                    type="button"
                    disabled
                    className="bg-green-500/10 border border-green-500/20 text-green-400 px-8 py-3 text-sm font-semibold rounded-xl"
                  >
                    <BadgeCheck className="mr-2 h-4 w-4" />
                    Already Active
                  </Button>
                ) : (
                  <Button
                    type="button"
                    onClick={() =>
                      window.open(
                        `/investment/all-schemes/sip-for-child/apply/${selectedExample.planId}`,
                        "_self"
                      )
                    }
                    className="bg-orange-600 text-white hover:bg-orange-700 px-8 py-3 text-sm font-semibold transition-all duration-200 rounded-xl shadow-lg shadow-orange-400/10"
                  >
                    Apply for{" "}
                    {SIP_EXAMPLES.find((item) => item.id === activeTab)?.planName}
                  </Button>
                )}
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-4 sm:px-6">
            <div className="w-full overflow-x-auto">
              <SummaryTable rows={summaryRows} />
            </div>
          </CardContent>
        </Card>

        {/* ===================== INVESTMENT JOURNEY ===================== */}
        <Card className="mt-6 border-white/10 bg-[#111113] text-white shadow-xl">
          <CardHeader className="px-4 sm:px-6">
            <CardTitle className="text-xl sm:text-2xl">
              Your Investment Journey
            </CardTitle>
            <p className="text-sm text-zinc-500">
              Understand how your money moves through each stage.
            </p>
          </CardHeader>
          <CardContent className="px-4 sm:px-6">
            <JourneyTable stages={stages} />
          </CardContent>
        </Card>

        {/* ===================== FINAL RESULT HIGHLIGHT ===================== */}
        <Card className="mt-6 overflow-hidden border-emerald-400/10 bg-gradient-to-r from-emerald-400/[0.04] to-transparent text-white">
          <CardContent className="p-5 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500 sm:text-sm">
                  Final Amount After {totalJourneyYears} Years
                </p>
                <p className="mt-2 text-2xl font-bold text-emerald-400 sm:text-3xl lg:text-4xl">
                  <Rupee />
                  {formatINR(data.finalAmount)}/-
                </p>
                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  After investing <Rupee />
                  {formatINR(data.monthlyInvestment)}
                  /month for {data.investmentYears} years and withdrawing{" "}
                  <Rupee />
                  {formatINR(data.withdrawalMonthly)}
                  /month through SWP for the next {data.withdrawalYears} years.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-5 py-4 sm:px-6 sm:py-5">
                <p className="text-xs text-zinc-500">Total SWP Withdrawals</p>
                <p className="mt-1 text-lg font-bold text-white sm:text-xl">
                  <Rupee />
                  {formatINR(totalSWPWithdrawals)}/-
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* ===================== CONTACT ===================== */}
        <div className="mt-6 rounded-2xl border border-dashed border-orange-400/20 bg-orange-400/[0.03] p-4 sm:p-6">
          <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-base font-bold text-white">
                Want a different SIP amount or time period?
              </p>
              <p className="mt-1 text-sm text-zinc-500">
                Contact us to create an example based on your preferred monthly
                contribution and target.
              </p>
            </div>

            <Button
              type="button"
              variant="outline"
              className="w-full shrink-0 border-orange-400/20 bg-orange-400/10 text-orange-300 hover:bg-orange-400/20 hover:text-orange-200 sm:w-auto"
            >
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Contact Us
            </Button>
          </div>
        </div>

        {/* ===================== DISCLAIMER ===================== */}
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs leading-5 text-zinc-500">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
            aria-hidden="true"
          />
          <p>
            This component uses illustrative example data based on the provided
            investment illustration. The assumed 22% return is not guaranteed
            and actual investment returns may differ materially. The displayed
            corpus and final amount are illustrative figures only.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SIPForChild;
