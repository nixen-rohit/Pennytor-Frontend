"use client";

import { useEffect, useState } from "react";
import { format } from "date-fns";
import { Eye, FileText, Loader2, Mail, Phone, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  ContactAdminService,
  type ContactMessage,
} from "@/services/contact-admin.service";

const PAGE_SIZE = 20;

export default function ContactList() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedMessage, setSelectedMessage] =
    useState<ContactMessage | null>(null);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await ContactAdminService.list(page, PAGE_SIZE);
        if (cancelled) return;
        setItems(response.items);
        setTotal(response.total);
        setError("");
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error ? err.message : "Failed to load messages",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [page]);

  const filteredItems = items.filter((item) => {
    const query = search.trim().toLowerCase();
    if (!query) return true;
    return [item.name, item.email, item.phone, item.message]
      .join(" ")
      .toLowerCase()
      .includes(query);
  });
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contact Messages</h1>
          <p className="mt-1 text-sm text-gray-400">
            Review messages submitted through the contact form.
          </p>
        </div>

        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" />
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search messages"
            className="w-full rounded-full border border-neutral-700 bg-neutral-950 py-2 pl-9 pr-4 text-sm text-slate-100 placeholder:text-slate-600 focus:border-indigo-500 focus:outline-none"
          />
        </div>

        <div className="overflow-hidden rounded-lg border border-neutral-800 bg-neutral-950">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
            </div>
          ) : error ? (
            <p className="py-16 text-center text-sm text-red-400">{error}</p>
          ) : filteredItems.length === 0 ? (
            <div className="space-y-3 py-16 text-center">
              <FileText className="mx-auto h-10 w-10 text-slate-600" />
              <p className="text-sm text-slate-400">No contact messages found.</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-sm">
                <thead>
                  <tr className="border-b border-neutral-800 text-xs uppercase tracking-wide text-slate-500">
                    <th className="px-5 py-3">Name</th>
                    <th className="px-5 py-3">Contact</th>
                    <th className="px-5 py-3">Message</th>
                    <th className="px-5 py-3">Received</th>
                    <th className="px-5 py-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredItems.map((item) => (
                    <tr
                      key={item.id}
                      className="border-b border-neutral-900 last:border-0 hover:bg-neutral-900/40"
                    >
                      <td className="px-5 py-3.5 font-medium text-slate-100">
                        {item.name}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">
                        <p>{item.email}</p>
                        <p className="text-xs text-slate-500">{item.phone}</p>
                      </td>
                      <td className="max-w-sm truncate px-5 py-3.5 text-slate-300">
                        {item.message}
                      </td>
                      <td className="whitespace-nowrap px-5 py-3.5 text-slate-300">
                        {format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <Button
                          size="sm"
                          className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                          onClick={() => setSelectedMessage(item)}
                        >
                          <Eye className="h-4 w-4" />
                          Review
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between">
          <p className="text-xs text-slate-500">
            {total} message{total === 1 ? "" : "s"}
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-slate-300"
              disabled={page <= 1 || loading}
              onClick={() => setPage((currentPage) => currentPage - 1)}
            >
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-white/20 text-slate-300"
              disabled={page >= totalPages || loading}
              onClick={() => setPage((currentPage) => currentPage + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <Dialog
        open={selectedMessage !== null}
        onOpenChange={(open) => {
          if (!open) setSelectedMessage(null);
        }}
      >
        <DialogContent className="border-neutral-800 bg-neutral-950 text-white">
          <DialogHeader>
            <DialogTitle>Contact Message</DialogTitle>
            <DialogDescription className="text-slate-400">
              Review the details submitted by this visitor.
            </DialogDescription>
          </DialogHeader>
          {selectedMessage && (
            <div className="space-y-5 text-sm">
              <div className="grid gap-3 sm:grid-cols-2">
                <Detail label="Name" value={selectedMessage.name} />
                <Detail
                  label="Service"
                  value={selectedMessage.service || "Not specified"}
                />
                <Detail
                  label="Email"
                  value={selectedMessage.email}
                  icon={<Mail className="h-4 w-4" />}
                />
                <Detail
                  label="Phone"
                  value={selectedMessage.phone}
                  icon={<Phone className="h-4 w-4" />}
                />
              </div>
              <div>
                <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">
                  Message
                </p>
                <p className="whitespace-pre-wrap rounded-md border border-neutral-800 bg-black p-3 leading-relaxed text-slate-200">
                  {selectedMessage.message}
                </p>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}

function Detail({
  label,
  value,
  icon,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
}) {
  return (
    <div>
      <p className="mb-1 text-xs uppercase tracking-wide text-slate-500">{label}</p>
      <p className="flex items-center gap-2 break-all text-slate-200">
        {icon}
        {value}
      </p>
    </div>
  );
}
