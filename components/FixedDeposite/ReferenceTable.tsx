import { formatINR, PRESET_PLANS, solveImpliedRate } from "@/utils/fixeddeposite-calculations";
import { cn } from "@/lib/utils";

const COLUMNS = [
  "S.N.",
  "Amount",
  "Lock-in Period",
  "Payout Mode",
  "EMI",
  "Total Payout",
] as const;

export function ReferenceTable() {
  return (
    <section className="container -mt-10 sm:-mt-12">
      <div className="overflow-hidden rounded-lg border border-fd-paper-line bg-card shadow-sm">
        <div className="border-b border-dashed border-fd-paper-line bg-fd-vault/[0.03] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-fd-vault">
            The three plans, as printed
          </h2>
          <p className="text-sm text-muted-foreground">
            Each payout fully repays the deposit plus interest by the end
            of the lock-in &mdash; a standard amortizing schedule.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-fd-gold/15">
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-fd-vault"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRESET_PLANS.map((plan, i) => {
                const periods = plan.frequency === "monthly" ? plan.tenureMonths : plan.tenureMonths / 3;
                const totalPayout = plan.payoutAmount * periods;
                const freqLabel = plan.frequency === "monthly" ? "Monthly" : "Quatarly";
                return (
                  <tr
                    key={plan.id}
                    className={cn(
                      "border-t border-fd-paper-line font-mono text-sm tabular",
                      i % 2 === 1 && "bg-fd-paper",
                    )}
                  >
                    <td className="px-5 py-4">{plan.serial}.</td>
                    <td className="px-5 py-4 font-semibold text-fd-vault">
                      {formatINR(plan.principal)}
                    </td>
                    <td className="px-5 py-4">{plan.tenureMonths} Months</td>
                    <td className="px-5 py-4">{freqLabel}</td>
                    <td className="px-5 py-4">
                      {periods} X {formatINR(plan.payoutAmount)}
                    </td>
                    <td className="px-5 py-4 font-semibold">{formatINR(totalPayout)}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <ImpliedRateNote />
      </div>
    </section>
  );
}

function ImpliedRateNote() {
  const rates = PRESET_PLANS.map((plan) =>
    solveImpliedRate({
      principal: plan.principal,
      tenureMonths: plan.tenureMonths,
      frequency: plan.frequency,
      payoutAmount: plan.payoutAmount,
    }),
  );
  const lowest = Math.min(...rates.map((r) => r.effectiveAnnualRatePercent));
  const highest = Math.max(...rates.map((r) => r.effectiveAnnualRatePercent));

  return (
    <p className="border-t border-fd-paper-line px-6 py-3 text-[11px] text-muted-foreground">
      Working the payout schedule backwards, these three plans imply an
      effective annual return of roughly {lowest.toFixed(0)}%&ndash;
      {highest.toFixed(0)}% &mdash; well above typical bank FD rates
      (usually single digits to low teens). Worth confirming the source
      and terms directly before treating these as ordinary fixed deposits.
    </p>
  );
}
