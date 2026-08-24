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
  ArrowLeft,
  CheckCircle2,
  XCircle,
  ShieldCheck,
  Mail,
  Phone,
  Loader2,
  AlertCircle,
} from "lucide-react";
import { format } from "date-fns";
import {
  ContactAdminService,
  type ContactMessage,
  type ContactMessageStatus,
} from "@/services/contact-admin.service";

const statusStyles: Record<ContactMessageStatus, string> = {
  NEW: "bg-yellow-500/20 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
  DONE: "bg-green-600/20 text-green-400",
};

function isDoneStatus(status: ContactMessageStatus | null | undefined): status is "DONE" {
  return status === "DONE";
}

const statusLabels: Record<ContactMessageStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function ContactMessageDetailPage() {
  const router = useRouter();
  const params = useParams<{ id: string }>();
  const messageId = params.id;

  const [app, setApp] = useState<ContactMessage | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [rejecting, setRejecting] = useState(false);
  const [deciding, setDeciding] = useState<ContactMessageStatus | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      setApp(await ContactAdminService.getMessage(messageId));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load message");
    } finally {
      setLoading(false);
    }
  }, [messageId]);

  useEffect(() => {
    const timeoutId = setTimeout(() => void load(), 0);
    return () => clearTimeout(timeoutId);
  }, [load]);

  const decide = async (status: ContactMessageStatus) => {
    setDeciding(status);
    try {
      await ContactAdminService.updateStatus(messageId, status, note.trim() || undefined);
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

  const handleDelete = () => {
    setDeleteConfirmOpen(true);
  };

  const confirmDelete = async () => {
    setDeleteConfirmOpen(false);
    try {
      await ContactAdminService.delete(messageId);
      router.push("/admin/contact-us");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to delete message");
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
                Contact message not found
              </h1>
              <p className="text-sm text-red-500">{error}</p>
              <Button
                type="button"
                variant="outline"
                className="border-white/20 text-slate-300"
                onClick={() => router.push("/admin/contact-us")}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Messages
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (!app) return null;

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-4xl mx-auto space-y-5">
        <div className="flex items-center justify-between gap-3">
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-slate-300"
            onClick={() => router.push("/admin/contact-us")}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Messages
          </Button>
          <Badge status={app.status as ContactMessageStatus} />
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="flex items-start justify-between gap-4 mb-6">
              <div className="min-w-0">
                <h1 className="text-2xl font-semibold text-slate-50">
                  Contact Message
                </h1>
                <div className="mt-3 grid gap-2 grid-cols-2 sm:grid-cols-4 max-w-xl">
                  <InfoBlock label="Message ID" value={app.id} />
                  <InfoBlock
                    label="Received"
                    value={
                      app.createdAt
                        ? format(new Date(app.createdAt), "dd MMM yyyy, hh:mm a")
                        : "—"
                    }
                  />
                  <InfoBlock
                    label="Status"
                    value={app.status ? statusLabels[app.status] : "—"}
                  />
                  <InfoBlock
                    label="Updated"
                    value={
                      app.updatedAt
                        ? format(new Date(app.updatedAt), "dd MMM yyyy, hh:mm a")
                        : "—"
                    }
                  />
                </div>
              </div>
              <ShieldCheck className="h-10 w-10 text-indigo-600 shrink-0" />
            </div>

            <div className="space-y-6">
              <Section title="Sender Information" icon={Mail}>
                <Row label="Name" value={app.name} />
                <Row label="Email" value={app.email} icon={<Mail className="h-4 w-4" />} />
                <Row label="Phone" value={app.phone} icon={<Phone className="h-4 w-4" />} />
                <Row label="Service" value={app.service || "Not specified"} />
              </Section>

              <Section title="Message" icon={Mail}>
                <div className="w-auto whitespace-pre-wrap rounded-md border border-neutral-800 bg-black p-4 leading-relaxed text-slate-200 min-h-[120px]">
                  {app.message}
                </div>
              </Section>
            </div>

            {app.reviewNote && (
              <div className="mt-6 rounded-lg border border-amber-500/30 bg-amber-500/10 p-4">
                <p className="text-xs font-semibold text-amber-400 uppercase tracking-wide">
                  Admin Note
                </p>
                <p className="text-sm text-slate-200 mt-1">{app.reviewNote}</p>
              </div>
            )}

            <div className="border-t border-neutral-800 mt-8 pt-6 space-y-4">
              {isDoneStatus(app.status) ? (
                <div className="rounded-xl border border-green-600/40 bg-green-600/10 p-5 space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-5 w-5 text-green-400" />
                    <p className="text-sm font-semibold text-green-400">
                      Message marked as Done
                    </p>
                  </div>
                  <p className="text-sm text-slate-200">
                    This message has been resolved and no further action is needed.
                  </p>
                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-600/40 text-red-400 hover:bg-red-600/10 mt-4"
                    onClick={handleDelete}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Delete
                  </Button>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-end gap-3">
                  <p className="text-sm text-slate-400 sm:mr-auto">
                    Review the message details before deciding.
                  </p>

                  <Button
                    type="button"
                    variant="outline"
                    className="border-red-600/40 text-red-400 hover:bg-red-600/10"
                    disabled={deciding !== null}
                    onClick={handleDelete}
                  >
                    <XCircle className="mr-2 h-4 w-4" />
                    Delete
                  </Button>

                  <Button
                    type="button"
                    variant="default"
                    className="bg-green-600 hover:bg-green-700 text-white"
                    disabled={deciding !== null}
                    onClick={() => decide("DONE")}
                  >
                    <CheckCircle2 className="mr-2 h-4 w-4" />
                    Mark as Done
                  </Button>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="border-neutral-800 bg-neutral-950">
          <DialogHeader>
            <DialogTitle>Delete this message?</DialogTitle>
            <DialogDescription className="text-slate-400">
              This action cannot be undone. The message will be permanently removed.
            </DialogDescription>
          </DialogHeader>
          <div className="flex justify-end gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              className="border-white/20 text-slate-300"
              onClick={() => setDeleteConfirmOpen(false)}
            >
              Cancel
            </Button>
            <Button
              type="button"
              className="bg-red-600 hover:bg-red-700 text-white"
              onClick={confirmDelete}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Badge({ status }: { status: ContactMessageStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {statusLabels[status]}
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

function Row({
  label,
  value,
  icon,
}: {
  label: string;
  value: React.ReactNode;
  icon?: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 py-1 border-b border-neutral-900 last:border-0">
      <span className="text-sm text-slate-400 shrink-0 flex items-center gap-2">
        {icon}
        {label}
      </span>
      <span className="text-sm text-slate-100 text-right break-all">
        {value || "—"}
      </span>
    </div>
  );
}