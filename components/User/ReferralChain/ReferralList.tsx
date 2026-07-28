import { useState } from "react";
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
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import {
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Users as UsersIcon,
} from "lucide-react";
import { format } from "date-fns";
import { ReferralState } from "@/components/User/ReferralChain/types";

interface Props {
  data: ReferralState;
}

export function ReferralList({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeFilter, setActiveFilter] = useState("all");
  const [approvedFilter, setApprovedFilter] = useState("all");
  const [kycFilter, setKycFilter] = useState("all");
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const activeFilterCount =
    (activeFilter !== "all" ? 1 : 0) +
    (approvedFilter !== "all" ? 1 : 0) +
    (kycFilter !== "all" ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const users = data.referrals;

  const filteredUsers = users.filter((user) => {
    const matchesSearch =
      user.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesActive =
      activeFilter === "all" ||
      (activeFilter === "active" && user.isActive) ||
      (activeFilter === "inactive" && !user.isActive);

    const matchesApproved =
      approvedFilter === "all" ||
      (approvedFilter === "approved" && user.isApproved) ||
      (approvedFilter === "unapproved" && !user.isApproved);

    const matchesKyc =
      kycFilter === "all" || user.kycStatus.toLowerCase() === kycFilter;

    return matchesSearch && matchesActive && matchesApproved && matchesKyc;
  });

  const totalPages = Math.ceil(filteredUsers.length / parseInt(entriesPerPage));
  const startIndex = (currentPage - 1) * parseInt(entriesPerPage);
  const endIndex = startIndex + parseInt(entriesPerPage);
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const clearFilters = () => {
    setActiveFilter("all");
    setApprovedFilter("all");
    setKycFilter("all");
    setCurrentPage(1);
  };

  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pages.push(1);
        pages.push("...");
        for (let i = totalPages - 3; i <= totalPages; i++) pages.push(i);
      } else {
        pages.push(1);
        pages.push("...");
        for (let i = currentPage - 1; i <= currentPage + 1; i++) pages.push(i);
        pages.push("...");
        pages.push(totalPages);
      }
    }
    return pages;
  };

  return (
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="My Referrals" />
      <p className="text-sm text-slate-400 -mt-4">
        View and manage users you have referred
      </p>

      {/* Filter dialog */}
      <Dialog open={openFilterDialog} onOpenChange={setOpenFilterDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Filter Referrals</DialogTitle>
            <DialogDescription>
              Apply filters to narrow down referral records.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label>Status</Label>
              <Select value={activeFilter} onValueChange={setActiveFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>Approval</Label>
              <Select value={approvedFilter} onValueChange={setApprovedFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="unapproved">Unapproved</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label>KYC Status</Label>
              <Select value={kycFilter} onValueChange={setKycFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All</SelectItem>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="verified">Verified</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button onClick={() => setOpenFilterDialog(false)}>
              Apply Filters
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search Name or Email..."
            value={searchTerm}
            onChange={(e) => { setSearchTerm(e.target.value); setCurrentPage(1); }}
            className="pl-10 focus-visible:ring-indigo-500"
          />
        </div>
        <Button variant="outline" onClick={() => setOpenFilterDialog(true)}>
          <Filter className="mr-2 h-4 w-4" />
          Filters
          {hasActiveFilters && (
            <span className="ml-2 rounded-full bg-indigo-600 text-white px-2 py-0.5 text-xs font-medium">
              {activeFilterCount}
            </span>
          )}
        </Button>
      </div>

      {/* Table */}
      <Card className="shadow-sm">
        <CardContent className="p-0">
          <div className="p-4 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Show</span>
              <Select value={entriesPerPage} onValueChange={(v) => { setEntriesPerPage(v); setCurrentPage(1); }}>
                <SelectTrigger className="w-[70px] h-8">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
              <span>entries</span>
            </div>
            <div className="text-sm text-slate-400">
              Showing {filteredUsers.length === 0 ? 0 : startIndex + 1} to{" "}
              {Math.min(endIndex, filteredUsers.length)} of{" "}
              {filteredUsers.length} entries
            </div>
          </div>

          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-neutral-900/50 hover:bg-neutral-900/50">
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">Full Name</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">Email</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">Level</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">Is Active</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">KYC Status</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">Commission</TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">Joined</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {currentUsers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={7} className="h-64 text-center">
                      <div className="flex flex-col items-center justify-center gap-2 text-slate-400">
                        <div className="p-3 rounded-full bg-neutral-800">
                          <UsersIcon className="h-8 w-8 text-slate-400" />
                        </div>
                        <p className="text-sm font-medium text-slate-500">
                          {hasActiveFilters ? "No referrals matching your filters" : "No referrals found."}
                        </p>
                        {hasActiveFilters && (
                          <Button variant="link" onClick={clearFilters} className="text-indigo-400 hover:text-indigo-300">
                            Clear all filters
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  currentUsers.map((user) => (
                    <TableRow
                      key={user.id}
                      className="border-b border-neutral-800 last:border-b-0 hover:bg-neutral-800/50 transition-colors"
                    >
                      <TableCell className="py-3 font-medium text-slate-200">{user.fullName}</TableCell>
                      <TableCell className="py-3 text-slate-400">{user.email}</TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                          Level {user.level}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        {user.isActive ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/20 text-green-400">Active</span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400">Inactive</span>
                        )}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          user.kycStatus === "Verified" ? "bg-green-600/20 text-green-400" :
                          user.kycStatus === "Pending" ? "bg-yellow-500/20 text-yellow-400" :
                          user.kycStatus === "Not Submitted" ? "bg-slate-500/20 text-slate-400" :
                          "bg-red-600/20 text-red-400"
                        }`}>
                          {user.kycStatus}
                        </span>
                      </TableCell>
                      <TableCell className="py-3 text-slate-200">₹{user.commission.toLocaleString()}</TableCell>
                      <TableCell className="py-3 text-slate-400">{format(user.createdAt, "MMM dd, yyyy")}</TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <div className="p-4 sm:p-6 border-t border-neutral-800">
              <div className="flex items-center justify-center gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="h-8 w-8 p-0"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <div className="flex items-center gap-1">
                  {getPageNumbers().map((page, index) => {
                    if (page === "...") {
                      return <span key={`ellipsis-${index}`} className="px-3 py-1 text-slate-400">...</span>;
                    }
                    return (
                      <Button
                        key={page}
                        variant={currentPage === page ? "default" : "outline"}
                        size="sm"
                        onClick={() => setCurrentPage(page as number)}
                        className={`h-8 w-8 p-0 ${
                          currentPage === page
                            ? "bg-indigo-600 text-white hover:bg-indigo-700"
                            : "hover:bg-neutral-800"
                        }`}
                      >
                        {page}
                      </Button>
                    );
                  })}
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage((prev) => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="h-8 w-8 p-0"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="border-b border-neutral-800 pb-2">
      <h3 className="text-base font-semibold text-slate-50">{title}</h3>
    </div>
  );
}