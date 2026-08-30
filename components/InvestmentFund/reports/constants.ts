import { type InvestmentReportEntry } from "@/services/investment-fund.service";

export const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const KIND_LABELS: Record<InvestmentReportEntry["kind"], string> = {
  INVESTMENT: "Scheme Payment",
  REFUND: "Refund",
  ROI: "Monthly ROI",
};

export const STATUS_BADGES: Record<string, string> = {
  PENDING: "bg-yellow-500/15 text-yellow-400 border-yellow-500/20",
  VERIFIED: "bg-green-500/15 text-green-400 border-green-500/20",
};