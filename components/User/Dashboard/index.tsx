"use client"

import PortfolioCard from "@/components/User/Dashboard/PortfolioCard"
import WalletSummary from "@/components/User/Dashboard/WalletSummary"
import InvestmentSummary from "@/components/User/Dashboard/InvestmentSummary"
import UserInvestments from "@/components/User/Dashboard/UserInvestments"
import RecentTransactions from "@/components/User/Dashboard/RecentTransactions"
import ReferralSummary from "@/components/User/Dashboard/ReferralSummary"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PortfolioCard />
      <WalletSummary />
      <ReferralSummary />
      <UserInvestments />
      <InvestmentSummary />
      <RecentTransactions />
    </div>
  )
}