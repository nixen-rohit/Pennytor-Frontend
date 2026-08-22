import * as React from "react";
import { ArrowRight, Phone, TrendingUp, ShieldCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type InvestmentFundPlan = {
  serialNumber: string;
  amount: string;
  lockInPeriod: string;
  roi: string;
};

const INVESTMENT_FUND_PLANS: InvestmentFundPlan[] = [
  {
    serialNumber: "1.",
    amount: "Rs.5,00,000/- to Rs.25,00,000/-",
    lockInPeriod: "3 Years",
    roi: "3%",
  },
  {
    serialNumber: "2.",
    amount: "Rs.25,00,000/- to Rs.50,00,000/-",
    lockInPeriod: "3 Years",
    roi: "3.5%",
  },
  {
    serialNumber: "3.",
    amount: "Rs.50,00,000/- to Rs.1,00,00,000/-",
    lockInPeriod: "3 Years",
    roi: "4%",
  },
  {
    serialNumber: "4.",
    amount: "Rs.1,00,00,000/- to Rs.5,00,00,000/-",
    lockInPeriod: "3 Years",
    roi: "4.5%",
  },
  {
    serialNumber: "5.",
    amount: "Rs.5,00,00,000/- and Above",
    lockInPeriod: "3 Years",
    roi: "5%",
  },
];

type InvestmentFundProps = {
  onContact?: () => void;
  onApply?: (plan: InvestmentFundPlan) => void;
  className?: string;
};

export function InvestmentFund({
  onContact,
  onApply,
  className = "",
}: InvestmentFundProps) {
  return (
    <section
      aria-labelledby="investment-fund-heading"
      className={`w-full bg-[#08090f] px-4 py-12 text-white sm:px-6 lg:px-8 ${className}`}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#181820] via-[#101116] to-[#090a0f] px-5 py-8 shadow-2xl sm:px-8 sm:py-10 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl"
          />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                <TrendingUp className="h-4 w-4" aria-hidden="true" />
                Investment Plan
              </div>

              <h2
                id="investment-fund-heading"
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Investment <span className="text-amber-400">Fund Scheme</span>
              </h2>

              <p className="mt-4 max-w-2xl text-sm leading-6 text-zinc-400 sm:text-base">
                Explore investment plans based on your investment amount, with a
                fixed 3-year lock-in period and monthly ROI.
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
                onClick={() => onApply?.(INVESTMENT_FUND_PLANS[0])}
                className="h-11 bg-amber-400 px-5 font-semibold text-black hover:bg-amber-300"
              >
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop / tablet table */}
        <Card className="mt-6 hidden overflow-hidden border-white/10 bg-[#111217] shadow-2xl md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[900px] border-collapse">
                <caption className="sr-only">
                  Investment Fund Scheme plans with monthly ROI
                </caption>

                <thead>
                  <tr className="bg-[#18191f]">
                    <th
                      scope="col"
                      className="w-24 border-b border-white/10 px-5 py-5 text-left text-xs font-bold uppercase tracking-wider text-zinc-400"
                    >
                      S.N.
                    </th>
                    <th
                      scope="col"
                      className="border-b border-white/10 px-5 py-5 text-left text-xs font-bold uppercase tracking-wider text-zinc-400"
                    >
                      Amount
                    </th>
                    <th
                      scope="col"
                      className="border-b border-white/10 px-5 py-5 text-left text-xs font-bold uppercase tracking-wider text-zinc-400"
                    >
                      Lock-in Period
                    </th>
                    <th
                      scope="col"
                      className="border-b border-white/10 px-5 py-5 text-left text-xs font-bold uppercase tracking-wider text-zinc-400"
                    >
                      ROI
                      <span className="mt-1 block text-[10px] font-medium normal-case tracking-normal text-zinc-500">
                        (Monthly)
                      </span>
                    </th>
                    <th
                      scope="col"
                      className="border-b border-white/10 px-5 py-5 text-left text-xs font-bold uppercase tracking-wider text-zinc-400"
                    >
                      Action
                    </th>
                  </tr>
                </thead>

                <tbody>
                  {INVESTMENT_FUND_PLANS.map((plan, index) => (
                    <tr
                      key={plan.serialNumber}
                      className="transition-colors hover:bg-white/[0.025]"
                    >
                      <td className="border-b border-white/10 px-5 py-6 text-sm font-bold text-zinc-400">
                        {plan.serialNumber}
                      </td>

                      <td className="border-b border-white/10 px-5 py-6">
                        <span className="text-base font-bold text-white lg:text-lg">
                          {plan.amount}
                        </span>
                      </td>

                      <td className="border-b border-white/10 px-5 py-6 text-sm font-medium text-zinc-300">
                        {plan.lockInPeriod}
                      </td>

                      <td className="border-b border-white/10 px-5 py-6">
                        <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-bold text-amber-300">
                          {plan.roi}
                        </span>
                      </td>

                      <td className="border-b border-white/10 px-5 py-6">
                        <Button
                          type="button"
                          size="sm"
                          variant="outline"
                          onClick={() => onApply?.(plan)}
                          className={
                            "font-semibold border-white/15 bg-white/5 text-white  hover:bg-amber-400 hover:text-black"
                          }
                        >
                          Apply
                          <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                        </Button>
                      </td>
                    </tr>
                  ))}

                  {/* Custom budget row */}
                  <tr className="bg-[#0d0e12]">
                    <td colSpan={5} className="px-5 py-7">
                      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-amber-400/20 bg-amber-400/[0.03] p-5 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-base font-bold text-white">
                            Don&apos;t find a plan that fits your budget?
                          </p>
                          <p className="mt-1 text-sm text-zinc-500">
                            Contact us and we&apos;ll help you find a suitable
                            Investment Fund plan.
                          </p>
                        </div>

                        <Button
                          type="button"
                          variant="outline"
                          onClick={onContact}
                          className="shrink-0 border-amber-400/20 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:text-amber-200"
                        >
                          <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                          Contact Us
                        </Button>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        {/* Mobile cards */}
        <div className="mt-6 grid gap-4 md:hidden">
          {INVESTMENT_FUND_PLANS.map((plan, index) => (
            <Card
              key={plan.serialNumber}
              className="overflow-hidden border-white/10 bg-[#111217] text-white shadow-xl"
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#18191f] px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Plan {plan.serialNumber}
                    </p>
                    <p className="mt-1 text-xl font-bold">{plan.amount}</p>
                  </div>

                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-bold text-amber-300">
                    {plan.roi}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/10">
                  <div className="bg-[#111217] p-4">
                    <p className="text-xs text-zinc-500">Lock-in Period</p>
                    <p className="mt-1 font-medium text-zinc-200">
                      {plan.lockInPeriod}
                    </p>
                  </div>

                  <div className="bg-[#111217] p-4">
                    <p className="text-xs text-zinc-500">Monthly ROI</p>
                    <p className="mt-1 font-bold text-amber-300">{plan.roi}</p>
                  </div>
                </div>

                <div className="p-4">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => onApply?.(plan)}
                    className={
                      "font-semibold border-white/15 bg-white/5 text-white  hover:bg-amber-400 hover:text-black"
                    }
                  >
                    Apply for Plan {plan.serialNumber}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Custom budget card */}
          <Card className="overflow-hidden border-dashed border-amber-400/20 bg-amber-400/[0.03] text-white shadow-xl">
            <CardContent className="p-5">
              <p className="text-base font-bold text-white">
                Don&apos;t find a plan that fits your budget?
              </p>
              <p className="mt-1 text-sm leading-5 text-zinc-500">
                Contact us and we&apos;ll help you find a suitable Investment
                Fund plan.
              </p>

              <Button
                type="button"
                variant="outline"
                onClick={onContact}
                className="mt-4 w-full border-amber-400/20 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:text-amber-200"
              >
                <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Information note */}
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs leading-5 text-zinc-500">
          <ShieldCheck
            className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
            aria-hidden="true"
          />
          <p>
            The figures shown are dummy/demo data for UI purposes. Replace these
            values with your approved investment terms before using this
            component in production.
          </p>
        </div>
      </div>
    </section>
  );
}

export default InvestmentFund;
