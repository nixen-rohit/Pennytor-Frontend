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
import { Search, Loader2 } from "lucide-react";
import { format } from "date-fns";
import {
  SIPForChildAdminService,
  type SIPForChildRequestSummary,
  type SIPStatus,
  type KycStatus,
} from "@/services/sip-for-child-admin.service";

const STATUS_FILTERS: Array<{ label: string; value?: SIPStatus }> = [
  { label: "All" },
  { label: "Pending", value: "PENDING" },
  { label: "Approved", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
];

const statusStyles: Record<SIPStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  VERIFIED: "bg-green-600/20 text-green-400",
  REJECTED: "bg-red-600/20 text-red-400",
  COMPLETED: "bg-blue-600/20 text-blue-400",
};

const kycStyles: Record<KycStatus, string> = {
  VERIFIED: "bg-green-600/20 text-green-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

const ENTRY_OPTIONS = ["5", "10", "15", "20"];

export default function SIPForChildRequestList() {
  const [status, setStatus] = useState<SIPStatus | undefined>();
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [currentPage, setCurrentPage] = useState(1);
  const [rows, setRows] = useState<SIPForChildRequestSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const id = setTimeout(() => {
      setDebouncedSearch(search);
      setCurrentPage(1);
    }, 400);
    return () => clearTimeout(id);
  }, [search]);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    SIPForChildAdminService.list({
      status,
      page: currentPage,
      pageSize: parseInt(entriesPerPage),
      search: debouncedSearch || undefined,
    })
      .then((res) => {
        if (cancelled) return;
        setRows(res.items);
        setTotal(res.total);
      })
      .catch((err) => {
        if (cancelled) return;
        setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (cancelled) return;
        setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [status, currentPage, entriesPerPage, debouncedSearch]);

  const limit = parseInt(entriesPerPage);
  const totalPages = Math.max(1, Math.ceil(total / limit));
  const startIndex = (currentPage - 1) * limit;
  const endIndex = Math.min(startIndex + limit, total);

  return (
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h2 className="text-2xl font-semibold text-white">
          SIP for Child Requests
        </h2>
        <p className="text-sm text-gray-400 mt-1">
          Applications submitted by users from their dashboard.
        </p>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
          <Input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search applicant email or name"
            className="pl-9 focus-visible:ring-indigo-500"
          />
        </div>
        {STATUS_FILTERS.map((f) => (
          <button
            key={f.label}
            type="button"
            onClick={() => {
              setStatus(f.value);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
              status === f.value
                ? "bg-indigo-600 text-white border-indigo-600"
                : "border-neutral-700 text-slate-300 hover:border-indigo-500"
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

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
              {loading
                ? "Loading..."
                : `Showing ${total === 0 ? 0 : startIndex + 1} to ${endIndex} of ${total} entries`}
            </div>
          </div>

          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <p className="py-16 text-center text-sm text-red-500">{error}</p>
          ) : rows.length === 0 ? (
            <div className="py-16 text-center space-y-3">
              <FileIcon />
              <p className="text-sm text-slate-400">No SIP for Child requests found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-900/50 hover:bg-neutral-900/50">
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Applicant
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Scheme
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      KYC
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Status
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Paid
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
                    <Row key={req.id} req={req} />
                  ))}
                </TableBody>
              </Table>
            </div>
          )}

          {!loading && !error && totalPages > 1 && (
            <div className="flex items-center justify-end gap-2 p-4 border-t border-neutral-800">
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === 1 || loading}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="border-neutral-700 text-slate-300"
              >
                Previous
              </Button>
              <span className="px-2 text-xs text-slate-500">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                disabled={currentPage === totalPages || loading}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="border-neutral-700 text-slate-300"
              >
                Next
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function Row({ req }: { req: SIPForChildRequestSummary }) {
  return (
    <TableRow className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors">
      <TableCell className="py-3">
        <p className="text-sm text-slate-200">{req.applicantEmail}</p>
        <p className="text-xs text-slate-500">{req.applicantName}</p>
      </TableCell>
      <TableCell className="py-3 text-sm text-slate-300">{req.scheme}</TableCell>
      <TableCell className="py-3">
        {req.kycStatus ? <KycBadge status={req.kycStatus} /> : <span className="text-xs text-slate-500">—</span>}
      </TableCell>
      <TableCell className="py-3">
        <StatusBadge status={req.status} />
      </TableCell>
      <TableCell className="py-3 text-sm text-slate-300">
        {req.monthsPaid}/{req.totalMonths}
      </TableCell>
      <TableCell className="py-3 text-slate-400">
        {req.submittedAt
          ? format(new Date(req.submittedAt), "dd MMM yyyy, hh:mm a")
          : format(new Date(req.createdAt), "dd MMM yyyy, hh:mm a")}
      </TableCell>
      <TableCell className="py-3 text-right">
        <Button
          asChild
          size="sm"
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Link href={`/admin/investments/sip/${req.id}`}>
            Review
          </Link>
        </Button>
      </TableCell>
    </TableRow>
  );
}

function StatusBadge({ status }: { status: SIPStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status === "VERIFIED" ? "APPROVED" : status.replace("_", " ")}
    </span>
  );
}

function KycBadge({ status }: { status: KycStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${kycStyles[status]}`}
    >
      {status}
    </span>
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
