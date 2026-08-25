"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw, Loader2 } from "lucide-react";
import { useAuthStore } from "@/store/auth.store";

import { TransactionRecord } from "./types";
import { TransactionToolbar } from "./TransactionToolbar";
import { TransactionFilterDialog } from "./TransactionFilterDialog";
import { TransactionTable } from "./TransactionTable";
import { Pagination } from "./Pagination";
import {
  DepositService,
  DepositStatus,
  MyDeposit,
} from "@/services/deposit.service";
import {
  WithdrawalService,
  WithdrawalStatus,
  MyWithdrawal,
} from "@/services/withdrawal.service";
import {
  InvestmentFundService,
  type MyInvestment,
} from "@/services/investment-fund.service";

type RecordStatus = TransactionRecord["currentStatus"];

function mapStatus(status: DepositStatus | WithdrawalStatus): RecordStatus {
  switch (status) {
    case "VERIFIED":
      return "APPROVED";
    case "REJECTED":
      return "REJECTED";
    case "PENDING":
    case "UNDER_REVIEW":
      return "PENDING";
  }
}

function depositToRecords(
  items: MyDeposit[],
  userName: string,
  userType: string,
): TransactionRecord[] {
  return items.map((d) => ({
    id: `CR-${d.id}`,
    userName,
    userType,
    transactionId: d.transactionId,
    transactionAmount: Number(d.amount) || 0,
    requestType: "CR",
    requestKind: "CR" as const,
    currentStatus: mapStatus(d.status),
    requestDate: new Date(d.submittedAt ?? d.createdAt),
  }));
}

function withdrawalToRecords(
  items: MyWithdrawal[],
  userName: string,
  userType: string,
): TransactionRecord[] {
  return items.map((w) => ({
    id: `DR-${w.id}`,
    userName,
    userType,
    transactionId: w.id.slice(0, 8).toUpperCase(),
    transactionAmount: Number(w.amount) || 0,
    requestType: "DR",
    requestKind: "DR" as const,
    currentStatus: mapStatus(w.status),
    requestDate: new Date(w.submittedAt ?? w.createdAt),
  }));
}

function investmentToRecords(
  items: MyInvestment[],
  userName: string,
  userType: string,
): TransactionRecord[] {
  return items.map((d) => ({
    id: `IF-${d.id}`,
    userName,
    userType,
    transactionId: d.id.slice(0, 8).toUpperCase(),
    transactionAmount: Number(d.amount) || 0,
    requestType: d.planLabel.startsWith("Investment Fund")
      ? d.planLabel
      : `Investment Fund Scheme(${d.planLabel})`,
    requestKind: "IF" as const,
    currentStatus:
      d.status === "VERIFIED"
        ? ("APPROVED" as const)
        : d.status === "REJECTED"
          ? ("REJECTED" as const)
          : ("PENDING" as const),
    requestDate: new Date(d.submittedAt ?? d.createdAt),
  }));
}

export default function Transaction() {
  const user = useAuthStore((s) => s.user);
  const userName =
    [user?.firstName, user?.lastName].filter(Boolean).join(" ").toUpperCase() ||
    "—";
  const userType = "Pennytor";

  const [transactions, setTransactions] = useState<TransactionRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [dep, wdr, inv] = await Promise.all([
        DepositService.myDeposits(),
        WithdrawalService.myWithdrawals(),
        InvestmentFundService.myApplications().catch(() => ({ items: [] as MyInvestment[] })),
      ]);
      const records = [
        ...depositToRecords(dep.items, userName, userType),
        ...withdrawalToRecords(wdr.items, userName, userType),
        ...investmentToRecords(inv.items ?? [], userName, userType),
      ].sort((a, b) => b.requestDate.getTime() - a.requestDate.getTime());
      setTransactions(records);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load transactions",
      );
      setTransactions([]);
    } finally {
      setLoading(false);
    }
  }, [userName, userType]);

  useEffect(() => {
    const id = setTimeout(() => void load(), 0);
    return () => clearTimeout(id);
  }, [load]);

  const activeFilterCount =
    (requestTypeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const filteredTransactions = useMemo(() => {
    return transactions.filter((txn) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        txn.userName.toLowerCase().includes(query) ||
        txn.userType.toLowerCase().includes(query) ||
        txn.transactionId.toLowerCase().includes(query) ||
        String(txn.transactionAmount).includes(query);

      const matchesRequestType =
        requestTypeFilter === "all" || txn.requestKind === requestTypeFilter;
      const matchesStatus =
        statusFilter === "all" || txn.currentStatus === statusFilter;

      return matchesSearch && matchesRequestType && matchesStatus;
    });
  }, [transactions, searchTerm, requestTypeFilter, statusFilter]);

  const entriesPerPageNumber = parseInt(entriesPerPage);
  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / entriesPerPageNumber),
  );
  const startIndex = (currentPage - 1) * entriesPerPageNumber;
  const endIndex = startIndex + entriesPerPageNumber;
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleRequestTypeChange = (value: string) => {
    setRequestTypeFilter(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: string) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const handleEntriesPerPageChange = (value: string) => {
    setEntriesPerPage(value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  const clearFilters = () => {
    setRequestTypeFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
              Transaction
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-slate-300"
            disabled={loading}
            onClick={() => void load()}
          >
            {loading ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="mr-2 h-4 w-4" />
            )}
            Refresh
          </Button>
        </div>

        <TransactionFilterDialog
          open={openFilterDialog}
          onOpenChange={setOpenFilterDialog}
          requestTypeFilter={requestTypeFilter}
          statusFilter={statusFilter}
          onRequestTypeChange={handleRequestTypeChange}
          onStatusChange={handleStatusChange}
          onClearFilters={clearFilters}
        />

        <TransactionToolbar
          searchTerm={searchTerm}
          onSearchChange={handleSearchChange}
          activeFilterCount={activeFilterCount}
          hasActiveFilters={hasActiveFilters}
          onOpenFilters={() => setOpenFilterDialog(true)}
        />

        {error && (
          <div className="rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-400">
            {error}
          </div>
        )}

        <TransactionTable
          transactions={currentTransactions}
          totalCount={filteredTransactions.length}
          startIndex={startIndex}
          endIndex={endIndex}
          entriesPerPage={entriesPerPage}
          onEntriesPerPageChange={handleEntriesPerPageChange}
          hasActiveFilters={hasActiveFilters}
          onClearFilters={clearFilters}
          footer={
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          }
        />
      </div>
    </div>
  );
}