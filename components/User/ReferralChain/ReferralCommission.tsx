import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { DollarSign, ArrowUpRight, ArrowDownRight, Minus } from "lucide-react";
import { format } from "date-fns";
import { ReferralState } from "@/components/User/ReferralChain/types";

interface Props {
  data: ReferralState;
}

export function ReferralCommission({ data }: Props) {
  const { commissions } = data;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Commission History" />
      <p className="text-sm text-slate-400 -mt-4">
        Track your earnings from the referral program
      </p>

      {/* Summary */}
      <div className="flex flex-wrap gap-4">
        {[
          { label: "Total Earned", value: "₹12,580", color: "text-emerald-400" },
          { label: "Pending", value: "₹3,200", color: "text-yellow-400" },
          { label: "Cleared", value: "₹9,380", color: "text-green-400" },
        ].map((item) => (
          <div
            key={item.label}
            className="flex items-center gap-3 rounded-xl border border-neutral-800 bg-neutral-900/50 px-5 py-3"
          >
            <DollarSign className={`h-5 w-5 ${item.color}`} />
            <div>
              <p className="text-xs text-slate-400">{item.label}</p>
              <p className={`text-lg font-bold ${item.color}`}>{item.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Table */}
      <div className="rounded-xl border border-neutral-800 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-neutral-900/50 hover:bg-neutral-900/50">
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">From</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Amount</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Level</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">%</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Date</TableHead>
              <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {commissions.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-32 text-center text-slate-500">
                  No commission records yet
                </TableCell>
              </TableRow>
            ) : (
              commissions.map((c) => (
                <TableRow key={c.id} className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors">
                  <TableCell className="py-3 text-slate-200">{c.fromUser}</TableCell>
                  <TableCell className="py-3 font-medium text-slate-200">₹{c.amount.toLocaleString()}</TableCell>
                  <TableCell className="py-3">
                    <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                      L{c.level}
                    </span>
                  </TableCell>
                  <TableCell className="py-3 text-slate-400">{c.percentage}%</TableCell>
                  <TableCell className="py-3 text-slate-400">{format(c.date, "MMM dd, yyyy")}</TableCell>
                  <TableCell className="py-3">
                    {c.status === "Cleared" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-green-400">
                        <ArrowUpRight className="h-3 w-3" /> Cleared
                      </span>
                    ) : c.status === "Pending" ? (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-yellow-400">
                        <Minus className="h-3 w-3" /> Pending
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 text-xs font-medium text-red-400">
                        <ArrowDownRight className="h-3 w-3" /> Cancelled
                      </span>
                    )}
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="border-b border-neutral-800 pb-2">
      <h3 className="text-base font-semibold text-slate-50">{title}</h3>
    </div>
  );
}