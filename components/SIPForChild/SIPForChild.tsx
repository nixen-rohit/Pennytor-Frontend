 
import {
  ArrowRight,
  Calculator,
  GraduationCap,
  Phone,
  ShieldCheck,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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

const calculateSIP = ({
  monthlyInvestment,
  investmentYears,
  annualReturn,
}: Pick<SIPExample, "monthlyInvestment" | "investmentYears" | "annualReturn">) => {
  const months = investmentYears * 12;
  const monthlyRate = annualReturn / 100 / 12;

  if (monthlyRate === 0) {
    return monthlyInvestment * months;
  }

  // Future value of an ordinary SIP, with contribution made at the
  // beginning of each month (annuity-due convention).
  return (
    monthlyInvestment *
    (((1 + monthlyRate) ** months - 1) / monthlyRate) *
    (1 + monthlyRate)
  );
};

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
    return Math.max(0, startingCorpus - monthlyWithdrawal * months);
  }

  return (
    startingCorpus * (1 + monthlyRate) ** months -
    monthlyWithdrawal * (((1 + monthlyRate) ** months - 1) / monthlyRate)
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
  const data = { ...EXAMPLE, ...example };

  const totalMonths = data.investmentYears * 12;
  const totalInvested = data.monthlyInvestment * totalMonths;
  const fundValue = calculateSIP(data);
  const estimatedGrowth = fundValue - totalInvested;

  const projectedEndValue = calculateSWPEndValue({
    startingCorpus: fundValue,
    monthlyWithdrawal: data.withdrawalMonthly,
    withdrawalYears: data.withdrawalYears,
    annualReturn: data.annualReturn,
  });

  const totalSWPWithdrawals =
    data.withdrawalMonthly * data.withdrawalYears * 12;

  return (
    <section
      aria-labelledby="sip-child-heading"
      className={`w-full bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8 ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Hero */}
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
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-orange-400/20 bg-orange-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-orange-300">
                <GraduationCap className="h-4 w-4" aria-hidden="true" />
                Child Future Planning
              </div>

              <h2
                id="sip-child-heading"
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                SIP For Child{" "}
                <span className="text-orange-400">Future Secure</span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                A simple example showing how a monthly SIP can build a corpus
                and how a future SWP can be illustrated from that corpus.
              </p>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row lg:shrink-0">
              <Button
                type="button"
                variant="outline"
                onClick={onContact}
                className="h-11 border-white/15 bg-white/5 px-5 text-white hover:bg-white/10 hover:text-white"
              >
                <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                Contact
              </Button>

              <Button
                type="button"
                onClick={onApply}
                className="h-11 bg-orange-400 px-5 font-semibold text-black hover:bg-orange-300"
              >
                Start Planning
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Example summary */}
        <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
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

        {/* Formula explanation */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card className="border-white/10 bg-[#111113] text-white shadow-xl">
            <CardHeader>
              <div className="mb-2 inline-flex w-fit rounded-full border border-orange-400/20 bg-orange-400/10 p-2 text-orange-300">
                <Calculator className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">
                Step 1: SIP Corpus Formula
              </CardTitle>
              <p className="text-sm leading-6 text-zinc-500">
                The future value of a monthly SIP can be estimated using the
                following formula.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="font-mono text-sm leading-7 text-orange-300 sm:text-base">
                  FV = P × [((1 + r)^n − 1) / r] × (1 + r)
                </p>
              </div>

              <div className="space-y-3 text-sm text-zinc-300">
                <p>
                  <strong className="text-white">P</strong> = monthly SIP
                  amount
                </p>
                <p>
                  <strong className="text-white">r</strong> = annual return ÷
                  12 ÷ 100
                </p>
                <p>
                  <strong className="text-white">n</strong> = number of monthly
                  investments = years × 12
                </p>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <p className="mb-3 text-sm font-semibold text-white">
                  Example using the values above
                </p>
                <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5 font-mono text-xs leading-7 text-zinc-300 sm:text-sm">
                  <p>P = Rs.{formatINR(data.monthlyInvestment)}</p>
                  <p>r = {data.annualReturn}% ÷ 12 ÷ 100</p>
                  <p>n = {data.investmentYears} × 12 = {totalMonths}</p>
                  <p className="mt-2 text-orange-300">
                    FV ≈ Rs.{formatINR(fundValue)}
                  </p>
                </div>
              </div>

              <div className="rounded-xl border border-emerald-400/10 bg-emerald-400/[0.03] p-4">
                <p className="text-xs text-zinc-500">Estimated growth</p>
                <p className="mt-1 text-xl font-bold text-emerald-400">
                  Rs.{formatINR(estimatedGrowth)}/-
                </p>
              </div>
            </CardContent>
          </Card>

          <Card className="border-white/10 bg-[#111113] text-white shadow-xl">
            <CardHeader>
              <div className="mb-2 inline-flex w-fit rounded-full border border-orange-400/20 bg-orange-400/10 p-2 text-orange-300">
                <Calculator className="h-5 w-5" aria-hidden="true" />
              </div>
              <CardTitle className="text-2xl">
                Step 2: SWP Remaining Corpus
              </CardTitle>
              <p className="text-sm leading-6 text-zinc-500">
                If the corpus is later used for a monthly withdrawal, the
                remaining value can be illustrated using the SWP formula.
              </p>
            </CardHeader>

            <CardContent className="space-y-5">
              <div className="rounded-2xl border border-white/10 bg-black/20 p-5">
                <p className="font-mono text-sm leading-7 text-orange-300 sm:text-base">
                  FV = PV × (1 + r)^n − W × [((1 + r)^n − 1) / r]
                </p>
              </div>

              <div className="space-y-3 text-sm text-zinc-300">
                <p>
                  <strong className="text-white">PV</strong> = starting corpus
                </p>
                <p>
                  <strong className="text-white">W</strong> = monthly
                  withdrawal
                </p>
                <p>
                  <strong className="text-white">r</strong> = assumed annual
                  return ÷ 12 ÷ 100
                </p>
                <p>
                  <strong className="text-white">n</strong> = withdrawal years
                  × 12
                </p>
              </div>

              <Separator className="bg-white/10" />

              <div>
                <p className="mb-3 text-sm font-semibold text-white">
                  Example using the values above
                </p>
                <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5 font-mono text-xs leading-7 text-zinc-300 sm:text-sm">
                  <p>PV ≈ Rs.{formatINR(fundValue)}</p>
                  <p>W = Rs.{formatINR(data.withdrawalMonthly)}/month</p>
                  <p>r = {data.annualReturn}% ÷ 12 ÷ 100</p>
                  <p>n = {data.withdrawalYears} × 12</p>
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

        {/* Visual timeline */}
        <Card className="mt-6 border-white/10 bg-[#111113] text-white shadow-xl">
          <CardContent className="p-5 sm:p-7">
            <div className="grid gap-4 lg:grid-cols-3 lg:items-center">
              <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Phase 1
                </p>
                <p className="mt-2 text-lg font-bold">
                  Build the corpus
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Rs.{formatINR(data.monthlyInvestment)}/month ×{" "}
                  {data.investmentYears} years
                </p>
              </div>

              <div className="hidden justify-center lg:flex">
                <ArrowRight className="h-6 w-6 text-orange-400" />
              </div>

              <div className="rounded-2xl border border-orange-400/20 bg-orange-400/[0.04] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-orange-300">
                  Phase 2
                </p>
                <p className="mt-2 text-lg font-bold">
                  Estimated corpus
                </p>
                <p className="mt-2 text-sm text-zinc-400">
                  Rs.{formatINR(fundValue)}/-
                </p>
              </div>

              <div className="hidden justify-center lg:flex">
                <ArrowRight className="h-6 w-6 text-orange-400" />
              </div>

              <div className="rounded-2xl border border-white/10 bg-[#18181b] p-5">
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                  Phase 3
                </p>
                <p className="mt-2 text-lg font-bold">
                  Monthly SWP
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  Rs.{formatINR(data.withdrawalMonthly)}/month ×{" "}
                  {data.withdrawalYears} years
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Contact / custom planning */}
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
              onClick={onContact}
              className="shrink-0 border-orange-400/20 bg-orange-400/10 text-orange-300 hover:bg-orange-400/20 hover:text-orange-200"
            >
              <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
              Contact Us
            </Button>
          </div>
        </div>

        {/* Disclaimer */}
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs leading-5 text-zinc-500">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
            aria-hidden="true"
          />
          <p>
            This component uses illustrative example data and mathematical
            formulas for demonstration only. Actual investment returns are not
            guaranteed and can differ materially. Replace the example values
            and assumptions with approved product terms before production use.
          </p>
        </div>
      </div>
    </section>
  );
}

export default SIPForChild;
