export type InvestmentScheme = "A" | "B" | "C" | "D" | "E";

export interface InvestmentSchemeData {
  id: number;
  scheme: InvestmentScheme;
  minAmount: number;
  maxAmount: number;
  lockInPeriod: string;
  roi: number;
}

export const INVESTMENT_SCHEMES: InvestmentSchemeData[] = [
  {
    id: 1,
    scheme: "A",
    minAmount: 500000,
    maxAmount: 2500000,
    lockInPeriod: "3 Years",
    roi: 3,
  },
  {
    id: 2,
    scheme: "B",
    minAmount: 2500000,
    maxAmount: 5000000,
    lockInPeriod: "3 Years",
    roi: 3.5,
  },
  {
    id: 3,
    scheme: "C",
    minAmount: 5000000,
    maxAmount: 10000000,
    lockInPeriod: "3 Years",
    roi: 4,
  },
  {
    id: 4,
    scheme: "D",
    minAmount: 10000000,
    maxAmount: 50000000,
    lockInPeriod: "3 Years",
    roi: 4.5,
  },
  {
    id: 5,
    scheme: "E",
    minAmount: 50000000,
    maxAmount: 999999999,
    lockInPeriod: "3 Years",
    roi: 5,
  },
];

export function getSchemeById(id: number): InvestmentSchemeData | undefined {
  return INVESTMENT_SCHEMES.find((s) => s.id === id);
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(amount);
}

export const STEPS = [
  { step: 1, title: "Scheme Details" },
  { step: 2, title: "Payment" },
  { step: 3, title: "Authenticate" },
] as const;

export interface FormState {
  scheme: InvestmentScheme | null;
  schemeId: number | null;
  amount: string;
  password: string;
  otp: string;
}

export const initialFormState: FormState = {
  scheme: null,
  schemeId: null,
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