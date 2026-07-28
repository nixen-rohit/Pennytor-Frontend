"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const plans = [
  {
    label: "Fixed Return Plans",
    percentage: 100,
    amount: "₹937.5",
    barColor: "bg-green-500",
  },
  {
    label: "Percentage Based Plans",
    percentage: 0,
    amount: "₹0",
    barColor: "bg-blue-500",
  },
]

export default function CommissionBreakdown() {
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
              <span className="font-semibold">{plan.amount}</span>
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
