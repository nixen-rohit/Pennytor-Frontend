"use client"

import { useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Loader2, RefreshCw, Receipt } from "lucide-react"
import { format } from "date-fns"
import { useDashboardStore } from "@/store/dashboard.store"

interface Row {
  id: string
  activity: string
  status: "APPROVED" | "PENDING" | "REJECTED"
  amount: number
  date: Date
}

export default function RecentTransactions() {
  const { summary, loading, error, fetch } = useDashboardStore()
  const rows: Row[] = (summary?.recentTransactions ?? []).map((tx) => ({
    id: tx.id,
    activity: tx.activity,
    status: tx.status,
    amount: tx.amount,
    date: new Date(tx.date),
  }))

  useEffect(() => {
    void fetch()
  }, [fetch])

  const statusCls: Record<Row["status"], string> = {
    APPROVED: "bg-green-500/10 text-green-500 border-green-500/20",
    PENDING: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20",
    REJECTED: "bg-red-500/10 text-red-500 border-red-500/20",
  }

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Receipt className="h-4 w-4 text-muted-foreground" />
            <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
          </div>
          <button
            type="button"
            onClick={() => void fetch(true)}
            disabled={loading}
            className="text-muted-foreground hover:text-white disabled:opacity-50"
            aria-label="Refresh"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </button>
        </div>
      </CardHeader>
      <CardContent className="p-4">
        {error ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-red-400">{error}</p>
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="border-white/20 text-slate-300"
              onClick={() => void fetch(true)}
            >
              <RefreshCw className="mr-2 h-3.5 w-3.5" />
              Try Again
            </Button>
          </div>
        ) : rows.length === 0 && !loading ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <Receipt className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">No transactions yet</p>
            <p className="text-xs text-muted-foreground text-center max-w-xs">
              Your deposits, withdrawals and investments will appear here once you start.
            </p>
          </div>
        ) : loading && rows.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            <p className="text-xs text-muted-foreground">Loading transactions...</p>
          </div>
        ) : (
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
                {rows.map((tx) => (
                  <tr key={tx.id} className="border-b border-white/5 last:border-0">
                    <td className="py-3 px-2 font-medium">{tx.activity}</td>
                    <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">
                      {format(tx.date, "dd MMM yyyy")}
                    </td>
                    <td className="py-3 px-2">
                      <Badge variant="outline" className={`text-xs ${statusCls[tx.status]}`}>
                        {tx.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-2 text-right font-semibold whitespace-nowrap">
                      ₹{tx.amount.toLocaleString("en-IN")}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
