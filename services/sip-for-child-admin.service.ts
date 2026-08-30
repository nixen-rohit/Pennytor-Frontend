import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

export type SIPStatus = "PENDING" | "VERIFIED" | "REJECTED" | "COMPLETED";

export type KycStatus = "VERIFIED" | "PENDING" | "REJECTED";

export interface SIPForChildRequestSummary {
  id: string;
  applicantEmail: string;
  applicantName: string;
  scheme: string;
  amount: string;
  monthlyInvestment: string;
  monthsPaid: number;
  monthsMissed: number;
  totalMonths: number;
  kycStatus: KycStatus | null;
  status: SIPStatus;
  submittedAt: string | null;
  createdAt: string;
}

export interface SIPForChildRequestDetail {
  id: string;
  scheme: string;
  amount: string;
  status: SIPStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  totalMonths: number;
  monthsPaid: number;
  monthsMissed: number;
  nextPaymentDue: string | null;
  startedAt: string | null;
  lastPaidAt: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    clientId: string;
  };
  kycStatus: KycStatus | null;
  schemeInfo: {
    label: string;
    name: string;
    monthlyInvestment: number;
    totalMonths: number;
    annualReturn: number;
    fundValue: number;
  };
  premiums: Array<{
    id: string;
    monthNumber: number;
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

export class SIPForChildAdminService {
  static async list(params: {
    status?: SIPStatus;
    search?: string;
    page?: number;
    pageSize?: number;
  }): Promise<{ items: SIPForChildRequestSummary[]; total: number }> {
    const searchParams = new URLSearchParams();
    if (params.status) searchParams.set("status", params.status);
    if (params.search) searchParams.set("search", params.search);
    if (params.page) searchParams.set("page", String(params.page));
    if (params.pageSize) searchParams.set("pageSize", String(params.pageSize));

    const response = await fetch(
      `${API_URL}/sip-for-child-admin/list?${searchParams.toString()}`,
      {
        credentials: "include",
        cache: "no-store",
      },
    );
    return assertOk(response);
  }

  static async detail(id: string): Promise<SIPForChildRequestDetail> {
    const response = await fetch(`${API_URL}/sip-for-child-admin/detail/${id}`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async approve(id: string): Promise<{ id: string; status: SIPStatus }> {
    const response = await fetch(
      `${API_URL}/sip-for-child-admin/approve/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        credentials: "include",
        cache: "no-store",
      },
    );
    return assertOk(response);
  }

  static async reject(
    id: string,
    note: string,
  ): Promise<{ id: string; status: SIPStatus }> {
    const response = await fetch(
      `${API_URL}/sip-for-child-admin/reject/${id}`,
      {
        method: "PATCH",
        headers: { "Content-Type": "application/json", ...csrfHeaders() },
        credentials: "include",
        body: JSON.stringify({ note }),
        cache: "no-store",
      },
    );
    return assertOk(response);
  }
}
