import * as React from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Phone, ShieldCheck, WalletCards, BadgeCheck } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import {
  FixedDepositService,
  type FDApplication,
  type FDPlanId,
} from "@/services/fixed-deposit.service";

type FixedDepositPlan = {
  serialNumber: string;
  amount: string;
  lockInPeriod: string;
  payoutMode: string;
  emi: string;
  totalPayout: string;
  planId: FDPlanId;
};

const FIXED_DEPOSIT_PLANS: FixedDepositPlan[] = [
  {
    serialNumber: "1.",
    amount: "Rs. 25,000/-",
    lockInPeriod: "48 Months",
    payoutMode: "Quarterly",
    emi: "16 X Rs.3,130/-",
    totalPayout: "Rs. 50,080/-",
    planId: "FD_25000",
  },
  {
    serialNumber: "2.",
    amount: "Rs. 50,000/-",
    lockInPeriod: "42 Months",
    payoutMode: "Quarterly",
    emi: "14 X Rs.7,145/-",
    totalPayout: "Rs. 1,00,030/-",
    planId: "FD_50000",
  },
  {
    serialNumber: "3.",
    amount: "Rs. 1,00,000/-",
    lockInPeriod: "40 Months",
    payoutMode: "Monthly",
    emi: "40 X Rs.5,000/-",
    totalPayout: "Rs. 2,00,000/-",
    planId: "FD_100000",
  },
];

