"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarClock,
  BadgeCheck,
  Clock3,
  Wallet,
  AlertCircle,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { type MySIPInvestment } from "@/services/sip-for-child.service";

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Cell({
  label,
  value,
  accent = false,
  danger = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="bg-[#0d0e12] p-4">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 font-bold ${
          danger
            ? "text-sm text-red-400"
            : accent
              ? "text-lg text-emerald-400"
              : "text-sm text-zinc-100"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

export function ProgressCard({
  inv,
  onPayNow,
}: {
  inv: MySIPInvestment;
  onPayNow: () => void;
}) {
  const statusStyles: Record<string, { label: string; cls: string }> = {
    VERIFIED: {
      label:
        inv.monthsPaid > 0 ? "ACTIVE" : "APPROVED - AWAITING FIRST PAYMENT",
      cls: "bg-green-500/10 text-green-400 border-green-500/20",
    },
    REJECTED: {
      label: "REJECTED - REFUNDED",
      cls: "bg-red-500/10 text-red-400 border-red-500/20",
    },
    COMPLETED: {
      label: "COMPLETED",
      cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
    },
    PENDING: {
      label: "PENDING APPROVAL",
      cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
    },
  };
  const statusMeta = statusStyles[inv.status] ?? statusStyles.PENDING;

  const progress = Math.min(
    100,
    Math.round((inv.monthsPaid / inv.totalMonths) * 100),
  );

  const monthlyAmount = Number(inv.monthlyInvestment);
  const totalPaid = monthlyAmount * inv.monthsPaid;

  return (
    <Card className="border-white/10 bg-[#111217] shadow-xl">
      <CardContent className="p-6 space-y-5">
        {/* Identity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="rounded-lg bg-indigo-500/15 px-3 py-1 text-sm font-bold text-indigo-300">
                {inv.planLabel}
              </span>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusMeta.cls}`}
              >
                {statusMeta.label}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              {inv.startedAt
                ? `SIP running for ${Math.floor(
                    (new Date().getTime() - new Date(inv.startedAt).getTime()) /
                      (1000 * 60 * 60 * 24),
                  )} days`
                : inv.cycle?.startAt
                  ? `SIP started ${format(new Date(inv.cycle.startAt), "dd MMM yyyy")}`
                  : "Applied on N/A"}
              {inv.cycle?.monthsRemaining != null &&
                inv.cycle.monthsRemaining > 0 &&
                ` · ${Math.floor(inv.cycle.monthsRemaining * 30)} days remaining`}
            </p>
          </div>
          <div className="text-left sm:text-right font-bold">
            <p className="text-xs text-zinc-500">Monthly Premium</p>
            <p className="text-2xl text-green-500">{inr(monthlyAmount)}</p>
          </div>
        </div>

        {/* Money state line */}
        <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
          {inv.status === "PENDING" && (
            <>
              <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
              <p className="text-xs text-zinc-400 font-bold">
                Application submitted. Waiting for admin approval.
              </p>
            </>
          )}
          {inv.status === "REJECTED" && (
            <>
              <AlertCircle className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-xs text-zinc-400 font-bold">
                Rejected
                {inv.reviewNote ? `: ${inv.reviewNote}` : "."} All paid premiums
                have been refunded to your wallet.
              </p>
            </>
          )}
          {inv.status === "VERIFIED" && inv.monthsPaid === 0 && (
            <>
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <p className="text-xs text-zinc-400 font-bold">
                Approved! Please pay your first premium to start the SIP.
              </p>
            </>
          )}
          {inv.status === "VERIFIED" && inv.monthsPaid > 0 && (
            <>
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <p className="text-xs text-zinc-400 font-bold">
                Paid{" "}
                <span className="font-medium text-green-400">
                  {inr(totalPaid)}
                </span>{" "}
                total ({inv.monthsPaid}/{inv.totalMonths} months)
                {inv.monthsMissed > 0 && (
                  <span className="text-yellow-400">
                    {" "}
                    ({inv.monthsMissed} missed)
                  </span>
                )}
              </p>
            </>
          )}
          {inv.status === "COMPLETED" && (
            <>
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <p className="text-xs text-zinc-400 font-bold">
                Fully matured! All {inv.totalMonths} EMIs have been credited to
                your wallet.
              </p>
            </>
          )}
        </div>

        {/* Cycle grid */}
        {(inv.status === "VERIFIED" || inv.status === "COMPLETED") && (
          <>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              <Cell label="Monthly Premium" value={inr(monthlyAmount)} accent />
              <Cell
                label="Months Paid"
                value={`${inv.monthsPaid} / ${inv.totalMonths}`}
              />
              <Cell
                label="Months Missed"
                value={`${inv.monthsMissed} / 3 allowed`}
                danger={inv.monthsMissed >= 3}
              />
              <Cell label="Total Paid" value={inr(totalPaid)} />
              <Cell
                label="Fund Value (Projected)"
                value={inr(inv.fundValue)}
                accent
              />
              <Cell
                label="Next Payment Due"
                value={
                  inv.nextPaymentDue
                    ? format(new Date(inv.nextPaymentDue), "dd MMM yyyy")
                    : inv.monthsPaid >= inv.totalMonths
                      ? "Completed"
                      : "N/A"
                }
              />
            </div>

            {/* Progress */}
            <div className="space-y-2">
              <div className="flex items-center justify-between text-xs text-zinc-400">
                <span className="inline-flex items-center gap-1.5">
                  <CalendarClock className="h-3.5 w-3.5" />
                  Progress: {inv.monthsPaid} / {inv.totalMonths} months
                </span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock3 className="h-3.5 w-3.5" />
                  {inv.totalMonths - inv.monthsPaid} months remaining
                </span>
              </div>
              <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Month Grid */}
            <div className="space-y-2">
              <p className="text-sm font-semibold text-zinc-300">
                Payment Calendar
              </p>
              <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-12 lg:grid-cols-20">
                {Array.from({ length: inv.totalMonths }, (_, i) => {
                  const monthNum = i + 1;
                  const premium = inv.premiums?.find(
                    (p) => p.monthNumber === monthNum,
                  );
                  const isPaid = premium?.status === "PAID";
                  const isMissed = premium?.status === "MISSED";
                  const isCurrent =
                    monthNum === inv.monthsPaid + 1 &&
                    (inv.status === "VERIFIED" || inv.status === "COMPLETED");
                  const isPast = monthNum <= inv.monthsPaid;

                  return (
                    <div
                      key={monthNum}
                      className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                        isPaid
                          ? "bg-green-500/20 text-green-400 border border-green-500/30"
                          : isMissed
                            ? "bg-red-500/20 text-red-400 border border-red-500/30"
                            : isCurrent
                              ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 ring-2 ring-amber-400/20"
                              : isPast
                                ? "bg-zinc-800 text-zinc-500"
                                : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                      }`}
                      title={`Month ${monthNum}${isPaid ? " - Paid" : isMissed ? " - Missed" : isCurrent ? " - Current" : ""}`}
                    >
                      {monthNum}
                    </div>
                  );
                })}
              </div>
              <div className="flex items-center gap-4 text-xs text-zinc-500">
                <span className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-green-500/20 border border-green-500/30" />
                  Paid
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-amber-500/20 border border-amber-500/30" />
                  Current
                </span>
                <span className="flex items-center gap-1.5">
                  <div className="h-3 w-3 rounded bg-zinc-900 border border-zinc-800" />
                  Upcoming
                </span>
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}