export type PayoutFrequency = "monthly" | "quarterly";

export interface FdPlanInput {
  /** Principal locked into the deposit, in rupees. */
  principal: number;
  /** Lock-in period, in months. */
  tenureMonths: number;
  /** How often the payout is disbursed. */
  frequency: PayoutFrequency;
  /** Assumed annual interest rate, as a percentage (nominal, compounded per payout period). */
  annualRatePercent: number;
}

export interface FdPlanResult extends FdPlanInput {
  /** Number of payouts over the tenure. */
  payoutCount: number;
  /** Amount paid out each period, fully amortizing the principal to zero. */
  payoutAmount: number;
  /** payoutAmount * payoutCount. */
  totalPayout: number;
  /** totalPayout - principal. */
  totalInterest: number;
}

export interface ImpliedRateInput {
  principal: number;
  tenureMonths: number;
  frequency: PayoutFrequency;
  payoutAmount: number;
}

export interface ImpliedRateResult {
  /** Interest rate per payout period, as a percentage. */
  periodicRatePercent: number;
  /** periodicRate * periods per year — the rate as usually quoted. */
  nominalAnnualRatePercent: number;
  /** (1+periodicRate)^periodsPerYear - 1 — what the money actually compounds to. */
  effectiveAnnualRatePercent: number;
}

/** One row of the printed reference table on the FD poster. */
export interface PresetFdPlan {
  id: string;
  serial: number;
  principal: number;
  tenureMonths: number;
  frequency: PayoutFrequency;
  payoutAmount: number;
}
