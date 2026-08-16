import { fetchApi } from "./api";
import type { WithdrawalStatus, WithdrawMethod } from "./withdrawal.service";

export interface WithdrawalRequestSummary {
  id: string;
  amount: string;
  method: WithdrawMethod;
  destination: string;
  status: WithdrawalStatus;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    clientId: string | null;
  };
}

export interface WithdrawalRequestListResponse {
  items: WithdrawalRequestSummary[];
  total: number;
}

export interface WithdrawalRequestDetail {
  id: string;
  clientId: string | null;
  currentBalance: string;
  amount: string;
  method: WithdrawMethod;
  destination: string;
  status: WithdrawalStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  reviewedAt: string | null;
  createdAt: string;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    clientId: string | null;
  } | null;
}

export class WithdrawalAdminService {
  /** Withdrawal-page feed: server-side filter/paginate/search over withdrawals. */
  static async listWithdrawals(
    status?: WithdrawalStatus,
    page = 1,
    search?: string,
    pageSize = 20,
  ): Promise<WithdrawalRequestListResponse> {
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) query.set("status", status);
    if (search) query.set("search", search);
    return fetchApi(`/admin/withdrawals?${query.toString()}`);
  }

  static async getWithdrawal(id: string): Promise<WithdrawalRequestDetail> {
    return fetchApi(`/admin/withdrawals/${id}`);
  }

  static async updateStatus(
    id: string,
    status: WithdrawalStatus,
    note?: string,
  ): Promise<{ id: string; status: WithdrawalStatus }> {
    return fetchApi(`/admin/withdrawals/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    });
  }

  /** Approve — atomic debit + ledger + audit on the backend. */
  static async approve(id: string): Promise<{ id: string; status: string }> {
    return fetchApi(`/admin/withdrawals/${id}/approve`, { method: "POST" });
  }

  /** Reject with a reason — audited, no money moves. */
  static async reject(
    id: string,
    reason: string,
  ): Promise<{ id: string; status: string }> {
    return fetchApi(`/admin/withdrawals/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ note: reason }),
    });
  }
}