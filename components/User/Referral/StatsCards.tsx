"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, Wallet, Users, Layers } from "lucide-react"

interface StatItem {
  label: string
  value: string
  subtext?: string
  icon: React.ElementType
  positive?: boolean
}

const stats: StatItem[] = [
  {
    label: "Total Earnings",
    value: "₹937.5",
    subtext: "12.4% vs last month",
    icon: TrendingUp,
    positive: true,
  },
  {
    label: "Pending Payouts",
    value: "₹0",
    subtext: "Next disbursement on 15th",
    icon: Wallet,
  },
  {
    label: "Total Referrals",
    value: "7",
    subtext: "Active users",
    icon: Users,
    positive: true,
  },
  {
    label: "Active Levels",
    value: "3",
    subtext: "Referral levels activated",
    icon: Layers,
    positive: true,
  },
]

export default function StatsCards() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat) => {
        const Icon = stat.icon
        return (
          <Card
            key={stat.label}
            className="border border-white/10 bg-white/5 backdrop-blur-sm"
          >
            <CardContent className="p-4 space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                  {stat.label}
                </span>
                <Icon className="h-4 w-4 text-muted-foreground" />
              </div>
              <p
                className={cn(
                  "text-lg font-bold tracking-tight",
                  stat.positive && "text-green-500",
                )}
              >
                {stat.value}
              </p>
              {stat.subtext && (
                <p className="text-[10px] text-muted-foreground">
                  {stat.subtext}
                </p>
              )}
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
