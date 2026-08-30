"use client";

import { TableCell, TableRow } from "@/components/ui/table";
import { format } from "date-fns";
import { type FDReportEntry } from "@/services/fixed-deposit.service";
import { TYPE_BADGE } from "./constants";

export function ReportRow({ entry }: { entry: FDReportEntry }) {
  const safeDate = (() => {
    const d = new Date(entry.occurredAt);
    return isNaN(d.getTime()) ? "—" : format(d, "dd MMM yyyy, hh:mm a");
  })();

  const planLabel = (() => {
    const n = parseInt(entry.planId.replace("FD_", ""), 10);
    return `₹${n.toLocaleString("en-IN")}`;
  })();

  return (
    <TableRow className="border-b border-white/5 hover:bg-white/[0.02] transition-colors">
      <TableCell className="py-3 text-sm text-zinc-300">{safeDate}</TableCell>
      <TableCell className="py-3">
        <span
          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
            TYPE_BADGE[entry.kind]?.cls || "bg-zinc-500/20 text-zinc-400"
          }`}
        >
          {TYPE_BADGE[entry.kind]?.label || entry.kind}
        </span>
      </TableCell>
      <TableCell className="py-3 text-sm text-zinc-300">{planLabel}</TableCell>
      <TableCell className="py-3 text-sm text-zinc-300">
        {entry.emiNumber ? `#${entry.emiNumber}` : "N/A"}
      </TableCell>
      <TableCell className="py-3 text-right">
        <span
          className={`text-sm font-semibold ${
            entry.direction === "CREDIT"
              ? "text-emerald-400"
              : entry.direction === "DEBIT"
                ? "text-red-400"
                : "text-zinc-400"
          }`}
        >
          {entry.direction === "CREDIT"
            ? "+"
            : entry.direction === "DEBIT"
              ? "-"
              : ""}
          ₹{Number(entry.amount).toLocaleString("en-IN")}
        </span>
      </TableCell>
    </TableRow>
  );
}