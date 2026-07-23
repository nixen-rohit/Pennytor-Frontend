"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { ArrowUpRight } from "lucide-react"

const transactions = [
  {
    activity: "CR",
    date: "17 Jun 2026",
    status: "APPROVED",
    amount: "+₹100,000.00",
  },
]

export default function RecentTransactions() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Activity</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Date</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((tx, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-2 font-medium">{tx.activity}</td>
                  <td className="py-3 px-2 text-muted-foreground">{tx.date}</td>
                  <td className="py-3 px-2">
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                    >
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right font-semibold text-green-500">
                    {tx.amount}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {transactions.length === 0 && (
          <p className="text-center text-sm text-muted-foreground py-6">
            No transactions yet
          </p>
        )}
      </CardContent>
    </Card>
  )
}
