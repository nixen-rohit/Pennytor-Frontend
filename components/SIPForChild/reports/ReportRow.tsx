"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { type SIPReportEntry } from "@/services/sip-for-child.service";
import { inr, KIND_LABELS } from "./constants";

export function ReportRow({ entry }: { entry: SIPReportEntry }) {
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
        {entry.monthNumber ? `Month ${entry.monthNumber}` : "N/A"}
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
        {entry.direction === "INFO" ? "N/A" : inr(entry.amount)}
      </TableCell>
    </TableRow>
  );
}