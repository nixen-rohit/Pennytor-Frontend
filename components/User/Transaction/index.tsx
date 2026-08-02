"use client";

import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { RefreshCw } from "lucide-react";

import { initialTransactions } from "./types";
import { TransactionToolbar } from "./TransactionToolbar";
import { TransactionFilterDialog } from "./TransactionFilterDialog";
import { TransactionTable } from "./TransactionTable";
import { Pagination } from "./Pagination";

export default function Transaction() {
  const [searchTerm, setSearchTerm] = useState("");
  const [requestTypeFilter, setRequestTypeFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const activeFilterCount =
    (requestTypeFilter !== "all" ? 1 : 0) + (statusFilter !== "all" ? 1 : 0);
  const hasActiveFilters = activeFilterCount > 0;

  const filteredTransactions = useMemo(() => {
    return initialTransactions.filter((txn) => {
      const query = searchTerm.toLowerCase();
      const matchesSearch =
        txn.userName.toLowerCase().includes(query) ||
        txn.userType.toLowerCase().includes(query) ||
        txn.transactionId.toLowerCase().includes(query) ||
        String(txn.transactionAmount).includes(query);

      const matchesRequestType =
        requestTypeFilter === "all" || txn.requestType === requestTypeFilter;
      const matchesStatus =
        statusFilter === "all" || txn.currentStatus === statusFilter;

      return matchesSearch && matchesRequestType && matchesStatus;
    });
  }, [searchTerm, requestTypeFilter, statusFilter]);

  const entriesPerPageNumber = parseInt(entriesPerPage);
  const totalPages = Math.max(1, Math.ceil(filteredTransactions.length / entriesPerPageNumber));
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
          >
            <RefreshCw className="mr-2 h-4 w-4" />
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
