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

/** Single user, returned by GET /admin/referrals/users/:id. */
export interface AdminReferralUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  userType: "pennytor_user" | "super_user";
  status: string;
  /** New column name (was `ownReferralCode` in the pre-migration schema). */
  referralCode: string | null;
  referralCodeStatus: "ACTIVE" | "INACTIVE" | null;
  referredById: string | null;
  createdAt: string;
  _count: { referrals: number; referrerRelationships: number };
}

/** Tree node, returned by GET /admin/referrals/tree/:id. */
export interface AdminReferralTreeNode {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  referralCode: string | null;
  referralCodeStatus: "ACTIVE" | "INACTIVE" | null;
  userType: "pennytor_user" | "super_user";
  createdAt: string;
  depth: number;
  children: AdminReferralTreeNode[];
}

export interface CommissionListItem {
  id: string;
  referrerId: string;
  referredUserId: string;
  investmentId: string;
  level: number;
  investmentAmountSnapshot: string;
  commissionRateSnapshot: string;
  qualifyingDirectReferralCount: number;
  commissionAmount: string;
  commissionMonth: number;
  commissionYear: number;
  status: "CALCULATED" | "PAID" | "FROZEN" | "REVERSED";
  paidAt: string | null;
  frozenAt: string | null;
  reversedAt: string | null;
  createdAt: string;
}

export interface CommissionListResponse {
  items: CommissionListItem[];
  total: number;
  page: number;
  pageSize: number;
}

// ─── Service ────────────────────────────────────────────────────────────────

export class ReferralAdminService {
  /**
   * ADMIN: get a single user record by id.
   */
  static async getUser(id: string): Promise<AdminReferralUser> {
    return assertOk<AdminReferralUser>(
      await fetch(`${API_URL}/admin/referrals/users/${id}`, {
        credentials: "include",
        cache: "no-store",
      }),
    );
  }

  /**
   * ADMIN: get the full referral tree for a user (L1..L∞). The backend
   * caps at 50 levels defensively.
   */
  static async getTree(id: string): Promise<AdminReferralTreeNode[]> {
    return assertOk<AdminReferralTreeNode[]>(
      await fetch(`${API_URL}/admin/referrals/tree/${id}`, {
        credentials: "include",
        cache: "no-store",
      }),
    );
  }

  /**
   * ADMIN: toggle a user's `referralEligible` soft-flag.
   */
  static async toggleEligibility(
    userId: string,
    eligible: boolean,
  ): Promise<{
    id: string;
    firstName: string;
    lastName: string;
    referralEligible: boolean;
  }> {
    return assertOk(
      await fetch(`${API_URL}/admin/referrals/users/${userId}/eligibility`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        credentials: "include",
        body: JSON.stringify({ eligible }),
        cache: "no-store",
      }),
    );
  }

  /**
   * ADMIN: list commissions (paginated, optional status/referrerId filter).
   */
  static async listCommissions(
    page = 1,
    pageSize = 20,
    status?: string,
    referrerId?: string,
  ): Promise<CommissionListResponse> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (status) params.set("status", status);
    if (referrerId) params.set("referrerId", referrerId);
    return assertOk<CommissionListResponse>(
      await fetch(`${API_URL}/admin/commissions?${params}`, {
        credentials: "include",
        cache: "no-store",
      }),
    );
  }

  static async freezeCommission(
    commissionId: string,
    actorId: string,
  ): Promise<{ id: string; status: string }> {
    return assertOk(
      await fetch(`${API_URL}/admin/commissions/${commissionId}/freeze`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        credentials: "include",
        body: JSON.stringify({ actorId }),
        cache: "no-store",
      }),
    );
  }

  static async reverseCommission(
    commissionId: string,
    actorId: string,
    reason: string,
  ): Promise<{ reversalId: string | null }> {
    return assertOk(
      await fetch(`${API_URL}/admin/commissions/${commissionId}/reverse`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        credentials: "include",
        body: JSON.stringify({ actorId, reason }),
        cache: "no-store",
      }),
    );
  }

  static async runCycle(
    month?: number,
    year?: number,
    actorId?: string,
  ): Promise<unknown> {
    return assertOk(
      await fetch(`${API_URL}/admin/commissions/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        credentials: "include",
        body: JSON.stringify({ month, year, actorId }),
        cache: "no-store",
      }),
    );
  }
}
