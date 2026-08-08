import type {
  PlanResult,
  SipPhaseInput,
  SipResult,
  SwpPhaseInput,
  SwpResult,
  YearPoint,
} from "@/types/sip";

/**
 * Grows a monthly SIP investment. Deposits are made at the START of each
 * month and compound for that month too (annuity due) — the convention
 * most SIP calculators use, and the one that reproduces the poster's
 * figure (Rs.5,000/month, 10 yrs, 22% -> corpus ~Rs.21,79,000).
 */
export function simulateSip(input: SipPhaseInput): SipResult {
  const { monthlyInvestment, years, annualRatePercent } = input;
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRatePercent / 12 / 100;

  let balance = 0;
  const yearlyBalances: YearPoint[] = [];

  for (let m = 1; m <= months; m++) {
    balance = (balance + monthlyInvestment) * (1 + monthlyRate);
    if (m % 12 === 0) {
      yearlyBalances.push({ year: m / 12, balance: Math.round(balance) });
    }
  }
  // capture a partial final year if years isn't a whole number
  if (months > 0 && months % 12 !== 0) {
    yearlyBalances.push({ year: months / 12, balance: Math.round(balance) });
  }

  const investedAmount = monthlyInvestment * months;

  return {
    investedAmount: Math.round(investedAmount),
    corpusAtEnd: Math.round(balance),
    gain: Math.round(balance - investedAmount),
    yearlyBalances,
  };
}

/**
 * Draws down a corpus via monthly withdrawals. The balance grows for the
 * month, then the withdrawal is taken at month end (ordinary annuity) —
 * the standard SWP convention. If the corpus is exhausted mid-way, the
 * balance is floored at zero and the depletion year is reported.
 */
export function simulateSwp(startingCorpus: number, input: SwpPhaseInput): SwpResult {
  const { monthlyWithdrawal, years, annualRatePercent } = input;
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRatePercent / 12 / 100;

  let balance = startingCorpus;
  let totalWithdrawn = 0;
  let depletedAtYear: number | null = null;
  const yearlyBalances: YearPoint[] = [];

  for (let m = 1; m <= months; m++) {
    balance = balance * (1 + monthlyRate);
    const withdrawal = Math.min(monthlyWithdrawal, Math.max(0, balance));
    balance -= withdrawal;
    totalWithdrawn += withdrawal;

    if (balance <= 0 && depletedAtYear === null && withdrawal < monthlyWithdrawal) {
      depletedAtYear = Math.round((m / 12) * 10) / 10;
    }

    if (m % 12 === 0) {
      yearlyBalances.push({ year: m / 12, balance: Math.round(Math.max(0, balance)) });
    }
  }
  if (months > 0 && months % 12 !== 0) {
    yearlyBalances.push({ year: months / 12, balance: Math.round(Math.max(0, balance)) });
  }

  return {
    totalWithdrawn: Math.round(totalWithdrawn),
    finalBalance: Math.round(Math.max(0, balance)),
    depletedAtYear,
    yearlyBalances,
  };
}

export function simulatePlan(sipInput: SipPhaseInput, swpInput: SwpPhaseInput): PlanResult {
  const sip = simulateSip(sipInput);
  const swp = simulateSwp(sip.corpusAtEnd, swpInput);

  return {
    sip,
    swp,
    handoffCorpus: sip.corpusAtEnd,
    netOutcome: swp.finalBalance,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatCompactINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    notation: "compact",
    maximumFractionDigits: 1,
  }).format(amount);
}

/** The exact figures printed on the original poster. */
export const POSTER_PLAN = {
  sip: { monthlyInvestment: 5000, years: 10, annualRatePercent: 22 } satisfies SipPhaseInput,
  swp: { monthlyWithdrawal: 50000, years: 10, annualRatePercent: 22 } satisfies SwpPhaseInput,
};

export const CALCULATOR_LIMITS = {
  sipMonthly: { min: 500, max: 50000, step: 500, default: 5000 },
  sipYears: { min: 1, max: 25, step: 1, default: 10 },
  sipRate: { min: 6, max: 26, step: 0.5, default: 22 },
  swpMonthly: { min: 1000, max: 200000, step: 1000, default: 50000 },
  swpYears: { min: 1, max: 25, step: 1, default: 10 },
  swpRate: { min: 4, max: 26, step: 0.5, default: 22 },
} as const;
