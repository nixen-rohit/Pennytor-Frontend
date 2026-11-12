import { create } from "zustand";

/**
 * Minimal query invalidation for the finance module (the app has no React
 * Query). Every list hook subscribes to a version key; after approve/reject
 * the mutation bumps the affected keys so the pending lists and the reports
 * refetch automatically.
 */
export const FINANCE_KEYS = {
  deposits: "finance-deposits",
  withdrawals: "finance-withdrawals",
  reports: "finance-reports",
  investmentFund: "finance-investment-fund",
} as const;

type VersionMap = Record<string, number>;

interface FinanceQueryState {
  versions: VersionMap;
  bump: (key: string) => void;
  versionOf: (key: string) => number;
}

export const useFinanceQueryStore = create<FinanceQueryState>((set, get) => ({
  versions: {},
  bump: (key) =>
    set((state) => ({
      versions: {
        ...state.versions,
        [key]: (state.versions[key] ?? 0) + 1,
      },
    })),
  versionOf: (key) => get().versions[key] ?? 0,
}));

export function invalidateFinanceLists() {
  useFinanceQueryStore.getState().bump(FINANCE_KEYS.deposits);
  useFinanceQueryStore.getState().bump(FINANCE_KEYS.withdrawals);
}

export function invalidateFinanceReports() {
  useFinanceQueryStore.getState().bump(FINANCE_KEYS.reports);
}