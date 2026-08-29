import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

export type FDPlanId = "FD_25000" | "FD_50000" | "FD_100000";

export interface FDScheme {
  id: FDPlanId;
  name: string;
  depositAmount: number;
  lockInMonths: number;
  payoutMode: string;
  emiAmount: number;
  totalEmis: number;
  totalPayout: number;
}

export type FDStatus = "PENDING" | "VERIFIED" | "COMPLETED" | "REJECTED";
export type FDPayoutStatus = "PENDING" | "PAID";

export interface FDPayout {
  id: string;
  emiNumber: number;
  amount: string;
  status: FDPayoutStatus;
  paidAt: string | null;
}

export interface FDApplication {
  id: string;
  planId: FDPlanId;
  depositAmount: string;
  lockInMonths: number;
  payoutMode: string;
  emiAmount: string;
  totalEmis: number;
  totalPayout: string;
  status: FDStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  verifiedAt: string | null;
  nextPayoutAt: string | null;
  emisPaid: number;
  lastPayoutAt: string | null;
  createdAt: string;
  payouts: FDPayout[];
}

export interface FDReportEntry {
  id: string;
  kind: "FD_DEPOSIT" | "FD_PAYOUT";
  planId: string;
  direction: "DEBIT" | "CREDIT";
  amount: string;
  status: string | null;
  occurredAt: string;
  emiNumber?: number;
}

function csrfHeaders(): Record<string, string> {
  const token = useAuthStore.getState().csrfToken;
  return token ? { "X-CSRF-Token": token } : {};
}

async function assertOk<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(
      response.status,
      (await response.json().catch(() => null))?.message ||
        "Something went wrong",
    );
  }
  return response.json().catch(() => null);
}

export class FixedDepositService {
  static async getSchemes(): Promise<FDScheme[]> {
    const response = await fetch(`${API_URL}/fixed-deposit/schemes`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async verifyPasswordAndSendOtp(
    password: string,
    planId: FDPlanId,
  ): Promise<void> {
    const response = await fetch(`${API_URL}/fixed-deposit/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify({ password, planId }),
      cache: "no-store",
    });
    await assertOk(response);
  }

  static async createApplication(
    planId: FDPlanId,
    password: string,
    otp: string,
  ): Promise<{ id: string; status: string }> {
    const response = await fetch(`${API_URL}/fixed-deposit/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify({ planId, password, otp }),
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async myApplications(): Promise<FDApplication[]> {
    const response = await fetch(`${API_URL}/fixed-deposit/mine`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async myReports(): Promise<FDReportEntry[]> {
    const response = await fetch(`${API_URL}/fixed-deposit/reports`, {
      credentials: "include",
      cache: "no-store",
    });
    const data = await assertOk<{ items: FDApplication[] }>(response);
    const apps = data.items ?? [];

    const entries: FDReportEntry[] = [];
    for (const app of apps) {
      entries.push({
        id: `deposit-${app.id}`,
        kind: "FD_DEPOSIT",
        planId: app.planId,
        direction: "DEBIT",
        amount: app.depositAmount,
        status: app.status,
        occurredAt: app.submittedAt || app.createdAt,
      });
      for (const p of app.payouts) {
        if (p.status === "PAID" && p.paidAt) {
          entries.push({
            id: p.id,
            kind: "FD_PAYOUT",
            planId: app.planId,
            direction: "CREDIT",
            amount: p.amount,
            status: p.status,
            occurredAt: p.paidAt,
            emiNumber: p.emiNumber,
          });
        }
      }
    }
    entries.sort((a, b) => new Date(b.occurredAt).getTime() - new Date(a.occurredAt).getTime());
    return entries;
  }
}
