export interface GullakInput {
  /** Amount deposited every day, in rupees. */
  dailyDeposit: number;
  /** Length of the scheme, in years. */
  years: number;
  /** Annual interest rate, as a percentage (e.g. 15 for 15%). */
  annualRatePercent: number;
}

export interface GullakResult extends GullakInput {
  /** Deposit rolled up to a monthly figure (30 days/month convention). */
  monthlyDeposit: number;
  /** Total number of monthly installments over the term. */
  months: number;
  /** Total amount paid in by the depositor. */
  investedAmount: number;
  /** Maturity value at the end of the term. */
  finalAmount: number;
  /** finalAmount - investedAmount. */
  netProfit: number;
  /** netProfit as a percentage of investedAmount. */
  profitPercentage: number;
}

export interface YearlyBreakdownRow extends GullakResult {
  year: number;
}

/** One row of the printed reference table on the scheme poster. */
export interface PresetScheme extends GullakInput {
  id: string;
  label: string;
}
