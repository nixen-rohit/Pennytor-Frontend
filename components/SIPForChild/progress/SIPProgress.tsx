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
  AlertCircle,
  CheckCircle2,
  Zap,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import {
  SIPForChildService,
  type MySIPInvestment,
} from "@/services/sip-for-child.service";
import { PayPremium } from "../premium/PayPremium";

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function SIPProgress() {
  const [items, setItems] = useState<MySIPInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabOverride, setTabOverride] = useState<string | null>(null);
  const [payingAppId, setPayingAppId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SIPForChildService.myApplications();
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

  const plans = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ scheme: string; apps: MySIPInvestment[] }> = [];
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

  const defaultTab = useMemo(() => {
    const verified = plans.find((p) =>
      p.apps.some((a) => a.status === "VERIFIED"),
    );
    return (verified ?? plans[0])?.scheme ?? "";
  }, [plans]);

  const activeTab = tabOverride ?? defaultTab;

  const payingApp = payingAppId
    ? items.find((i) => i.id === payingAppId) ?? null
    : null;

  if (payingApp) {
    return (
      <PayPremium
        application={payingApp}
        onPaid={() => {
          setPayingAppId(null);
          void load();
        }}
        onCancel={() => setPayingAppId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#08090f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
                SIP Progress
              </h1>
              <p className="text-sm text-zinc-400">
                Your SIP for Child payment history and month-by-month tracking.
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
              <Link href="/investment/all-schemes/sip-for-child/reports">
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
              {plans.map((p) => (
                <TabsTrigger
                  key={p.scheme}
                  value={p.scheme}
                  className="flex items-center gap-3"
                >
                  Plan {p.scheme}
                </TabsTrigger>
              ))}
            </TabsList>
            {plans.map((p) => (
              <TabsContent
                key={p.scheme}
                value={p.scheme}
                className="space-y-6"
              >
                {p.apps.map((inv) => (
                  <div key={inv.id} className="space-y-4">
                    <PaymentDueBanner
                      inv={inv}
                      onPayNow={() => setPayingAppId(inv.id)}
                    />
                    <ProgressCard inv={inv} onPayNow={() => setPayingAppId(inv.id)} />
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

function PaymentDueBanner({
  inv,
  onPayNow,
}: {
  inv: MySIPInvestment;
  onPayNow: () => void;
}) {
  const isVerified = inv.status === "VERIFIED";
  const isPaymentDue = isVerified && inv.monthsPaid < inv.totalMonths;
  const monthlyAmount = Number(inv.monthlyInvestment);

  if (!isPaymentDue) return null;

  // Find the next unpaid month number
  const paidMonths = new Set(
    (inv.premiums ?? [])
      .filter((p) => p.status === "PAID")
      .map((p) => p.monthNumber),
  );
  let nextUnpaidMonth = inv.monthsPaid + 1;
  while (nextUnpaidMonth <= inv.totalMonths && paidMonths.has(nextUnpaidMonth)) {
    nextUnpaidMonth++;
  }
  const isAdvance = nextUnpaidMonth > inv.monthsPaid + 1;

  const isOverdue =
    inv.nextPaymentDue && new Date(inv.nextPaymentDue) < new Date();

  return (
    <Card
      className={`border-2 ${
        isOverdue
          ? "border-red-500/40 bg-gradient-to-r from-red-500/10 to-amber-500/5"
          : isAdvance
            ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-indigo-500/5"
            : "border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-emerald-500/5"
      } shadow-lg`}
    >
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isOverdue
                  ? "bg-red-500/20"
                  : isAdvance
                    ? "bg-emerald-500/20"
                    : "bg-amber-500/20"
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="h-6 w-6 text-red-400" />
              ) : isAdvance ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <Zap className="h-6 w-6 text-amber-400" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {isAdvance
                  ? "Current Month Already Paid"
                  : inv.monthsPaid === 0
                    ? "First Premium Payment Due"
                    : isOverdue
                      ? "Payment Overdue"
                      : "Monthly Premium Due"}
              </h3>
              <p className="text-sm text-zinc-400">
                {isAdvance
                  ? `Month ${nextUnpaidMonth} of ${inv.totalMonths} — pay now to continue your SIP.`
                  : inv.monthsPaid === 0
                    ? "Your application has been approved! Pay your first premium to activate the SIP."
                    : isOverdue
                      ? `Month ${nextUnpaidMonth} payment was due on ${
                          inv.nextPaymentDue
                            ? format(new Date(inv.nextPaymentDue), "dd MMM yyyy")
                            : "earlier"
                        }. Pay now to avoid missing it.`
                      : `Month ${nextUnpaidMonth} of ${inv.totalMonths} — ${
                          inv.nextPaymentDue
                            ? `due ${format(new Date(inv.nextPaymentDue), "dd MMM yyyy")}`
                            : "pay now to continue"
                        }`}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-lg font-bold text-green-400">
                  {inr(monthlyAmount)}
                </span>
                <span className="text-xs text-zinc-500">per month</span>
                {isAdvance && (
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                    ADVANCE
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            type="button"
            onClick={onPayNow}
            className={`shrink-0 px-8 py-3 text-sm font-bold shadow-lg ${
              isOverdue
                ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                : isAdvance
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
            } text-white`}
          >
            {isAdvance ? "Pay Advance" : "Pay Now"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {inv.monthsMissed >= 2 && (
          <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
            <p className="text-xs font-medium text-red-300">
              Warning: You have {inv.monthsMissed} missed payment(s). On the 4th
              missed payment, your SIP will be auto-rejected and refunded.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

function ProgressCard({
  inv,
  onPayNow,
}: {
  inv: MySIPInvestment;
  onPayNow: () => void;
}) {
  const statusMeta =
    inv.status === "VERIFIED"
      ? {
          label:
            inv.monthsPaid > 0
              ? "ACTIVE"
              : "APPROVED - AWAITING FIRST PAYMENT",
          cls: "bg-green-500/10 text-green-400 border-green-500/20",
        }
      : inv.status === "REJECTED"
        ? {
            label: "REJECTED - REFUNDED",
            cls: "bg-red-500/10 text-red-400 border-red-500/20",
          }
        : {
            label: "PENDING APPROVAL",
            cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
          };

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
            <p className="text-zinc-500 font-bold">
              {inv.startedAt ? (
                <span className="flex items-center gap-2 font-medium text-zinc-200">
                  SIP started on{" "}
                  <span className="text-yellow-400">
                    {format(new Date(inv.startedAt), "dd MMM yyyy")}
                  </span>
                </span>
              ) : inv.submittedAt ? (
                <span className="flex items-center gap-2 font-medium text-zinc-200">
                  Applied on{" "}
                  <span className="text-yellow-400">
                    {format(
                      new Date(inv.submittedAt),
                      "dd MMM yyyy, hh:mm a",
                    )}
                  </span>
                </span>
              ) : null}
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
        </div>

        {/* Cycle grid */}
        {inv.status === "VERIFIED" && (
          <>
            <div className="grid grid-cols-1 gap-px overflow-hidden rounded-xl border border-white/10 bg-white/10 sm:grid-cols-2 lg:grid-cols-3">
              <Cell
                label="Monthly Premium"
                value={inr(monthlyAmount)}
                accent
              />
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
                    inv.status === "VERIFIED";
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

function EmptyState() {
  return (
    <Card className="border-dashed border-white/15 bg-white/[0.02] shadow-none">
      <CardContent className="flex flex-col items-center py-16 text-center space-y-4">
        <div className="rounded-full bg-indigo-500/10 p-4 ring-1 ring-indigo-400/30">
          <TrendingUp className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No active SIP yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-400">
            Apply to a SIP for Child plan and your progress dashboard will
            appear here with month-by-month payment tracking.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Link href="/investment/all-schemes/sip-for-child">
            Browse Plans
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
