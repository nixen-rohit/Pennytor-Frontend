"use client"

import { useState, useCallback, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  Copy,
  DollarSign,
  Link,
  UserCheck,
  CalendarDays,
  Share2,
  Check,
  TrendingUp,
  Wallet,
  Users,
  Layers,
  Crown,
  Award,
} from "lucide-react"
import { format } from "date-fns"
import { ReferralState, initialReferralState } from "../ReferralChain"


 

export function ReferralStats({ data }: { data: ReferralState }) {
  const { stats } = data;

  const cards = [
    {
      label: "Total Commission",
      value: `₹${stats.totalCommission.toLocaleString()}`,
      icon: DollarSign,
      color: "text-green-500",
      bg: "bg-green-500/10",
      
    },
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
    
     
  ];

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
       

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
                  <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
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

 

function CommissionBreakdown({ data }: { data: ReferralState }) {
  const total = data.stats.totalCommission || 1

  const plans = [
    {
      label: "Cleared",
      amount: data.stats.clearedCommission,
      percentage: Math.round((data.stats.clearedCommission / total) * 100),
      barColor: "bg-green-500",
    },
    {
      label: "Pending",
      amount: data.stats.pendingCommission,
      percentage: Math.round((data.stats.pendingCommission / total) * 100),
      barColor: "bg-yellow-500",
    },
  ]

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-semibold">Commission Breakdown</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {plans.map((plan) => (
          <div key={plan.label} className="space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">{plan.label}</span>
              <span className="font-semibold">₹{plan.amount.toLocaleString()}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="flex-1 h-2 rounded-full bg-white/10">
                <div
                  className={cn("h-full rounded-full transition-all", plan.barColor)}
                  style={{ width: `${plan.percentage}%` }}
                />
              </div>
              <span className="text-xs font-medium text-muted-foreground w-8 text-right">
                {plan.percentage}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}

const periodTabs = ["6M", "1Y", "ALL"]

function buildMonthlyData(data: ReferralState, period: string) {
  const records = data.commissions.filter((c) => c.status !== "Cancelled")

  if (records.length === 0) return []

  const months = period === "6M" ? 6 : period === "1Y" ? 12 : null

  const endDate = records.reduce((m, c) => (c.date > m ? c.date : m), records[0].date)
  const end = new Date(endDate.getFullYear(), endDate.getMonth(), 1)

  let start: Date
  if (months !== null) {
    start = new Date(end.getFullYear(), end.getMonth() - (months - 1), 1)
  } else {
    const startDate = records.reduce((m, c) => (c.date < m ? c.date : m), records[0].date)
    start = new Date(startDate.getFullYear(), startDate.getMonth(), 1)
  }

  const result: { month: string; value: number }[] = []
  for (
    let d = start;
    d <= end;
    d = new Date(d.getFullYear(), d.getMonth() + 1, 1)
  ) {
    let value = 0
    for (const c of records) {
      if (c.date.getFullYear() === d.getFullYear() && c.date.getMonth() === d.getMonth()) {
        value += c.amount
      }
    }
    result.push({ month: format(d, "MMM").toUpperCase(), value })
  }
  return result
}

function MonthlyGrowth({ data }: { data: ReferralState }) {
  const [activePeriod, setActivePeriod] = useState("6M")
  const monthlyData = useMemo(() => buildMonthlyData(data, activePeriod), [data, activePeriod])
  const maxValue = Math.max(...monthlyData.map((d) => d.value), 1)

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Monthly Growth</CardTitle>
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
          {monthlyData.map((d) => (
            <div key={d.month} className="flex flex-col items-center gap-1 flex-1">
              <span className="text-[10px] font-medium text-muted-foreground">
                ₹{d.value}
              </span>
              <div
                className="w-full rounded-t-sm bg-gradient-to-t from-[#E85B66]/60 to-[#4E385E]/60 transition-all duration-300"
                style={{ height: `${(d.value / maxValue) * 120}px` }}
              />
              <span className="text-[10px] text-muted-foreground">{d.month}</span>
            </div>
          ))}
          {monthlyData.every((d) => d.value === 0) && (
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <span className="text-xs text-muted-foreground/30">Chart visualization</span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

const LEVEL_RATES = [
  { level: 1, rate: "0.5%", min: 0, iconColor: "text-yellow-500", bgColor: "from-yellow-500/10 to-transparent" },
  { level: 2, rate: "0.25%", min: 3, iconColor: "text-blue-400", bgColor: "from-blue-500/10 to-transparent" },
  { level: 3, rate: "0.25%", min: 3, iconColor: "text-purple-400", bgColor: "from-purple-500/10 to-transparent" },
] as const

const topLevelIcons = [Crown, TrendingUp, Award]

function TopLevels({ data }: { data: ReferralState }) {
  const rows = LEVEL_RATES.map((cfg, i) => {
    const records = data.commissions.filter((c) => c.level === cfg.level)
    const Icon = topLevelIcons[i] ?? Award
    return {
      level: `Level ${cfg.level}`,
      commission: `₹${records.reduce((s, c) => s + c.amount, 0).toLocaleString()}`,
      percentage: cfg.rate,
      icon: Icon,
      iconColor: cfg.iconColor,
    }
  })

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-semibold">Top Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {rows.map((level) => {
          const Icon = level.icon
          return (
            <div
              key={level.level}
              className="flex items-center justify-between p-3 rounded-lg bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-white/10 flex items-center justify-center">
                  <Icon className={`h-4 w-4 ${level.iconColor}`} />
                </div>
                <div>
                  <p className="text-sm font-medium">{level.level}</p>
                  <p className="text-[10px] text-muted-foreground">Referral Commission</p>
                </div>
              </div>
              <div className="text-right">
                <p className="text-sm font-bold">{level.commission}</p>
                <p className="text-[10px] text-muted-foreground">{level.percentage}</p>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

const REFERRAL_CODE = "W0YFGP5T2A"
const LINK_TEXT = `${process.env.NEXT_PUBLIC_SITE_URL || "https://example.com"}/register?ref=${REFERRAL_CODE}`

function ReferralCode() {
  const [copiedCode, setCopiedCode] = useState(false)
  const [copiedLink, setCopiedLink] = useState(false)

  const handleCopy = useCallback(async (text: string, setter: (v: boolean) => void) => {
    try {
      await navigator.clipboard.writeText(text)
      setter(true)
      setTimeout(() => setter(false), 2000)
    } catch {
      const ta = document.createElement("textarea")
      ta.value = text
      document.body.appendChild(ta)
      ta.select()
      document.execCommand("copy")
      document.body.removeChild(ta)
      setter(true)
      setTimeout(() => setter(false), 2000)
    }
  }, [])

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">Your Referral Code</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">Share and earn commissions</p>
          </div>
          <Share2 className="h-5 w-5 text-[#E85B66]" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="flex items-center gap-4 text-xs text-muted-foreground">
          {LEVEL_RATES.map((r) => (
            <span key={r.level} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/10">
              L{r.level}: {r.rate}
            </span>
          ))}
        </div>

        <div className="relative flex items-center justify-between p-3 rounded-lg bg-white/10 border border-white/10">
          <code className="text-sm font-mono font-bold tracking-wider text-white">
            {REFERRAL_CODE}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(REFERRAL_CODE, setCopiedCode)}
            className={cn(
              "text-xs gap-1.5 transition-all duration-300",
              copiedCode && "text-green-500",
            )}
          >
            <span className="relative">
              <Copy
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  copiedCode ? "opacity-0 scale-0" : "opacity-100 scale-100",
                )}
              />
              <Check
                className={cn(
                  "h-3.5 w-3.5 absolute inset-0 transition-all duration-300",
                  copiedCode ? "opacity-100 scale-100" : "opacity-0 scale-0",
                )}
              />
            </span>
            {copiedCode ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground truncate">
            {LINK_TEXT}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleCopy(LINK_TEXT, setCopiedLink)}
            className={cn(
              "text-xs gap-1.5 border-white/20 shrink-0 transition-all duration-300",
              copiedLink && "text-green-500 border-green-500/30",
            )}
          >
            <span className="relative">
              <Link
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  copiedLink ? "opacity-0 scale-0" : "opacity-100 scale-100",
                )}
              />
              <Check
                className={cn(
                  "h-3.5 w-3.5 absolute inset-0 transition-all duration-300",
                  copiedLink ? "opacity-100 scale-100" : "opacity-0 scale-0",
                )}
              />
            </span>
            {copiedLink ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

const levelIcons = [TrendingUp, Award, Users]

function ReferralLevels({ data }: { data: ReferralState }) {
  const rows = LEVEL_RATES.map((cfg, i) => {
    const users = data.referrals.filter((r) => r.level === cfg.level)
    const Icon = levelIcons[i] ?? Users
    return {
      ...cfg,
      icon: Icon,
      users: users.length,
      commission: `₹${users.reduce((s, u) => s + u.commission, 0).toLocaleString()}`,
    }
  })

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-semibold">Referral Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {rows.map((level) => {
          const Icon = level.icon
          return (
            <div
              key={level.level}
              className={cn(
                "p-4 rounded-lg border border-white/10 bg-gradient-to-r",
                level.bgColor,
              )}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-2">
                  <Icon className={cn("h-4 w-4", level.iconColor)} />
                  <span className="text-sm font-semibold">Level {level.level}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {level.users} users
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{level.commission}</p>
                  <p className="text-xs text-muted-foreground">{level.rate}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-muted-foreground">Min: {level.min}</p>
                </div>
              </div>
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export default function ReferralDashboard({ data = initialReferralState }: { data?: ReferralState }) {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">Referral Overview</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your referral earnings and performance metrics in real-time
        </p>
      </div>

      <ReferralStats data={data} />

      

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <CommissionBreakdown data={data} />
          <TopLevels data={data} />
        </div>
        <div className="space-y-6">
          <MonthlyGrowth data={data} />
          <ReferralCode />
        </div>
      </div>

      <ReferralLevels data={data} />
    </div>
  )
}
