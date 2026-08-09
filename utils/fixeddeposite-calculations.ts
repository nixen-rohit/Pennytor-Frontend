import type {
  FdPlanInput,
  FdPlanResult,
  ImpliedRateInput,
  ImpliedRateResult,
  PayoutFrequency,
  PresetFdPlan,
} from "@/types/fixedDeposite";

export function periodsPerYear(frequency: PayoutFrequency): number {
  return frequency === "monthly" ? 12 : 4;
}

function payoutCountFor(tenureMonths: number, frequency: PayoutFrequency): number {
  const monthsPerPeriod = frequency === "monthly" ? 1 : 3;
  return Math.max(1, Math.round(tenureMonths / monthsPerPeriod));
}

/** Present value of an ordinary annuity of `payment` for `n` periods at rate `r`. */
function annuityPresentValue(payment: number, r: number, n: number): number {
  if (r === 0) return payment * n;
  return (payment * (1 - Math.pow(1 + r, -n))) / r;
}

/**
 * A fixed-deposit-style payout plan: the principal is locked in and paid
 * back out in equal installments (an amortizing annuity) that fully repay
 * principal + interest by the end of the tenure — the "EMI" and "Total
 * Payout" columns on the poster.
 */
export function calculateFdPlan(input: FdPlanInput): FdPlanResult {
  const { principal, tenureMonths, frequency, annualRatePercent } = input;
  const n = payoutCountFor(tenureMonths, frequency);
  const r = annualRatePercent / periodsPerYear(frequency) / 100;

  const payoutAmount = r === 0 ? principal / n : (principal * r) / (1 - Math.pow(1 + r, -n));

  const totalPayout = payoutAmount * n;

  return {
    ...input,
    payoutCount: n,
    payoutAmount: Math.round(payoutAmount),
    totalPayout: Math.round(totalPayout),
    totalInterest: Math.round(totalPayout - principal),
  };
}

/**
 * Reverse-engineers the interest rate a known payout schedule implies, via
 * bisection on the annuity present-value equation. Useful for sanity-
 * checking a printed EMI/payout figure against the principal.
 */
export function solveImpliedRate(input: ImpliedRateInput): ImpliedRateResult {
  const { principal, tenureMonths, frequency, payoutAmount } = input;
  const n = payoutCountFor(tenureMonths, frequency);
  const perYear = periodsPerYear(frequency);

  let lo = 0.00001;
  let hi = 2; // 200% per period ceiling — comfortably above any realistic input
  for (let i = 0; i < 100; i++) {
    const mid = (lo + hi) / 2;
    const pv = annuityPresentValue(payoutAmount, mid, n);
    if (pv > principal) lo = mid;
    else hi = mid;
  }
  const r = (lo + hi) / 2;

  return {
    periodicRatePercent: Math.round(r * 100 * 100) / 100,
    nominalAnnualRatePercent: Math.round(r * perYear * 100 * 100) / 100,
    effectiveAnnualRatePercent:
      Math.round((Math.pow(1 + r, perYear) - 1) * 100 * 100) / 100,
  };
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

/** The three rows printed on the original poster. */
export const PRESET_PLANS: PresetFdPlan[] = [
  { id: "1", serial: 1, principal: 25000, tenureMonths: 48, frequency: "quarterly", payoutAmount: 3130 },
  { id: "2", serial: 2, principal: 50000, tenureMonths: 42, frequency: "quarterly", payoutAmount: 7155 },
  { id: "3", serial: 3, principal: 100000, tenureMonths: 36, frequency: "monthly", payoutAmount: 5560 },
];

export const CALCULATOR_LIMITS = {
  principal: { min: 5000, max: 500000, step: 5000, default: 25000 },
  tenureMonths: { min: 6, max: 60, step: 1, default: 48 },
  annualRatePercent: { min: 4, max: 15, step: 0.25, default: 8 },
} as const;
