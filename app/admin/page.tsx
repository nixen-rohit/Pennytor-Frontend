"use client";

import Link from "next/link";
import { Loader2 } from "lucide-react";
import { useFinanceSummary } from "@/hooks/use-finance";

const fmt = (n: string | number) =>
  Number(n).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });

interface Stat {
  label: string;
  value: string | number;
  href: string;
  accent?: string;
}

function StatCard({ stat }: { stat: Stat }) {
  return (
    <Link
      href={stat.href}
      className="block p-5 rounded-lg border border-[#1F1F23] bg-zinc-900/50 hover:bg-[#1F1F23] transition-colors"
    >
      <p className="text-sm text-gray-400">{stat.label}</p>
      <p className={`text-2xl font-bold mt-2 ${stat.accent ?? "text-white"}`}>
        {stat.value}
      </p>
    </Link>
  );
}

function SectionHeading({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mt-8 mb-4">
      <h3 className="text-white font-semibold">{title}</h3>
      <p className="text-sm text-gray-400">{subtitle}</p>
    </div>
  );
}

export default function AdminDashboardPage() {
  const { data: sum, loading, error } = useFinanceSummary();

  const depStats: Stat[] = sum
    ? [
        {
          label: "Deposits Total",
          value: sum.deposits.total,
          href: "/admin/finance/reports",
        },
        {
          label: "Deposits Pending",
          value: sum.deposits.pending,
          href: "/admin/finance/deposite-request",
          accent: "text-amber-400",
        },
        {
          label: "Deposits Approved",
          value: sum.deposits.approved,
          href: "/admin/finance/reports",
          accent: "text-green-400",
        },
        {
          label: "Amount Credited",
          value: `₹${fmt(sum.deposits.approvedAmount)}`,
          href: "/admin/finance/reports",
          accent: "text-emerald-400",
        },
        {
          label: "Deposits Rejected",
          value: sum.deposits.rejected,
          href: "/admin/finance/reports",
          accent: "text-red-400",
        },
      ]
    : [];

  const wdrStats: Stat[] = sum
    ? [
        {
          label: "Withdrawals Total",
          value: sum.withdrawals.total,
          href: "/admin/finance/reports",
        },
        {
          label: "Withdrawals Pending",
          value: sum.withdrawals.pending,
          href: "/admin/finance/widthdrawal-request",
          accent: "text-amber-400",
        },
        {
          label: "Withdrawals Approved",
          value: sum.withdrawals.approved,
          href: "/admin/finance/reports",
          accent: "text-green-400",
        },
        {
          label: "Amount Debited",
          value: `₹${fmt(sum.withdrawals.approvedAmount)}`,
          href: "/admin/finance/reports",
          accent: "text-red-400",
        },
        {
          label: "Withdrawals Rejected",
          value: sum.withdrawals.rejected,
          href: "/admin/finance/reports",
          accent: "text-red-400",
        },
      ]
    : [];

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">
        Welcome back, Admin
      </h2>

      {error ? (
        <div className="p-4 rounded-lg border border-red-600/40 bg-red-600/10 text-sm text-red-400">
          {error}
        </div>
      ) : loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          Loading finance stats…
        </div>
      ) : (
        <>
          <SectionHeading
            title="Deposits"
            subtitle="All fund deposit requests and their review outcomes"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {depStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>

          <SectionHeading
            title="Withdrawals"
            subtitle="All withdrawal requests and their review outcomes"
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {wdrStats.map((stat) => (
              <StatCard key={stat.label} stat={stat} />
            ))}
          </div>
        </>
      )}

      <div className="p-6 rounded-lg border border-[#1F1F23] bg-zinc-900/50 mt-8">
        <h3 className="text-white font-semibold mb-2">
          Admin verification pending
        </h3>
        <p className="text-sm text-gray-400">
          {loading
            ? "Loading pending request counts…"
            : `${sum?.totals.totalPending ?? 0} request${
                sum?.totals.totalPending === 1 ? "" : "s"
              } awaiting review across deposits and withdrawals. Review them in the Finance section.`}
        </p>
      </div>
    </div>
  );
}