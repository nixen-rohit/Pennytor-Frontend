"use client"
import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, Wallet, TrendingUp, RefreshCw, PieChart, ArrowRight } from "lucide-react"
import Link from "next/link"
import { DepositService } from "@/services/deposit.service"

const inr = (v: string | number) => `₹${Number(v || 0).toLocaleString("en-IN")}`

interface PortfolioState {
  totalInvested: number
  activeInvestments: number
}

export default function PortfolioCard() {
  const [state, setState] = useState<PortfolioState | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const r = await DepositService.myDeposits()
      const b = Number(r.balance || 0)
      const a = r.items?.filter((d: any) => d.status === "VERIFIED").length || 0
      setState({ totalInvested: b, activeInvestments: a })
    } catch {
      setError("Could not load portfolio data")
      setState(null)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => void load(), 0)
    return () => clearTimeout(id)
  }, [load])

  if (loading) {
    return (
      <Card className="border-white/10 bg-white/5 p-6">
        <div className="flex items-start gap-4 animate-pulse">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-6 w-32 rounded bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-6 w-32 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-8 w-24 rounded bg-white/10" />
        </div>
      </Card>
    )
  }

  if (error && !state) {
    return (
      <Card className="border-white/10 bg-white/5 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <PieChart className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Portfolio unavailable</p>
              <p className="text-xs text-muted-foreground">
                We couldn't load your portfolio data right now.
              </p>
            </div>
          </div>
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="border-white/20 text-slate-300"
            onClick={() => void load()}
          >
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Try Again
          </Button>
        </div>
      </Card>
    )
  }

  if (!state || (state.totalInvested === 0 && state.activeInvestments === 0)) {
    return (
      <Card className="border-white/10 bg-white/5 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <PieChart className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">Your portfolio is empty</p>
              <p className="text-xs text-muted-foreground">
                Start investing to see your portfolio grow here.
              </p>
            </div>
          </div>
          <Button asChild className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white">
            <Link href="/investment/all-schemes/investment-fund">
              Start Investing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-white/5 p-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 space-y-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <Wallet className="h-4 w-4 text-[#E85B66]" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Total Invested
              </span>
            </div>
            <p className="text-xl font-bold text-green-500">{inr(state.totalInvested)}</p>
          </div>
          <div>
            <div className="flex items-center gap-2 mb-1">
              <TrendingUp className="h-4 w-4 text-green-500" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Active Investments
              </span>
            </div>
            <p className="text-xl font-bold">{state.activeInvestments}</p>
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <Button type="button" size="sm" variant="outline" className="border-white/20 text-slate-300" onClick={() => void load()}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button asChild size="sm" className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white">
            <Link href="/funds/deposite">
              Show More
              <ArrowRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>
    </Card>
  )
}
