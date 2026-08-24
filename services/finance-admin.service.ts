import { fetchApi } from "./api";
import type { DepositStatus } from "./deposit.service";

export type FinanceType = "DEPOSIT" | "WITHDRAWAL";
export type FinanceDisplayStatus = "PENDING" | "APPROVED" | "REJECTED";
export type FinanceSortBy = "createdAt" | "submittedAt" | "amount";
export type FinanceSortOrder = "asc" | "desc";

export interface FinanceReportItem {
  id: string;
  type: FinanceType;
  status: DepositStatus;
  displayStatus: FinanceDisplayStatus;
  amount: string;
  transactionReference: string | null;
  method: string | null;
  destination: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  createdAt: string;
  applicant: {
    email: string;
    clientId: string | null;
  } | null;
}

export interface FinancePagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}

export interface FinanceReportResponse {
  items: FinanceReportItem[];
  pagination: FinancePagination;
}

export interface FinanceReportFilters {
  type?: FinanceType;
  status?: DepositStatus;
  page?: number;
  limit?: number;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: FinanceSortBy;
  sortOrder?: FinanceSortOrder;
}

export interface FinanceSummary {
  deposits: {
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    approvedAmount: string;
  };
  withdrawals: {
    total: number;
    pending: number;
    underReview: number;
    approved: number;
    rejected: number;
    approvedAmount: string;
  };
  totals: {
    totalTransactions: number;
    totalPending: number;
    totalApproved: number;
    totalRejected: number;
  };
}

/**
 * Finance report client: merges deposits + withdrawals on the backend,
 * ordered by date. The deposit page and withdrawal page use their own
 * services (deposit-admin / withdrawal-admin).
 */
export class FinanceAdminService {
  static async listReport(
    filters: FinanceReportFilters = {},
  ): Promise<FinanceReportResponse> {
    const query = new URLSearchParams({
      page: String(filters.page ?? 1),
      limit: String(filters.limit ?? 20),
    });
    if (filters.type) query.set("type", filters.type);
    if (filters.status) query.set("status", filters.status);
    if (filters.search) query.set("search", filters.search);
    if (filters.dateFrom) query.set("dateFrom", filters.dateFrom);
    if (filters.dateTo) query.set("dateTo", filters.dateTo);
    if (filters.sortBy) query.set("sortBy", filters.sortBy);
    if (filters.sortOrder) query.set("sortOrder", filters.sortOrder);
    return fetchApi(`/admin/finance/reports?${query.toString()}`);
  }

  static async getSummary(): Promise<FinanceSummary> {
    return fetchApi("/admin/finance/summary");
  }
}