import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

export type FDStatus = "PENDING" | "VERIFIED" | "COMPLETED" | "REJECTED";

export interface FDRequestSummary {
  id: string;
  applicantEmail: string;
  applicantName: string;
  planId: string;
  depositAmount: string;
  lockInMonths: number;
  payoutMode: string;
  emiAmount: string;
  totalEmis: number;
  emisPaid: number;
  status: FDStatus;
  submittedAt: string | null;
  createdAt: string;
}

export interface FDRequestDetail {
  id: string;
  planId: string;
  depositAmount: string;
  lockInMonths: number;
  payoutMode: string;
  emiAmount: string;
  totalEmis: number;
  totalPayout: string;
  status: FDStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  verifiedAt: string | null;
  nextPayoutAt: string | null;
  emisPaid: number;
  lastPayoutAt: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    clientId: string;
  };
  payouts: Array<{
    id: string;
    emiNumber: number;
    amount: string;
    status: string;
    paidAt: string | null;
  }>;
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

export class FixedDepositAdminService {
  static async list(params: {
    status?: FDStatus;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: FDRequestSummary[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));

    const response = await fetch(
      `${API_URL}/fixed-deposit-admin/list?${searchParams.toString()}`,
      { credentials: "include", cache: "no-store" },
    );
    return assertOk(response);
  }

  static async detail(id: string): Promise<FDRequestDetail> {
    const response = await fetch(`${API_URL}/fixed-deposit-admin/detail/${id}`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async approve(id: string): Promise<{ id: string; status: FDStatus }> {
    const response = await fetch(`${API_URL}/fixed-deposit-admin/approve/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async reject(
    id: string,
    note: string,
  ): Promise<{ id: string; status: FDStatus }> {
    const response = await fetch(`${API_URL}/fixed-deposit-admin/reject/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify({ note }),
      cache: "no-store",
    });
    return assertOk(response);
  }
}
