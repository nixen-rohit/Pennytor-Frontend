import { GullakHero } from "./GullakHero";
import { ReferenceLedger } from "./ReferenceLedger";


/**
 * Full "Gullak Scheme" showcase: hero, the printed reference table, and an
 * interactive calculator. Drop <GullakScheme /> into any page.
 */
export function GullakScheme() {
  return (
    <div className="pb-8">
      <GullakHero />
      <ReferenceLedger />  
    </div>
  );
}
