export type CurrentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

/** Machine key used for filtering — IF = Investment Fund scheme rows. */
export type RequestKind = "DR" | "CR" | "IF";

export interface TransactionRecord {
  id: string;
  userName: string;
  userType: string;
  transactionId: string;
  transactionAmount: number;
  /** Display label, e.g. "CR", "DR", "Investment Fund Scheme(B)". */
  requestType: string;
  requestKind: RequestKind;
  currentStatus: CurrentStatus;
  requestDate: Date;
}

export const initialTransactions: TransactionRecord[] = [
  {
    id: "1",
    userName: "ALOK KUMAR RANA",
    userType: "Pennytor",
    transactionId: "",
    transactionAmount: 680,
    requestType: "DR",
    requestKind: "DR",
    currentStatus: "PENDING",
    requestDate: new Date("2026-07-27"),
  },
  {
    id: "2",
    userName: "ALOK KUMAR RANA",
    userType: "Pennytor",
    transactionId: "",
    transactionAmount: 100000,
    requestType: "CR",
    requestKind: "CR",
    currentStatus: "APPROVED",
    requestDate: new Date("2026-06-17"),
  },
];

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
