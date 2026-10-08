import { fetchApi } from "./api";

export interface DashboardReferral {
  canRefer: boolean;
  reason: string | null;
  referralCode: string | null;
  referralCodeStatus: "ACTIVE" | "INACTIVE" | null;
  kycStatus: string;
  directReferrals: number;
  verifiedDirectReferrals: number;
  currentUnlockedLevel: number;
  rates: { l1: number; l2: number; l3: number; l4: number; l5: number };
  thresholds: { l2: number; l3: number; l4: number; l5: number };
  maxDepth: number;
  totalEarnings: string;
  monthlyEarnings: string;
}

export interface DashboardPortfolioRow {
  id: string;
  planLabel: string;
  amount: string;
  monthlyRoi: string;
  totalRoiPaid: string;
  status: string;
  href: string;
}

export interface DashboardInvestmentSummary {
  totalInvested: string;
  activePlans: number;
  monthlyRoi: string;
  totalRoi: string;
  items: DashboardPortfolioRow[];
}

export interface DashboardTransaction {
  id: string;
  activity: string;
  status: "APPROVED" | "PENDING" | "REJECTED";
  amount: number;
  date: string | Date;
}

export interface DashboardSummary {
  wallet: { balance: string };
  referral: DashboardReferral;
  investmentSummary: DashboardInvestmentSummary;
  fixedDeposits: any[];
  sipInvestments: any[];
  userInvestments: any[];
  recentTransactions: DashboardTransaction[];
}

export class DashboardService {
  static async getSummary(): Promise<DashboardSummary> {
    return fetchApi<DashboardSummary>("/dashboard/summary", {
      method: "GET",
    });
  }
}
