export type CurrentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

/** Machine key used for filtering — IF = Investment Fund scheme rows. */
export type RequestKind = "DR" | "CR" | "IF";

export interface TransactionRecord {
  id: string;
  userType: string;
  transactionId: string;
  transactionAmount: number;
  /** Display label, e.g. "CR", "DR", "Investment Fund Scheme(B)". */
  requestType: string;
  requestKind: RequestKind;
  currentStatus: CurrentStatus;
  requestDate: Date;
}

export const entriesOptions = ["10", "25", "50", "100"];

export const requestTypeOptions: { value: "all" | RequestKind; label: string }[] =
  [
    { value: "all", label: "All" },
    { value: "DR", label: "DR — Withdrawal" },
    { value: "CR", label: "CR — Deposit" },
    { value: "IF", label: "Investment Fund" },
  ];

export const statusOptions: ("all" | CurrentStatus)[] = [
  "all",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];
