"use client"

import { useEffect } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, ArrowRight, RefreshCw, AlertCircle } from "lucide-react"
import Link from "next/link"
import { useDashboardStore } from "@/store/dashboard.store"

export default function WalletSummary() {
  const { summary, loading, error, fetch } = useDashboardStore()
  const balance = summary?.wallet?.balance ?? null

  useEffect(() => {
    void fetch()
  }, [fetch])

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#E85B66]" />
              <span className="text-sm text-muted-foreground">Wallet Balance</span>
            </div>
            {loading ? (
              <div className="h-9 w-32 animate-pulse rounded bg-white/10" />
            ) : error ? (
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-400" />
                <span className="text-sm text-red-400">Balance unavailable</span>
              </div>
            ) : (
              <p className="text-3xl font-bold">
                ₹{Number(balance ?? 0).toLocaleString("en-IN")}
              </p>
            )}
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"              
              size="icon"
              disabled={loading}
              onClick={() => void fetch(true)}
              aria-label="Refresh"
              className="border-white/20 bg-zinc-700 hover:bg-zinc-700/80 "
            >
              <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
            </Button>
            <Button asChild className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white">
              <Link href="/funds/deposite">
                Add Funds
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Balance updates automatically when deposits are approved or
          investments are credited.
        </p>
      </CardContent>
    </Card>
  )
}
