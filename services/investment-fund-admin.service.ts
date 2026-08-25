import { fetchApi } from "./api";

export type InvestmentFundStatus = "PENDING" | "VERIFIED" | "REJECTED";
export type KycStatus = "VERIFIED" | "PENDING" | "REJECTED";

export interface InvestmentFundRequestSummary {
  id: string;
  applicantEmail: string;
  applicantName: string;
  scheme: string;
  amount: string;
  kycStatus: KycStatus;
  status: InvestmentFundStatus;
  submittedAt: string | null;
  createdAt: string;
}

export interface InvestmentFundRequestListResponse {
  items: InvestmentFundRequestSummary[];
  total: number;
}

export interface InvestmentCycleState {
  startAt: string;
  lastRoiPaidAt: string;
  nextRoiDueAt: string | null;
  lockEndsAt: string;
  monthsElapsed: number;
  monthsRemaining: number;
  expectedMonthlyRoi: string;
}

export interface InvestmentFundRequestDetail {
  id: string;
  scheme: "A" | "B" | "C" | "D" | "E";
  amount: string;
  status: InvestmentFundStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  verifiedAt: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    clientId: string | null;
  };
  kycStatus: KycStatus | null;
  schemeInfo: {
    label: string;
    roiPercent: number;
    lockInMonths: number;
    minAmount: string;
    maxAmount: string;
  };
  totalRoiPaid: string;
  cycle: InvestmentCycleState | null;
}

/** Admin feed for investment fund applications submitted from the user dashboard. */
export class InvestmentFundAdminService {
  static async list(
    status?: InvestmentFundStatus,
    page = 1,
    search?: string,
    pageSize = 20,
  ): Promise<InvestmentFundRequestListResponse> {
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) query.set("status", status);
    if (search) query.set("search", search);
    return fetchApi(`/admin/investment-fund?${query.toString()}`);
  }

  static async get(id: string): Promise<InvestmentFundRequestDetail> {
    return fetchApi(`/admin/investment-fund/${id}`);
  }

  /** Approve — starts the lock-in / monthly ROI cycle; 409 if already processed. */
  static async approve(id: string): Promise<{ id: string; status: string }> {
    return fetchApi(`/admin/investment-fund/${id}/approve`, { method: "POST" });
  }

  /** Reject with a reason — refunds the user's wallet atomically. */
  static async reject(
    id: string,
    reason: string,
  ): Promise<{ id: string; status: string }> {
    return fetchApi(`/admin/investment-fund/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ note: reason }),
    });
  }
}
