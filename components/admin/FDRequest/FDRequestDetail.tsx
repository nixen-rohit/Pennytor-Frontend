"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  ArrowLeft,
  Loader2,
  CheckCircle2,
  XCircle,
  Wallet,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import {
  FixedDepositAdminService,
  type FDRequestDetail,
} from "@/services/fixed-deposit-admin.service";

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  })}`;

export default function FDRequestDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [data, setData] = useState<FDRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState(false);
  const [rejectNote, setRejectNote] = useState("");
  const [showRejectForm, setShowRejectForm] = useState(false);

  useEffect(() => {
    if (!id) return;
    let cancelled = false;
    setLoading(true);
    setError(null);
    FixedDepositAdminService.detail(id)
      .then((res) => { if (!cancelled) setData(res); })
      .catch((err) => { if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await FixedDepositAdminService.approve(id);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to approve");
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async () => {
    if (!id) return;
    if (rejectNote.trim().length < 3) {
      alert("Rejection reason must be at least 3 characters");
      return;
    }
    setActionLoading(true);
    try {
      await FixedDepositAdminService.reject(id, rejectNote);
      window.location.reload();
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to reject");
    } finally {
      setActionLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="py-24 text-center">
        <p className="text-sm text-red-400">{error || "Application not found"}</p>
      </div>
    );
  }

  const statusMeta = {
    PENDING: { label: "PENDING APPROVAL", cls: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20" },
    VERIFIED: { label: "APPROVED", cls: "bg-green-500/10 text-green-400 border-green-500/20" },
    COMPLETED: { label: "COMPLETED", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
    REJECTED: { label: "REJECTED", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
  }[data.status];

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button asChild variant="outline" size="sm" className="border-white/20">
            <Link href="/admin/investments/fixed-deposite">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-white">Fixed Deposit Request</h2>
            <p className="text-sm text-gray-400 mt-1">Application detail and EMI payout history.</p>
          </div>
        </div>
        <span className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusMeta.cls}`}>
          {statusMeta.label}
        </span>
      </div>

      {/* Applicant Info */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Applicant Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Name</p>
              <p className="text-sm text-white">{data.user.firstName} {data.user.lastName}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Email</p>
              <p className="text-sm text-white">{data.user.email}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Client ID</p>
              <p className="text-sm text-white">{data.user.clientId || "—"}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Applied On</p>
              <p className="text-sm text-white">
                {data.submittedAt
                  ? format(new Date(data.submittedAt), "dd MMM yyyy, hh:mm a")
                  : format(new Date(data.createdAt), "dd MMM yyyy, hh:mm a")}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Plan Details */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Plan Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-slate-500">Deposit Amount</p>
              <p className="text-2xl font-bold text-amber-400">{inr(data.depositAmount)}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-slate-500">Lock-in Period</p>
              <p className="text-2xl font-bold text-white">{data.lockInMonths} months</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-slate-500">Payout Mode</p>
              <p className="text-2xl font-bold text-white capitalize">{data.payoutMode}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-slate-500">EMI Amount</p>
              <p className="text-2xl font-bold text-white">{inr(data.emiAmount)}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-slate-500">Total EMIs</p>
              <p className="text-2xl font-bold text-white">{data.totalEmis}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-slate-500">Total Payout</p>
              <p className="text-2xl font-bold text-emerald-400">{inr(data.totalPayout)}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payout Status */}
      {data.status === "VERIFIED" && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Payout Status</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
                <p className="text-xs text-slate-500">EMIs Paid</p>
                <p className="text-2xl font-bold text-green-400">{data.emisPaid} / {data.totalEmis}</p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
                <p className="text-xs text-slate-500">Next Payout</p>
                <p className="text-sm font-bold text-white">
                  {data.nextPayoutAt
                    ? format(new Date(data.nextPayoutAt), "dd MMM yyyy")
                    : "N/A"}
                </p>
              </div>
              <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
                <p className="text-xs text-slate-500">Last Payout</p>
                <p className="text-sm font-bold text-white">
                  {data.lastPayoutAt
                    ? format(new Date(data.lastPayoutAt), "dd MMM yyyy")
                    : "N/A"}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* EMI History */}
      {data.payouts.length > 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">EMI Payment History</h3>
            <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-12 lg:grid-cols-20">
              {Array.from({ length: data.totalEmis }, (_, i) => {
                const emiNum = i + 1;
                const payout = data.payouts.find((p) => p.emiNumber === emiNum);
                const isPaid = payout?.status === "PAID";

                return (
                  <div
                    key={emiNum}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium ${
                      isPaid
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                    }`}
                    title={`EMI #${emiNum}${isPaid ? " - Paid" : ""}`}
                  >
                    {emiNum}
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Admin Actions */}
      {data.status === "PENDING" && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Admin Actions</h3>
            {!showRejectForm ? (
              <div className="flex gap-3">
                <Button
                  onClick={handleApprove}
                  disabled={actionLoading}
                  className="bg-green-600 hover:bg-green-700 text-white"
                >
                  {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <CheckCircle2 className="h-4 w-4 mr-2" />}
                  Approve (Debit Deposit & Start Payout Cycle)
                </Button>
                <Button
                  onClick={() => setShowRejectForm(true)}
                  variant="outline"
                  className="border-red-500/50 text-red-400 hover:bg-red-500/10"
                >
                  <XCircle className="h-4 w-4 mr-2" />
                  Reject
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                <Input
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  placeholder="Enter rejection reason (min 3 characters)"
                  className="bg-black/40"
                />
                <div className="flex gap-3">
                  <Button
                    onClick={handleReject}
                    disabled={actionLoading || rejectNote.trim().length < 3}
                    className="bg-red-600 hover:bg-red-700 text-white"
                  >
                    {actionLoading ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <XCircle className="h-4 w-4 mr-2" />}
                    Confirm Reject
                  </Button>
                  <Button
                    onClick={() => { setShowRejectForm(false); setRejectNote(""); }}
                    variant="outline"
                    disabled={actionLoading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
}
