"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  CalendarClock,
  TrendingUp,
  Loader2,
  RefreshCw,
  BadgeCheck,
  Clock3,
  Wallet,
  Undo2,
} from "lucide-react";
import { format } from "date-fns";
import {
  InvestmentFundService,
  type MyInvestment,
} from "@/services/investment-fund.service";

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function InvestmentProgress() {
  const [items, setItems] = useState<MyInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // User's explicit tab choice — null means "follow the default".
  const [tabOverride, setTabOverride] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await InvestmentFundService.myApplications();
      setItems(res.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load progress");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => void load(), 0);
    return () => clearTimeout(id);
  }, [load]);

  // One tab per scheme the user actually holds (newest application first).
  const plans = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ scheme: string; apps: MyInvestment[] }> = [];
    for (const inv of items) {
      if (!seen.has(inv.scheme)) {
        seen.add(inv.scheme);
        list.push({
          scheme: inv.scheme,
          apps: items.filter((i) => i.scheme === inv.scheme),
        });
      }
    }
    return list;
  }, [items]);

  // Default tab: the active (VERIFIED) plan, otherwise the first one.
  const defaultTab = useMemo(() => {
    const verified = plans.find((p) =>
      p.apps.some((a) => a.status === "VERIFIED"),
    );
    return (verified ?? plans[0])?.scheme ?? "";
  }, [plans]);

  const activeTab = tabOverride ?? defaultTab;

  return (
    <div className="min-h-screen bg-[#08090f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                Scheme Progress
              </h1>
              <p className="text-sm text-zinc-400">
                Your investment fund cycle — start date, monthly returns and
                lock-in timeline.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 text-white"
            >
              <Link href="/investment/all-schemes/investment-fund/reports">
                Reports
              </Link>
            </Button>
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
        </div>

        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <p className="py-24 text-center text-sm text-red-400">{error}</p>
        ) : plans.length === 0 ? (
          <EmptyState />
        ) : (
          <Tabs value={activeTab} onValueChange={setTabOverride}>
            <TabsList className="grid w-full grid-cols-5 lg:w-[800px]">
              {plans.map((p) => {
                const hasActive = p.apps.some((a) => a.status === "VERIFIED");
                return (
                  <TabsTrigger
                    key={p.scheme}
                    value={p.scheme}
                    className="flex items-center gap-3"
                  >
                    Plan {p.scheme}
                  </TabsTrigger>
                );
              })}
            </TabsList>
            {plans.map((p) => (
              <TabsContent
                key={p.scheme}
                value={p.scheme}
                className="space-y-6"
              >
                {/* Only the visible tab's card is mounted — inactive tabs
                    stay out of the DOM until selected. */}
                {p.apps.map((inv) => (
                  <ProgressCard key={inv.id} inv={inv} />
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

function ProgressCard({ inv }: { inv: MyInvestment }) {
  const statusMeta =
    inv.status === "VERIFIED"
      ? {
          label: "ACTIVE",
          cls: "bg-green-500/10 text-green-400 border-green-500/20",
        }
      : inv.status === "REJECTED"
        ? {
            label: "REJECTED — REFUNDED",
            cls: "bg-red-500/10 text-red-400 border-red-500/20",
          }
        : {
            label: "PENDING APPROVAL",
            cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
          };

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
        </div>

        {/* Cycle grid */}
        {inv.status === "VERIFIED" && inv.cycle && (
          <>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              <Cell
                label="Cycle Started"
                value={format(new Date(inv.cycle.startAt), "dd MMM yyyy")}
              />
              <Cell
                label="Lock-in Ends"
                value={format(new Date(inv.cycle.lockEndsAt), "dd MMM yyyy")}
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
                    ? format(new Date(inv.cycle.nextPayoutAt), "dd MMM yyyy")
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
            <div className="space-y-2">
              <p className="text-sm font-semibold text-zinc-300">
                ROI Payment Calendar
              </p>
              <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-12 lg:grid-cols-20">
                {Array.from({ length: inv.lockInMonths }, (_, i) => {
                  const monthNum = i + 1;
                  const isPaid = monthNum <= inv.cycle.monthsElapsed;
                  const isCurrent =
                    monthNum === inv.cycle.monthsElapsed + 1 &&
                    inv.cycle.monthsRemaining > 0;
                  const isUpcoming = monthNum > inv.cycle.monthsElapsed + 1;

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
              </div>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}

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

function EmptyState() {
  return (
    <Card className="border-dashed border-white/15 bg-white/[0.02] shadow-none">
      <CardContent className="flex flex-col items-center py-16 text-center space-y-4">
        <div className="rounded-full bg-indigo-500/10 p-4 ring-1 ring-indigo-400/30">
          <TrendingUp className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No active schemes yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-400">
            Apply to an Investment Fund plan and your progress dashboard will
            appear here with monthly ROI tracking.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Link href="/investment/all-schemes/investment-fund">
            Browse Schemes
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
