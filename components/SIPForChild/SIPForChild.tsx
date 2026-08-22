"use client";

import { useState } from "react";
import { ArrowRight, GraduationCap, Phone, ShieldCheck ,ChartNoAxesCombined ,CalendarClock, IndianRupee } from "lucide-react";


import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type SIPExample = {
  id: "5000" | "2500";
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
    id: "5000",
    monthlyInvestment: 5000,
    investmentYears: 10,
    annualReturn: 22,
    fundValue: 2179000,
    withdrawalMonthly: 50000,
    withdrawalYears: 10,
    finalAmount: 1117000,
  },
  {
    id: "2500",
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

export function SIPForChild() {
  const [activeTab, setActiveTab] = useState<"5000" | "2500">("5000");

  const selectedExample =
    SIP_EXAMPLES.find((item) => item.id === activeTab) ?? SIP_EXAMPLES[0];

  const data = selectedExample;
  /* =========================
     SIP Calculations
  ========================= */

  const totalMonths = data.investmentYears * 12;

  const totalInvested = data.monthlyInvestment * totalMonths;

  const estimatedGrowth = data.fundValue - totalInvested;

  /* =========================
     SWP Calculations
  ========================= */

  const totalSWPWithdrawals =
    data.withdrawalMonthly * data.withdrawalYears * 12;

  const totalJourneyYears = data.investmentYears + data.withdrawalYears;

  return (
    <section
      aria-labelledby="sip-child-heading"
      className={`w-full bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8 `}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* =====================================================
            HERO
        ===================================================== */}

        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#18131f] via-[#110f16] to-[#09090b] px-5 py-8 shadow-2xl sm:px-8 sm:py-10 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-orange-500/10 blur-3xl"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-violet-500/10 blur-3xl"
          />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              {/* Badge */}

              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Child Future Planning
              </div>

              {/* Heading */}

              <h2
                id="sip-child-heading"
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                SIP For Child{" "}
                <span className="text-orange-400">Future Secure</span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Build a future corpus through a monthly SIP and use a planned
                SWP for your future financial needs.
              </p>
            </div>

            {/* Buttons */}

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Button
                type="button"
                variant="outline"
                className="h-11 border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
              >
                <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                Contact
              </Button>

              <Button
                type="button"
                className="h-11 bg-orange-400 px-5 font-semibold text-black hover:bg-orange-300"
              >
                Start Planning
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* =====================================================
            SIP TABS
        ===================================================== */}

        <div className="mt-6">
          <div className="mx-auto flex w-full max-w-xl rounded-2xl border border-white/10 bg-[#111113] p-1.5">
            {SIP_EXAMPLES.map((item) => {
              const isActive = activeTab === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setActiveTab(item.id)}
                  className={`flex-1 rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-200 ${
                    isActive
                      ? "bg-orange-400 text-black shadow-lg shadow-orange-400/10"
                      : "text-zinc-400 hover:bg-white/5 hover:text-white"
                  }`}
                >
                  SIP ₹ {formatINR(item.monthlyInvestment)}
                  /month
                </button>
              );
            })}
          </div>
        </div>

        {/* =====================================================
            ACTIVE PLAN HEADER
        ===================================================== */}

        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-sm font-medium text-orange-400">Selected Plan</p>

            <h3 className="mt-1 text-2xl font-bold text-white sm:text-3xl">
              SIP of <IndianRupee className="inline-block h-[1em] w-[1em]" />{" "}
              <span className="text-orange-400">
                {formatINR(data.monthlyInvestment)}
              </span>{" "}
              /- per month
            </h3>
          </div>

          <p className="text-sm text-zinc-500">
            {data.investmentYears} years SIP + {data.withdrawalYears} years SWP
          </p>
        </div>

        {/* =====================================================
            QUICK SUMMARY CARDS
        ===================================================== */}

        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {/* Monthly SIP */}

          <Card className="border-white/10 bg-[#111113] text-white">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Monthly SIP
              </p>

              <p className="mt-2 text-2xl font-bold">
                <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(data.monthlyInvestment)}/-
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                for {data.investmentYears} years
              </p>
            </CardContent>
          </Card>

          {/* Total Invested */}

          <Card className="border-white/10 bg-[#111113] text-white">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Total Invested
              </p>

              <p className="mt-2 text-2xl font-bold">
                <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(totalInvested)}/-
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                {totalMonths} monthly contributions
              </p>
            </CardContent>
          </Card>

          {/* Return */}

          <Card className="border-white/10 bg-[#111113] text-white">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Assumed Return
              </p>

              <p className="mt-2 text-2xl font-bold text-orange-400">
                {data.annualReturn}% p.a.
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                illustrative assumption
              </p>
            </CardContent>
          </Card>

          {/* Corpus */}

          <Card className="border-white/10 bg-[#111113] text-white">
            <CardContent className="p-5">
              <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                Fund Value
              </p>

              <p className="mt-2 text-2xl font-bold">
                <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(data.fundValue)}/-
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                after {data.investmentYears} years
              </p>
            </CardContent>
          </Card>
        </div>

        {/* =====================================================
            INVESTMENT SUMMARY
        ===================================================== */}

        <Card className="mt-6 border-white/10 bg-[#111113] text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Investment Summary</CardTitle>

            <p className="text-sm leading-6 text-zinc-500">
              A simple breakdown of your SIP investment, estimated fund value,
              and SWP plan.
            </p>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[700px] text-sm">
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
                  {/* Monthly SIP */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Monthly SIP
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-orange-400">
                      <span className="mr-2">
                        <CalendarClock className="inline-block h-5 w-5 text-orange-400" />
                      </span>
                      <IndianRupee className="inline-block h-[1em] w-[1em]" /> {formatINR(data.monthlyInvestment)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      Monthly investment
                    </td>
                  </tr>

                  {/* Investment Period */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Investment Period
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-white">
                      {data.investmentYears} Years
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      {totalMonths} monthly contributions
                    </td>
                  </tr>

                  {/* Total Invested */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Total Invested
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-white">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(totalInvested)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      Principal amount invested
                    </td>
                  </tr>

                  {/* Return */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Assumed Return
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-orange-400">
                      {data.annualReturn}% p.a.
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      Illustrative annual return
                    </td>
                  </tr>

                  {/* Fund Value */}

                  <tr className="bg-orange-400/[0.04] hover:bg-orange-400/[0.07]">
                    <td className="px-5 py-4 font-semibold text-white">
                      Fund Value
                    </td>

                    <td className="px-5 py-4 text-right text-lg font-bold text-orange-400">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(data.fundValue)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-400">
                      Value after {data.investmentYears} years
                    </td>
                  </tr>

                  {/* Growth */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Estimated Growth 
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-emerald-400">
                      <span className="mr-2">
                        <ChartNoAxesCombined  className="inline-block h-5 w-5 text-emerald-400" />
                      </span> <IndianRupee className="inline-block h-[1em] w-[1em]" /> {formatINR(estimatedGrowth)}/- 
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      Growth over invested amount
                    </td>
                  </tr>

                  {/* SWP */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Monthly SWP
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-white">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(data.withdrawalMonthly)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      Planned monthly withdrawal
                    </td>
                  </tr>

                  {/* SWP Period */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      SWP Period
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-white">
                      {data.withdrawalYears} Years
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      {data.withdrawalYears * 12} monthly withdrawals
                    </td>
                  </tr>

                  {/* Total SWP */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Total SWP Withdrawals
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-white">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(totalSWPWithdrawals)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      Total planned withdrawals
                    </td>
                  </tr>

                  {/* Final Amount */}

                  <tr className="bg-emerald-400/[0.03] hover:bg-emerald-400/[0.06]">
                    <td className="px-5 py-4 font-semibold text-white">
                      Final Amount
                    </td>

                    <td className="px-5 py-4 text-right text-lg font-bold text-emerald-400">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(data.finalAmount)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-400">
                      At the end of {totalJourneyYears} years
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* =====================================================
            INVESTMENT JOURNEY
        ===================================================== */}

        <Card className="mt-6 border-white/10 bg-[#111113] text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">Your Investment Journey</CardTitle>

            <p className="text-sm text-zinc-500">
              Understand how your money moves through each stage.
            </p>
          </CardHeader>

          <CardContent>
            <div className="overflow-x-auto rounded-2xl border border-white/10">
              <table className="w-full min-w-[750px] text-sm">
                <thead>
                  <tr className="border-b border-white/10 bg-[#18181b]">
                    <th className="px-5 py-4 text-left text-zinc-400">Stage</th>

                    <th className="px-5 py-4 text-left text-zinc-400">
                      What Happens?
                    </th>

                    <th className="px-5 py-4 text-right text-zinc-400">
                      Amount
                    </th>

                    <th className="px-5 py-4 text-left text-zinc-400">
                      Duration
                    </th>
                  </tr>
                </thead>

                <tbody className="divide-y divide-white/10">
                  {/* Phase 1 */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-5">
                      <span className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300">
                        Phase 1
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-semibold text-white">
                        Build the Corpus
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Invest a fixed amount every month.
                      </p>
                    </td>

                    <td className="px-5 py-5 text-right font-bold text-white">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" /> {formatINR(data.monthlyInvestment)}/month
                    </td>

                    <td className="px-5 py-5 text-zinc-400">
                      {data.investmentYears} years
                    </td>
                  </tr>

                  {/* Phase 2 */}

                  <tr className="bg-orange-400/[0.03] hover:bg-orange-400/[0.07]">
                    <td className="px-5 py-5">
                      <span className="inline-flex rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1 text-xs font-semibold text-orange-300">
                        Phase 2
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-semibold text-white">Corpus Created</p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Your SIP grows based on the illustrative return.
                      </p>
                    </td>

                    <td className="px-5 py-5 text-right font-bold text-orange-400">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" /> {formatINR(data.fundValue)}/-
                    </td>

                    <td className="px-5 py-5 text-zinc-400">
                      After {data.investmentYears} years
                    </td>
                  </tr>

                  {/* Phase 3 */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-5">
                      <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Phase 3
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-semibold text-white">
                        Start Monthly SWP
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Withdraw a fixed amount from the accumulated corpus.
                      </p>
                    </td>

                    <td className="px-5 py-5 text-right font-bold text-white">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" /> {formatINR(data.withdrawalMonthly)}/month
                    </td>

                    <td className="px-5 py-5 text-zinc-400">
                      {data.withdrawalYears} years
                    </td>
                  </tr>

                  {/* Result */}

                  <tr className="bg-emerald-400/[0.03] hover:bg-emerald-400/[0.06]">
                    <td className="px-5 py-5">
                      <span className="inline-flex rounded-full border border-emerald-400/20 bg-emerald-400/10 px-3 py-1 text-xs font-semibold text-emerald-300">
                        Result
                      </span>
                    </td>

                    <td className="px-5 py-5">
                      <p className="font-semibold text-white">
                        Remaining Corpus
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Illustrative value after the SWP period.
                      </p>
                    </td>

                    <td className="px-5 py-5 text-right font-bold text-emerald-400">
                      <IndianRupee className="inline-block h-[1em] w-[1em]" /> {formatINR(data.finalAmount)}/-
                    </td>

                    <td className="px-5 py-5 text-zinc-400">
                      After {data.withdrawalYears} years
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

         

        {/* =====================================================
            FINAL RESULT HIGHLIGHT
        ===================================================== */}

        <Card className="mt-6 overflow-hidden border-emerald-400/10 bg-gradient-to-r from-emerald-400/[0.04] to-transparent text-white">
          <CardContent className="p-6 sm:p-8">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-wider text-zinc-500">
                  Final Amount After {totalJourneyYears} Years
                </p>

                <p className="mt-2 text-3xl font-bold text-emerald-400 sm:text-4xl">
                  <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(data.finalAmount)}/-
                </p>

                <p className="mt-2 max-w-2xl text-sm leading-6 text-zinc-500">
                  After investing <IndianRupee className="inline-block h-[1em] w-[1em]" />
                  {formatINR(data.monthlyInvestment)}
                  /month for {data.investmentYears} years and withdrawing <IndianRupee className="inline-block h-[1em] w-[1em]" />
                  {formatINR(data.withdrawalMonthly)}
                  /month through SWP for the next {data.withdrawalYears} years.
                </p>
              </div>

              <div className="shrink-0 rounded-2xl border border-emerald-400/10 bg-emerald-400/5 px-6 py-5">
                <p className="text-xs text-zinc-500">Total SWP Withdrawals</p>

                <p className="mt-1 text-xl font-bold text-white">
                  <IndianRupee className="inline-block h-[1em] w-[1em]" />{formatINR(totalSWPWithdrawals)}/-
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* =====================================================
            CONTACT
        ===================================================== */}

        <div className="mt-6 rounded-2xl border border-dashed border-orange-400/20 bg-orange-400/[0.03] p-5 sm:p-6">
          <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
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
              className="shrink-0 border-orange-400/20 bg-orange-400/10 text-orange-300 hover:bg-orange-400/20 hover:text-orange-200"
            >
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Contact Us
            </Button>
          </div>
        </div>

        {/* =====================================================
            DISCLAIMER
        ===================================================== */}

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
