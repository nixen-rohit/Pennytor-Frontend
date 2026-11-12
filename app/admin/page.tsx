"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import {
  BadgeCheck,
  Banknote,
  Loader2,
  PiggyBank,
  TrendingUp,
  Users,
  Wallet,
} from "lucide-react";
import {
  AdminDashboardService,
  AdminPendingCounts,
} from "@/services/admin-dashboard.service";

interface PendingCard {
  key: keyof AdminPendingCounts;
  label: string;
  href: string;
  icon: typeof Wallet;
}

const CARDS: PendingCard[] = [
  {
    key: "kycPending",
    label: "KYC Pending",
    href: "/admin/kyc/applications",
    icon: BadgeCheck,
  },
  {
    key: "depositsPending",
    label: "Deposit Pending",
    href: "/admin/finance/deposite-request",
    icon: Wallet,
  },
  {
    key: "withdrawalsPending",
    label: "Withdrawal Pending",
    href: "/admin/finance/widthdrawal-request",
    icon: Banknote,
  },
  {
    key: "fixedDepositsPending",
    label: "Fixed Deposit Scheme Pending",
    href: "/admin/investments/fixed-deposite",
    icon: PiggyBank,
  },
  {
    key: "sipPending",
    label: "SIP for Child Pending",
    href: "/admin/investments/sip",
    icon: Users,
  },
  {
    key: "investmentFundPending",
    label: "Investment Fund Pending",
    href: "/admin/investments/investment-fund",
    icon: TrendingUp,
  },
];

export default function AdminDashboardPage() {
  const [counts, setCounts] = useState<AdminPendingCounts | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await AdminDashboardService.getPendingCounts();
        if (!cancelled) {
          setCounts(data);
          setError(null);
        }
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : "Failed to load pending requests",
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-1">
        Welcome back, Admin
      </h2>
      <p className="text-sm text-gray-400 mb-6">
        Requests waiting for review. Open a queue to review and approve.
      </p>

      {error ? (
        <div className="p-4 rounded-lg border border-red-600/40 bg-red-600/10 text-sm text-red-400">
          {error}
        </div>
      ) : loading ? (
        <div className="flex items-center gap-2 text-sm text-gray-400 py-8">
          <Loader2 className="h-4 w-4 animate-spin text-indigo-500" />
          Loading pending requests…
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {CARDS.map((card) => {
            const Icon = card.icon;
            const value = counts?.[card.key] ?? 0;
            return (
              <Link
                key={card.key}
                href={card.href}
                className="group flex items-start justify-between gap-4 rounded-lg border border-[#1F1F23] bg-zinc-900/50 p-5 transition-colors hover:bg-[#1F1F23]"
              >
                <div>
                  <p className="text-sm text-gray-400">{card.label}</p>
                  <p
                    className={`mt-2 text-3xl font-bold ${
                      value > 0 ? "text-amber-400" : "text-white"
                    }`}
                  >
                    {value}
                  </p>
                </div>
                <span className="rounded-md bg-[#1F1F23] p-2 text-gray-400 transition-colors group-hover:text-indigo-400">
                  <Icon className="h-5 w-5" />
                </span>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
