"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  BadgeCheck,
  XCircle,
  Loader2,
  AlertCircle,
  TrendingUp,
  CalendarClock,
  Wallet,
} from "lucide-react";
import { format } from "date-fns";
import {
  InvestmentFundAdminService,
  type InvestmentFundRequestDetail,
} from "@/services/investment-fund-admin.service";
import { useFinanceQueryStore } from "@/store/finance-query.store";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  VERIFIED: "bg-green-600/20 text-green-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

const kycStyles: Record<string, string> = {
  VERIFIED: "bg-green-600/20 text-green-400",
  PENDING: "bg-yellow-500/20 text-yellow-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

function inr(value: string | number) {
  return `₹${Number(value || 0).toLocaleString("en-IN")}`;
}

export default function FundRequestDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const requestId = params.id;

  const [app, setApp] = useState<InvestmentFundRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [showReject, setShowReject] = useState(false);
  const [deciding, setDeciding] = useState<"approve" | "reject" | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setApp(await InvestmentFundAdminService.get(requestId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load request");
    } finally {
      setLoading(false);
    }
  }, [requestId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => void load(), 0);
    return () => clearTimeout(timeoutId);
  }, [load]);

  const decide = async (kind: "approve" | "reject") => {
    if (kind === "reject" && note.trim().length < 3) return;
    setDeciding(kind);
    setError(null);
    try {
      if (kind === "approve") {
        await InvestmentFundAdminService.approve(requestId);
      } else {
        await InvestmentFundAdminService.reject(requestId, note.trim());
      }
      useFinanceQueryStore.getState().bump("finance-investment-fund");
      await load();
      setShowReject(false);
      setNote("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setDeciding(null);
    }
  };

  if (loading) {
    return (
      <div className="flex h-[60vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error && !app) {
    return (
      <div className="max-w-3xl mx-auto space-y-5">
        <Card className="shadow-sm">
          <CardContent className="p-6 text-center space-y-4">
            <AlertCircle className="mx-auto h-12 w-12 text-red-400" />
            <h1 className="text-xl font-semibold text-slate-50">
              Application not found
            </h1>
            <p className="text-sm text-red-500">{error}</p>
            <Button
              type="button"
              variant="outline"
              onClick={() => router.push("/admin/investments/investment-fund")}
              className="border-neutral-700"
            >
              Back to list
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!app) return null;

  const isPending = app.status === "PENDING";

  return (
    <div className="max-w-3xl mx-auto space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="icon"
            className="border-neutral-700"
          >
            <Link href="/admin/investments/investment-fund" aria-label="Back">
              <ArrowLeft className="h-4 w-4" />
            </Link>
          </Button>
          <div>
            <h2 className="text-xl font-semibold text-white">
              {app.schemeInfo.label} Application
            </h2>
            <p className="text-xs font-mono text-slate-500">{app.id}</p>
          </div>
        </div>
        <span
          className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${
            statusStyles[app.status]
          }`}
        >
          {app.status === "VERIFIED" ? "APPROVED" : app.status}
        </span>
      </div>

      {error && (
        <div className="flex items-start gap-2 rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-400">
          <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Applicant */}
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-1.5">
          <SectionTitle icon={<Wallet className="h-4 w-4 text-indigo-500" />}>
            Applicant
          </SectionTitle>
          <Row label="Email" value={app.user.email} mono />
          <Row
            label="Name"
            value={`${app.user.firstName} ${app.user.lastName}`.trim()}
          />
          <Row label="Client ID" value={app.user.clientId ?? "—"} mono />
          <div className="flex items-center justify-between py-1.5">
            <span className="text-sm text-slate-400">KYC</span>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                kycStyles[app.kycStatus ?? "PENDING"]
              }`}
            >
              {app.kycStatus ?? "PENDING"}
            </span>
          </div>
          <Row
            label="Submitted"
            value={
              app.submittedAt
                ? format(new Date(app.submittedAt), "dd MMM yyyy, hh:mm a")
                : "—"
            }
          />
        </CardContent>
      </Card>

      {/* Fixed scheme info + user's investment */}
      <Card className="shadow-sm">
        <CardContent className="p-5 space-y-1.5">
          <SectionTitle icon={<TrendingUp className="h-4 w-4 text-amber-400" />}>
            Scheme information (fixed)
          </SectionTitle>
          <Row label="Plan" value={app.schemeInfo.label} />
          <Row
            label="Investment range"
            value={`${inr(app.schemeInfo.minAmount)} – ${inr(app.schemeInfo.maxAmount)}`}
          />
          <Row
            label="Lock-in period"
            value={`${Math.floor(app.schemeInfo.lockInMonths / 12)} Years`}
          />
          <Row label="Monthly ROI" value={`${app.schemeInfo.roiPercent}%`} />

          <div className="pt-3 mt-2 border-t border-neutral-800">
            <Row
              label="User invests"
              value={inr(app.amount)}
              strong
            />
          </div>
        </CardContent>
      </Card>

      {/* Cycle state — only once approved */}
      {app.cycle && (
        <Card className="shadow-sm border-emerald-900/50">
          <CardContent className="p-5 space-y-1.5">
            <SectionTitle icon={<CalendarClock className="h-4 w-4 text-emerald-400" />}>
              ROI cycle
            </SectionTitle>
            <Row
              label="Cycle started"
              value={format(new Date(app.cycle.startAt), "dd MMM yyyy")}
            />
            <Row
              label="Lock-in ends"
              value={format(new Date(app.cycle.lockEndsAt), "dd MMM yyyy")}
            />
            <Row
              label="Expected monthly ROI"
              value={inr(app.cycle.expectedMonthlyRoi)}
              strong
            />
            <Row label="Total ROI paid" value={inr(app.totalRoiPaid)} />
            <Row
              label="Last payout up to"
              value={format(
                new Date(app.cycle.lastRoiPaidAt),
                "dd MMM yyyy, hh:mm a",
              )}
            />
            <Row
              label="Next payout due"
              value={
                app.cycle.nextRoiDueAt
                  ? format(new Date(app.cycle.nextRoiDueAt), "dd MMM yyyy")
                  : "Completed"
              }
            />
            <Row
              label="Progress"
              value={`${app.cycle.monthsElapsed} / ${app.schemeInfo.lockInMonths} months`}
            />
          </CardContent>
        </Card>
      )}

      {/* Rejection note */}
      {app.status === "REJECTED" && app.reviewNote && (
        <Card className="shadow-sm border-red-900/50">
          <CardContent className="p-5">
            <div className="flex items-start gap-2">
              <XCircle className="h-5 w-5 shrink-0 text-red-400 mt-0.5" />
              <div>
                <p className="text-sm font-semibold text-red-400">
                  Rejected by admin
                </p>
                <p className="text-sm text-slate-300 mt-1">{app.reviewNote}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Decision panel */}
      {isPending && (
        <Card className="shadow-sm">
          <CardContent className="p-5 space-y-4">
            {!showReject ? (
              <>
                <p className="text-sm text-slate-400">
                  Approving starts the {Math.floor(app.schemeInfo.lockInMonths / 12)}-year
                  lock-in and the monthly {app.schemeInfo.roiPercent}% ROI cycle.
                  Rejecting refunds {inr(app.amount)} to the applicant&apos;s wallet.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    disabled={deciding !== null}
                    onClick={() => void decide("approve")}
                    className="flex-1 bg-green-600 hover:bg-green-700 text-white flex items-center justify-center gap-2"
                  >
                    {deciding === "approve" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <BadgeCheck className="h-4 w-4" />
                    )}
                    Approve & start cycle
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={deciding !== null}
                    onClick={() => setShowReject(true)}
                    className="flex-1 border-red-600/40 text-red-400 hover:bg-red-950/40 hover:text-red-300 flex items-center justify-center gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Reject & refund
                  </Button>
                </div>
              </>
            ) : (
              <>
                <label
                  htmlFor="reject-note"
                  className="block text-sm font-medium text-slate-200"
                >
                  Rejection reason <span className="text-red-500">*</span>
                  <span className="ml-2 text-xs text-slate-500">
                    The amount is refunded to the wallet automatically.
                  </span>
                </label>
                <Input
                  id="reject-note"
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="e.g. KYC not verified for this amount"
                  maxLength={1000}
                />
                {note.trim().length > 0 && note.trim().length < 3 && (
                  <p className="text-xs text-red-500">
                    Reason must be at least 3 characters.
                  </p>
                )}
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    type="button"
                    disabled={note.trim().length < 3 || deciding !== null}
                    onClick={() => void decide("reject")}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white flex items-center justify-center gap-2"
                  >
                    {deciding === "reject" ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <XCircle className="h-4 w-4" />
                    )}
                    Confirm rejection & refund
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    disabled={deciding !== null}
                    onClick={() => setShowReject(false)}
                    className="flex-1 border-neutral-700"
                  >
                    Cancel
                  </Button>
                </div>
              </>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}

function SectionTitle({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 mb-3 pb-2 border-b border-neutral-800">
      {icon}
      <h3 className="text-sm font-semibold text-slate-200">{children}</h3>
    </div>
  );
}

function Row({
  label,
  value,
  mono = false,
  strong = false,
}: {
  label: string;
  value: string;
  mono?: boolean;
  strong?: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1.5">
      <span className="text-sm text-slate-400">{label}</span>
      <span
        className={`truncate text-right ${
          strong
            ? "text-base font-bold text-emerald-400"
            : "text-sm text-slate-100"
        } ${mono ? "font-mono" : ""}`}
      >
        {value}
      </span>
    </div>
  );
}
