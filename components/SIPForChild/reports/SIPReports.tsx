"use client";

import { useCallback, useEffect, useState } from "react";
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
  ArrowLeft,
  Loader2,
  RefreshCw,
  ReceiptText,
} from "lucide-react";
import { format } from "date-fns";
import {
  SIPForChildService,
  type SIPReportEntry,
} from "@/services/sip-for-child.service";

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

const KIND_LABELS: Record<SIPReportEntry["kind"], string> = {
  SIP_APPLICATION: "Application",
  SIP_PREMIUM: "Monthly Premium",
  SIP_INVESTMENT: "SIP Investment",
  REFUND: "Refund",
  SWP_WITHDRAWAL: "SWP Withdrawal",
};

export default function SIPReports() {
  const [items, setItems] = useState<SIPReportEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SIPForChildService.myReports();
      setItems(res.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load reports");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => void load(), 0);
    return () => clearTimeout(id);
  }, [load]);

  return (
    <div className="min-h-screen bg-[#08090f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                SIP Reports
              </h1>
              <p className="text-sm text-zinc-400">
                Every rupee that moved — premium payments, refunds and application records.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="icon"
            disabled={loading}
            onClick={() => void load()}
            className="border-white/15 bg-white/5"
            aria-label="Refresh"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>

        <Card className="border-white/10 bg-[#111217] shadow-xl">
          <CardContent className="p-0">
            {loading && items.length === 0 ? (
              <div className="flex items-center justify-center py-24">
                <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
              </div>
            ) : error ? (
              <p className="py-24 text-center text-sm text-red-400">{error}</p>
            ) : items.length === 0 ? (
              <div className="py-20 text-center space-y-3">
                <ReceiptText className="mx-auto h-10 w-10 text-zinc-600" />
                <p className="text-sm text-zinc-400">
                  No transactions yet. Apply to a SIP plan to see your report.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="border-white/10 bg-[#18191f] hover:bg-[#18191f]">
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Date &amp; Time
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Type
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Scheme
                      </TableHead>
                      <TableHead className="text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Month
                      </TableHead>
                      <TableHead className="text-right text-xs font-bold uppercase tracking-wider text-zinc-400">
                        Amount
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((e) => (
                      <ReportRow key={e.id} entry={e} />
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

function ReportRow({ entry }: { entry: SIPReportEntry }) {
  const isCredit = entry.direction === "CREDIT";
  const isDebit = entry.direction === "DEBIT";

  return (
    <TableRow className="border-white/10 hover:bg-white/[0.03]">
      <TableCell className="whitespace-nowrap py-4 text-sm text-zinc-300">
        {format(new Date(entry.occurredAt), "dd MMM yyyy, hh:mm a")}
      </TableCell>
      <TableCell className="py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            entry.kind === "SIP_PREMIUM"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : entry.kind === "REFUND"
                ? "border-sky-500/20 bg-sky-500/10 text-sky-400"
                : entry.kind === "SIP_APPLICATION"
                  ? "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
                  : "border-zinc-500/20 bg-zinc-500/10 text-zinc-400"
          }`}
        >
          {KIND_LABELS[entry.kind]}
        </span>
      </TableCell>
      <TableCell className="py-4 text-sm text-zinc-200">
        {entry.planLabel}
      </TableCell>
      <TableCell className="py-4 text-sm text-zinc-200">
        {entry.monthNumber ? `Month ${entry.monthNumber}` : "—"}
      </TableCell>
      <TableCell
        className={`whitespace-nowrap py-4 text-right font-mono font-semibold ${
          isCredit
            ? "text-green-500"
            : isDebit
              ? "text-red-400"
              : "text-zinc-500"
        }`}
      >
        {isCredit ? "+" : isDebit ? "-" : ""}
        {entry.direction === "INFO" ? "—" : inr(entry.amount)}
      </TableCell>
    </TableRow>
  );
}
