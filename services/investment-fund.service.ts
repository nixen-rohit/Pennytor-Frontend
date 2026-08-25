import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

export type InvestmentScheme = "A" | "B" | "C" | "D" | "E";

export interface InvestmentFundScheme {
  id: number;
  serialNumber: InvestmentScheme;
  minAmount: number;
  maxAmount: number;
  lockInPeriod: string;
  roi: number;
}

export interface InvestmentApplicationRequest {
  scheme: InvestmentScheme;
  amount: string;
  password: string;
  otp: string;
}

export interface InvestmentApplicationRef {
  id: string;
  status: string;
  amount: string;
}

export interface InvestmentSchemesResponse {
  schemes: InvestmentFundScheme[];
}

export type InvestmentFundStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface MyInvestmentCycle {
  startAt: string;
  lockEndsAt: string;
  nextPayoutAt: string | null;
  lastRoiPaidAt: string;
  monthsElapsed: number;
  monthsRemaining: number;
}

export interface MyInvestment {
  id: string;
  scheme: InvestmentScheme;
  planLabel: string;
  amount: string;
  roiPercent: number;
  monthlyRoi: string;
  lockInMonths: number;
  status: InvestmentFundStatus;
  /** Money left the wallet at apply time. */
  debited: boolean;
  /** Only a rejection returns the money to the wallet. */
  refunded: boolean;
  reviewNote: string | null;
  submittedAt: string | null;
  createdAt: string;
  totalRoiPaid: string;
  cycle: MyInvestmentCycle | null;
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

export class InvestmentFundService {
  static async getSchemes(): Promise<InvestmentFundScheme[]> {
    const response = await fetch(`${API_URL}/investment-fund/schemes`, {
      credentials: "include",
      cache: "no-store",
    });
    const data = await assertOk<InvestmentSchemesResponse>(response);
    return data.schemes;
  }

  static async sendOtp(): Promise<void> {
    const response = await fetch(`${API_URL}/investment-fund/otp`, {
      method: "POST",
      headers: csrfHeaders(),
      credentials: "include",
      cache: "no-store",
    });
    await assertOk(response);
  }

  static async verifyPasswordAndSendOtp(
    password: string,
    scheme: string,
    amount?: string,
  ): Promise<void> {
    const response = await fetch(`${API_URL}/investment-fund/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify({ password, scheme, ...(amount ? { amount } : {}) }),
      cache: "no-store",
    });
    await assertOk(response);
  }

  static async createApplication(data: InvestmentApplicationRequest): Promise<InvestmentApplicationRef> {
    const response = await fetch(`${API_URL}/investment-fund/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return assertOk(response);
  }

  /** "User Investments" feed — amount, cycle, monthly ROI, payout dates. */
  static async myApplications(): Promise<{ items: MyInvestment[] }> {
    const response = await fetch(`${API_URL}/investment-fund/mine`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  /** Report feed — scheme debits, refunds and every ROI credit. */
  static async myReports(): Promise<{ items: InvestmentReportEntry[] }> {
    const response = await fetch(`${API_URL}/investment-fund/reports`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }
}

export interface InvestmentReportEntry {
  id: string;
  kind: "INVESTMENT" | "REFUND" | "ROI";
  planLabel: string;
  direction: "DEBIT" | "CREDIT";
  amount: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | null;
  occurredAt: string;
}