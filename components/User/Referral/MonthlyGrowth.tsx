"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { cn } from "@/lib/utils"

const periodTabs = ["6M", "1Y", "ALL"]

const monthlyData = [
  { month: "FEB", value: 0 },
  { month: "MAR", value: 0 },
  { month: "APR", value: 0 },
  { month: "MAY", value: 125 },
  { month: "JUN", value: 812.5 },
  { month: "JUL", value: 0 },
]

export default function MonthlyGrowth() {
  const [activePeriod, setActivePeriod] = useState("6M")
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
