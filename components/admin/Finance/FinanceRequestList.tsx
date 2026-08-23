"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
  Search,
  ArrowDownLeft,
  ArrowUpRight,
  ChevronDown,
  Loader2,
} from "lucide-react";
import { format } from "date-fns";
import type { DepositStatus } from "@/services/deposit.service";
import type { FinanceType } from "@/services/finance-admin.service";
import {
  useDepositRequests,
  useFinanceReportList,
  useWithdrawalRequests,
} from "@/hooks/use-finance";
import { Pagination } from "@/components/admin/Finance/Pagination";

const STATUS_FILTERS: Array<{ label: string; value?: DepositStatus }> = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
];

const statusStyles: Record<DepositStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  UNDER_REVIEW: "bg-blue-500/20 text-blue-400",
  VERIFIED: "bg-green-600/20 text-green-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

const ENTRY_OPTIONS = ["10", "20", "50"];

interface Row {
  id: string;
  type: FinanceType;
  amount: string;
  status: DepositStatus;
  createdAt: string;
  reference: string | null;
  method: string | null;
  user: {
    firstName: string;
    lastName: string;
    email: string;
    clientId: string | null;
  } | null;
}

/**
 * One table for all three admin finance pages. `variant` selects the feed:
 *  - "deposits"    -> /admin/deposits    (deposit page, pending by default)
 *  - "withdrawals" -> /admin/withdrawals (withdrawal page, pending by default)
 *  - "report"      -> /admin/finance/reports (merged, date order)
 * Filtering, pagination and searching always happen on the backend.
 */
