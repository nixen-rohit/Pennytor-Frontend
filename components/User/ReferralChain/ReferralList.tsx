"use client";

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
import { Search, Filter, Users as UsersIcon } from "lucide-react";
import { format } from "date-fns";
import { ReferralState } from "@/components/User/ReferralChain/types";
import { maskEmail } from "@/components/User/ReferralChain/utils";
import { FilterDialog, ReferralFilters } from "@/components/User/ReferralChain/FilterDialog";
import { Pagination } from "@/components/User/ReferralChain/Pagination";

const EMPTY_FILTERS: ReferralFilters = { active: "all", level: "all", kyc: "all" };

const inr = (value: string | number | undefined) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

interface Props {
  data: ReferralState;
}

export function ReferralList({ data }: Props) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filters, setFilters] = useState<ReferralFilters>(EMPTY_FILTERS);
  const [entriesPerPage, setEntriesPerPage] = useState("10");
  const [currentPage, setCurrentPage] = useState(1);
  const [openFilterDialog, setOpenFilterDialog] = useState(false);

  const activeFilterCount =
    (filters.active !== "all" ? 1 : 0) +
    (filters.level !== "all" ? 1 : 0) +
    (filters.kyc !== "all" ? 1 : 0);

  const hasActiveFilters = activeFilterCount > 0;

  const filteredUsers = data.referrals.filter((user) => {
    const fullName = `${user.firstName} ${user.lastName}`.toLowerCase();
    const matchesSearch =
      fullName.includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase());

    // All referrals from the API are considered active
    const matchesActive =
      filters.active === "all" || filters.active === "active";

    // Level filtering is not available from the API (all are direct referrals)
    const matchesLevel = filters.level === "all";

    // KYC status is not available from the API
    const matchesKyc = filters.kyc === "all";

    return matchesSearch && matchesActive && matchesLevel && matchesKyc;
  });

  const perPage = parseInt(entriesPerPage);
  const totalPages = Math.ceil(filteredUsers.length / perPage);
  const startIndex = (currentPage - 1) * perPage;
  const endIndex = startIndex + perPage;
  const currentUsers = filteredUsers.slice(startIndex, endIndex);

  const clearFilters = () => {
    setFilters(EMPTY_FILTERS);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => setCurrentPage(page);

  return (
    <div className="space-y-4 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <FilterDialog
        open={openFilterDialog}
        onOpenChange={setOpenFilterDialog}
        filters={filters}
        onFiltersChange={setFilters}
        onClear={clearFilters}
      />

      {/* Search and Filter */}
      <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
        <div className="relative w-full lg:w-96">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="text"
            placeholder="Search Name or Email..."
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
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
          <div className="p-4  md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-neutral-800">
            <div className="flex items-center gap-2 text-sm text-slate-400">
              <span>Show</span>
              <Select
                value={entriesPerPage}
                onValueChange={(v) => {
                  setEntriesPerPage(v);
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="w-[70px] h-8 bg-black">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent >
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
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                    Full Name
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                    Email
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                    Type
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                    Eligible
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                    Referral Code
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                    Joined
                  </TableHead>
                  <TableHead className="text-xs font-semibold text-slate-400 uppercase tracking-wider py-3">
                    Commission
                  </TableHead>
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
                          {hasActiveFilters
                            ? "No referrals matching your filters"
                            : "No referrals found."}
                        </p>
                        {hasActiveFilters && (
                          <Button
                            variant="link"
                            onClick={clearFilters}
                            className="text-indigo-400 hover:text-indigo-300"
                          >
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
                      <TableCell className="py-3 font-medium text-slate-200">
                        {user.firstName} {user.lastName}
                      </TableCell>
                      <TableCell className="py-3 text-slate-400">
                        {maskEmail(user.email)}
                      </TableCell>
                      <TableCell className="py-3">
                        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-indigo-500/20 text-indigo-400">
                          {user.userType === "super_user" ? "Super User" : "User"}
                        </span>
                      </TableCell>
                      <TableCell className="py-3">
                        {user.referralCodeStatus === "ACTIVE" ? (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-600/20 text-green-400">
                            Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-600/20 text-red-400">
                            Inactive
                          </span>
                        )}
                      </TableCell>
                      <TableCell className="py-3 text-slate-400 font-mono text-xs">
                        {user.referralCode ?? "—"}
                      </TableCell>
                      <TableCell className="py-3 text-slate-400">
                        {format(new Date(user.createdAt), "MMM dd, yyyy")}
                      </TableCell>
                      <TableCell className="py-3 text-slate-200 font-semibold">
                        {inr(user.totalCommission)}
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 0 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </CardContent>
      </Card>
    </div>
  );
}
