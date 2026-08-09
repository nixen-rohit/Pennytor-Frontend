import { FUND_OPTIONS } from "./investmentsFunds-calculations";
import { cn } from "@/lib/utils";

export function FundOptionsTable() {
  return (
    <section className="container">
      <div className="overflow-hidden rounded-lg border border-fund-paper-line bg-card shadow-sm">
        <div className="border-b border-dashed border-fund-paper-line bg-fund-slate/[0.03] px-6 py-4">
          <h2 className="font-display text-lg font-semibold text-fund-slate">
            Investments Returns
          </h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[720px] border-collapse text-left">
            <thead>
              <tr className="bg-fund-teal/10">
                {[
                  "S.N.",
                  "Amount",
                  "Return On Investment (ROI) ",
                  "Lock-in Period",
                ].map((col) => (
                  <th
                    key={col}
                    className="whitespace-nowrap px-5 py-3 text-xs font-semibold uppercase tracking-wide text-fund-slate"
                  >
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {FUND_OPTIONS.map((fund, i) => (
                <tr
                  key={fund.id}
                  className={cn(
                    "border-t border-fund-paper-line font-mono text-sm tabular",
                    i % 2 === 1 && "bg-fund-paper",
                  )}
                >
                  <td className="px-5 py-4">{i + 1}.</td>
                  <td className="px-5 py-4 font-sans font-semibold text-fund-slate">
                    {fund.name}
                  </td>
                  <td className="px-5 py-4">{fund.roi}</td>
                  <td className="px-5 py-4">{fund.lock_in_period}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        
      </div>
    </section>
  );
}
