"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { FileText, Loader2, Search } from "lucide-react";
import {
  KycAdminService,
  KycApplicationSummary,
  KycStatus,
} from "@/services/kyc-admin.service";

const STATUS_FILTERS: Array<{ label: string; value?: KycStatus }> = [
  { label: "All" },
  { label: "Submitted", value: "SUBMITTED" },
  { label: "Under Review", value: "UNDER_REVIEW" },
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
  const [items, setItems] = useState<KycApplicationSummary[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const pageSize = 20;

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await KycAdminService.listApplications(
          status,
          page,
          search.trim() || undefined,
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
  }, [status, search, page]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));

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
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-neutral-800 text-left text-xs uppercase tracking-wide text-slate-500">
                      <th className="px-5 py-3">Applicant</th>
                      <th className="px-5 py-3">Client ID</th>
                      <th className="px-5 py-3">Status</th>
                      <th className="px-5 py-3">Submitted</th>
                      <th className="px-5 py-3">Documents</th>
                      <th className="px-5 py-3 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((app) => (
                      <tr
                        key={app.id}
                        className="border-b border-neutral-900 last:border-0 hover:bg-neutral-900/40"
                      >
                        <td className="px-5 py-3.5">
                          <p className="font-medium text-slate-100">
                            {app.user.firstName} {app.user.lastName}
                          </p>
                          <p className="text-xs text-slate-400">
                            {app.user.email}
                          </p>
                        </td>
                        <td className="px-5 py-3.5 text-slate-300">
                          {app.user.clientId ?? "N/A"}
                        </td>
                        <td className="px-5 py-3.5">
                          <Badge status={app.status} styles={statusStyles} />
                        </td>
                        <td className="px-5 py-3.5 text-slate-300">
                          {format(
                            new Date(app.createdAt),
                            "dd MMM yyyy, hh:mm a",
                          )}
                        </td>
                        <td className="px-5 py-3.5 text-slate-300">
                          {app._count.files}/5
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <Button
                            asChild
                            size="sm"
                            className="bg-indigo-600 hover:bg-indigo-700 text-white"
                          >
                            <Link href={`/admin/kyc/applications/${app.id}`}>
                              Review
                            </Link>
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {total} application{total === 1 ? "" : "s"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-slate-300"
              disabled={page <= 1 || loading}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-slate-300"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
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
