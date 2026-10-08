"use client"

import WalletSummary from "@/components/User/Dashboard/WalletSummary"
import InvestmentSummary from "@/components/User/Dashboard/InvestmentSummary"
import UserInvestments from "@/components/User/Dashboard/UserInvestments"
import UserSIPInvestments from "@/components/User/Dashboard/UserSIPInvestments"
import FixedDepositSummary from "@/components/User/Dashboard/FixedDepositSummary"
import RecentTransactions from "@/components/User/Dashboard/RecentTransactions"
import ReferralSummary from "@/components/User/Dashboard/ReferralSummary"

export default function Dashboard() {
  return (
    <div className="space-y-6">
      <InvestmentSummary />
      <WalletSummary />
      <ReferralSummary />
      <UserInvestments />
      <UserSIPInvestments />
      <FixedDepositSummary />
      
      <RecentTransactions />
    </div>
  )
}