export type RequestType = "DR" | "CR";
export type CurrentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

export interface TransactionRecord {
  id: string;
  userName: string;
  userType: string;
  transactionId: string;
  transactionAmount: number;
  requestType: RequestType;
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
    currentStatus: "APPROVED",
    requestDate: new Date("2026-06-17"),
  },
];

export const entriesOptions = ["10", "25", "50", "100"];

export const requestTypeOptions: ("all" | RequestType)[] = ["all", "DR", "CR"];

export const statusOptions: ("all" | CurrentStatus)[] = [
  "all",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];
