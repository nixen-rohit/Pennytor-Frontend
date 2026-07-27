"use client"

import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"
import { TrendingUp, TrendingDown, Wallet, BadgePercent, Target } from "lucide-react"

interface StatItem {
  label: string
  value: string
  icon: React.ElementType
  positive?: boolean
  negative?: boolean
}

const stats: StatItem[] = [
  { label: "TOTAL PORTFOLIO VALUE", value: "₹100,000.00", icon: Wallet, positive: true },
  { label: "TODAY'S GAIN", value: "+₹0", icon: TrendingUp },
  { label: "INVESTED VALUE", value: "₹100,000.00", icon: TrendingDown },
  { label: "TOTAL RETURNS", value: "₹0.00", icon: BadgePercent },
  { label: "EXPECTED RETURNS", value: "₹100,160.00", icon: Target },
]

export default function PortfolioCard() {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
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
                  stat.negative && "text-red-500",
                )}
              >
                {stat.value}
              </p>
            </CardContent>
          </Card>
        )
      })}
    </div>
  )
}
