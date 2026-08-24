"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { FileText, Loader2, Mail, Phone, Search, ArrowRight } from "lucide-react";
import {
  ContactAdminService,
  type ContactMessage,
  type ContactMessageStatus,
} from "@/services/contact-admin.service";
import { Pagination } from "@/components/admin/Finance/Pagination";

const ENTRY_OPTIONS = ["5", "10", "15", "20"];

const STATUS_FILTERS: Array<{ label: string; value?: ContactMessageStatus }> = [
  { label: "All" },
  { label: "New", value: "NEW" },
  { label: "Done", value: "DONE" },
];

const statusStyles: Record<ContactMessageStatus, string> = {
  NEW: "bg-yellow-500/20 text-yellow-400",
  IN_PROGRESS: "bg-blue-500/20 text-blue-400",
  DONE: "bg-green-600/20 text-green-400",
};

const statusLabels: Record<ContactMessageStatus, string> = {
  NEW: "New",
  IN_PROGRESS: "In Progress",
  DONE: "Done",
};

export default function ContactList() {
  const [items, setItems] = useState<ContactMessage[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [entriesPerPage, setEntriesPerPage] = useState("5");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<ContactMessageStatus | undefined>(undefined);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const pageSize = parseInt(entriesPerPage);

  useEffect(() => {
    let cancelled = false;

    const loadMessages = async () => {
      setLoading(true);
      try {
        const response = await ContactAdminService.list(page, pageSize);
        if (cancelled) return;
        let filteredItems = response.items;
        
        if (statusFilter) {
          filteredItems = filteredItems.filter((item) => item.status === statusFilter);
        }
        
        setItems(filteredItems);
        setTotal(response.pagination?.total ?? response.total);
        setError("");
      } catch (err) {
        if (!cancelled) {
          setError(err instanceof Error ? err.message : "Failed to load messages");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadMessages();
    return () => {
      cancelled = true;
    };
  }, [page, statusFilter, pageSize]);

  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const startIndex = (page - 1) * pageSize;
  const endIndex = Math.min(startIndex + pageSize, total);

  return (
    <div className="min-h-screen bg-black p-4">
      <div className="mx-auto max-w-7xl space-y-5">
        <div>
          <h1 className="text-2xl font-semibold text-white">Contact Messages</h1>
          <p className="mt-1 text-sm text-gray-400">
            Review messages submitted through the contact form.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
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
          {STATUS_FILTERS.map((f) => (
            <button
              key={f.label}
              type="button"
              onClick={() => {
                setStatusFilter(f.value);
                setPage(1);
              }}
              className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors border ${
                statusFilter === f.value
                  ? "bg-indigo-600 text-white border-indigo-600"
                  : "border-neutral-700 text-slate-300 hover:border-indigo-500"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <span>Show</span>
                <Select
                  value={entriesPerPage}
                  onValueChange={(v) => {
                    setEntriesPerPage(v);
                    setPage(1);
                  }}
                >
                  <SelectTrigger className="w-[70px] h-8 bg-black">
                    <SelectValue placeholder="5" />
                  </SelectTrigger>
                  <SelectContent>
                    {ENTRY_OPTIONS.map((n) => (
                      <SelectItem key={n} value={n}>
                        {n}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <span>entries</span>
              </div>
              <div className="text-sm text-slate-400">
                {loading ? (
                  "Loading..."
                ) : (
                  <>
                    Showing {total === 0 ? 0 : startIndex + 1} to {endIndex} of{" "}
                    {total} entries
                  </>
                )}
              </div>
            </div>

            {loading ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="h-6 w-6 animate-spin text-indigo-500" />
              </div>
            ) : error ? (
              <p className="py-16 text-center text-sm text-red-500">{error}</p>
            ) : items.length === 0 ? (
              <div className="py-16 text-center space-y-3">
                <FileText className="mx-auto h-10 w-10 text-slate-600" />
                <p className="text-sm text-slate-400">No contact messages found.</p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow className="bg-neutral-900/50 hover:bg-neutral-900/50">
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                        Name
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                        Email
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                        Received
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                        Status
                      </TableHead>
                      <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3 text-right">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {items.map((item) => (
                      <TableRow
                        key={item.id}
                        className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors"
                      >
                        <TableCell className="py-3 font-medium text-slate-100">
                          {item.name}
                        </TableCell>
                        <TableCell className="py-3 text-slate-300">
                          {item.email}
                        </TableCell>
                        <TableCell className="py-3 whitespace-nowrap text-slate-300">
                          {format(new Date(item.createdAt), "dd MMM yyyy, hh:mm a")}
                        </TableCell>
                        <TableCell className="py-3">
                          {item.status && (
                            <span
                              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[item.status]}`}
                            >
                              {statusLabels[item.status]}
                            </span>
                          )}
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Link href={`/admin/contact-us/${item.id}`}>
                            <Button
                              size="sm"
                              className="gap-2 bg-indigo-600 text-white hover:bg-indigo-700"
                            >
                              <ArrowRight className="h-4 w-4" />
                              Review
                            </Button>
                          </Link>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}

            {!loading && !error && totalPages > 1 && (
              <Pagination
                currentPage={page}
                totalPages={totalPages}
                onPageChange={setPage}
              />
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
