"use client"

import StatsCards from "./StatsCards"
import CommissionBreakdown from "./CommissionBreakdown"
import MonthlyGrowth from "./MonthlyGrowth"
import TopLevels from "./TopLevels"
import ReferralCode from "./ReferralCode"
import RecentTransactions from "./RecentTransactions"
import ReferralLevels from "./ReferralLevels"

export default function ReferralDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Commission Dashboard</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your referral earnings and performance metrics in real-time
        </p>
      </div>

      <StatsCards />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CommissionBreakdown />
          <TopLevels />
        </div>
        <div className="space-y-6">
          <MonthlyGrowth />
          <ReferralCode />
        </div>
      </div>

      <RecentTransactions />
      <ReferralLevels />
    </div>
  )
}
