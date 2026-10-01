"use client"

import { useCallback, useEffect, useMemo, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  TrendingUp,
  Loader2,
  RefreshCw,
  Wallet,
  BarChart3,
  CalendarClock,
  ChevronRight,
} from "lucide-react"
import {
  InvestmentFundService,
  type MyInvestment,
} from "@/services/investment-fund.service"

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export default function InvestmentSummary() {
  const [items, setItems] = useState<MyInvestment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await InvestmentFundService.myApplications()
      setItems(res.items ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load summary")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => void load(), 0)
    return () => clearTimeout(id)
  }, [load])

  const totals = useMemo(() => {
    const active = items.filter((i) => i.status === "VERIFIED")
    return {
      totalInvested: items.reduce((sum, i) => sum + (Number(i.amount) || 0), 0),
      activePlans: active.length,
      monthlyRoi: active.reduce((sum, i) => sum + (Number(i.monthlyRoi) || 0), 0),
      totalRoi: items.reduce((sum, i) => sum + (Number(i.totalRoiPaid) || 0), 0),
    }
  }, [items])

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5 text-[#E85B66]" />
            <CardTitle className="text-base font-semibold">
              Investment Portfolio
            </CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={loading}
              onClick={() => void load()}
              className="text-muted-foreground hover:text-white"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
            <Button asChild variant="ghost" size="sm" className="text-muted-foreground gap-1">
              <Link href="/investment/all-schemes/investment-fund/progress">
                View All
                <ChevronRight className="h-3 w-3" />
              </Link>
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {loading && items.length === 0 ? (
          <div className="flex flex-col items-center gap-2 py-12">
            <Loader2 className="h-6 w-6 animate-spin text-[#E85B66]" />
            <p className="text-xs text-muted-foreground">Loading investment summary...</p>
          </div>
        ) : error ? (
          <div className="flex flex-col items-center gap-3 py-10">
            <p className="text-sm text-red-400">{error}</p>
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
        ) : (
          <>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <Stat
                icon={<Wallet className="h-3.5 w-3.5" />}
                label="Total Invested"
                value={inr(totals.totalInvested)}
              />
              <Stat
                icon={<BarChart3 className="h-3.5 w-3.5" />}
                label="Active Plans"
                value={String(totals.activePlans)}
              />
              <Stat
                icon={<TrendingUp className="h-3.5 w-3.5" />}
                label="Expected Monthly ROI"
                value={inr(totals.monthlyRoi)}
                accent
              />
              <Stat
                icon={<CalendarClock className="h-3.5 w-3.5" />}
                label="ROI Received"
                value={inr(totals.totalRoi)}
              />
            </div>

            {items.length === 0 ? (
              <div className="flex flex-col items-center gap-3 rounded-lg border border-dashed border-white/10 py-10">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-white/10">
                  <BarChart3 className="h-6 w-6 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground">
                  No investments yet — start with an Investment Fund plan.
                </p>
                <p className="text-xs text-muted-foreground text-center max-w-xs">
                  Choose a plan that fits your goal and earn monthly returns automatically.
                </p>
                <Button
                  asChild
                  size="sm"
                  className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white"
                >
                  <Link href="/investment/all-schemes/investment-fund">
                    Explore Schemes
                  </Link>
                </Button>
              </div>
            ) : (
              <div className="space-y-2">
                {items.slice(0, 3).map((i) => (
                  <Link
                    key={i.id}
                    href="/investment/all-schemes/investment-fund/progress"
                    className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3 transition-colors hover:bg-white/[0.06]"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-sm font-semibold">{i.planLabel}</span>
                      <span
                        className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
                          i.status === "VERIFIED"
                            ? "bg-green-500/10 text-green-500"
                            : i.status === "REJECTED"
                              ? "bg-red-500/10 text-red-500"
                              : "bg-yellow-500/10 text-yellow-500"
                        }`}
                      >
                        {i.status === "VERIFIED" ? "ACTIVE" : i.status}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold">{inr(i.amount)}</p>
                      {i.status === "VERIFIED" && (
                        <p className="text-[11px] text-green-500">
                          +{inr(i.monthlyRoi)}/mo
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  )
}

function Stat({
  icon,
  label,
  value,
  accent = false,
}: {
  icon: React.ReactNode
  label: string
  value: string
  accent?: boolean
}) {
  return (
    <div className="p-3 rounded-lg bg-white/5 space-y-1">
      <div className="flex items-center gap-1.5">
        {icon}
        <span className="text-[10px] text-muted-foreground">{label}</span>
      </div>
      <p className={`text-sm font-bold ${accent ? "text-green-500" : ""}`}>
        {value}
      </p>
    </div>
  )
}