export default function FinanceRequestList({
  variant,
  defaultStatus,
  title,
  description,
  showFundColumn = false,
  showTypeFilter = false,
}: {
  variant: "deposits" | "withdrawals" | "report";
  defaultStatus?: DepositStatus;
  title?: string;
  description?: string;
  showFundColumn?: boolean;
  showTypeFilter?: boolean;
}) {
  const isReport = variant === "report";
  const [status, setStatus] = useState<DepositStatus | undefined>(defaultStatus);
  const [type, setType] = useState<FinanceType | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("20");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [search]);

  const limit = parseInt(entriesPerPage);

  const deposits = useDepositRequests(
    status,
    isReport ? 1 : currentPage,
    isReport ? undefined : debouncedSearch || undefined,
    limit,
  );
  const withdrawals = useWithdrawalRequests(
    status,
    isReport ? 1 : currentPage,
    isReport ? undefined : debouncedSearch || undefined,
    limit,
  );
  const report = useFinanceReportList({
    type,
    status,
    page: isReport ? currentPage : 1,
    limit,
    search: isReport ? debouncedSearch.trim() || undefined : undefined,
  });

  const feed = isReport
    ? {
        loading: report.loading,
        error: report.error,
        total: report.pagination?.total ?? 0,
        totalPages: report.pagination?.totalPages ?? 1,
        currentPage: report.pagination?.page ?? 1,
      }
    : {
        loading: deposits.loading || withdrawals.loading,
        error: deposits.error || withdrawals.error,
        total: variant === "deposits" ? deposits.total : withdrawals.total,
        totalPages: Math.max(
          1,
          Math.ceil(
            (variant === "deposits" ? deposits.total : withdrawals.total) /
              limit,
          ),
        ),
        currentPage,
      };

  const rows: Row[] = isReport
    ? report.items.map((r) => ({
        id: r.id,
        type: r.type,
        amount: r.amount,
        status: r.status,
        createdAt: r.createdAt,
        reference: r.type === "DEPOSIT" ? r.transactionReference : r.destination,
        method: r.method,
        user: r.applicant,
      }))
    : variant === "deposits"
      ? deposits.items.map((d) => ({
          id: d.id,
          type: "DEPOSIT" as const,
          amount: d.amount,
          status: d.status,
          createdAt: d.createdAt,
          reference: d.transactionId,
          method: null,
          user: d.user,
        }))
      : withdrawals.items.map((w) => ({
          id: w.id,
          type: "WITHDRAWAL" as const,
          amount: w.amount,
          status: w.status,
          createdAt: w.createdAt,
          reference: w.destination,
          method: w.method,
          user: w.user,
        }));

  const startIndex = (feed.currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, feed.total);
  const activeStatus = status ?? defaultStatus;

  return (
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        {title && <h2 className="text-2xl font-semibold text-white">{title}</h2>}
        {description && (
          <p className="text-sm text-gray-400 mt-1">{description}</p>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search email or client ID"
            className="pl-9 focus-visible:ring-indigo-500"
          />
        </div>
        {showTypeFilter && (
          <TypeFilter
            value={type}
            onChange={(t) => {
              setType(t);
              setCurrentPage(1);
            }}
          />
        )}
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => {
              setStatus(f.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              activeStatus === f.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-neutral-700 text-slate-300 hover:border-indigo-500"
            }`}
          >
            {f.label}
          </button>
        ))}
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
                  <SelectValue placeholder="20" />
                </SelectTrigger>
                <SelectContent>
                  {ENTRY_OPTIONS.map((n) => (
                    <SelectItem key={n} value={n}>
                      {n}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <span>entries</span>
            </div>
            <div className="text-sm text-slate-400">
              {feed.loading ? (
                "Loading..."
              ) : (
                <>
                  Showing {feed.total === 0 ? 0 : startIndex + 1} to {endIndex} of{" "}
                  {feed.total} entries
                </>
              )}
            </div>
          </div>

          {feed.loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : feed.error ? (
            <p className="py-16 text-center text-sm text-red-500">{feed.error}</p>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileIcon />
              <p className="text-sm text-slate-400">No fund requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-900/50 hover:bg-neutral-900/50">
                    {showFundColumn && (
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                        Fund
                      </TableHead>
                    )}
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Applicant
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Client ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Amount
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Transaction / Destination
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Submitted
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3 text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rows.map((req) => (
                    <TableRow
                      key={`${req.type}-${req.id}`}
                      className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors"
                    >
                      {showFundColumn && (
                        <TableCell className="py-3">
                          <FundBadge fund={req.type} />
                        </TableCell>
                      )}
                      <TableCell className="py-3">
                        <p className="font-medium text-slate-200">
                          {req.user
                            ? `${req.user.firstName} ${req.user.lastName}`
                            : "—"}
                        </p>
                        <p className="text-xs text-slate-500">{req.user?.email}</p>
                      </TableCell>
                      <TableCell className="py-3 text-xs font-mono text-slate-500">
                        {req.user?.clientId ?? "—"}
                      </TableCell>
                      <TableCell
                        className={`py-3 font-mono ${
                          req.type === "WITHDRAWAL"
                            ? "text-red-400"
                            : "text-green-400"
                        }`}
                      >
                        {req.type === "WITHDRAWAL" ? "-" : "+"}₹{req.amount}
                      </TableCell>
                      <TableCell className="py-3 text-slate-300 font-mono text-xs">
                        {req.reference ?? "—"}
                        {req.method ? ` (${req.method})` : ""}
                      </TableCell>
                      <TableCell className="py-3">
                        <Badge status={req.status} />
                      </TableCell>
                      <TableCell className="py-3 text-slate-400">
                        {format(new Date(req.createdAt), "dd MMM yyyy, hh:mm a")}
                      </TableCell>
                      <TableCell className="py-3 text-right">
                        <Button
                          asChild
                          size="sm"
                          className="bg-indigo-600 hover:bg-indigo-700 text-white"
                        >
                          <Link
                            href={
                              req.type === "DEPOSIT"
                                ? `/admin/finance/deposite-request/${req.id}`
                                : `/admin/finance/widthdrawal-request/${req.id}`
                            }
                          >
                            Review
                          </Link>
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!feed.loading && !feed.error && feed.totalPages > 1 && (
            <Pagination
              currentPage={feed.currentPage}
              totalPages={feed.totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function FileIcon() {
  return (
    <svg
      className="mx-auto h-10 w-10 text-slate-600"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z"
      />
    </svg>
  );
}

function TypeFilter({
  value,
  onChange,
}: {
  value?: FinanceType;
  onChange: (t?: FinanceType) => void;
}) {
  return (
    <div className="relative">
      <select
        value={value ?? ""}
        onChange={(e) =>
          onChange((e.target.value || undefined) as FinanceType | undefined)
        }
        className="appearance-none rounded-full border border-neutral-700 bg-neutral-950 pl-3 pr-8 py-1.5 text-xs font-medium text-slate-300 focus:border-indigo-500 focus:outline-none"
      >
        <option value="">All Funds</option>
        <option value="DEPOSIT">Deposit</option>
        <option value="WITHDRAWAL">Withdrawal</option>
      </select>
      <ChevronDown className="pointer-events-none absolute right-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-slate-500" />
    </div>
  );
}

function FundBadge({ fund }: { fund: FinanceType }) {
  const isDeposit = fund === "DEPOSIT";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isDeposit ? "bg-green-600/20 text-green-400" : "bg-red-600/20 text-red-400"
      }`}
    >
      {isDeposit ? <ArrowDownLeft className="h-3 w-3" /> : <ArrowUpRight className="h-3 w-3" />}
      {fund}
    </span>
  );
}

function Badge({ status }: { status: DepositStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status === "VERIFIED" ? "APPROVED" : status.replace("_", " ")}
    </span>
  );
}