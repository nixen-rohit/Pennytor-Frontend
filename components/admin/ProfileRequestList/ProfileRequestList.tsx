"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
import {
  Search,
  ChevronUp,
  ChevronDown, 
  ClipboardList,
  CalendarClock,
} from "lucide-react";
import { format } from "date-fns";

import {
  initialProfileRequests,
  type ProfileRequest,
  type ReviewStatus,
} from "./types";
import { Pagination } from "./Pagination";

type SortOrder = "asc" | "desc";

const PAGE_SIZE = 5;

const statusStyles: Record<ReviewStatus, string> = {
  PENDING: "bg-yellow-500/20 text-yellow-400",
  APPROVED: "bg-green-600/20 text-green-400",
  REJECTED: "bg-red-600/20 text-red-400",
};

export default function ProfileRequestList() {
  const router = useRouter();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<"all" | ReviewStatus>("all");
  const [sortOrder, setSortOrder] = useState<SortOrder>("desc");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredRequests = useMemo(() => {
    const query = searchTerm.trim().toLowerCase();
    return initialProfileRequests
      .filter((req) => {
        const matchesSearch =
          !query ||
          req.email.toLowerCase().includes(query) ||
          req.clientId.toLowerCase().includes(query);
        const matchesStatus =
          statusFilter === "all" || req.status === statusFilter;
        return matchesSearch && matchesStatus;
      })
      .sort((a, b) =>
        sortOrder === "asc"
          ? a.submittedAt.getTime() - b.submittedAt.getTime()
          : b.submittedAt.getTime() - a.submittedAt.getTime(),
      );
  }, [searchTerm, statusFilter, sortOrder]);

  const totalPages = Math.max(1, Math.ceil(filteredRequests.length / PAGE_SIZE));
  const startIndex = (currentPage - 1) * PAGE_SIZE;
  const endIndex = startIndex + PAGE_SIZE;
  const currentRequests = filteredRequests.slice(startIndex, endIndex);

  const handleSearchChange = (value: string) => {
    setSearchTerm(value);
    setCurrentPage(1);
  };

  const handleStatusChange = (value: "all" | ReviewStatus) => {
    setStatusFilter(value);
    setCurrentPage(1);
  };

  const toggleSortOrder = () => {
    setSortOrder((prev) => (prev === "asc" ? "desc" : "asc"));
    setCurrentPage(1);
  };

  const openReview = (request: ProfileRequest) => {
    router.push(`/admin/request/profile/${request.id}`);
  };

  return (
    <div className="min-h-screen p-4 bg-black">
      <div className="max-w-7xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            Profile Requests
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Review and verify KYC profile requests from users.
          </p>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-0">
            <div className="p-4 md:p-6 border-b border-neutral-800">
              <div className=" flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
                <div className="relative w-full lg:w-96">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                    type="text"
                    placeholder="Search by email or client ID..."
                    value={searchTerm}
                    onChange={(e) => handleSearchChange(e.target.value)}
                    className="pl-10 focus-visible:ring-indigo-500"
                  />
                </div>

                <div className="bg-black flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full lg:w-auto">
                  <Select
                    value={statusFilter}
                    onValueChange={(v) => handleStatusChange(v as "all" | ReviewStatus)}
                  >
                    <SelectTrigger className="w-full sm:w-[180px] bg-black border-white/20">
                      <SelectValue placeholder="All Status" />
                    </SelectTrigger>
                    <SelectContent className="bg-black border-white/20">
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="PENDING">Pending</SelectItem>
                      <SelectItem value="APPROVED">Approved</SelectItem>
                      <SelectItem value="REJECTED">Rejected</SelectItem>
                    </SelectContent>
                  </Select>

                  <Button
                    type="button"
                    variant="outline"
                    onClick={toggleSortOrder}
                    className="border-white/20 text-slate-300 w-full sm:w-auto"
                  >
                    {sortOrder === "asc" ? (
                      <ChevronUp className="mr-2 h-4 w-4" />
                    ) : (
                      <ChevronDown className="mr-2 h-4 w-4" />
                    )}
                    Date & Time
                  </Button>
                </div>
              </div>
            </div>

            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-neutral-900/50 hover:bg-neutral-900/50">
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Client ID
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      User
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Email
                    </TableHead>
                    <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                      Submitted On
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
                  {currentRequests.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="h-64 text-center">
                        <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                          <div className="p-3 rounded-full bg-neutral-800">
                            <ClipboardList className="h-8 w-8 text-slate-400" />
                          </div>
                          <p className="text-sm font-medium text-slate-500">
                            No profile requests found
                          </p>
                        </div>
                      </TableCell>
                    </TableRow>
                  ) : (
                    currentRequests.map((req) => (
                      <TableRow
                        key={req.id}
                        className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors cursor-pointer"
                        onClick={() => openReview(req)}
                      >
                        <TableCell className="py-3 font-mono text-sm text-indigo-400">
                          {req.clientId}
                        </TableCell>
                        <TableCell className="py-3">
                          <p className="font-medium text-slate-200">
                            {req.fullName}
                          </p>
                          <p className="text-xs text-slate-500">
                            {req.phone}
                          </p>
                        </TableCell>
                        <TableCell className="py-3 text-slate-400">
                          {req.email}
                        </TableCell>
                        <TableCell className="py-3">
                          <span className="inline-flex items-center gap-1.5 text-slate-400">
                            <CalendarClock className="h-3.5 w-3.5" />
                            {format(req.submittedAt, "dd MMM yyyy, hh:mm a")}
                          </span>
                        </TableCell>
                        <TableCell className="py-3">
                          <StatusBadge status={req.status} />
                        </TableCell>
                        <TableCell className="py-3 text-right">
                          <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            className="bg-blue-800 text-white hover:bg-blue-600 border-white/20"
                            onClick={(e) => {
                              e.stopPropagation();
                              openReview(req);
                            }}
                          >
                             
                            Review
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>

            <div className="p-4 md:p-6 border-t border-neutral-800 flex items-center justify-between">
              <p className="text-sm text-slate-400">
                Showing {filteredRequests.length === 0 ? 0 : startIndex + 1} to{" "}
                {Math.min(endIndex, filteredRequests.length)} of{" "}
                {filteredRequests.length} requests
              </p>
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={setCurrentPage}
              />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

function StatusBadge({ status }: { status: ReviewStatus }) {
  return (
    <span
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusStyles[status]}`}
    >
      {status}
    </span>
  );
}