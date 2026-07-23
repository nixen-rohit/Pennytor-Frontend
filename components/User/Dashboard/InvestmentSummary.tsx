"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  TrendingUp,
  ArrowRight,
  ChevronRight,
  Clock,
  DollarSign,
  BarChart3,
  Target,
} from "lucide-react"

const periodTabs = ["1Y", "3Y", "5Y", "ALL"]
const months = ["JAN", "MAR", "MAY", "JUL", "SEP", "NOV"]

const allocationItems = [
  { label: "Stocks", percentage: 0, color: "bg-blue-500" },
  { label: "Mutual Funds", percentage: 0, color: "bg-purple-500" },
  { label: "Insurance", percentage: 50, color: "bg-[#E85B66]" },
  { label: "Cash", percentage: 50, color: "bg-green-500" },
]

export default function InvestmentSummary() {
  const [activePeriod, setActivePeriod] = useState("1Y")

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartSection activePeriod={activePeriod} setActivePeriod={setActivePeriod} />
        <AllocationSection />
      </div>

      <FixedInvestmentsSection />
      <PercentageBasedSection />
      <ReferralEarningsSection />
    </div>
  )
}

function ChartSection({
  activePeriod,
  setActivePeriod,
}: {
  activePeriod: string
  setActivePeriod: (v: string) => void
}) {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Portfolio Growth</CardTitle>
          <div className="flex gap-1">
            {periodTabs.map((p) => (
              <button
                key={p}
                onClick={() => setActivePeriod(p)}
                className={cn(
                  "px-3 py-1 text-xs font-medium rounded-md transition-colors",
                  activePeriod === p
                    ? "bg-[#E85B66] text-white"
                    : "text-muted-foreground hover:text-white hover:bg-white/10",
                )}
              >
                {p}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="relative h-48 flex items-end justify-between gap-2 px-2">
          {months.map((m, i) => (
            <div key={m} className="flex flex-col items-center gap-1 flex-1">
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-[#E85B66]/60 to-[#4E385E]/60 transition-all duration-300"
                style={{ height: `${20 + Math.sin(i * 1.2) * 30 + 30}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{m}</span>
            </div>
          ))}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
            <span className="text-xs text-muted-foreground/30">Chart visualization</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function AllocationSection() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-semibold">Asset Allocation</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="text-center">
          <p className="text-2xl font-bold">₹100,000.00</p>
          <p className="text-xs text-muted-foreground">TOTAL</p>
        </div>

        <div className="flex justify-center gap-1">
          {allocationItems.map((item) => (
            <div
              key={item.label}
              className={cn("h-3 rounded-full flex-1 max-w-16", item.color)}
              style={{ opacity: item.percentage > 0 ? 1 : 0.2 }}
            />
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          {allocationItems.map((item) => (
            <div
              key={item.label}
              className="flex items-center justify-between p-2 rounded-md bg-white/5"
            >
              <div className="flex items-center gap-2">
                <div className={cn("h-2 w-2 rounded-full", item.color)} />
                <span className="text-xs text-muted-foreground">{item.label}</span>
              </div>
              <span className="text-xs font-medium">{item.percentage}%</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}

function FixedInvestmentsSection() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Fixed Investments</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
            View All
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Invested", value: "₹100,000", icon: DollarSign },
            { label: "Expected Returns", value: "₹100,160", icon: Target },
            { label: "Actual Returns", value: "₹0", icon: BarChart3, negative: true },
            { label: "Total Investments", value: "1", icon: Clock },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-lg bg-white/5 space-y-1"
            >
              <div className="flex items-center gap-1.5">
                <item.icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{item.label}</span>
              </div>
              <p className={cn("text-sm font-bold", item.negative && "text-red-500")}>
                {item.value}
              </p>
            </div>
          ))}
        </div>

        <div className="p-4 rounded-lg bg-gradient-to-r from-[#4E385E]/30 to-[#E85B66]/10 border border-white/10">
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <p className="font-semibold text-sm">Pennytor SWP Fund - Super</p>
              <div className="grid grid-cols-3 gap-4 text-xs">
                <div>
                  <span className="text-muted-foreground">Invested: </span>
                  <span className="font-medium">₹100,000</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Expected: </span>
                  <span className="font-medium">₹100,160</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Actual: </span>
                  <span className="font-medium text-red-500">₹0</span>
                </div>
              </div>
              <p className="text-xs text-muted-foreground">Duration: 36 months</p>
            </div>
            <ChevronRight className="h-4 w-4 text-muted-foreground shrink-0 mt-1" />
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function PercentageBasedSection() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Percentage Based Investments</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-muted-foreground gap-1">
            View All
            <ChevronRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: "Total Invested", value: "₹0", icon: DollarSign },
            { label: "Expected Returns", value: "₹0", icon: Target },
            { label: "Actual Returns", value: "₹0", icon: BarChart3 },
            { label: "Total Investments", value: "0", icon: Clock },
          ].map((item) => (
            <div
              key={item.label}
              className="p-3 rounded-lg bg-white/5 space-y-1"
            >
              <div className="flex items-center gap-1.5">
                <item.icon className="h-3 w-3 text-muted-foreground" />
                <span className="text-[10px] text-muted-foreground">{item.label}</span>
              </div>
              <p className="text-sm font-bold">{item.value}</p>
            </div>
          ))}
        </div>

        <div className="text-center py-6">
          <TrendingUp className="h-8 w-8 text-muted-foreground/30 mx-auto mb-2" />
          <p className="text-sm text-muted-foreground">No percentage-based investments yet</p>
        </div>
      </CardContent>
    </Card>
  )
}

function ReferralEarningsSection() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Referral Earnings</CardTitle>
          <Button variant="ghost" size="sm" className="text-xs text-[#E85B66] gap-1">
            VIEW DETAILS
            <ArrowRight className="h-3 w-3" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-6">
        <div className="grid grid-cols-3 gap-3">
          {[
            { label: "Total Earned", value: "₹0" },
            { label: "Pending Amount", value: "₹0" },
            { label: "Total Referrals", value: "0" },
          ].map((item) => (
            <div key={item.label} className="p-3 rounded-lg bg-white/5 text-center space-y-1">
              <p className="text-lg font-bold">{item.value}</p>
              <p className="text-[10px] text-muted-foreground">{item.label}</p>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Recent Commissions
            </p>
            <div className="text-center py-6 rounded-lg bg-white/5">
              <p className="text-sm text-muted-foreground">No commissions yet</p>
            </div>
          </div>
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Pending Commissions
            </p>
            <div className="text-center py-6 rounded-lg bg-white/5">
              <p className="text-sm text-muted-foreground">No pending commissions</p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
