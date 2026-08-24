import { API_URL, fetchApi } from "./api";
import type { DepositStatus } from "./deposit.service";

export interface DepositRequestSummary {
  id: string;
  amount: string;
  transactionId: string;
  status: DepositStatus;
  createdAt: string;
  user: {
    email: string;
    clientId: string | null;
  };
}

export interface DepositRequestListResponse {
  items: DepositRequestSummary[];
  total: number;
}

export interface DepositRequestDetail {
  id: string;
  clientId: string | null;
  currentBalance: string;
  amount: string;
  transactionId: string;
  status: DepositStatus;
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
  file: {
    id: string;
    mimeType: string;
    fileSize: number;
    originalName: string;
  };
}

export class DepositAdminService {
  /** Deposit-page feed: server-side filter/paginate/search over deposits. */
  static async listDeposits(
    status?: DepositStatus,
    page = 1,
    search?: string,
    pageSize = 20,
  ): Promise<DepositRequestListResponse> {
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) query.set("status", status);
    if (search) query.set("search", search);
    return fetchApi(`/admin/deposits?${query.toString()}`);
  }

  static async getDeposit(id: string): Promise<DepositRequestDetail> {
    return fetchApi(`/admin/deposits/${id}`);
  }

  static async updateStatus(
    id: string,
    status: DepositStatus,
    note?: string,
  ): Promise<{ id: string; status: DepositStatus }> {
    return fetchApi(`/admin/deposits/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    });
  }

  /** Approve — atomic credit + ledger + audit on the backend. */
  static async approve(id: string): Promise<{ id: string; status: string }> {
    return fetchApi(`/admin/deposits/${id}/approve`, { method: "POST" });
  }

  /** Reject with a reason — audited, no money moves. */
  static async reject(
    id: string,
    reason: string,
  ): Promise<{ id: string; status: string }> {
    return fetchApi(`/admin/deposits/${id}/reject`, {
      method: "POST",
      body: JSON.stringify({ note: reason }),
    });
  }

  static fileUrl(id: string): string {
    return `${API_URL}/admin/deposits/${id}/file`;
  }

  static downloadUrl(id: string): string {
    return `${DepositAdminService.fileUrl(id)}/download`;
  }
}