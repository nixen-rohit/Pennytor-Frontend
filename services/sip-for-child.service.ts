import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

export type SIPPlanId = "5000" | "2500";

export interface SIPForChildScheme {
  id: SIPPlanId;
  name: string;
  monthlyInvestment: number;
  investmentYears: number;
  annualReturn: number;
  fundValue: number;
  withdrawalMonthly: number;
  withdrawalYears: number;
  finalAmount: number;
}

export interface SIPApplicationRequest {
  planId: SIPPlanId;
  password: string;
  otp: string;
}

export interface SIPApplicationRef {
  id: string;
  status: string;
  amount: string;
}

export interface SIPSchemesResponse {
  schemes: SIPForChildScheme[];
}

export type SIPStatus = "PENDING" | "VERIFIED" | "REJECTED";

export interface MySIPCycle {
  startAt: string;
  lockEndsAt: string;
  nextPayoutAt: string | null;
  lastRoiPaidAt: string;
  monthsElapsed: number;
  monthsRemaining: number;
}

export interface MySIPInvestment {
  id: string;
  planId: SIPPlanId;
  planLabel: string;
  monthlyInvestment: string;
  totalInvested: string;
  fundValue: string;
  roiPercent: number;
  monthlyRoi: string;
  lockInMonths: number;
  status: SIPStatus;
  debited: boolean;
  refunded: boolean;
  reviewNote: string | null;
  submittedAt: string | null;
  createdAt: string;
  totalRoiPaid: string;
  cycle: MySIPCycle | null;
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

export class SIPForChildService {
  static async getSchemes(): Promise<SIPForChildScheme[]> {
    const response = await fetch(`${API_URL}/sip-for-child/schemes`, {
      credentials: "include",
      cache: "no-store",
    });
    const data = await assertOk<SIPSchemesResponse>(response);
    return data.schemes;
  }

  static async verifyPasswordAndSendOtp(
    password: string,
    planId: string,
  ): Promise<void> {
    const response = await fetch(`${API_URL}/sip-for-child/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify({ password, planId }),
      cache: "no-store",
    });
    await assertOk(response);
  }

  static async createApplication(data: SIPApplicationRequest): Promise<SIPApplicationRef> {
    const response = await fetch(`${API_URL}/sip-for-child/apply`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async myApplications(): Promise<{ items: MySIPInvestment[] }> {
    const response = await fetch(`${API_URL}/sip-for-child/mine`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async myReports(): Promise<{ items: SIPReportEntry[] }> {
    const response = await fetch(`${API_URL}/sip-for-child/reports`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }
}

export interface SIPReportEntry {
  id: string;
  kind: "SIP_INVESTMENT" | "REFUND" | "SWP_WITHDRAWAL";
  planLabel: string;
  direction: "DEBIT" | "CREDIT";
  amount: string;
  status: "PENDING" | "VERIFIED" | "REJECTED" | null;
  occurredAt: string;
}