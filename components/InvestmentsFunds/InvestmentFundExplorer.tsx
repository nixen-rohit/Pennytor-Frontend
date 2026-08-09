import { FundHero } from "./FundHero";
import { FundOptionsTable } from "./FundOptionsTable";

/**
 * Full "Investment Fund Explorer" showcase: hero, a persistent disclaimer,
 * example fund strategies, and a low/base/high projection calculator.
 * Drop <InvestmentFundExplorer /> into any page.
 *
 * Deliberately structured so return ranges are tied to strategy/risk, not
 * to deposit size — see lib/fund-calculations.ts for why.
 */
export function InvestmentFundExplorer() {
  return (
    <div className="pb-8">
      <FundHero />
      <FundOptionsTable />
    </div>
  );
}
