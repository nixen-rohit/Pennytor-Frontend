import {
  ArrowRight,
  Calculator,
  GraduationCap,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

type SIPExample = {
  monthlyInvestment: number;
  investmentYears: number;
  annualReturn: number;
  withdrawalMonthly: number;
  withdrawalYears: number;
};

const EXAMPLE: SIPExample = {
  monthlyInvestment: 5000,
  investmentYears: 10,
  annualReturn: 22,
  withdrawalMonthly: 50000,
  withdrawalYears: 10,
};

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

/**
 * Future value of a SIP assuming contributions
 * are made at the beginning of each month
 * (annuity-due convention).
 */
const calculateSIP = ({
  monthlyInvestment,
  investmentYears,
  annualReturn,
}: Pick<
  SIPExample,
  "monthlyInvestment" | "investmentYears" | "annualReturn"
>) => {
  const months = investmentYears * 12;
  const monthlyRate = annualReturn / 100 / 12;

  if (monthlyRate === 0) {
    return monthlyInvestment * months;
  }

  return (
    monthlyInvestment *
    (((1 + monthlyRate) ** months - 1) / monthlyRate) *
    (1 + monthlyRate)
  );
};

/**
 * Calculates the estimated corpus remaining after
 * monthly withdrawals.
 */
const calculateSWPEndValue = ({
  startingCorpus,
  monthlyWithdrawal,
  withdrawalYears,
  annualReturn,
}: {
  startingCorpus: number;
  monthlyWithdrawal: number;
  withdrawalYears: number;
  annualReturn: number;
}) => {
  const months = withdrawalYears * 12;
  const monthlyRate = annualReturn / 100 / 12;

  if (monthlyRate === 0) {
    return Math.max(
      0,
      startingCorpus - monthlyWithdrawal * months
    );
  }

  return (
    startingCorpus * (1 + monthlyRate) ** months -
    monthlyWithdrawal *
      (((1 + monthlyRate) ** months - 1) / monthlyRate)
  );
};

type SIPForChildProps = {
  example?: Partial<SIPExample>;
  onContact?: () => void;
  onApply?: () => void;
  className?: string;
};

export function SIPForChild({
  example,
  onContact,
  onApply,
  className = "",
}: SIPForChildProps) {
  const data = {
    ...EXAMPLE,
    ...example,
  };

  /* =========================
     SIP Calculations
  ========================= */

  const totalMonths = data.investmentYears * 12;

  const totalInvested =
    data.monthlyInvestment * totalMonths;

  const fundValue = calculateSIP(data);

  const estimatedGrowth =
    fundValue - totalInvested;

  /* =========================
     SWP Calculations
  ========================= */

  const projectedEndValue = calculateSWPEndValue({
    startingCorpus: fundValue,
    monthlyWithdrawal: data.withdrawalMonthly,
    withdrawalYears: data.withdrawalYears,
    annualReturn: data.annualReturn,
  });

  const totalSWPWithdrawals =
    data.withdrawalMonthly *
    data.withdrawalYears *
    12;

  return (
    <section
      aria-labelledby="sip-child-heading"
      className={`w-full bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8 ${className}`}
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
                <GraduationCap
                  className="h-4 w-4"
                  aria-hidden="true"
                />

                Child Future Planning
              </div>

              {/* Heading */}

              <h2
                id="sip-child-heading"
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                SIP For Child{" "}
                <span className="text-orange-400">
                  Future Secure
                </span>
              </h2>

              {/* Description */}

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                A simple example showing how a monthly SIP
                can build a corpus and how a future SWP can
                be illustrated from that corpus.
              </p>
            </div>

            {/* Buttons */}

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={onContact}
                className="h-11 border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
              >
                <Phone
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                />

                Contact
              </Button>

              <Button
                type="button"
                onClick={onApply}
                className="h-11 bg-orange-400 px-5 font-semibold text-black hover:bg-orange-300"
              >
                Start Planning

                <ArrowRight
                  className="ml-2 h-4 w-4"
                  aria-hidden="true"
                />
              </Button>
            </div>
          </div>
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
                Rs.{formatINR(data.monthlyInvestment)}/-
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
                Rs.{formatINR(totalInvested)}/-
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
                Example Return
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
                Estimated Corpus
              </p>

              <p className="mt-2 text-2xl font-bold">
                Rs.{formatINR(fundValue)}/-
              </p>

              <p className="mt-1 text-xs text-zinc-500">
                after {data.investmentYears} years
              </p>
            </CardContent>
          </Card>
        </div>

        {/* =====================================================
            INVESTMENT SUMMARY TABLE
        ===================================================== */}

        <Card className="mt-6 border-white/10 bg-[#111113] text-white shadow-xl">
          <CardHeader>
            <CardTitle className="text-2xl">
              Investment Summary
            </CardTitle>

            <p className="text-sm leading-6 text-zinc-500">
              A simple breakdown of your SIP investment,
              estimated corpus, and SWP plan.
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
                      Rs.{formatINR(data.monthlyInvestment)}/-
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
                      Rs.{formatINR(totalInvested)}/-
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

                  {/* Corpus */}

                  <tr className="bg-orange-400/[0.04] hover:bg-orange-400/[0.07]">
                    <td className="px-5 py-4 font-semibold text-white">
                      Estimated Corpus
                    </td>

                    <td className="px-5 py-4 text-right text-lg font-bold text-orange-400">
                      Rs.{formatINR(fundValue)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-400">
                      Estimated value after{" "}
                      {data.investmentYears} years
                    </td>
                  </tr>

                  {/* Growth */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Estimated Growth
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-emerald-400">
                      Rs.{formatINR(estimatedGrowth)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      Estimated profit over invested amount
                    </td>
                  </tr>

                  {/* SWP */}

                  <tr className="hover:bg-white/[0.02]">
                    <td className="px-5 py-4 font-medium text-white">
                      Monthly SWP
                    </td>

                    <td className="px-5 py-4 text-right font-bold text-white">
                      Rs.{formatINR(data.withdrawalMonthly)}/-
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
                      Rs.{formatINR(totalSWPWithdrawals)}/-
                    </td>

                    <td className="px-5 py-4 text-zinc-500">
                      Total planned withdrawals
                    </td>
                  </tr>

                  {/* Ending Corpus */}

                  <tr className="bg-emerald-400/[0.03] hover:bg-emerald-400/[0.06]">
                    <td className="px-5 py-4 font-semibold text-white">
                      Estimated Ending Corpus
                    </td>

                    <td className="px-5 py-4 text-right text-lg font-bold text-emerald-400">
                      {projectedEndValue > 0
                        ? `Rs.${formatINR(projectedEndValue)}/-`
                        : "Rs.0/-"}
                    </td>

                    <td className="px-5 py-4 text-zinc-400">
                      After {data.withdrawalYears} years of SWP
                    </td>
                  </tr>

                </tbody>
              </table>

            </div>
          </CardContent>
        </Card>

        {/* =====================================================
            FORMULA SECTION
        ===================================================== */}

        <div className="mt-6 grid gap-6 lg:grid-cols-2">

          {/* SIP Formula */}

          <Card className="border-white/10 bg-[#111113] text-white shadow-xl">

            <CardHeader>

              <div className="mb-2 inline-flex w-fit rounded-full border border-orange-400/20 bg-orange-400/10 p-2 text-orange-300">
                <Calculator
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <CardTitle className="text-2xl">
                Step 1: SIP Corpus Formula
              </CardTitle>

              <p className="text-sm leading-6 text-zinc-500">
                The future value of a monthly SIP can be
                estimated using the following formula.
              </p>

            </CardHeader>

            <CardContent className="space-y-5">

              {/* Formula */}

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="font-mono text-sm leading-7 text-orange-300 sm:text-base">
                  FV = P × [((1 + r)^n − 1) / r] × (1 + r)
                </p>
              </div>

              {/* Variables */}

              <div className="overflow-hidden rounded-2xl border border-white/10">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="bg-[#18181b]">
                      <th className="px-4 py-3 text-left text-zinc-400">
                        Symbol
                      </th>

                      <th className="px-4 py-3 text-left text-zinc-400">
                        Meaning
                      </th>
                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">

                    <tr>
                      <td className="px-4 py-3 font-bold text-orange-300">
                        P
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        Monthly SIP amount
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-bold text-orange-300">
                        r
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        Annual return ÷ 12 ÷ 100
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-bold text-orange-300">
                        n
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        Investment years × 12
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-bold text-orange-300">
                        FV
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        Estimated future value
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

              <Separator className="bg-white/10" />

              {/* Example */}

              <div>

                <p className="mb-3 text-sm font-semibold text-white">
                  Example using the values above
                </p>

                <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5 font-mono text-xs leading-7 text-zinc-300 sm:text-sm">

                  <p>
                    P = Rs.
                    {formatINR(data.monthlyInvestment)}
                  </p>

                  <p>
                    r = {data.annualReturn}% ÷ 12 ÷ 100
                  </p>

                  <p>
                    n = {data.investmentYears} × 12 ={" "}
                    {totalMonths}
                  </p>

                  <p className="mt-2 text-orange-300">
                    FV ≈ Rs.{formatINR(fundValue)}
                  </p>

                </div>

              </div>

              {/* Growth */}

              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] p-4">

                <p className="text-xs text-zinc-500">
                  Estimated growth
                </p>

                <p className="mt-1 text-xl font-bold text-emerald-400">
                  Rs.{formatINR(estimatedGrowth)}/-
                </p>

              </div>

            </CardContent>
          </Card>

          {/* SWP Formula */}

          <Card className="border-white/10 bg-[#111113] text-white shadow-xl">

            <CardHeader>

              <div className="mb-2 inline-flex w-fit rounded-full border border-orange-400/20 bg-orange-400/10 p-2 text-orange-300">
                <Calculator
                  className="h-5 w-5"
                  aria-hidden="true"
                />
              </div>

              <CardTitle className="text-2xl">
                Step 2: SWP Remaining Corpus
              </CardTitle>

              <p className="text-sm leading-6 text-zinc-500">
                If the corpus is later used for monthly
                withdrawals, the remaining value can be
                illustrated using the SWP formula.
              </p>

            </CardHeader>

            <CardContent className="space-y-5">

              {/* Formula */}

              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="font-mono text-sm leading-7 text-orange-300 sm:text-base">
                  FV = PV × (1 + r)^n − W × [((1 + r)^n − 1) / r]
                </p>
              </div>

              {/* Variables */}

              <div className="overflow-hidden rounded-2xl border border-white/10">

                <table className="w-full text-sm">

                  <thead>
                    <tr className="bg-[#18181b]">

                      <th className="px-4 py-3 text-left text-zinc-400">
                        Symbol
                      </th>

                      <th className="px-4 py-3 text-left text-zinc-400">
                        Meaning
                      </th>

                    </tr>
                  </thead>

                  <tbody className="divide-y divide-white/10">

                    <tr>
                      <td className="px-4 py-3 font-bold text-orange-300">
                        PV
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        Starting corpus
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-bold text-orange-300">
                        W
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        Monthly withdrawal
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-bold text-orange-300">
                        r
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        Annual return ÷ 12 ÷ 100
                      </td>
                    </tr>

                    <tr>
                      <td className="px-4 py-3 font-bold text-orange-300">
                        n
                      </td>

                      <td className="px-4 py-3 text-zinc-300">
                        Withdrawal years × 12
                      </td>
                    </tr>

                  </tbody>

                </table>

              </div>

              <Separator className="bg-white/10" />

              {/* Example */}

              <div>

                <p className="mb-3 text-sm font-semibold text-white">
                  Example using the values above
                </p>

                <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5 font-mono text-xs leading-7 text-zinc-300 sm:text-sm">

                  <p>
                    PV ≈ Rs.{formatINR(fundValue)}
                  </p>

                  <p>
                    W = Rs.
                    {formatINR(data.withdrawalMonthly)}
                    /month
                  </p>

                  <p>
                    r = {data.annualReturn}% ÷ 12 ÷ 100
                  </p>

                  <p>
                    n = {data.withdrawalYears} × 12
                  </p>

                  <p className="mt-2 text-orange-300">
                    Total SWP withdrawals = Rs.
                    {formatINR(totalSWPWithdrawals)}
                  </p>

                  <p className="text-orange-300">
                    Illustrative ending value ≈{" "}
                    {projectedEndValue > 0
                      ? `Rs.${formatINR(projectedEndValue)}`
                      : "Rs.0/- (corpus exhausted)"}
                  </p>

                </div>

              </div>

            </CardContent>
          </Card>

        </div>

        {/* =====================================================
            INVESTMENT JOURNEY TABLE
        ===================================================== */}

        <Card className="mt-6 border-white/10 bg-[#111113] text-white shadow-xl">

          <CardHeader>

            <CardTitle className="text-2xl">
              Your Investment Journey
            </CardTitle>

            <p className="text-sm text-zinc-500">
              Understand how your money moves through each
              stage.
            </p>

          </CardHeader>

          <CardContent>

            <div className="overflow-x-auto rounded-2xl border border-white/10">

              <table className="w-full min-w-[750px] text-sm">

                <thead>

                  <tr className="border-b border-white/10 bg-[#18181b]">

                    <th className="px-5 py-4 text-left text-zinc-400">
                      Stage
                    </th>

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
                      Rs.
                      {formatINR(
                        data.monthlyInvestment
                      )}
                      /month
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

                      <p className="font-semibold text-white">
                        Corpus Created
                      </p>

                      <p className="mt-1 text-xs text-zinc-500">
                        Your SIP grows based on the assumed
                        return.
                      </p>

                    </td>

                    <td className="px-5 py-5 text-right font-bold text-orange-400">
                      Rs.{formatINR(fundValue)}/-
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
                        Withdraw a fixed amount from the
                        accumulated corpus.
                      </p>

                    </td>

                    <td className="px-5 py-5 text-right font-bold text-white">
                      Rs.
                      {formatINR(
                        data.withdrawalMonthly
                      )}
                      /month
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
                        Illustrative value after the SWP
                        period.
                      </p>

                    </td>

                    <td className="px-5 py-5 text-right font-bold text-emerald-400">
                      {projectedEndValue > 0
                        ? `Rs.${formatINR(
                            projectedEndValue
                          )}/-`
                        : "Rs.0/-"}
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
            SIMPLE EXPLANATION
        ===================================================== */}

        <Card className="mt-6 border-orange-400/10 bg-orange-400/[0.02] text-white">

          <CardContent className="p-6">

            <div className="grid gap-6 md:grid-cols-3">

              {/* Step 1 */}

              <div>

                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange-400/10 text-sm font-bold text-orange-300">
                  1
                </div>

                <h3 className="font-semibold text-white">
                  Start SIP
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Invest Rs.
                  {formatINR(
                    data.monthlyInvestment
                  )}
                  every month for{" "}
                  {data.investmentYears} years.
                </p>

              </div>

              {/* Step 2 */}

              <div>

                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-orange-400/10 text-sm font-bold text-orange-300">
                  2
                </div>

                <h3 className="font-semibold text-white">
                  Build Corpus
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Based on the illustrative return
                  assumption, the estimated corpus is
                  Rs.{formatINR(fundValue)}/-.
                </p>

              </div>

              {/* Step 3 */}

              <div>

                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-full bg-emerald-400/10 text-sm font-bold text-emerald-300">
                  3
                </div>

                <h3 className="font-semibold text-white">
                  Start SWP
                </h3>

                <p className="mt-2 text-sm leading-6 text-zinc-500">
                  Withdraw Rs.
                  {formatINR(
                    data.withdrawalMonthly
                  )}
                  /month for{" "}
                  {data.withdrawalYears} years.
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
                Want a different SIP amount or time
                period?
              </p>

              <p className="mt-1 text-sm text-zinc-500">
                Contact us to create an example based on
                your preferred monthly contribution and
                target.
              </p>

            </div>

            <Button
              type="button"
              variant="outline"
              onClick={onContact}
              className="shrink-0 border-orange-400/20 bg-orange-400/10 text-orange-300 hover:bg-orange-400/20 hover:text-orange-200"
            >
              <Phone
                className="mr-2 h-4 w-4"
                aria-hidden="true"
              />

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
            This component uses illustrative example data
            and mathematical formulas for demonstration
            only. Actual investment returns are not
            guaranteed and can differ materially. Replace
            the example values and assumptions with
            approved product terms before production use.
          </p>

        </div>

      </div>
    </section>
  );
}

export default SIPForChild;