"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, TrendingUp, Award } from "lucide-react"
import { cn } from "@/lib/utils"

const levels = [
  {
    level: "Level 1",
    users: 2,
    commission: "₹500",
    percentage: "0.5%",
    min: 0,
    icon: TrendingUp,
    iconColor: "text-yellow-500",
    bgColor: "from-yellow-500/10 to-transparent",
  },
  {
    level: "Level 2",
    users: 3,
    commission: "₹250",
    percentage: "0.25%",
    min: 3,
    icon: Award,
    iconColor: "text-blue-400",
    bgColor: "from-blue-500/10 to-transparent",
  },
  {
    level: "Level 3",
    users: 2,
    commission: "₹187.5",
    percentage: "0.25%",
    min: 3,
    icon: Users,
    iconColor: "text-purple-400",
    bgColor: "from-purple-500/10 to-transparent",
  },
]

export default function ReferralLevels() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-semibold">Referral Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {levels.map((level) => {
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
                  <span className="text-sm font-semibold">{level.level}</span>
                </div>
                <span className="text-xs text-muted-foreground">
                  {level.users} users
                </span>
              </div>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-lg font-bold">{level.commission}</p>
                  <p className="text-xs text-muted-foreground">{level.percentage}</p>
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
