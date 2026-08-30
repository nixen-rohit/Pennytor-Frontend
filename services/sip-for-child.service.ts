import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

export type SIPPlanId = "PLAN_5000" | "PLAN_2500";

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
  scheme: SIPPlanId;
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

export type SIPStatus = "PENDING" | "VERIFIED" | "REJECTED" | "COMPLETED";

export interface MySIPPremium {
  id: string;
  monthNumber: number;
  amount: string;
  status: string;
  paidAt: string | null;
}

export interface MySIPInvestment {
  id: string;
  scheme: SIPPlanId;
  planLabel: string;
  monthlyInvestment: string;
  totalInvested: string;
  fundValue: string;
  roiPercent: number;
  monthlyRoi: string;
  lockInMonths: number;
  totalMonths: number;
  monthsPaid: number;
  monthsMissed: number;
  nextPaymentDue: string | null;
  startedAt: string | null;
  lastPaidAt: string | null;
  status: SIPStatus;
  debited: boolean;
  refunded: boolean;
  reviewNote: string | null;
  submittedAt: string | null;
  createdAt: string;
  totalRoiPaid: string;
  premiums: MySIPPremium[];
  cycle: {
    startAt: string;
    monthsElapsed: number;
    monthsRemaining: number;
    nextPaymentDue: string | null;
    lastPaidAt: string | null;
  } | null;
}

export interface SIPReportEntry {
  id: string;
  kind: "SIP_INVESTMENT" | "SIP_PREMIUM" | "SIP_APPLICATION" | "REFUND" | "SWP_WITHDRAWAL";
  planLabel: string;
  direction: "DEBIT" | "CREDIT" | "INFO";
  amount: string;
  status: string | null;
  occurredAt: string;
  monthNumber?: number;
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
    scheme: string,
    amount?: string,
  ): Promise<void> {
    const response = await fetch(`${API_URL}/sip-for-child/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify({ password, scheme, ...(amount ? { amount } : {}) }),
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

  static async payPremium(
    applicationId: string,
    password: string,
    otp: string,
  ): Promise<{ success: boolean; monthNumber: number; nextMonth: number | null; advanced: boolean }> {
    const response = await fetch(
      `${API_URL}/sip-for-child/${applicationId}/pay-premium`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        credentials: "include",
        body: JSON.stringify({ password, otp }),
        cache: "no-store",
      },
    );
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
