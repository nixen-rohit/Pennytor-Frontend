import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

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

// ─── Types ──────────────────────────────────────────────────────────────────

/** Mirror of the backend's ReferralCodeStatus enum. */
export type ReferralCodeStatus = "ACTIVE" | "INACTIVE" | null;

export interface EligibilityResponse {
  canRefer: boolean;
  reason: string | null;
  referralCode: string | null;
  referralCodeStatus: ReferralCodeStatus;
}

export interface MyStatsResponse {
  directReferrals: number;
  verifiedDirectReferrals: number;
  currentUnlockedLevel: number;
  rates: {
    l1: number;
    l2: number;
    l3: number;
    l4: number;
    l5: number;
  };
  totalEarnings: string;
  monthlyEarnings: string;
}

export interface ReferralTreeNode {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string | null;
  referralCodeStatus: ReferralCodeStatus;
  userType: string;
  createdAt: string;
  depth: number;
  children: ReferralTreeNode[];
}

export interface CommissionHistoryItem {
  id: string;
  level: number;
  investmentAmountSnapshot: string;
  commissionRateSnapshot: string;
  commissionAmount: string;
  commissionMonth: number;
  commissionYear: number;
  status: "CALCULATED" | "PAID" | "FROZEN" | "REVERSED";
  createdAt: string;
  paidAt: string | null;
  reversedAt: string | null;
  referredUserId: string;
  investmentId: string;
}

export interface CommissionSummary {
  yearly: Array<{ year: number; total: string; count: number }>;
  monthly: Array<{ year: number; month: number; total: string; count: number }>;
}

// ─── Service ────────────────────────────────────────────────────────────────

export class ReferralService {
  /**
   * Public: validate a referral code during registration. Rate-limited
   * server-side; returns a generic boolean to prevent enumeration.
   */
  static async validateCode(
    code: string,
  ): Promise<{ valid: boolean; referrerName?: string }> {
    const response = await fetch(`${API_URL}/referral/validate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
      body: JSON.stringify({ code }),
    });
    return assertOk(response);
  }

  static async getEligibility(): Promise<EligibilityResponse> {
    return assertOk<EligibilityResponse>(
      await fetch(`${API_URL}/referral/eligibility`, {
        credentials: "include",
        cache: "no-store",
      }),
    );
  }

  static async getMyCode(): Promise<{
    referralCode: string | null;
    referralCodeStatus: ReferralCodeStatus;
  }> {
    return assertOk(
      await fetch(`${API_URL}/referral/code`, {
        credentials: "include",
        cache: "no-store",
      }),
    );
  }

  static async getStats(): Promise<MyStatsResponse> {
    return assertOk<MyStatsResponse>(
      await fetch(`${API_URL}/referral/stats`, {
        credentials: "include",
        cache: "no-store",
      }),
    );
  }

  /**
   * Spec §25: backend returns L1–L5 only for normal users. The cap is
   * enforced server-side; the frontend never sees L6+.
   */
  static async getTree(): Promise<ReferralTreeNode[]> {
    return assertOk<ReferralTreeNode[]>(
      await fetch(`${API_URL}/referral/tree`, {
        credentials: "include",
        cache: "no-store",
      }),
    );
  }

  static async getCommissionHistory(
    page = 1,
    pageSize = 20,
  ): Promise<{
    items: CommissionHistoryItem[];
    total: number;
    page: number;
    pageSize: number;
  }> {
    return assertOk(
      await fetch(
        `${API_URL}/referral/commission-history?page=${page}&pageSize=${pageSize}`,
        {
          credentials: "include",
          cache: "no-store",
        },
      ),
    );
  }

  static async getCommissionSummary(): Promise<CommissionSummary> {
    return assertOk<CommissionSummary>(
      await fetch(`${API_URL}/referral/commission-summary`, {
        credentials: "include",
        cache: "no-store",
      }),
    );
  }
}
