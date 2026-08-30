"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { type InvestmentReportEntry } from "@/services/investment-fund.service";
import { inr, KIND_LABELS, STATUS_BADGES } from "./constants";

export function ReportRow({ entry }: { entry: InvestmentReportEntry }) {
  const isCredit = entry.direction === "CREDIT";

  return (
    <TableRow className="border-white/10 hover:bg-white/[0.03]">
      <TableCell className="whitespace-nowrap py-4 text-sm text-zinc-300">
        {format(new Date(entry.occurredAt), "dd MMM yyyy, hh:mm a")}
      </TableCell>
      <TableCell className="py-4">
        <span
          className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-medium ${
            entry.kind === "ROI"
              ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400"
              : entry.kind === "REFUND"
                ? "border-sky-500/20 bg-sky-500/10 text-sky-400"
                : "border-indigo-500/20 bg-indigo-500/10 text-indigo-300"
          }`}
        >
          {KIND_LABELS[entry.kind]}
        </span>
      </TableCell>
      <TableCell className="py-4 text-sm text-zinc-200">
        {entry.planLabel}
      </TableCell>
      <TableCell className="py-4">
        {entry.status ? (
          <span
            className={`inline-flex rounded-full border px-2 py-0.5 text-xs font-medium ${
              STATUS_BADGES[entry.status] ??
              "bg-red-500/15 text-red-400 border-red-500/20"
            }`}
          >
            {entry.status === "VERIFIED" ? "APPROVED" : entry.status}
          </span>
        ) : (
          <span className="text-xs text-zinc-500">—</span>
        )}
      </TableCell>
      <TableCell
        className={`whitespace-nowrap py-4 text-right font-mono font-semibold ${
          isCredit ? "text-green-500" : "text-red-400"
        }`}
      >
        {isCredit ? "+" : "-"}
        {inr(entry.amount)}
      </TableCell>
    </TableRow>
  );
}