export function FixedDeposit({ onContact, className = "" }: { onContact?: () => void; className?: string }) {
  const router = useRouter();
  const [activeSchemes, setActiveSchemes] = React.useState<Set<FDPlanId>>(new Set());

  React.useEffect(() => {
    FixedDepositService.myApplications()
      .then((apps: FDApplication[]) => {
        const active = new Set<FDPlanId>();
        for (const app of apps) {
          if (app.status === "PENDING" || app.status === "VERIFIED") {
            active.add(app.planId);
          }
        }
        setActiveSchemes(active);
      })
      .catch(() => {});
  }, []);

  const handleApply = (plan: FixedDepositPlan) => {
    router.push(
      `/investment/all-schemes/fixed-deposite/apply/${plan.planId}?name=${encodeURIComponent(plan.amount)}&lockIn=${encodeURIComponent(plan.lockInPeriod)}&payoutMode=${encodeURIComponent(plan.payoutMode)}&emi=${encodeURIComponent(plan.emi)}&totalPayout=${encodeURIComponent(plan.totalPayout)}`,
    );
  };

  return (
    <section
      aria-labelledby="fixed-deposit-heading"
      className={`w-full bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8`}
    >
      <div className="mx-auto w-full max-w-7xl">
        {/* Header */}
        <div className="relative overflow-hidden rounded-3xl border border-white/10 bg-gradient-to-br from-[#171820] via-[#101116] to-[#090a0f] px-5 py-8 shadow-2xl sm:px-8 sm:py-10 lg:px-12">
          <div aria-hidden="true" className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-amber-500/10 blur-3xl" />
          <div aria-hidden="true" className="pointer-events-none absolute -bottom-32 left-1/3 h-72 w-72 rounded-full bg-orange-500/5 blur-3xl" />

          <div className="relative flex flex-col gap-7 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-5xl">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.18em] text-amber-300">
                <WalletCards className="h-4 w-4" aria-hidden="true" />
                Fixed Investment
              </div>

              <h2 id="fixed-deposit-heading" className="text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
                Fixed{" "}
                <span className="text-amber-400">
                  Deposit{" "}
                  <span className="mt-1 text-xl font-bold text-amber-400 sm:text-2xl">(With SWP)</span>
                </span>
              </h2>

              <p className="mt-4 max-w-4xl text-sm leading-6 text-zinc-400 sm:text-base">
                Choose a fixed deposit amount, lock-in period, and payout mode that works for your financial goals.
              </p>
            </div>
          </div>
        </div>

        {/* Desktop / tablet table */}
        <Card className="mt-6 hidden overflow-hidden border-white/10 bg-[#111217] shadow-2xl md:block">
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full min-w-[980px] border-collapse">
                <caption className="sr-only">Fixed Deposit with SWP investment plans</caption>
                <thead>
                  <tr className="bg-[#18191f]">
                    {["S.N.", "Amount", "Lock-in-Period", "Payout Mode", "EMI", "Total Payout", "Action"].map((heading) => (
                      <th key={heading} scope="col" className="border-b border-white/10 px-5 py-5 text-left text-xs font-bold uppercase tracking-wider text-zinc-400">
                        {heading}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {FIXED_DEPOSIT_PLANS.map((plan) => {
                    const isActive = activeSchemes.has(plan.planId);
                    return (
                      <tr key={plan.serialNumber} className="transition-colors hover:bg-white/[0.025]">
                        <td className="border-b border-white/10 px-5 py-6 text-sm font-bold text-zinc-400">{plan.serialNumber}</td>
                        <td className="border-b border-white/10 px-5 py-6">
                          <span className="text-lg font-bold text-white">{plan.amount}</span>
                        </td>
                        <td className="border-b border-white/10 px-5 py-6 text-sm font-medium text-zinc-300">{plan.lockInPeriod}</td>
                        <td className="border-b border-white/10 px-5 py-6">
                          <span className="inline-flex rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                            {plan.payoutMode}
                          </span>
                        </td>
                        <td className="border-b border-white/10 px-5 py-6 text-sm font-medium text-zinc-300">{plan.emi}</td>
                        <td className="border-b border-white/10 px-5 py-6 text-base font-bold text-emerald-400">{plan.totalPayout}</td>
                        <td className="border-b border-white/10 px-5 py-6">
                          {isActive ? (
                            <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-300">
                              <BadgeCheck className="h-4 w-4" />
                              Already Active
                            </span>
                          ) : (
                            <Button
                              type="button"
                              size="sm"
                              variant="outline"
                              onClick={() => handleApply(plan)}
                              className="font-semibold border-white/15 bg-white/5 text-white hover:bg-amber-400 hover:text-black"
                            >
                              Apply
                              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                  <tr className="bg-[#0d0e12]">
                    <td colSpan={7} className="px-5 py-7">
                      <div className="flex flex-col items-start justify-between gap-4 rounded-2xl border border-dashed border-amber-400/20 bg-amber-400/[0.03] p-5 sm:flex-row sm:items-center">
                        <div>
                          <p className="text-base font-bold text-white">Don&apos;t find a plan that fits your budget?</p>
                          <p className="mt-1 text-sm text-zinc-500">Contact us and we&apos;ll help you find a suitable Fixed Deposit plan.</p>
                        </div>
                        <Button type="button" variant="outline" onClick={onContact} className="shrink-0 border-amber-400/20 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:text-amber-200">
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
          {FIXED_DEPOSIT_PLANS.map((plan) => {
            const isActive = activeSchemes.has(plan.planId);
            return (
              <Card key={plan.serialNumber} className="overflow-hidden border-white/10 bg-[#111217] text-white shadow-xl">
                <CardContent className="p-0">
                  <div className="flex items-center justify-between border-b border-white/10 bg-[#18191f] px-5 py-4">
                    <div>
                      <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Plan {plan.serialNumber}</p>
                      <p className="mt-1 text-2xl font-bold">{plan.amount}</p>
                    </div>
                    <span className="rounded-full border border-amber-400/20 bg-amber-400/10 px-3 py-1 text-sm font-semibold text-amber-300">
                      {plan.payoutMode}
                    </span>
                  </div>
                  <div className="grid grid-cols-2 gap-px bg-white/10">
                    <div className="bg-[#111217] p-4">
                      <p className="text-xs text-zinc-500">Lock-in Period</p>
                      <p className="mt-1 font-medium text-zinc-200">{plan.lockInPeriod}</p>
                    </div>
                    <div className="bg-[#111217] p-4">
                      <p className="text-xs text-zinc-500">Payout Mode</p>
                      <p className="mt-1 font-medium text-zinc-200">{plan.payoutMode}</p>
                    </div>
                    <div className="bg-[#111217] p-4">
                      <p className="text-xs text-zinc-500">EMI</p>
                      <p className="mt-1 font-medium text-zinc-200">{plan.emi}</p>
                    </div>
                    <div className="bg-[#111217] p-4">
                      <p className="text-xs text-zinc-500">Total Payout</p>
                      <p className="mt-1 font-bold text-emerald-400">{plan.totalPayout}</p>
                    </div>
                  </div>
                  <div className="p-4">
                    {isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1.5 text-sm font-semibold text-emerald-300">
                        <BadgeCheck className="h-4 w-4" />
                        Already Active
                      </span>
                    ) : (
                      <Button
                        type="button"
                        onClick={() => handleApply(plan)}
                        variant="outline"
                        className="font-semibold border-white/15 bg-white/5 text-white hover:bg-amber-400 hover:text-black"
                      >
                        Apply for {plan.amount}
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            );
          })}
          <Card className="overflow-hidden border-dashed border-amber-400/20 bg-amber-400/[0.03] text-white shadow-xl">
            <CardContent className="p-5">
              <p className="text-base font-bold text-white">Don&apos;t find a plan that fits your budget?</p>
              <p className="mt-1 text-sm leading-5 text-zinc-500">Contact us and we&apos;ll help you find a suitable Fixed Deposit plan.</p>
              <Button type="button" variant="outline" onClick={onContact} className="mt-4 w-full border-amber-400/20 bg-amber-400/10 text-amber-300 hover:bg-amber-400/20 hover:text-amber-200">
                <Phone className="mr-2 h-4 w-4" aria-hidden="true" />
                Contact Us
              </Button>
            </CardContent>
          </Card>
        </div>

        <div className="mt-5 flex items-start gap-2 rounded-xl border border-white/10 bg-white/[0.025] px-4 py-3 text-xs leading-5 text-zinc-500">
          <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-zinc-400" aria-hidden="true" />
          <p>
            The figures above are displayed exactly as provided in the Fixed Deposit reference. Confirm applicable terms, payout schedules, and final calculations before publishing or accepting applications.
          </p>
        </div>
      </div>
    </section>
  );
}

export default FixedDeposit;
