export interface SipPhaseInput {
  /** Amount invested every month during the growth phase, in rupees. */
  monthlyInvestment: number;
  /** Length of the SIP phase, in years. */
  years: number;
  /** Expected annual return during the growth phase, as a percentage. */
  annualRatePercent: number;
}

export interface SwpPhaseInput {
  /** Amount withdrawn every month during the payout phase, in rupees. */
  monthlyWithdrawal: number;
  /** Length of the SWP phase, in years. */
  years: number;
  /** Expected annual return during the payout phase, as a percentage. */
  annualRatePercent: number;
}

export interface YearPoint {
  year: number;
  balance: number;
}

export interface SipResult {
  investedAmount: number;
  corpusAtEnd: number;
  gain: number;
  yearlyBalances: YearPoint[];
}

export interface SwpResult {
  totalWithdrawn: number;
  finalBalance: number;
  /** Year the corpus ran out, if it did before the phase completed. */
  depletedAtYear: number | null;
  yearlyBalances: YearPoint[];
}

export interface PlanResult {
  sip: SipResult;
  swp: SwpResult;
  /** corpusAtEnd of SIP phase, i.e. the starting balance for SWP. */
  handoffCorpus: number;
  /** Net amount left in hand across both phases, after all contributions and withdrawals. */
  netOutcome: number;
}
