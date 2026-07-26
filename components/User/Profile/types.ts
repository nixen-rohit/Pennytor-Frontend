export type VerificationState =
  | "verified"
  | "pending"
  | "pending_approval"
  | "rejected";

export interface VerificationItem {
  id: string;
  label: string;
  description: string;
  state: VerificationState;
}

export interface KycProfile {
  name: string;
  email: string;
  initial: string;
  kycPercent: number;
  items: VerificationItem[];
}

export const STATE_STYLES: Record<
  VerificationState,
  { label: string; text: string; bg: string; ring: string; dot: string }
> = {
  verified: {
    label: "Verified",
    text: "text-emerald-300",
    bg: "bg-emerald-400/10",
    ring: "ring-emerald-400/30",
    dot: "bg-emerald-400",
  },
  pending: {
    label: "Pending",
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    ring: "ring-amber-400/30",
    dot: "bg-amber-400",
  },
  pending_approval: {
    label: "Pending Approval",
    text: "text-amber-300",
    bg: "bg-amber-400/10",
    ring: "ring-amber-400/30",
    dot: "bg-amber-400",
  },
  rejected: {
    label: "Rejected",
    text: "text-rose-300",
    bg: "bg-rose-400/10",
    ring: "ring-rose-400/30",
    dot: "bg-rose-400",
  },
};
