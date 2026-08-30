import { type SIPReportEntry } from "@/services/sip-for-child.service";

export const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const KIND_LABELS: Record<SIPReportEntry["kind"], string> = {
  SIP_APPLICATION: "Application",
  SIP_PREMIUM: "Monthly Premium",
  SIP_INVESTMENT: "SIP Investment",
  REFUND: "Refund",
  SWP_WITHDRAWAL: "SWP Withdrawal",
};