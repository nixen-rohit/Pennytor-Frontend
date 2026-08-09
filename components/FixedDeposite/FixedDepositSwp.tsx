import { FdHero } from "./FdHero";
import { ReferenceTable } from "./ReferenceTable";
import { FdCalculator } from "./FdCalculator";

/**
 * Full "Fixed Deposit (With SWP)" showcase: hero, the printed reference
 * table, and a two-way payout calculator. Drop <FixedDepositSwp /> into
 * any page.
 */
export function FixedDepositSwp() {
  return (
    <div className="pb-8">
      <FdHero />
      <ReferenceTable />
      <FdCalculator />
    </div>
  );
}
