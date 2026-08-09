import type {
  GullakInput,
  GullakResult,
  PresetScheme,
  YearlyBreakdownRow,
} from "@/types/gullak";

/**
 * The Gullak Scheme compounds like a bank Recurring Deposit: the daily
 * amount is rolled up into a monthly installment (30 days/month, matching
 * the printed table), compounded monthly at the stated annual rate.
 *
 *   M = P * [ ((1+r)^n - 1) / r ] * (1+r)
 *
 * where P = monthly installment, r = monthly rate, n = number of months.
 * This reproduces the poster's figures (e.g. Rs.100/day, 5 yrs, 15% ->
 * invested Rs.1,80,000 / maturity ~Rs.2,70,000) to within poster rounding.
 */
export function calculateGullak(input: GullakInput): GullakResult {
  const { dailyDeposit, years, annualRatePercent } = input;

  const monthlyDeposit = dailyDeposit * 30;
  const months = Math.max(0, Math.round(years * 12));
  const monthlyRate = annualRatePercent / 12 / 100;

  const investedAmount = monthlyDeposit * months;

  const finalAmount =
    months === 0
      ? 0
      : monthlyRate === 0
        ? investedAmount
        : monthlyDeposit *
          ((Math.pow(1 + monthlyRate, months) - 1) / monthlyRate) *
          (1 + monthlyRate);

  const netProfit = finalAmount - investedAmount;
  const profitPercentage =
    investedAmount > 0 ? (netProfit / investedAmount) * 100 : 0;

  return {
    ...input,
    monthlyDeposit,
    months,
    investedAmount: Math.round(investedAmount),
    finalAmount: Math.round(finalAmount),
    netProfit: Math.round(netProfit),
    profitPercentage: Math.round(profitPercentage * 100) / 100,
  };
}

/** Maturity value at the end of every completed year, for the growth chart. */
export function calculateYearlyBreakdown(
  input: GullakInput,
): YearlyBreakdownRow[] {
  const wholeYears = Math.max(1, Math.floor(input.years));
  const rows: YearlyBreakdownRow[] = [];

  for (let year = 1; year <= wholeYears; year++) {
    rows.push({ year, ...calculateGullak({ ...input, years: year }) });
  }

  // Include the exact (possibly fractional) requested term as the final point.
  if (input.years !== wholeYears) {
    rows.push({
      year: input.years,
      ...calculateGullak(input),
    });
  }

  return rows;
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

/** The three rows printed on the original scheme poster. */
export const PRESET_SCHEMES: PresetScheme[] = [
  {
    id: "100",
    label: "Rs.100/-",
    dailyDeposit: 100,
    years: 5,
    annualRatePercent: 15,
  },
  {
    id: "200",
    label: "Rs.200/-",
    dailyDeposit: 200,
    years: 5,
    annualRatePercent: 15,
  },
  {
    id: "500",
    label: "Rs.500/-",
    dailyDeposit: 500,
    years: 5,
    annualRatePercent: 15,
  },
];
