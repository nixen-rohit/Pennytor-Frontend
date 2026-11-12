import { fetchApi } from "./api";

export interface AdminPendingCounts {
  kycPending: number;
  depositsPending: number;
  withdrawalsPending: number;
  fixedDepositsPending: number;
  sipPending: number;
  investmentFundPending: number;
}

export class AdminDashboardService {
  static async getPendingCounts(): Promise<AdminPendingCounts> {
    return fetchApi("/admin/dashboard/pending-counts");
  }
}
