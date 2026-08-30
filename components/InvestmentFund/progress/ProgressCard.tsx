"use client";

import { Card, CardContent } from "@/components/ui/card";
import {
  CalendarClock,
  BadgeCheck,
  Clock3,
  Wallet,
  Undo2,
  CheckCircle2,
} from "lucide-react";
import { format } from "date-fns";
import { type MyInvestment } from "@/services/investment-fund.service";

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

function Cell({
  label,
  value,
  accent = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
}) {
  return (
    <div className="bg-[#0d0e12] p-4">
      <p className="text-[11px] uppercase tracking-wide text-zinc-500">
        {label}
      </p>
      <p
        className={`mt-1 font-bold ${accent ? "text-lg text-emerald-400" : "text-sm text-zinc-100"}`}
      >
        {value}
      </p>
    </div>
  );
}

const STATUS_META: Record<string, { label: string; cls: string }> = {
  VERIFIED: {
    label: "ACTIVE",
    cls: "bg-green-500/10 text-green-400 border-green-500/20",
  },
  REJECTED: {
    label: "REJECTED — REFUNDED",
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

export function ProgressCard({ inv }: { inv: MyInvestment }) {
  const statusMeta = STATUS_META[inv.status] ?? STATUS_META.PENDING;

  const progress = inv.cycle
    ? Math.min(
        100,
        Math.round((inv.cycle.monthsElapsed / inv.lockInMonths) * 100),
      )
    : 0;

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
            <p className=" text-zinc-500 font-bold">
              {inv.status === "VERIFIED" && inv.cycle ? (
                <span className="flex items-center gap-2 font-medium text-zinc-200">
                  Scheme started on{" "}
                  <span className="text-yellow-400">
                    {format(new Date(inv.cycle.startAt), "dd MMM yyyy")}
                  </span>
                </span>
              ) : (
                <span className="flex items-center gap-2 font-medium text-zinc-200">
                  Applied on{" "}
                  <span className="text-yellow-400">
                    {format(
                      new Date(inv.submittedAt ?? inv.createdAt),
                      "dd MMM yyyy, hh:mm a",
                    )}
                  </span>
                </span>
              )}
            </p>
          </div>
          <div className="text-left sm:text-right font-bold">
            <p className="text-xs text-zinc-500">Your Investment</p>
            <p className="text-2xl text-green-500">{inr(inv.amount)}</p>
          </div>
        </div>

        {/* Money state line */}
        <div className="flex items-start gap-2 rounded-lg border border-white/5 bg-white/[0.03] px-3 py-2">
          {inv.status === "PENDING" && (
            <>
              <Wallet className="mt-0.5 h-4 w-4 shrink-0 text-yellow-400" />
              <p className="text-xs text-zinc-400 font-bold">
                Amount debited from your wallet into{" "}
                <span className="font-medium text-green-400">
                  {inv.planLabel}
                </span>
                . The cycle starts the moment admin approves your request.
              </p>
            </>
          )}
          {inv.status === "REJECTED" && (
            <>
              <Undo2 className="mt-0.5 h-4 w-4 shrink-0 text-red-400" />
              <p className="text-xs text-zinc-400 font-bold">
                Rejected{inv.reviewNote ? `: ${inv.reviewNote}` : "."} The full{" "}
                {inr(inv.amount)} was refunded to your wallet.
              </p>
            </>
          )}
          {inv.status === "VERIFIED" && (
            <>
              <BadgeCheck className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <p className="text-xs text-zinc-400 font-bold">
                Earning{" "}
                <span className="font-medium text-green-400">
                  {inr(inv.monthlyRoi)}
                </span>{" "}
                every month{" "}
                <span className="font-medium text-yellow-400">
                  ( {inv.roiPercent}% monthly )
                </span>{" "}
                until maturity.
              </p>
            </>
          )}
          {inv.status === "COMPLETED" && (
            <>
              <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-400" />
              <p className="text-xs text-zinc-400 font-bold">
                COMPLETED! All {inv.lockInMonths} months ROI have been credited.
              </p>
            </>
          )}
        </div>

        {/* Cycle grid */}
        {(inv.status === "VERIFIED" || inv.status === "COMPLETED") &&
          inv.cycle && (
            <>
              <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
                <Cell
                  label="Cycle Started"
                  value={format(new Date(inv.cycle.startAt), "dd MMM yyyy")}
                />
                <Cell
                  label="Lock-in Ends"
                  value={format(
                    new Date(inv.cycle.lockEndsAt),
                    "dd MMM yyyy",
                  )}
                />
                <Cell
                  label="Expected Monthly ROI"
                  value={inr(inv.monthlyRoi)}
                  accent
                />
                <Cell label="Total ROI Paid" value={inr(inv.totalRoiPaid)} />
                <Cell
                  label="Last Payout Up To"
                  value={format(
                    new Date(inv.cycle.lastRoiPaidAt),
                    "dd MMM yyyy, hh:mm a",
                  )}
                />
                <Cell
                  label="Next Payout Due"
                  value={
                    inv.cycle.nextPayoutAt
                      ? format(
                          new Date(inv.cycle.nextPayoutAt),
                          "dd MMM yyyy",
                        )
                      : "Completed"
                  }
                />
              </div>

              {/* Progress */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-zinc-400">
                  <span className="inline-flex items-center gap-1.5">
                    <CalendarClock className="h-3.5 w-3.5" />
                    Progress: {inv.cycle.monthsElapsed} / {inv.lockInMonths}{" "}
                    months
                  </span>
                  <span className="inline-flex items-center gap-1.5">
                    <Clock3 className="h-3.5 w-3.5" />
                    {inv.cycle.monthsRemaining} months remaining
                  </span>
                </div>
                <div className="h-2.5 rounded-full bg-white/10 overflow-hidden">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-indigo-600 to-emerald-500 transition-all duration-500"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-[11px] text-zinc-500">
                  ROI is credited automatically every month around the same date
                  your scheme was approved.
                </p>
              </div>

              {/* ROI Payment Calendar */}
              {inv.status === "VERIFIED" && inv.cycle && (
                <div className="space-y-2">
                  <p className="text-sm font-semibold text-zinc-300">
                    ROI Payment Calendar
                  </p>
                  <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-12 lg:grid-cols-20">
                    {Array.from({ length: inv.lockInMonths }, (_, i) => {
                      const monthNum = i + 1;
                      const cycle = inv.cycle!;
                      const isPaid = monthNum <= cycle.monthsElapsed;
                      const isCurrent =
                        monthNum === cycle.monthsElapsed + 1 &&
                        cycle.monthsRemaining > 0;

                      return (
                        <div
                          key={monthNum}
                          className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium transition-colors ${
                            isPaid
                              ? "bg-green-500/20 text-green-400 border border-green-500/30"
                              : isCurrent
                                ? "bg-amber-500/20 text-amber-400 border border-amber-500/30 ring-2 ring-amber-400/20"
                                : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                          }`}
                          title={`Month ${monthNum}${isPaid ? " - ROI Credited" : isCurrent ? " - Next Payout" : ""}`}
                        >
                          {monthNum}
                        </div>
                      );
                    })}
                  </div>
                  <div className="flex items-center gap-4 text-xs text-zinc-500">
                    <span className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded bg-green-500/20 border border-green-500/30" />
                      ROI Credited
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded bg-amber-500/20 border border-amber-500/30" />
                      Next Payout
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded bg-zinc-900 border border-zinc-800" />
                      Upcoming
                    </span>
                    <span className="flex items-center gap-1.5">
                      <div className="h-3 w-3 rounded bg-blue-500/20 border border-blue-500/20" />
                      Completed
                    </span>
                  </div>
                </div>
              )}
            </>
          )}
      </CardContent>
    </Card>
  );
}