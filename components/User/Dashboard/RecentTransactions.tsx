"use client"

import { useCallback, useEffect, useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Loader2, RefreshCw, Receipt } from "lucide-react"
import { format } from "date-fns"
import { DepositService } from "@/services/deposit.service"
import { WithdrawalService } from "@/services/withdrawal.service"
import {
  InvestmentFundService,
  type MyInvestment,
} from "@/services/investment-fund.service"

interface Row {
  id: string
  activity: string
  status: "APPROVED" | "PENDING" | "REJECTED"
  amount: number
  date: Date
}

export default function RecentTransactions() {
  const [rows, setRows] = useState<Row[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const [dep, wdr, inv] = await Promise.all([
        DepositService.myDeposits(),
        WithdrawalService.myWithdrawals(),
        InvestmentFundService.myApplications().catch(() => ({ items: [] as MyInvestment[] })),
      ])

      const merged: Row[] = [
        ...dep.items.map((d) => ({
          id: `CR-${d.id}`,
          activity: "Deposit",
          status:
            d.status === "VERIFIED"
              ? ("APPROVED" as const)
              : d.status === "REJECTED"
                ? ("REJECTED" as const)
                : ("PENDING" as const),
          amount: Number(d.amount) || 0,
          date: new Date(d.submittedAt ?? d.createdAt),
        })),
        ...wdr.items.map((w) => ({
          id: `DR-${w.id}`,
          activity: "Withdrawal",
          status:
            w.status === "VERIFIED"
              ? ("APPROVED" as const)
              : w.status === "REJECTED"
                ? ("REJECTED" as const)
                : ("PENDING" as const),
          amount: Number(w.amount) || 0,
          date: new Date(w.submittedAt ?? w.createdAt),
        })),
        ...(inv.items ?? []).map((i) => ({
          id: `IF-${i.id}`,
          activity: i.planLabel,
          status:
            i.status === "VERIFIED"
              ? ("APPROVED" as const)
              : i.status === "REJECTED"
                ? ("REJECTED" as const)
                : ("PENDING" as const),
          amount: Number(i.amount) || 0,
          date: new Date(i.submittedAt ?? i.createdAt),
        })),
      ].sort((a, b) => b.date.getTime() - a.date.getTime())

      setRows(merged.slice(0, 5))
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load transactions")
      setRows([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => void load(), 0)
    return () => clearTimeout(id)
  }, [load])

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
            onClick={() => void load()}
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
          <p className="py-6 text-center text-sm text-red-400">{error}</p>
        ) : rows.length === 0 && !loading ? (
          <p className="py-6 text-center text-sm text-muted-foreground">
            No transactions yet
          </p>
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
