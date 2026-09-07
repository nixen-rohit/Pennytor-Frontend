import { QrCode, ClipboardCheck, Eye, Send } from "lucide-react";

export const STEPS = [
  { step: 1, title: "Scan & pay", icon: QrCode },
  { step: 2, title: "Confirm", icon: ClipboardCheck },
  { step: 3, title: "Review", icon: Eye },
  { step: 4, title: "Submit", icon: Send },
] as const;

export const BANK_DETAILS = {
  ifsc: "HDFC0004801",
  bankName: "HDFC Bank",
  branchAddress: "MG Road, Ghaziabad, Uttar Pradesh",
  // TODO: Replace with actual account number from backend API
  accountNumber: "XXXXXX0021",
  beneficiaryName: "Pennytor Financial Services",
} as const;

export const SESSION = {
  userName: "Alok Kumar (Admin)",
  userType: "Pennytor ",
  requestType: "CR",
} as const;

export const QUICK_AMOUNTS = [500, 1000, 2500, 5000] as const;

export interface FormState {
  amount: string;
  txnId: string;
  screenshot: File | null;
}

export const initialFormState: FormState = {
  amount: "",
  txnId: "",
  screenshot: null,
};

export interface FormErrors {
  amount?: string;
  txnId?: string;
  file?: string;
}

export type FormChange = <K extends keyof FormState>(
  key: K,
  value: FormState[K],
) => void;
