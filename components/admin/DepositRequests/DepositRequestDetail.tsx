"use client";

import { useCallback, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Download,
  Loader2,
  AlertCircle,
  Landmark,
  FileText,
  Copy as IconCopy,
  Check as IconCheck,
  Trash2,
  ChevronDown,
  Image,
  History,
} from "lucide-react";
import { format } from "date-fns";
import {
  DepositAdminService,
  DepositRequestDetail,
} from "@/services/deposit-admin.service";
import { useApproveFinanceTransaction, useRejectFinanceTransaction } from "@/hooks/use-finance";
import type { DepositStatus } from "@/services/deposit.service";

const statusStyles: Record<DepositStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  UNDER_REVIEW: "bg-blue-500/20 text-blue-400",
  VERIFIED: "bg-green-600/20 text-green-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

export default function DepositRequestDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const requestId = params.id;

  const [app, setApp] = useState<DepositRequestDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [deciding, setDeciding] = useState<DepositStatus | null>(null);
  const [deleteType, setDeleteType] = useState<"image" | "history" | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const { approve, error: approveError } = useApproveFinanceTransaction("deposit");
  const { reject, error: rejectError } = useRejectFinanceTransaction("deposit");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setApp(await DepositAdminService.getDeposit(requestId));
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

  const decide = async (status: DepositStatus) => {
    setDeciding(status);
    try {
      if (status === "VERIFIED") {
        const ok = await approve(requestId);
        if (!ok) {
          setError(approveError ?? "Failed to approve");
          return;
        }
      } else if (status === "REJECTED") {
        const ok = await reject(requestId, note.trim());
        if (!ok) {
          setError(rejectError ?? "Failed to reject");
          return;
        }
      } else {
        await DepositAdminService.updateStatus(
          requestId,
          status,
          note.trim() || undefined,
        );
      }
      await load();
      setRejecting(false);
      setNote("");
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setDeciding(null);
    }
  };

  const handleDeleteClick = (type: "image" | "history") => {
    setDeleteType(type);
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    if (!deleteType) return;
    setDeleting(true);
    try {
      if (deleteType === "image") {
        await DepositAdminService.deleteFile(requestId);
      } else {
        await DepositAdminService.deleteDeposit(requestId);
        router.push("/admin/finance/deposite-request");
        return;
      }
      await load();
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete");
    } finally {
      setDeleting(false);
      setDeleteConfirmOpen(false);
      setDeleteType(null);
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
      <div className="min-h-screen p-4 bg-black">
        <div className="max-w-3xl mx-auto space-y-5">
          <Card className="shadow-sm">
            <CardContent className="p-6 text-center space-y-4">
              <ShieldCheck className="mx-auto h-12 w-12 text-red-400" />
              <h1 className="text-xl font-semibold text-slate-50">
                Deposit request not found
              </h1>
              <p className="text-sm text-red-500">{error}</p>
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-slate-300"
                onClick={() => router.push("/admin/finance/deposite-request")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Requests
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!app) return null;

  const currencyAmount = `₹${app.amount}`;

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-slate-300"
            onClick={() => router.push("/admin/finance/deposite-request")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Requests
          </Button>
         <div className="text-center h-10 w-auto border border-white/20  rounded-md flex   items-center justify-center">
            <h2 className="p-2 text-white ">Deposit Status : </h2>
            <div className="p-2">
              <Badge status={app.status} />
            </div>
          </div>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                variant="outline"
                className="border-red-600/40 text-red-400 hover:bg-red-600/10"
              >
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
                <ChevronDown className="ml-2 h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="border-neutral-800 bg-neutral-950">
              <DropdownMenuItem
                className="text-slate-300 focus:bg-red-600/20 focus:text-red-400 cursor-pointer"
                onClick={() => handleDeleteClick("image")}
              >
                <Image className="mr-2 h-4 w-4" />
                Delete Image
              </DropdownMenuItem>
              <DropdownMenuItem
                className="text-slate-300 focus:bg-red-600/20 focus:text-red-400 cursor-pointer"
                onClick={() => handleDeleteClick("history")}
              >
                <History className="mr-2 h-4 w-4" />
                Delete History
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-slate-50">
                  Deposit Request
                </h1>
                <div className="mt-3 grid gap-2 grid-cols-2 sm:grid-cols-4 max-w-xl">
                  <InfoBlock label="Client ID" value={app.clientId ?? "—"} />
                  <InfoBlock label="Request ID" value={app.id} />
                  <InfoBlock
                    label="Submitted"
                    value={
                      app.submittedAt
                        ? format(
                            new Date(app.submittedAt),
                            "dd MMM yyyy, hh:mm a",
                          )
                        : "—"
                    }
                  />
                  <div className="rounded-lg border border-indigo-500/30 bg-indigo-600/10 px-3 py-2">
                    <p className="text-[10px] font-semibold uppercase tracking-wider text-indigo-400">
                      Current Balance
                    </p>
                    <p className="mt-0.5 font-mono text-sm text-indigo-200">
                      ₹{Number(app.currentBalance).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </p>
                  </div>
                </div>
              </div>
              <ShieldCheck className="h-10 w-10 text-indigo-600 shrink-0" />
            </div>

            <div className="space-y-6">
              <Section title="Request Details" icon={Landmark}>
                <Row
                  label="Amount"
                  value={
                    <span className="font-mono text-emerald-400">
                      {currencyAmount}
                    </span>
                  }
                />
                <Row
                  label="Transaction ID"
                  value={<span className="font-mono text-slate-300">{app.transactionId}</span>}
                  copyValue={app.transactionId}
                />
                <Row
                  label="Applicant"
                  value={
                    app.user
                      ? `${app.user.firstName} ${app.user.lastName}`
                      : "—"
                  }
                />
                <Row label="Email" value={app.user?.email ?? "—"} />
                <Row label="Client ID" value={app.clientId ?? "—"} />
                <Row
                  label="Current Wallet Balance"
                  value={
                    <span className="font-mono text-indigo-300">
                      ₹
                      {Number(app.currentBalance).toLocaleString("en-IN", {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2,
                      })}
                    </span>
                  }
                />
                <Row
                  label="Reviewed at"
                  value={
                    app.reviewedAt
                      ? format(new Date(app.reviewedAt), "dd MMM yyyy, hh:mm a")
                      : "—"
                  }
                />
              </Section>

              <Section title="Payment Screenshot" icon={FileText}>
                <div className="flex flex-col sm:flex-row gap-4 items-start">
                  <img
                    src={DepositAdminService.fileUrl(app.id)}
                    alt="Payment screenshot"
                    className="max-h-72 rounded-lg border border-neutral-700 bg-neutral-900 object-contain"
                  />
                  <a
                    href={DepositAdminService.downloadUrl(app.id)}
                    className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300"
                    title="Download screenshot"
                  >
                    <Download className="h-4 w-4" />
                    Download ({app.file.originalName})
                  </a>
                </div>
              </Section>
            </div>

            {app.reviewNote && (
              <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  {app.status === "REJECTED" ? "Rejection Reason" : "Review Note"}
                </p>
                <p className="text-sm text-slate-200 mt-1">{app.reviewNote}</p>
              </div>
            )}

            <div className="border-t border-neutral-800 mt-8 pt-6 space-y-4">
              {app.status === "VERIFIED" ? (
                <div className="rounded-xl border border-green-600/40 bg-green-600/10 p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <p className="text-sm font-semibold text-green-400">
                      Request closed
                    </p>
                  </div>
                  <p className="text-sm text-slate-200">
                    This deposit of ₹
                    {Number(app.amount).toLocaleString("en-IN", {
                      minimumFractionDigits: 2,
                      maximumFractionDigits: 2,
                    })}{" "}
                    was approved
                    {app.reviewedAt
                      ? ` on ${format(
                          new Date(app.reviewedAt),
                          "dd MMM yyyy, hh:mm a",
                        )}`
                      : ""}{" "}
                    and credited to the user's wallet. It is recorded in the
                    Deposit Reports and the user's transaction history.
                  </p>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                <p className="text-sm text-slate-400 sm:mr-auto">
                  Verify the screenshot and transaction id before deciding.
                </p>
                 
                <Button
                  type="button"
                  variant={app.status === "REJECTED" ? "default" : "outline"}
                  className={
                    app.status === "REJECTED"
                      ? "bg-red-600 text-white ring-2 ring-red-400/50 cursor-not-allowed"
                      : "border-red-600/40 text-red-400 hover:bg-red-600/10"
                  }
                  disabled={deciding !== null || app.status === "REJECTED"}
                  onClick={() => {
                    setNote("");
                    setRejecting(true);
                  }}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {app.status === "REJECTED" ? "Rejected" : "Reject"}
                </Button>
                <Button
                  type="button"
                  className="bg-green-600 hover:bg-green-700 text-white"
                  disabled={deciding !== null || app.status === "REJECTED"}
                  onClick={() => decide("VERIFIED")}
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Approve
                </Button>
              </div>
              )}

              {rejecting && (
                <div className="rounded-lg border border-red-600/40 bg-red-600/5 p-4 space-y-3 animate-in fade-in-0 zoom-in-95 duration-200">
                  <div className="space-y-1.5">
                    <label className="text-sm text-slate-400">
                      Note for this decision{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      rows={2}
                      value={note}
                      autoFocus
                      onChange={(e) => setNote(e.target.value)}
                      placeholder="e.g. Transaction id does not match the screenshot"
                      className="w-full rounded-md border border-neutral-700 bg-neutral-950 px-3 py-2 text-sm text-slate-100 placeholder:text-slate-600"
                    />
                    <p className="text-xs text-slate-500">
                      Required — this reason is stored and shown to the user.
                    </p>
                  </div>
                  <div className="flex justify-end gap-3">
                    <Button
                      type="button"
                      variant="outline"
                      className="border-white/20 text-slate-300"
                      disabled={deciding !== null}
                      onClick={() => setRejecting(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="button"
                      className="bg-red-600 hover:bg-red-700 text-white"
                      disabled={deciding !== null || !note.trim()}
                      onClick={() => decide("REJECTED")}
                    >
                      {deciding === "REJECTED" ? (
                        <Spinner />
                      ) : (
                        <XCircle className="mr-2 h-4 w-4" />
                      )}
                      Confirm Reject
                    </Button>
                  </div>
                </div>
              )}

              {error && (
                <div className="flex items-start gap-2 rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-400">
                  <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
                  <span>{error}</span>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="border-neutral-800 bg-neutral-950">
          <DialogHeader>
            <DialogTitle>
              {deleteType === "image" ? "Delete this screenshot?" : "Delete this deposit record?"}
            </DialogTitle>
            <DialogDescription className="text-slate-400">
              {deleteType === "image"
                ? "This will remove the payment screenshot. The deposit record will remain but without an image."
                : "This action cannot be undone. The entire deposit record and its screenshot will be permanently removed."}
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-slate-300"
              disabled={deleting}
              onClick={() => {
                setDeleteConfirmOpen(false);
                setDeleteType(null);
              }}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              disabled={deleting}
              onClick={confirmDelete}
            >
              {deleting ? (
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              ) : (
                <Trash2 className="mr-2 h-4 w-4" />
              )}
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Spinner() {
  return <Loader2 className="mr-2 h-4 w-4 animate-spin inline" />;
}

function Badge({ status }: { status: DepositStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status.replace("_", " ")}
    </span>
  );
}

function InfoBlock({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950/50 px-3 py-2">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-slate-500">
        {label}
      </p>
      <p
        className="mt-0.5 font-mono text-sm text-slate-100 truncate"
        title={value}
      >
        {value}
      </p>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ElementType;
  children: React.ReactNode;
}) {
  return (
    <div className="rounded-xl border border-neutral-800 bg-neutral-950/50 p-4">
      <div className="flex items-center gap-2 mb-3">
        <Icon className="h-4 w-4 text-indigo-500" />
        <h4 className="text-sm font-semibold text-indigo-500">{title}</h4>
      </div>
      <div className="grid gap-x-8 gap-y-2 grid-cols-1 sm:grid-cols-2">
        {children}
      </div>
    </div>
  );
}

function Row({ label, value, copyValue }: { label: string; value: React.ReactNode; copyValue?: string }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 border-b border-neutral-900 last:border-0">
      <span className="text-sm text-slate-400 shrink-0">{label}</span>
      <div className="flex items-center gap-2 text-right">
        <span className="text-sm text-slate-100 break-all">{value || "—"}</span>
        {copyValue && (
          <CopyButton value={copyValue} />
        )}
      </div>
    </div>
  );
}

function CopyButton({ value }: { value: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value]);

  return (
    <button
      type="button"
      onClick={handleCopy}
      className="flex shrink-0 items-center gap-1 rounded-md border border-neutral-700 px-2 py-1 text-xs text-slate-400 transition hover:border-neutral-600 hover:text-slate-200"
      title="Copy to clipboard"
    >
      {copied ? (
        <>
          <IconCheck className="h-3.5 w-3.5 text-emerald-400" />
          <span className="text-emerald-400">Copied</span>
        </>
      ) : (
        <>
          <IconCopy className="h-3.5 w-3.5" />
          Copy
        </>
      )}
    </button>
  );
}