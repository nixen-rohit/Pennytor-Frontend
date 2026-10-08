"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Clock, CheckCircle2, WalletCards, XCircle } from "lucide-react";
import { format } from "date-fns";
import { type FDApplication } from "@/services/fixed-deposit.service";

const inr = (v: string | number) => {
  const n = typeof v === "number" ? v : parseFloat(String(v)) || 0;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

const planLabel = (planId: string) => {
  const n = parseInt(planId.replace("FD_", ""), 10);
  return `₹${n.toLocaleString("en-IN")}`;
};

function InfoCell({
  label,
  value,
  accent,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="rounded-lg border border-white/5 bg-white/[0.02] p-3">
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-0.5 text-sm font-bold ${accent ? "text-emerald-400" : "text-white"}`}
      >
        {value}
      </p>
    </div>
  );
}

const STATUS_META: Record<
  string,
  { label: string; cls: string; icon: React.ReactNode; accent?: boolean }
> = {
  PENDING: {
    label: "Applied",
    cls: "bg-amber-500/10 text-amber-400 border-amber-500/20",
    icon: <Clock className="h-4 w-4" />,
    accent: true,
  },
  VERIFIED: {
    label: "ACTIVE",
    cls: "bg-green-500/10 text-green-400 border-green-500/20",
    icon: <CheckCircle2 className="h-4 w-4" />,
    accent: true,
  },
  COMPLETED: {
    label: "COMPLETED",
    cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    icon: <CheckCircle2 className="h-4 w-4" />,
    accent: false,
  },
  REJECTED: {
    label: "REJECTED",
    cls: "bg-red-500/10 text-red-400 border-red-500/20",
    icon: <XCircle className="h-4 w-4" />,
    accent: false,
  },
};

export function ProgressCard({ app }: { app: FDApplication }) {
  const paidEmis = app.emisPaid || 0;
  const totalEmis = app.totalEmis;
  const progress = totalEmis > 0 ? (paidEmis / totalEmis) * 100 : 0;
  const meta = STATUS_META[app.status] ?? STATUS_META.PENDING;

  return (
    <Card className="border-white/10 bg-[#111217]">
      <CardContent className="p-6">
        {/* Header */}
        <div className="mb-4 flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/10">
              <WalletCards className="h-5 w-5 text-amber-400" />
            </div>
            <div>
              <p className="text-lg font-bold text-white">
                {planLabel(app.planId)}
              </p>

              <span className="font-medium text-amber-300">Applied On: </span>
              <span className="text-emerald-300 font-medium">
                {app.submittedAt
                  ? format(new Date(app.submittedAt), "dd MMM yyyy")
                  : "N/A"}
              </span>
            </div>
          </div>
          <span
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.cls}`}
          >
            {meta.icon}
            {meta.label}
          </span>
        </div>

        {/* Status message */}
        <div className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
          {app.status === "PENDING" && (
            <p className="text-sm text-zinc-400">
              <span className="font-medium text-amber-300">Applied</span>.
              Application submitted. Waiting for admin review. Your wallet will
              be debited on approval.
            </p>
          )}
          {app.status === "VERIFIED" && (
            <p className="text-sm text-zinc-400">
              Active. Receiving{" "}
              <span className="text-emerald-400 font-bold">
                {" "}
                {inr(app.emiAmount)}
              </span>{" "}
              {app.payoutMode} EMIs until maturity.
            </p>
          )}
          {app.status === "COMPLETED" && (
            <p className="text-sm text-emerald-400">
              Fully matured! All {totalEmis} EMIs have been credited to your
              wallet.
            </p>
          )}
          {app.status === "REJECTED" && (
            <p className="text-sm text-red-400">
              Rejected.{" "}
              {app.reviewNote || "No deduction was made from your wallet."}
            </p>
          )}
        </div>

        {/* Info grid */}
        <div className="mb-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          <InfoCell label="Deposit" value={inr(app.depositAmount)} />
          <InfoCell label="Lock-in" value={`${app.lockInMonths} months`} />
          <InfoCell label="EMI Amount" value={inr(app.emiAmount)} accent />
          <InfoCell label="Total Payout" value={inr(app.totalPayout)} accent />
        </div>

        {/* Active/Completed: progress + calendar */}
        {(app.status === "VERIFIED" || app.status === "COMPLETED") && (
          <>
            {/* Progress bar */}
            <div className="mb-4">
              <div className="mb-1.5 flex items-center justify-between">
                <span className="text-xs text-zinc-500">EMI Progress</span>
                <span className="text-xs font-semibold text-zinc-300">
                  {paidEmis} / {totalEmis}
                </span>
              </div>
              <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-amber-500 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Next payout */}
            {app.nextPayoutAt && app.status === "VERIFIED" && (
              <div className="mb-4 flex items-center gap-2 text-sm text-zinc-400">
                <Clock className="h-3.5 w-3.5" />
                <span className="font-medium text-amber-300">
                  Next payout :{" "}
                </span>
                <span className="text-emerald-300 font-medium">
                  {format(new Date(app.nextPayoutAt), "dd MMM yyyy")}
                </span>
                {app.nextPayoutAt && app.status === "VERIFIED" && (
                  <div className="mt-1 text-xs text-zinc-500">
                    {app.emisPaid > 0 && (
                      <div className="inline-flex items-center gap-1 px-2 py-1 rounded bg-amber-500/10 text-amber-300">
                        <Clock className="h-3 w-3" />
                        <span>
                          {app.emisPaid} EMI{app.emisPaid > 1 ? "s" : ""}{" "}
                          {app.emisPaid >= totalEmis - 1 ? "past due" : "due"}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* EMI Calendar */}
            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-400">
                EMI Calendar
              </p>
              <div className="grid grid-cols-10 gap-1 sm:grid-cols-12 lg:grid-cols-20">
                {Array.from({ length: totalEmis }, (_, i) => {
                  const emiNum = i + 1;
                  const payout = app.payouts?.find(
                    (p) => p.emiNumber === emiNum,
                  );
                  const isPaid = payout?.status === "PAID";

                  return (
                    <div
                      key={emiNum}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium ${
                        isPaid
                          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
                          : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                      }`}
                      title={`EMI #${emiNum}${isPaid ? " - Paid" : ""}`}
                    >
                      {emiNum}
                    </div>
                  );
                })}
              </div>
              <div className="mt-2 flex items-center gap-4 text-[10px] text-zinc-500">
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-emerald-500/40" /> Paid
                </span>
                <span className="flex items-center gap-1">
                  <span className="h-2 w-2 rounded-sm bg-zinc-800" /> Upcoming
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
