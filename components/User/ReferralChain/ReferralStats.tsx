import { ReferralState } from "@/components/User/ReferralChain/types";
import { Users, UserCheck, DollarSign, TrendingUp, Wallet, CalendarDays } from "lucide-react";

interface Props {
  data: ReferralState;
}

export function ReferralStats({ data }: Props) {
  const { stats } = data;

  const cards = [
    {
      label: "Total Referrals",
      value: stats.totalReferrals,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Active Referrals",
      value: stats.activeReferrals,
      icon: UserCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "Total Commission",
      value: `₹${stats.totalCommission.toLocaleString()}`,
      icon: DollarSign,
      color: "text-indigo-500",
      bg: "bg-indigo-500/10",
    },
    {
      label: "Pending",
      value: `₹${stats.pendingCommission.toLocaleString()}`,
      icon: Wallet,
      color: "text-yellow-500",
      bg: "bg-yellow-500/10",
    },
    {
      label: "Cleared",
      value: `₹${stats.clearedCommission.toLocaleString()}`,
      icon: TrendingUp,
      color: "text-emerald-500",
      bg: "bg-emerald-500/10",
    },
    {
      label: "This Month",
      value: `${stats.thisMonthReferrals} referrals · ₹${stats.thisMonthCommission.toLocaleString()}`,
      icon: CalendarDays,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Referral Overview" />
      <p className="text-sm text-slate-400 -mt-4">
        Your referral performance at a glance
      </p>

      <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition-colors hover:border-neutral-700"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-2">
                  <p className="text-sm text-slate-400">{card.label}</p>
                  <p className="text-2xl font-bold text-slate-50">{card.value}</p>
                </div>
                <div className={`rounded-lg ${card.bg} p-2.5`}>
                  <Icon className={`h-5 w-5 ${card.color}`} />
                </div>
              </div>
            </div>
          );
        })}
      </div>
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