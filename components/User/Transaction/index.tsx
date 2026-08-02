"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  RefreshCw,
  ArrowDownLeft,
  ArrowUpRight,
  Receipt,
} from "lucide-react";
import { format } from "date-fns";

type RequestType = "DR" | "CR";
type CurrentStatus = "PENDING" | "APPROVED" | "REJECTED" | "CANCELLED";

interface TransactionRecord {
  id: string;
  userName: string;
  userType: string;
  transactionId: string;
  transactionAmount: number;
  requestType: RequestType;
  currentStatus: CurrentStatus;
  requestDate: Date;
}

const initialTransactions: TransactionRecord[] = [
  {
    id: "1",
    userName: "ALOK KUMAR RANA",
    userType: "ASTRO WEALTH",
    transactionId: "",
    transactionAmount: 680,
    requestType: "DR",
    currentStatus: "PENDING",
    requestDate: new Date("2026-07-27"),
  },
  {
    id: "2",
    userName: "ALOK KUMAR RANA",
    userType: "ASTRO WEALTH",
    transactionId: "",
    transactionAmount: 100000,
    requestType: "CR",
    currentStatus: "APPROVED",
    requestDate: new Date("2026-06-17"),
  },
];

const entriesOptions = ["10", "25", "50", "100"];
const requestTypeOptions: ("all" | RequestType)[] = ["all", "DR", "CR"];
const statusOptions: ("all" | CurrentStatus)[] = [
  "all",
  "PENDING",
  "APPROVED",
  "REJECTED",
  "CANCELLED",
];

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

  const transactions = initialTransactions;

  const filteredTransactions = transactions.filter((txn) => {
    const matchesSearch =
      txn.userName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.userType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      txn.transactionId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      String(txn.transactionAmount).includes(searchTerm.toLowerCase());

    const matchesRequestType =
      requestTypeFilter === "all" || txn.requestType === requestTypeFilter;
    const matchesStatus =
      statusFilter === "all" || txn.currentStatus === statusFilter;

    return matchesSearch && matchesRequestType && matchesStatus;
  });

  const totalPages = Math.max(
    1,
    Math.ceil(filteredTransactions.length / parseInt(entriesPerPage))
  );
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentTransactions = filteredTransactions.slice(startIndex, endIndex);

  const clearFilters = () => {
    setRequestTypeFilter("all");
    setStatusFilter("all");
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) pages.push(i);
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
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

        {/* Filter dialog */}
        <Dialog open={openFilterDialog} onOpenChange={setOpenFilterDialog}>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Filter Transactions</DialogTitle>
              <DialogDescription>
                Apply filters to narrow down transaction records.
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4 py-2">
              <div className="space-y-2">
                <Label>Request Type</Label>
                <Select
                  value={requestTypeFilter}
                  onValueChange={(v) => {
                    setRequestTypeFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {requestTypeOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === "all" ? "All" : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Current Status</Label>
                <Select
                  value={statusFilter}
                  onValueChange={(v) => {
                    setStatusFilter(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="All" />
                  </SelectTrigger>
                  <SelectContent>
                    {statusOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt === "all" ? "All" : opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={clearFilters}>
                Clear Filters
              </Button>
              <Button onClick={() => setOpenFilterDialog(false)}>
                Apply Filters
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        {/* Search and Filter */}
        <div className=" bg-black flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
          <div className="relative w-full lg:w-96">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="text"
              placeholder="Search this table..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 focus-visible:ring-indigo-500"
            />
          </div>
          <Button variant="outline" onClick={() => setOpenFilterDialog(true)}>
            <Filter className="mr-2 h-4 w-4" />
            Filters
            {hasActiveFilters && (
              <span className="ml-2 rounded-full bg-indigo-600 text-white px-2 py-0.5 text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>

        {/* Table */}
        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Show</span>
                <Select
                  value={entriesPerPage}
                  onValueChange={(v) => {
                    setEntriesPerPage(v);
                    setCurrentPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8 bg-black">
                    <SelectValue placeholder="10" />
                  </SelectTrigger>
                  <SelectContent>
                    {entriesOptions.map((opt) => (
                      <SelectItem key={opt} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>entries</span>
              </div>
              <div className="text-sm text-slate-400">
                Showing{" "}
                {filteredTransactions.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(endIndex, filteredTransactions.length)} of{" "}
                {filteredTransactions.length} entries
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-900/50 hover:bg-neutral-900/50">
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      User Name
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      User Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Transaction Id
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Transaction Amount
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Request Type
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Current Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Request Date
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {currentTransactions.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={7} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                          <div className="p-3 rounded-full bg-neutral-800">
                            <Receipt className="h-8 w-8 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-500">
                            {hasActiveFilters
                              ? "No transactions matching your filters"
                              : "No transactions found."}
                          </p>
                          {hasActiveFilters && (
                            <Button
                              variant="link"
                              onClick={clearFilters}
                              className="text-indigo-400 hover:text-indigo-300"
                            >
                              Clear all filters
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentTransactions.map((txn) => (
                      <TableRow
                        key={txn.id}
                        className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors"
                      >
                        <TableCell className="py-3 font-medium text-slate-200">
                          {txn.userName}
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                            {txn.userType}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-slate-400">
                          {txn.transactionId || "—"}
                        </TableCell>
                        <TableCell className="py-3 font-medium text-slate-200">
                          ₹{txn.transactionAmount.toLocaleString()}
                        </TableCell>
                        <TableCell className="py-3">
                          <span
                            className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              txn.requestType === "DR"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-green-600/20 text-green-400"
                            }`}
                          >
                            {txn.requestType === "DR" ? (
                              <ArrowUpRight className="h-3 w-3" />
                            ) : (
                              <ArrowDownLeft className="h-3 w-3" />
                            )}
                            {txn.requestType}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                              txn.currentStatus === "APPROVED"
                                ? "bg-green-600/20 text-green-400"
                                : txn.currentStatus === "PENDING"
                                ? "bg-yellow-500/20 text-yellow-400"
                                : txn.currentStatus === "REJECTED"
                                ? "bg-red-600/20 text-red-400"
                                : "bg-slate-500/20 text-slate-400"
                            }`}
                          >
                            {txn.currentStatus}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-slate-400">
                          {format(txn.requestDate, "dd-MM-yyyy")}
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="p-4 sm:p-6 border-t border-neutral-800">
                <div className="flex items-center justify-center gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                    disabled={currentPage === 1}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronLeft className="h-4 w-4" />
                  </Button>
                  <div className="flex items-center gap-1">
                    {getPageNumbers().map((page, index) => {
                      if (page === "...") {
                        return (
                          <span
                            key={`ellipsis-${index}`}
                            className="px-3 py-1 text-slate-400"
                          >
                            ...
                          </span>
                        );
                      }
                      return (
                        <Button
                          key={page}
                          variant={currentPage === page ? "default" : "outline"}
                          size="sm"
                          onClick={() => setCurrentPage(page as number)}
                          className={`h-8 w-8 p-0 ${
                            currentPage === page
                              ? "bg-indigo-600 text-white hover:bg-indigo-700"
                              : "hover:bg-neutral-800"
                          }`}
                        >
                          {page}
                        </Button>
                      );
                    })}
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                    }
                    disabled={currentPage === totalPages}
                    className="h-8 w-8 p-0"
                  >
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
