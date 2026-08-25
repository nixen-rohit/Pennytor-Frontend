"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
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
import { format } from "date-fns";
import { FileText, Loader2, Search } from "lucide-react";
import {
  KycAdminService,
  KycApplicationSummary,
  KycStatus,
} from "@/services/kyc-admin.service";
import { Pagination } from "@/components/admin/Finance/Pagination";

const ENTRY_OPTIONS = ["5", "10", "15", "20"];

const STATUS_FILTERS: Array<{ label: string; value?: KycStatus }> = [
  { label: "All" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Verified", value: "VERIFIED" },
  { label: "Rejected", value: "REJECTED" },
  { label: "Draft", value: "DRAFT" },
];

const statusStyles: Record<KycStatus, string> = {
  DRAFT: "bg-neutral-600/20 text-neutral-300",
  SUBMITTED: "bg-yellow-500/20 text-yellow-400",
  UNDER_REVIEW: "bg-blue-500/20 text-blue-400",
  VERIFIED: "bg-green-600/20 text-green-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

export default function KycApplicationList() {
  const [status, setStatus] = useState<KycStatus | undefined>(undefined);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [items, setItems] = useState<KycApplicationSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = parseInt(entriesPerPage);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await KycAdminService.listApplications(
          status,
          page,
          search.trim() || undefined,
          pageSize,
        );
        if (cancelled) return;
        setItems(res.items);
        setTotal(res.total);
        setError(null);
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load applications",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [status, search, page, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-6xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-white">
            KYC Applications
          </h1>
          <p className="text-sm text-gray-400 mt-1">
            Review identity documents and bank details.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="relative w-full sm:w-72">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="search"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search by email or client ID"
              className="w-full rounded-full border border-neutral-700 bg-neutral-950 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
            />
          </div>
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                setStatus(f.value);
                setPage(1);
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
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8 bg-black">
                    <SelectValue placeholder="5" />
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
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing {total === 0 ? 0 : startIndex + 1} to {endIndex} of{" "}
                    {total} entries
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : error ? (
              <p className="py-16 text-center text-sm text-red-500">{error}</p>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileText className="mx-auto h-10 w-10 text-slate-600" />
                <p className="text-sm text-slate-400">No applications found.</p>
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
                        Client ID
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                        KYC Status
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                        Submitted
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                        Documents
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((app) => (
                      <TableRow
                        key={app.id}
                        className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors"
                      >
                        <TableCell className="py-3">
                          <p className="text-sm text-slate-300">{app.user.email}</p>
                        </TableCell>
                        <TableCell className="py-3 text-slate-300">
                          {app.user.clientId ?? "N/A"}
                        </TableCell>
                        <TableCell className="py-3">
                          <Badge status={app.status} styles={statusStyles} />
                        </TableCell>
                        <TableCell className="py-3 text-slate-300">
                          {format(
                            new Date(app.createdAt),
                            "dd MMM yyyy, hh:mm a",
                          )}
                        </TableCell>
                        <TableCell className="py-3 text-slate-300">
                          {app._count.files}/5
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Button
                            asChild
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            <Link href={`/admin/kyc/applications/${app.id}`}>
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

            {!loading && !error && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function Badge({
  status,
  styles,
}: {
  status: KycStatus;
  styles: Record<KycStatus, string>;
}) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}
