import { SipHero } from "./SipHero";
import { ReferenceSummary } from "./ReferenceSummary";
import { SipCalculator } from "./SipCalculator";

/**
 * Full "SIP for Child's Future" showcase: hero, the printed reference
 * figures, and an interactive two-phase (SIP -> SWP) calculator.
 * Drop <SipChildFuture /> into any page.
 */
export function SipChildFuture() {
  return (
    <div className="pb-8">
      <SipHero />
      <ReferenceSummary />
      <SipCalculator />
    </div>
  );
}
