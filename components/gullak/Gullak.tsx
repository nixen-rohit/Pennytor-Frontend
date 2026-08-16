"use client"
import { PiggyBank, ArrowRight, Phone, CheckCircle2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

type GullakPlan = {
  dailyDeposit: string;
  timePeriod: string;
  annualReturn: string;
  investedAmount: string;
  finalAmount: string;
  netProfit: string;
};

const GULLAK_PLANS: GullakPlan[] = [
  {
    dailyDeposit: "Rs.100/-",
    timePeriod: "5 Years",
    annualReturn: "@15%",
    investedAmount: "Rs.1,80,000/-",
    finalAmount: "Rs.2,70,000/-",
    netProfit: "Rs.90,000/-",
  },
  {
    dailyDeposit: "Rs.200/-",
    timePeriod: "5 Years",
    annualReturn: "@15%",
    investedAmount: "Rs.3,60,000/-",
    finalAmount: "Rs.5,38,090/-",
    netProfit: "Rs.1,78,000/-",
  },
  {
    dailyDeposit: "Rs.500/-",
    timePeriod: "5 Years",
    annualReturn: "@15%",
    investedAmount: "Rs.9,00,000/-",
    finalAmount: "Rs.13,45,000/-",
    netProfit: "Rs.4,45,000/-",
  },
];

type GullakProps = {
  onContact?: () => void;
  onApply?: (plan: GullakPlan) => void;
  className?: string;
};

export function Gullak({ onContact, onApply }: GullakProps) {
  return (
    <section
      aria-labelledby="gullak-heading"
      className={`w-full bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8`}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#17171a] via-[#101012] to-[#09090b] px-5 py-8 shadow-2xl sm:px-8 sm:py-10 lg:px-12">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -right-24 -top-24 h-64 w-64 rounded-full bg-amber-500/10 blur-3xl"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -bottom-32 left-1/3 h-64 w-64 rounded-full bg-orange-500/5 blur-3xl"
          />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-2xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                <PiggyBank className="h-4 w-4" aria-hidden="true" />
                Savings Scheme
              </div>

              <h2
                id="gullak-heading"
                className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl"
              >
                Gullak <span className="text-amber-400">Scheme</span>
              </h2>

              <p className="mt-4 max-w-xl text-sm leading-6 text-zinc-400 sm:text-base">
                Build your savings consistently with a simple daily deposit plan
                designed around a 5-year period.
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
                onClick={() => onApply?.(GULLAK_PLANS[0])}
                className="h-11 bg-amber-400 px-5 font-semibold text-black hover:bg-amber-300"
              >
                Apply Now
                <ArrowRight className="ml-2 h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </div>

        {/* Desktop / tablet table */}
        <Card className="mt-6 hidden overflow-hidden border-white/10 bg-[#111113] shadow-2xl md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <caption className="sr-only">
                  Gullak Scheme investment plans
                </caption>
                <thead>
                  <tr className="bg-[#18181b]">
                    {[
                      "Daily Deposit",
                      "Time Period",
                      "Annual Return",
                      "Invested Amount",
                      "Final Amount",
                      "Net Profit",
                      "Action",
                    ].map((heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="border-b border-white/10 px-5 py-5 text-left text-xs font-bold uppercase tracking-wider text-zinc-400"
                      >
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>

                <tbody>
                  {GULLAK_PLANS.map((plan, index) => (
                    <tr
                      key={plan.dailyDeposit}
                      className="group transition-colors hover:bg-white/[0.025]"
                    >
                      <td className="border-b border-white/10 px-5 py-6">
                        <span className="text-lg font-bold text-white">
                          {plan.dailyDeposit}
                        </span>
                        <span className="mt-1 block text-xs text-zinc-500">
                          Daily savings
                        </span>
                      </td>

                      <td className="border-b border-white/10 px-5 py-6 text-sm font-medium text-zinc-300">
                        {plan.timePeriod}
                      </td>

                      <td className="border-b border-white/10 px-5 py-6">
                        <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                          {plan.annualReturn}
                        </span>
                      </td>

                      <td className="border-b border-white/10 px-5 py-6 text-sm font-medium text-zinc-300">
                        {plan.investedAmount}
                      </td>

                      <td className="border-b border-white/10 px-5 py-6 text-base font-bold text-white">
                        {plan.finalAmount}
                      </td>

                      <td className="border-b border-white/10 px-5 py-6">
                        <span className="text-base font-bold text-emerald-400">
                          {plan.netProfit}
                        </span>
                      </td>

                      <td className="border-b border-white/10 px-5 py-6">
                        <Button
                          type="button"
                          size="sm"
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
                  <tr className="bg-[#0d0d0f]">
                    <td colSpan={7} className="px-5 py-7">
                      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-amber-400/20 bg-amber-400/[0.03] p-5 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-base font-bold text-white">
                            Don't find a plan that fits your budget?
                          </p>
                          <p className="mt-1 text-sm text-zinc-500">
                            Contact us and we'll help you find a suitable Gullak
                            plan.
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
          {GULLAK_PLANS.map((plan, index) => (
            <Card
              key={plan.dailyDeposit}
              className="overflow-hidden border-white/10 bg-[#111113] text-white shadow-xl"
            >
              <CardContent className="p-0">
                <div className="flex items-center justify-between border-b border-white/10 bg-[#18181b] px-5 py-4">
                  <div>
                    <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                      Daily Deposit
                    </p>
                    <p className="mt-1 text-2xl font-bold">
                      {plan.dailyDeposit}
                    </p>
                  </div>

                  <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                    {plan.annualReturn}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-px bg-white/10">
                  <div className="bg-[#111113] p-4">
                    <p className="text-xs text-zinc-500">Time Period</p>
                    <p className="mt-1 font-medium text-zinc-200">
                      {plan.timePeriod}
                    </p>
                  </div>
                  <div className="bg-[#111113] p-4">
                    <p className="text-xs text-zinc-500">Invested Amount</p>
                    <p className="mt-1 font-medium text-zinc-200">
                      {plan.investedAmount}
                    </p>
                  </div>
                  <div className="bg-[#111113] p-4">
                    <p className="text-xs text-zinc-500">Final Amount</p>
                    <p className="mt-1 font-bold text-white">
                      {plan.finalAmount}
                    </p>
                  </div>
                  <div className="bg-[#111113] p-4">
                    <p className="text-xs text-zinc-500">Net Profit</p>
                    <p className="mt-1 font-bold text-emerald-400">
                      {plan.netProfit}
                    </p>
                  </div>
                </div>

                <div className="p-4">
                  <Button
                    type="button"
                    onClick={() => onApply?.(plan)}
                    className={
                      "w-full bg-amber-400 font-semibold text-black hover:bg-amber-300"
                    }
                  >
                    Apply for {plan.dailyDeposit}
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
          <Card className="overflow-hidden border-dashed border-amber-400/20 bg-amber-400/[0.03] text-white shadow-xl">
            <CardContent className="p-5">
              <p className="text-base font-bold text-white">
                Don't find a plan that fits your budget?
              </p>
              <p className="mt-1 text-sm leading-5 text-zinc-500">
                Contact us and we'll help you find a suitable Gullak plan.
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

        {/* Trust / note */}
        <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs leading-5 text-zinc-500">
          <CheckCircle2
            className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400"
            aria-hidden="true"
          />
          <p>
            The figures above are displayed exactly as provided in the Gullak
            Scheme reference. Confirm applicable terms, returns, and final
            calculations before publishing or accepting applications.
          </p>
        </div>
      </div>
    </section>
  );
}

export default Gullak;
