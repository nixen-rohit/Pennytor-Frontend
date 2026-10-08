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

/** KYC verification status from the backend. */
export type KycStatus = "VERIFIED" | "PENDING" | "REJECTED" | "NOT_STARTED";

export interface EligibilityResponse {
  canRefer: boolean;
  reason: string | null;
  referralCode: string | null;
  referralCodeStatus: ReferralCodeStatus;
  kycStatus: KycStatus;
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
  kycStatus: KycStatus;
  /**
   * Verified-direct-referral thresholds for each commission level.
   * Spec §12: L2 unlocks at 3, L3 at 6, L4 at 9, L5 at 12. L1
   * unlocks at 0 (the user just needs a verified investment of
   * their own; this is enforced by `currentUnlockedLevel`, not by
   * a count threshold).
   */
  thresholds: {
    l2: number;
    l3: number;
    l4: number;
    l5: number;
  };
  maxDepth: number;
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
  totalCommission?: string;
}

/** Flattened L1 user — derived from the tree on the client. */
export type ReferralUser = Omit<ReferralTreeNode, "children" | "depth">;

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

/**
 * Default state for the user-facing referral network page. Re-typed
 * here so the `ReferralChain/types.ts` module can re-export it
 * without circular imports.
 */
export const initialReferralState: {
  stats: MyStatsResponse;
  referrals: ReferralUser[];
  treeData: ReferralTreeNode[];
  myCode: string | null;
  eligibility: EligibilityResponse | null;
} = {
  stats: {
    directReferrals: 0,
    verifiedDirectReferrals: 0,
    currentUnlockedLevel: 0,
    rates: { l1: 0, l2: 0, l3: 0, l4: 0, l5: 0 },
    kycStatus: "NOT_STARTED",
    thresholds: { l2: 3, l3: 6, l4: 9, l5: 12 },
    maxDepth: 5,
    totalEarnings: "0",
    monthlyEarnings: "0",
  },
  referrals: [],
  treeData: [],
  myCode: null,
  eligibility: null,
};
