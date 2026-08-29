import type { FDPlanId } from "@/services/fixed-deposit.service";

export interface FDSchemeData {
  id: FDPlanId;
  name: string;
  depositAmount: number;
  lockInMonths: number;
  payoutMode: string;
  emiAmount: number;
  totalEmis: number;
  totalPayout: number;
}

export const FD_SCHEMES: FDSchemeData[] = [
  {
    id: "FD_25000",
    name: "FD Plan 1",
    depositAmount: 25000,
    lockInMonths: 48,
    payoutMode: "quarterly",
    emiAmount: 3130,
    totalEmis: 16,
    totalPayout: 50080,
  },
  {
    id: "FD_50000",
    name: "FD Plan 2",
    depositAmount: 50000,
    lockInMonths: 42,
    payoutMode: "quarterly",
    emiAmount: 7145,
    totalEmis: 14,
    totalPayout: 100030,
  },
  {
    id: "FD_100000",
    name: "FD Plan 3",
    depositAmount: 100000,
    lockInMonths: 40,
    payoutMode: "monthly",
    emiAmount: 5000,
    totalEmis: 40,
    totalPayout: 200000,
  },
];

export function getSchemeById(id: string): FDSchemeData | undefined {
  return FD_SCHEMES.find((s) => s.id === id);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const STEPS = [
  { step: 1, title: "Plan Details" },
  { step: 2, title: "Payment" },
  { step: 3, title: "Authenticate" },
] as const;

export interface FormState {
  planId: string | null;
  password: string;
  otp: string;
}

export const initialFormState: FormState = {
  planId: null,
  password: "",
  otp: "",
};

export interface FormErrors {
  password?: string;
  otp?: string;
}

export type FormChange = <K extends keyof FormState>(
  key: K,
  value: FormState[K],
) => void;
