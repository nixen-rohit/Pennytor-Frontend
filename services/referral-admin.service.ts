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

export interface AdminReferralStats {
  totalUsers: number;
  totalReferrers: number;
}

export interface AdminReferralUser {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ownReferralCode: string;
  userType: string;
  referralEligible: boolean;
  createdAt: string;
  _count: { referrals: number };
}

export interface AdminReferralUsersResponse {
  users: AdminReferralUser[];
  total: number;
  page: number;
  pageSize: number;
}

export interface AdminReferralTreeData {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  ownReferralCode: string;
  userType: string;
  referralEligible: boolean;
  createdAt: string;
  referrals: AdminReferralTreeData[];
}

// ─── Service ────────────────────────────────────────────────────────────────

export class ReferralAdminService {
  /**
   * ADMIN: get system-wide referral stats.
   */
  static async getStats(): Promise<AdminReferralStats> {
    const response = await fetch(`${API_URL}/admin/referral/stats`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  /**
   * ADMIN: get the full referral tree.
   */
  static async getTree(): Promise<AdminReferralTreeData[]> {
    const response = await fetch(`${API_URL}/admin/referral/tree`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  /**
   * ADMIN: get all referral participants (paginated).
   */
  static async getUsers(
    page = 1,
    pageSize = 20,
    search?: string,
    userType?: string,
  ): Promise<AdminReferralUsersResponse> {
    const params = new URLSearchParams({
      page: String(page),
      pageSize: String(pageSize),
    });
    if (search) params.set("search", search);
    if (userType) params.set("userType", userType);

    const response = await fetch(`${API_URL}/admin/referral/users?${params}`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  /**
   * ADMIN: toggle a user's referral eligibility.
   */
  static async toggleEligibility(
    userId: string,
    eligible: boolean,
  ): Promise<{ id: string; firstName: string; lastName: string; referralEligible: boolean }> {
    const response = await fetch(
      `${API_URL}/admin/referral/${userId}/eligibility`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        credentials: "include",
        body: JSON.stringify({ eligible }),
        cache: "no-store",
      },
    );
    return assertOk(response);
  }
}
