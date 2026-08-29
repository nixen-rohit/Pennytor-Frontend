"use client";

import { useEffect, useState, useMemo } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  ChevronLeft,
  Clock,
  CheckCircle2,
  Loader2,
  RefreshCw,
  WalletCards,
  TrendingUp,
  Calendar,
  XCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  FixedDepositService,
  type FDApplication,
} from "@/services/fixed-deposit.service";

const planLabel = (planId: string) => {
  const n = parseInt(planId.replace("FD_", ""), 10);
  return `₹${n.toLocaleString("en-IN")}`;
};

const inr = (v: string | number) => {
  const n = typeof v === "number" ? v : parseFloat(String(v)) || 0;
  return `₹${n.toLocaleString("en-IN", { maximumFractionDigits: 0 })}`;
};

export default function FDProgressPage() {
  const [applications, setApplications] = useState<FDApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  const fetchApps = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await FixedDepositService.myApplications();
      setApplications(data);
      // Auto-select first VERIFIED tab, or first tab
      if (data.length > 0 && !activeTab) {
        const verified = data.find((a) => a.status === "VERIFIED");
        setActiveTab(verified?.id || data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  // Empty state
  if (!loading && !error && applications.length === 0) {
    return (
      <div className="min-h-screen bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <Card className="border-white/10 bg-[#111217] p-8">
            <CardContent className="p-0 space-y-4">
              <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10">
                <TrendingUp className="h-8 w-8 text-amber-400" />
              </div>
              <h2 className="text-xl font-bold text-white">No Fixed Deposits Yet</h2>
              <p className="text-sm text-zinc-400">
                You haven&apos;t applied for any Fixed Deposit plans yet.
              </p>
              <Link href="/investment/all-schemes/fixed-deposite">
                <Button className="bg-amber-400 text-black hover:bg-amber-300">
                  Browse Plans
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/investment/all-schemes/fixed-deposite"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Plans
        </Link>

        {/* Header */}
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">Fixed Deposit Progress</h1>
            <p className="mt-1 text-sm text-zinc-400">
              Track your Fixed Deposit investments and EMI payouts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/investment/all-schemes/fixed-deposite/reports">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Reports
              </Button>
            </Link>
            <Button
              onClick={() => fetchApps(true)}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {/* Tabs */}
        {!loading && !error && applications.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-[#111217] border border-white/10">
              {applications.map((app) => (
                <TabsTrigger
                  key={app.id}
                  value={app.id}
                  className="data-[state=active]:bg-amber-400 data-[state=active]:text-black"
                >
                  {planLabel(app.planId)}
                </TabsTrigger>
              ))}
            </TabsList>

            {applications.map((app) => (
              <TabsContent key={app.id} value={app.id}>
                <ProgressCard app={app} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}

function ProgressCard({ app }: { app: FDApplication }) {
  const paidEmis = app.emisPaid || 0;
  const totalEmis = app.totalEmis;
  const progress = totalEmis > 0 ? (paidEmis / totalEmis) * 100 : 0;

  const statusMeta: Record<string, { label: string; cls: string; icon: React.ReactNode }> = {
    PENDING: {
      label: "PENDING",
      cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
      icon: <Clock className="h-4 w-4" />,
    },
    VERIFIED: {
      label: "ACTIVE",
      cls: "bg-green-500/10 text-green-400 border-green-500/20",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    COMPLETED: {
      label: "COMPLETED",
      cls: "bg-blue-500/10 text-blue-400 border-blue-500/20",
      icon: <CheckCircle2 className="h-4 w-4" />,
    },
    REJECTED: {
      label: "REJECTED",
      cls: "bg-red-500/10 text-red-400 border-red-500/20",
      icon: <XCircle className="h-4 w-4" />,
    },
  };

  const meta = statusMeta[app.status] || statusMeta.PENDING;

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
              <p className="text-xs text-zinc-500">
                Applied {app.submittedAt ? format(new Date(app.submittedAt), "dd MMM yyyy") : "N/A"}
              </p>
            </div>
          </div>
          <span className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-xs font-semibold ${meta.cls}`}>
            {meta.icon}
            {meta.label}
          </span>
        </div>

        {/* Status message */}
        <div className="mb-4 rounded-lg border border-white/5 bg-white/[0.02] p-3">
          {app.status === "PENDING" && (
            <p className="text-sm text-zinc-400">
              Application submitted. Waiting for admin review. Your wallet will be debited on approval.
            </p>
          )}
          {app.status === "VERIFIED" && (
            <p className="text-sm text-zinc-400">
              Active. Receiving {inr(app.emiAmount)} {app.payoutMode} EMIs until maturity.
            </p>
          )}
          {app.status === "COMPLETED" && (
            <p className="text-sm text-emerald-400">
              Fully matured! All {totalEmis} EMIs have been credited to your wallet.
            </p>
          )}
          {app.status === "REJECTED" && (
            <p className="text-sm text-red-400">
              Rejected. {app.reviewNote || "No deduction was made from your wallet."}
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
              <div className="mb-4 flex items-center gap-2 text-xs text-zinc-400">
                <Clock className="h-3.5 w-3.5" />
                Next payout:{" "}
                {format(new Date(app.nextPayoutAt), "dd MMM yyyy")}
              </div>
            )}

            {/* EMI Calendar */}
            <div>
              <p className="mb-2 text-xs font-semibold text-zinc-400">EMI Calendar</p>
              <div className="grid grid-cols-10 gap-1 sm:grid-cols-12 lg:grid-cols-20">
                {Array.from({ length: totalEmis }, (_, i) => {
                  const emiNum = i + 1;
                  const payout = app.payouts?.find((p) => p.emiNumber === emiNum);
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
      <p className="text-[10px] uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={`mt-0.5 text-sm font-bold ${accent ? "text-emerald-400" : "text-white"}`}>
        {value}
      </p>
    </div>
  );
}
