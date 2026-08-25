"use client"

import PortfolioCard from "./PortfolioCard"
import WalletSummary from "./WalletSummary"
import InvestmentSummary from "./InvestmentSummary"
import UserInvestments from "./UserInvestments"
import RecentTransactions from "./RecentTransactions"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <PortfolioCard />
      <WalletSummary />
      <UserInvestments />
      <InvestmentSummary />
      <RecentTransactions />
    </div>
  )
}
