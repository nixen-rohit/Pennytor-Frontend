import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowUpRight } from "lucide-react";

import type { WithdrawalStatus } from "@/services/withdrawal.service";
import { SlipRow } from "./SlipRow";

export interface PaymentSlipData {
  txnId: string;
  amount: string;
  submittedAt: string | null;
  createdAt: string;
  status: WithdrawalStatus;
}

const statusStyles: Record<string, string> = {
  PENDING: "border-amber-500/20 bg-amber-500/10 text-amber-300",
  UNDER_REVIEW: "border-blue-500/20 bg-blue-500/10 text-blue-300",
  VERIFIED: "border-green-600/20 bg-green-600/10 text-green-400",
  REJECTED: "border-red-600/20 bg-red-600/10 text-red-400",
};

const statusLabels: Record<string, string> = {
  PENDING: "Pending review",
  UNDER_REVIEW: "Under review",
  VERIFIED: "Verified",
  REJECTED: "Rejected",
};

function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  return `${d.toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  })}, ${d.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  })}`;
}

export function PaymentSlipCard({ slip }: { slip?: PaymentSlipData | null }) {
  const status = slip?.status ?? "PENDING";

  const title = "Withdrawal Slip";
  const subtitle = "Latest withdrawal request";
  const paidToLabel = "Debited from";
  const requestTypeValue = "Debit (DR)";
  const icon = <ArrowUpRight className="h-4 w-4 text-slate-300" />;
  const iconBg = "bg-red-600/20";
  const beneficiary = "Your registered account";

  const rows = slip
    ? [
        { label: "Debited from", value: beneficiary },
        { label: "Amount", value: `₹${slip.amount}`, mono: true },
        { label: "Request id", value: slip.txnId, mono: true },
        {
          label: "Date and time",
          value: formatDateTime(slip.submittedAt ?? slip.createdAt),
        },
        { label: "Request type", value: "Debit (DR)" },
      ]
    : [
        { label: "Debited from", value: beneficiary },
        { label: "Request id", value: "————", mono: true },
        { label: "Date and time", value: "—" },
        { label: "Request type", value: "Debit (DR)" },
      ];

  return (
    <Card className="border-neutral-800 bg-neutral-950 shadow-sm">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className={`flex h-9 w-9 items-center justify-center rounded-lg bg-red-600/20`}>
              <ArrowUpRight className="h-4 w-4 text-slate-300" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-200">Withdrawal Slip</p>
              <p className="text-[11px] text-slate-500">Latest withdrawal request</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className={`text-xs ${slip ? statusStyles[status] : "border-neutral-700 bg-neutral-800/40 text-slate-400"}`}
          >
            {slip ? statusLabels[status] : "No requests yet"}
          </Badge>
        </div>

        <div className="divide-y divide-neutral-800 rounded-lg border border-neutral-800 bg-black/30 px-4">
          {rows.map((row) => (
            <SlipRow
              key={row.label}
              label={row.label}
              value={row.value}
              mono={row.mono}
            />
          ))}
        </div>

        <div className="flex items-start gap-2 text-[11px] text-slate-400">
          Verified by the admin team within 30 minutes of submission; the amount is debited from your wallet once approved.
        </div>
      </CardContent>
    </Card>
  );
}