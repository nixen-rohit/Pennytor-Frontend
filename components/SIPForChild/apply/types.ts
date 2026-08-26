export type SIPPlanId = "5000" | "2500";

export interface SIPForChildSchemeData {
  id: SIPPlanId;
  name: string;
  monthlyInvestment: number;
  investmentYears: number;
  annualReturn: number;
  fundValue: number;
  withdrawalMonthly: number;
  withdrawalYears: number;
  finalAmount: number;
}

export const SIP_SCHEMES: SIPForChildSchemeData[] = [
  {
    id: "5000",
    name: "SIP ₹5,000/month",
    monthlyInvestment: 5000,
    investmentYears: 10,
    annualReturn: 22,
    fundValue: 2179000,
    withdrawalMonthly: 50000,
    withdrawalYears: 10,
    finalAmount: 1117000,
  },
  {
    id: "2500",
    name: "SIP ₹2,500/month",
    monthlyInvestment: 2500,
    investmentYears: 10,
    annualReturn: 22,
    fundValue: 1089000,
    withdrawalMonthly: 25000,
    withdrawalYears: 10,
    finalAmount: 400000,
  },
];

export function getSchemeById(id: SIPPlanId): SIPForChildSchemeData | undefined {
  return SIP_SCHEMES.find((s) => s.id === id);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(amount));
}

export const STEPS = [
  { step: 1, title: "Scheme Details" },
  { step: 2, title: "Payment" },
  { step: 3, title: "Authenticate" },
] as const;

export interface FormState {
  planId: SIPPlanId | null;
  amount: string;
  password: string;
  otp: string;
}

export const initialFormState: FormState = {
  planId: null,
  amount: "",
  password: "",
  otp: "",
};

export interface FormErrors {
  amount?: string;
  password?: string;
  otp?: string;
}

export type FormChange = <K extends keyof FormState>(
  key: K,
  value: FormState[K],
) => void;