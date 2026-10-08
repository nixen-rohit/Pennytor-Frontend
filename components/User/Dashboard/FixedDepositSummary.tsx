"use client"

import { useEffect } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { PiggyBank, Loader2, RefreshCw } from "lucide-react"
import { format } from "date-fns"
import { useDashboardStore } from "@/store/dashboard.store"
import type { FDApplication } from "@/services/fixed-deposit.service"

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export default function FixedDepositSummary() {
  const { summary, loading, error, fetch } = useDashboardStore()
  const items = (summary?.fixedDeposits ?? []) as FDApplication[]

  useEffect(() => {
    void fetch()
  }, [fetch])

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <PiggyBank className="h-5 w-5 text-[#E85B66]" />
            <CardTitle className="text-base font-semibold">Fixed Deposits</CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={() => void fetch(true)}
            className="text-muted-foreground hover:text-white"
          >
            {loading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#E85B66]" />
            <p className="text-xs text-muted-foreground">Loading fixed deposits...</p>
          </div>
        ) : error ? (
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
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
              <PiggyBank className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground">
              No fixed deposits yet.
            </p>
            <Button
              asChild
              size="sm"
              className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white"
            >
              <Link href="/investment/all-schemes/fixed-deposite">
                Explore Fixed Deposits
              </Link>
            </Button>
          </div>
        ) : (
          items.map((fd) => (
            <div
              key={fd.id}
              className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-3"
            >
              <div className="flex items-center justify-between gap-3">
                <div className="space-y-1">
                  <span className="text-sm font-semibold">{fd.planId}</span>
                  <p className="text-xs text-muted-foreground">
                    Started{" "}
                    {format(new Date(fd.submittedAt ?? fd.createdAt), "dd MMM yyyy")}
                  </p>
                </div>
                <span
                  className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${
                    fd.status === "VERIFIED"
                      ? "bg-green-500/10 text-green-500 border-green-500/20"
                      : fd.status === "REJECTED"
                        ? "bg-red-500/10 text-red-500 border-red-500/20"
                        : "bg-yellow-500/10 text-yellow-500 border-yellow-500/20"
                  }`}
                >
                  {fd.status === "VERIFIED" ? "ACTIVE" : fd.status}
                </span>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/10 bg-white/10">
                <Stat label="Deposit" value={inr(fd.depositAmount)} />
                <Stat label="Total Payout" value={inr(fd.totalPayout)} accent />
                <Stat label="Lock-in" value={`${fd.lockInMonths} months`} />
                <Stat
                  label="EMIs Paid"
                  value={`${fd.emisPaid} of ${fd.totalEmis}`}
                />
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  )
}

function Stat({
  label,
  value,
  accent = false,
}: {
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="bg-[#0b0c12] p-3">
      <p className="text-[11px] text-muted-foreground truncate">{label}</p>
      <p className={`mt-0.5 font-bold truncate ${accent ? "text-green-500" : ""}`}>
        {value}
      </p>
    </div>
  )
}
