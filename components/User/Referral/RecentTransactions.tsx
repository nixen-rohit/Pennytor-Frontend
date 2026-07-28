"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { ChevronLeft, ChevronRight } from "lucide-react"

const transactions = [
  { user: "SAMEER PATRA", product: "Level 1 Commission (FIXED)", commission: "0.5%", status: "PROCESSED", amount: "₹250", date: "27 Jul 2026" },
  { user: "MD IRFAN ANSARI", product: "Level 2 Commission (FIXED)", commission: "0.25%", status: "PROCESSED", amount: "₹125", date: "13 Jul 2026" },
  { user: "GOURAV KUMAR DEY", product: "Level 3 Commission (FIXED)", commission: "0.25%", status: "PROCESSED", amount: "₹62.5", date: "11 Jul 2026" },
  { user: "BANTY KUMAR SINGH", product: "Level 1 Commission (FIXED)", commission: "0.5%", status: "PROCESSED", amount: "₹250", date: "07 Jul 2026" },
  { user: "SONAKSHI KUMARI", product: "Level 3 Commission (FIXED)", commission: "0.25%", status: "PROCESSED", amount: "₹125", date: "01 Jul 2026" },
]

const PAGE_SIZE = 5

export default function RecentTransactions() {
  const [page, setPage] = useState(1)
  const totalPages = Math.ceil(transactions.length / PAGE_SIZE)
  const startIndex = (page - 1) * PAGE_SIZE
  const pageItems = transactions.slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-base font-semibold">Recent Transactions</CardTitle>
      </CardHeader>
      <CardContent className="p-4">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-white/10">
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">User</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Product</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Commission</th>
                <th className="text-left py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Status</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Amount</th>
                <th className="text-right py-3 px-2 text-muted-foreground font-medium text-xs uppercase tracking-wider">Date</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.map((tx, i) => (
                <tr key={i} className="border-b border-white/5 last:border-0">
                  <td className="py-3 px-2 font-medium whitespace-nowrap">{tx.user}</td>
                  <td className="py-3 px-2 text-muted-foreground whitespace-nowrap">{tx.product}</td>
                  <td className="py-3 px-2 whitespace-nowrap">{tx.commission}</td>
                  <td className="py-3 px-2">
                    <Badge
                      variant="outline"
                      className="bg-green-500/10 text-green-500 border-green-500/20 text-xs"
                    >
                      {tx.status}
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right font-semibold whitespace-nowrap">{tx.amount}</td>
                  <td className="py-3 px-2 text-right text-muted-foreground whitespace-nowrap">{tx.date}</td>
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

        {transactions.length > 0 && (
          <div className="flex items-center justify-between pt-4">
            <p className="text-xs text-muted-foreground">
              Showing {startIndex + 1}-{Math.min(startIndex + PAGE_SIZE, transactions.length)} of {transactions.length} transactions
            </p>
            <div className="flex items-center gap-1">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
                className="h-8 w-8 p-0"
              >
                <ChevronLeft className="h-4 w-4" />
              </Button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={page === p ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setPage(p)}
                  className={cn(
                    "h-8 w-8 p-0 text-xs",
                    page === p && "bg-[#E85B66] hover:bg-[#E85B66]/90 text-white",
                  )}
                >
                  {p}
                </Button>
              ))}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
                className="h-8 w-8 p-0"
              >
                <ChevronRight className="h-4 w-4" />
              </Button>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
