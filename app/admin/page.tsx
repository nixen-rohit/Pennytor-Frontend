import Link from "next/link";

const stats = [
  { label: "Total Users", value: "0", href: "/admin/users" },
  { label: "Pending Withdrawals", value: "0", href: "/admin/withdrawals" },
  { label: "Pending Deposits", value: "0", href: "/admin/deposits" },
  { label: "Total Transactions", value: "0", href: "/admin/transactions" },
];

export default function AdminDashboardPage() {
  return (
    <div>
      <h2 className="text-xl font-semibold text-white mb-6">
        Welcome back, Admin
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <Link
            key={stat.label}
            href={stat.href}
            className="block p-5 rounded-lg border border-[#1F1F23] bg-zinc-900/50 hover:bg-[#1F1F23] transition-colors"
          >
            <p className="text-sm text-gray-400">{stat.label}</p>
            <p className="text-2xl font-bold text-white mt-2">{stat.value}</p>
          </Link>
        ))}
      </div>

      <div className="p-6 rounded-lg border border-[#1F1F23] bg-zinc-900/50">
        <h3 className="text-white font-semibold mb-2">
          Admin verification pending
        </h3>
        <p className="text-sm text-gray-400">
          Withdrawal and deposit requests submitted by users will appear here
          once the admin backend endpoints are connected.
        </p>
      </div>
    </div>
  );
}
