import { Landmark, ShieldCheck, Eye, Smartphone } from "lucide-react";

export const STEPS = [
  { step: 1, title: "Withdraw", icon: Landmark },
  { step: 2, title: "Verify OTP", icon: ShieldCheck },
  { step: 3, title: "Review", icon: Eye },
] as const;

export type WithdrawMethod = "bank" | "upi";

export const WITHDRAW_METHODS = [
  {
    id: "bank" as const,
    label: "Bank Account",
    description: "Transfer to your registered bank account",
    icon: Landmark,
  },
  {
    id: "upi" as const,
    label: "UPI",
    description: "Transfer to an active UPI ID",
    icon: Smartphone,
  },
];

export const BANK_ACCOUNT = {
  accountHolderName: "ALOK KUMAR RANA",
  bankName: "HDFC Bank",
  branch: "MG Road, Ghaziabad",
  accountNumber: "50100XXXXXX4521",
  ifsc: "HDFC0004801",
} as const;

export const QUICK_AMOUNTS = [500, 1000, 2500, 5000] as const;

export const USER_EMAIL = "a***@gmail.com";
export const MAX_WITHDRAWAL = 687.5;

export interface FormState {
  method: WithdrawMethod;
  upiId: string;
  amount: string;
  password: string;
  otp: string;
}

export const initialFormState: FormState = {
  method: "bank",
  upiId: "",
  amount: "",
  password: "",
  otp: "",
};

export interface FormErrors {
  upiId?: string;
  amount?: string;
  password?: string;
  otp?: string;
}

export type FormChange = <K extends keyof FormState>(
  key: K,
  value: FormState[K],
) => void;
