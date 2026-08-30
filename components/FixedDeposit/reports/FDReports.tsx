"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  ChevronLeft,
  Loader2,
  RefreshCw,
  ReceiptText,
} from "lucide-react";
import { format } from "date-fns";
import {
  FixedDepositService,
  type FDReportEntry,
} from "@/services/fixed-deposit.service";

const typeBadge: Record<string, { label: string; cls: string }> = {
  FD_DEPOSIT: { label: "Deposit", cls: "bg-amber-500/20 text-amber-400" },
  FD_PAYOUT: { label: "EMI Credit", cls: "bg-emerald-500/20 text-emerald-400" },
};

export default function FDReports() {
  const [reports, setReports] = useState<FDReportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchReports = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await FixedDepositService.myReports();
      setReports(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchReports();
  }, []);

  return (
    <div className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/investment/all-schemes/fixed-deposite"
          className="mb-6 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Plans
        </Link>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Fixed Deposit Reports</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Transaction history for your Fixed Deposit activities.
            </p>
          </div>
          <Button
            onClick={() => fetchReports(true)}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="border-white/10 bg-white/5 text-white hover:bg-white/10"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            Refresh
          </Button>
        </div>

        {/* Content */}
        <Card className="border-white/10 bg-[#111217]">
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-amber-400" />
              </div>
            ) : error ? (
              <div className="py-16 text-center">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            ) : reports.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <ReceiptText className="mx-auto h-10 w-10 text-zinc-600" />
                <p className="text-sm text-zinc-400">No transactions yet.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-b border-white/10 bg-white/[0.02] hover:bg-white/[0.02]">
                      <TableHead className="text-xs font-semibold text-zinc-400 uppercase tracking-wider py-3">
                        Date & Time
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-400 uppercase tracking-wider py-3">
                        Type
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-400 uppercase tracking-wider py-3">
                        Plan
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-400 uppercase tracking-wider py-3">
                        EMI 
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-zinc-400 uppercase tracking-wider py-3 text-right">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {reports.map((r) => (
                      <TableRow
                        key={r.id}
                        className="border-b border-white/5 hover:bg-white/[0.02] transition-colors"
                      >
                        <TableCell className="py-3 text-sm text-zinc-300">
                          {(() => {
                            const d = new Date(r.occurredAt);
                            return isNaN(d.getTime()) ? "—" : format(d, "dd MMM yyyy, hh:mm a");
                          })()}
                        </TableCell>
                        <TableCell className="py-3">
                          <span
                            className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              typeBadge[r.kind]?.cls || "bg-zinc-500/20 text-zinc-400"
                            }`}
                          >
                            {typeBadge[r.kind]?.label || r.kind}
                          </span>
                        </TableCell>
                        <TableCell className="py-3 text-sm text-zinc-300">
                          {(() => {
                            const n = parseInt(r.planId.replace("FD_", ""), 10);
                            return `₹${n.toLocaleString("en-IN")}`;
                          })()}
                        </TableCell>
                        <TableCell className="py-3 text-sm text-zinc-300">
                          {r.emiNumber ? `#${r.emiNumber}` : "N/A"}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <span
                            className={`text-sm font-semibold ${
                              r.direction === "CREDIT"
                                ? "text-emerald-400"
                                : r.direction === "DEBIT"
                                  ? "text-red-400"
                                  : "text-zinc-400"
                            }`}
                          >
                            {r.direction === "CREDIT" ? "+" : r.direction === "DEBIT" ? "-" : ""}
                            ₹{Number(r.amount).toLocaleString("en-IN")}
                          </span>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
