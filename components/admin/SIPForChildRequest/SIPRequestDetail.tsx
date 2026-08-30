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
  AlertCircle,
  Calendar,
  Wallet,
  Clock,
} from "lucide-react";
import { format } from "date-fns";
import {
  SIPForChildAdminService,
  type SIPForChildRequestDetail,
} from "@/services/sip-for-child-admin.service";

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export default function SIPRequestDetail() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const id = params?.id;
  const [data, setData] = useState<SIPForChildRequestDetail | null>(null);
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
    SIPForChildAdminService.detail(id)
      .then((res) => {
        if (!cancelled) setData(res);
      })
      .catch((err) => {
        if (!cancelled) setError(err instanceof Error ? err.message : "Failed to load");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [id]);

  const handleApprove = async () => {
    if (!id) return;
    setActionLoading(true);
    try {
      await SIPForChildAdminService.approve(id);
      router.refresh();
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
      await SIPForChildAdminService.reject(id, rejectNote);
      router.refresh();
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
    REJECTED: { label: "REJECTED", cls: "bg-red-500/10 text-red-400 border-red-500/20" },
    COMPLETED: { label: "COMPLETED", cls: "bg-blue-500/10 text-blue-400 border-blue-500/20" },
  }[data.status];

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button
            asChild
            variant="outline"
            size="sm"
            className="border-white/20"
          >
            <Link href="/admin/investments/sip">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Link>
          </Button>
          <div>
            <h2 className="text-2xl font-semibold text-white">
              SIP for Child Request
            </h2>
            <p className="text-sm text-gray-400 mt-1">
              Application detail and premium payment history.
            </p>
          </div>
        </div>
        <span
          className={`inline-flex items-center rounded-full border px-3 py-1 text-sm font-medium ${statusMeta.cls}`}
        >
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
              <p className="text-xs text-slate-500">KYC Status</p>
              <p className="text-sm text-white">{data.kycStatus || "—"}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Scheme Info */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Scheme Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-slate-500">Scheme</p>
              <p className="text-sm text-white">{data.schemeInfo.name}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Monthly Premium</p>
              <p className="text-sm text-white">{inr(data.schemeInfo.monthlyInvestment)}</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Annual Return</p>
              <p className="text-sm text-white">{data.schemeInfo.annualReturn}%</p>
            </div>
            <div>
              <p className="text-xs text-slate-500">Total Months</p>
              <p className="text-sm text-white">{data.totalMonths}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Payment Status */}
      <Card className="shadow-sm">
        <CardContent className="p-6">
          <h3 className="text-lg font-semibold text-white mb-4">Payment Status</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-slate-500">Months Paid</p>
              <p className="text-2xl font-bold text-green-400">{data.monthsPaid} / {data.totalMonths}</p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-red-500">Months Missed</p>
              <p className={`text-2xl font-bold ${data.monthsMissed >= 3 ? 'text-red-400' : 'text-yellow-400'}`}>
                {data.monthsMissed} / 3
              </p>
            </div>
            <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 p-4">
              <p className="text-xs text-slate-500">Next Payment Due</p>
              <p className="text-sm font-bold text-white">
                {data.nextPaymentDue
                  ? format(new Date(data.nextPaymentDue), "dd MMM yyyy")
                  : "N/A"}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Premium History */}
      {data.premiums.length > 0 && (
        <Card className="shadow-sm">
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold text-white mb-4">Premium Payment History</h3>
            <div className="grid grid-cols-10 gap-1.5 sm:grid-cols-12 lg:grid-cols-20">
              {Array.from({ length: data.totalMonths }, (_, i) => {
                const monthNum = i + 1;
                const premium = data.premiums.find((p) => p.monthNumber === monthNum);
                const isPaid = premium?.status === "PAID";
                const isMissed = premium?.status === "MISSED";

                return (
                  <div
                    key={monthNum}
                    className={`flex h-8 w-8 items-center justify-center rounded-md text-xs font-medium ${
                      isPaid
                        ? "bg-green-500/20 text-green-400 border border-green-500/30"
                        : isMissed
                          ? "bg-red-500/20 text-red-400 border border-red-500/30"
                          : "bg-zinc-900 text-zinc-600 border border-zinc-800"
                    }`}
                    title={`Month ${monthNum}${isPaid ? " - Paid" : isMissed ? " - Missed" : ""}`}
                  >
                    {monthNum}
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
                  {actionLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <CheckCircle2 className="h-4 w-4 mr-2" />
                  )}
                  Approve
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
                    {actionLoading ? (
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    ) : (
                      <XCircle className="h-4 w-4 mr-2" />
                    )}
                    Confirm Reject
                  </Button>
                  <Button
                    onClick={() => {
                      setShowRejectForm(false);
                      setRejectNote("");
                    }}
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
