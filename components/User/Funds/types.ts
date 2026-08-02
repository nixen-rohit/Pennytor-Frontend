export const WALLET_BALANCE = 687.5;

export const SLIP = {
  beneficiary: "Pennytor Financial Services",
  txnId: "402917583920",
  dateTime: "02 Aug 2026, 10:45 AM",
  requestType: "Credit (CR)",
  status: "Pending review",
} as const;

export interface SlipRowData {
  label: string;
  value: string;
  mono?: boolean;
}

export const slipRows: SlipRowData[] = [
  { label: "Paid to", value: SLIP.beneficiary },
  { label: "Transaction id", value: SLIP.txnId, mono: true },
  { label: "Date and time", value: SLIP.dateTime },
  { label: "Request type", value: SLIP.requestType },
];
