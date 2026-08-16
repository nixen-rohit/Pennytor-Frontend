"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { useShallow } from "zustand/react/shallow";
import { DepositAdminService } from "@/services/deposit-admin.service";
import { WithdrawalAdminService } from "@/services/withdrawal-admin.service";
import {
  FinanceAdminService,
  FinanceReportFilters,
  FinanceSummary,
} from "@/services/finance-admin.service";
import { FINANCE_KEYS, useFinanceQueryStore } from "@/store/finance-query.store";

interface UseQueryResult<T> {
  data: T | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

function useQuery<T>(
  key: string,
  loader: () => Promise<T>,
): UseQueryResult<T> {
  const version = useFinanceQueryStore(
    useShallow((s) => s.versionOf(key)),
  );
  const [data, setData] = useState<T | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const seq = useRef(0);

  const load = useCallback(async () => {
    const mySeq = ++seq.current;
    setLoading(true);
    try {
      const result = await loader();
      if (seq.current === mySeq) {
        setData(result);
        setError(null);
      }
    } catch (err) {
      if (seq.current === mySeq) {
        setError(err instanceof Error ? err.message : "Failed to load");
      }
    } finally {
      if (seq.current === mySeq) setLoading(false);
    }
  }, [loader]);

  useEffect(() => {
    const id = setTimeout(() => void load(), 0);
    return () => clearTimeout(id);
  }, [load, version]);

  return { data, loading, error, refresh: load };
}

const keyFor = (parts: (string | number | undefined)[]) =>
  parts.join("|");

/** Deposit page — pending deposit requests (server-side). */
export function useDepositRequests(
  status?: string,
  page = 1,
  search?: string,
  pageSize = 20,
) {
  const key = keyFor([FINANCE_KEYS.deposits, status ?? "ALL", page, search ?? "", pageSize]);
  const loader = useCallback(
    () => DepositAdminService.listDeposits(status as never, page, search || undefined, pageSize),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  const result = useQuery(key, loader);
  return {
    ...result,
    items: result.data?.items ?? [],
    total: result.data?.total ?? 0,
  };
}

/** Withdrawal page — pending withdrawal requests (server-side). */
export function useWithdrawalRequests(
  status?: string,
  page = 1,
  search?: string,
  pageSize = 20,
) {
  const key = keyFor([FINANCE_KEYS.withdrawals, status ?? "ALL", page, search ?? "", pageSize]);
  const loader = useCallback(
    () => WithdrawalAdminService.listWithdrawals(status as never, page, search || undefined, pageSize),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  const result = useQuery(key, loader);
  return {
    ...result,
    items: result.data?.items ?? [],
    total: result.data?.total ?? 0,
  };
}

/** Finance report — merged deposits + withdrawals, date order (server-side). */
export function useFinanceReportList(filters: FinanceReportFilters = {}) {
  const key = keyFor([
    FINANCE_KEYS.reports,
    filters.type ?? "ALL",
    filters.status ?? "ALL",
    filters.page ?? 1,
    filters.search ?? "",
    filters.dateFrom ?? "",
    filters.dateTo ?? "",
    filters.sortBy ?? "createdAt",
    filters.sortOrder ?? "desc",
    filters.limit ?? 20,
  ]);
  const loader = useCallback(
    () => FinanceAdminService.listReport(filters),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [key],
  );
  const result = useQuery(key, loader);
  return {
    ...result,
    items: result.data?.items ?? [],
    pagination: result.data?.pagination,
  };
}

/** Dashboard summary cards. */
export function useFinanceSummary() {
  const loader = useCallback(() => FinanceAdminService.getSummary(), []);
  return useQuery<FinanceSummary>(FINANCE_KEYS.summary, loader);
}

type DecisionType = "deposit" | "withdrawal";

/** Approve a deposit or withdrawal, then invalidate every finance view. */
export function useApproveFinanceTransaction(type: DecisionType) {
  const [approving, setApproving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const approve = useCallback(
    async (id: string) => {
      setApproving(true);
      setError(null);
      try {
        await (type === "deposit"
          ? DepositAdminService.approve(id)
          : WithdrawalAdminService.approve(id));
        useFinanceQueryStore.getState().bump(FINANCE_KEYS.deposits);
        useFinanceQueryStore.getState().bump(FINANCE_KEYS.withdrawals);
        useFinanceQueryStore.getState().bump(FINANCE_KEYS.reports);
        useFinanceQueryStore.getState().bump(FINANCE_KEYS.summary);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to approve");
        return false;
      } finally {
        setApproving(false);
      }
    },
    [type],
  );
  return { approve, approving, error };
}

/** Reject a deposit or withdrawal with a reason, then invalidate finance views. */
export function useRejectFinanceTransaction(type: DecisionType) {
  const [rejecting, setRejecting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reject = useCallback(
    async (id: string, reason: string) => {
      setRejecting(true);
      setError(null);
      try {
        await (type === "deposit"
          ? DepositAdminService.reject(id, reason)
          : WithdrawalAdminService.reject(id, reason));
        useFinanceQueryStore.getState().bump(FINANCE_KEYS.deposits);
        useFinanceQueryStore.getState().bump(FINANCE_KEYS.withdrawals);
        useFinanceQueryStore.getState().bump(FINANCE_KEYS.reports);
        useFinanceQueryStore.getState().bump(FINANCE_KEYS.summary);
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to reject");
        return false;
      } finally {
        setRejecting(false);
      }
    },
    [type],
  );
  return { reject, rejecting, error };
}