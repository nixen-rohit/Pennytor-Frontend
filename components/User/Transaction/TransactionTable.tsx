import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
import { ArrowDownLeft, ArrowUpRight, Receipt } from "lucide-react";
import { format } from "date-fns";

import { entriesOptions } from "./types";
import type { CurrentStatus, RequestType, TransactionRecord } from "./types";

interface Props {
  transactions: TransactionRecord[];
  totalCount: number;
  startIndex: number;
  endIndex: number;
  entriesPerPage: string;
  onEntriesPerPageChange: (value: string) => void;
  hasActiveFilters: boolean;
  onClearFilters: () => void;
  footer?: React.ReactNode;
}

export function TransactionTable({
  transactions,
  totalCount,
  startIndex,
  endIndex,
  entriesPerPage,
  onEntriesPerPageChange,
  hasActiveFilters,
  onClearFilters,
  footer,
}: Props) {
  return (
    <Card className="shadow-sm">
      <CardContent className="p-0">
        <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800">
          <div className="flex items-center gap-2 text-sm text-slate-400">
            <span>Show</span>
            <Select value={entriesPerPage} onValueChange={onEntriesPerPageChange}>
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
            Showing {totalCount === 0 ? 0 : startIndex + 1} to{" "}
            {Math.min(endIndex, totalCount)} of {totalCount} entries
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
              {transactions.length === 0 ? (
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
                          onClick={onClearFilters}
                          className="text-indigo-400 hover:text-indigo-300"
                        >
                          Clear all filters
                        </Button>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                transactions.map((txn) => (
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
                      <RequestTypeBadge type={txn.requestType} />
                    </TableCell>
                    <TableCell className="py-3">
                      <StatusBadge status={txn.currentStatus} />
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

        {footer}
      </CardContent>
    </Card>
  );
}

function RequestTypeBadge({ type }: { type: RequestType }) {
  const isDr = type === "DR";
  return (
    <span
      className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-medium ${
        isDr ? "bg-red-600/20 text-red-400" : "bg-green-600/20 text-green-400"
      }`}
    >
      {isDr ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownLeft className="h-3 w-3" />}
      {type}
    </span>
  );
}

const statusStyles: Record<CurrentStatus, string> = {
  APPROVED: "bg-green-600/20 text-green-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  REJECTED: "bg-red-600/20 text-red-400",
  CANCELLED: "bg-slate-500/20 text-slate-400",
};

function StatusBadge({ status }: { status: CurrentStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}
