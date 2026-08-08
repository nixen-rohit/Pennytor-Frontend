import {
  calculateGullak,
  formatINR,
  PRESET_SCHEMES,
} from "@/utils/gullak-calculations";
import { cn } from "@/lib/utils";

const COLUMNS = [
  "Daily Deposit",
  "Time Period",
  "Annual Return",
  "Invested Amount",
  "Final Amount",
  "Net Profit",
] as const;

export function ReferenceLedger() {
  return (
    <section className="container -mt-10 sm:-mt-12">
      <div className="overflow-hidden rounded-lg border border-gullak-paper-line bg-card shadow-sm">
        <div className="border-b border-dashed border-gullak-paper-line bg-gullak-indigo/[0.03] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-gullak-indigo">
            Reference passbook
          </h2>
          <p className="text-sm text-muted-foreground">
            The three plans as printed on the scheme, for comparison.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="bg-gullak-saffron/15">
                {COLUMNS.map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-gullak-indigo"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {PRESET_SCHEMES.map((scheme, i) => {
                const result = calculateGullak(scheme);
                return (
                  <tr
                    key={scheme.id}
                    className={cn(
                      "border-t border-gullak-paper-line font-mono text-sm tabular",
                      i % 2 === 1 && "bg-gullak-paper",
                    )}
                  >
                    <td className="px-5 py-4 font-semibold text-gullak-indigo">
                      {scheme.label}
                    </td>
                    <td className="px-5 py-4">{scheme.years} Years</td>
                    <td className="px-5 py-4">{scheme.annualRatePercent} %</td>
                    <td className="px-5 py-4">
                      {formatINR(result.investedAmount)}
                    </td>
                    <td className="px-5 py-4 font-semibold">
                      {formatINR(result.finalAmount)}
                    </td>
                    <td className="px-5 py-4 font-semibold text-gullak-emerald">
                      {formatINR(result.netProfit)}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <p className="passbook-edge border-t border-gullak-paper-line px-6 py-2 text-[11px] text-muted-foreground">
          Figures assume monthly compounding on a 30-day month, matching the
          printed scheme. Actual bank terms may round slightly differently.
        </p>
      </div>
    </section>
  );
}
