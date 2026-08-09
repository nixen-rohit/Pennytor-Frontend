export type RiskLevel =
  | "Low"
  | "Low to Moderate"
  | "Moderate"
  | "Moderately High"
  | "High"
  | "Very High";

/**
 * A fund strategy category. Deliberately NOT keyed by deposit size — the
 * return range depends on what the money is invested in, not on how much
 * of it there is. A flat rate that scales purely with deposit tier is the
 * signature of a guaranteed-return scheme, not a real market-linked fund.
 */
export interface FundOption {
  id: string;
  name: string;
  roi:string,
  lock_in_period:string,
  
 
}

export interface ProjectionInput {
  principal: number;
  years: number;
  minAnnualRatePercent: number;
  maxAnnualRatePercent: number;
}

export interface ProjectionResult extends ProjectionInput {
  lowValue: number;
  baseValue: number;
  highValue: number;
  lowGain: number;
  baseGain: number;
  highGain: number;
}
