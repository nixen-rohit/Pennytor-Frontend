"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Crown, TrendingUp, Award } from "lucide-react"

const levels = [
  {
    level: "Level 1",
    commission: "₹500",
    percentage: "0.5%",
    icon: Crown,
    iconColor: "text-yellow-500",
  },
  {
    level: "Level 2",
    commission: "₹250",
    percentage: "0.25%",
    icon: TrendingUp,
    iconColor: "text-blue-400",
  },
  {
    level: "Level 3",
    commission: "₹187.5",
    percentage: "0.25%",
    icon: Award,
    iconColor: "text-purple-400",
  },
]

export default function TopLevels() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-semibold">Top Levels</CardTitle>
      </CardHeader>
      <CardContent className="p-4 space-y-3">
        {levels.map((level) => {
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
