"use client"

import { useCallback, useEffect, useState } from "react"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  CalendarClock,
  Wallet,
  Loader2,
  RefreshCw,
  BadgeCheck,
  Clock3,
  Undo2,
  GraduationCap,
} from "lucide-react"
import { format } from "date-fns"
import {
  SIPForChildService,
  type MySIPInvestment,
} from "@/services/sip-for-child.service"

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

export default function UserSIPInvestments() {
  const [items, setItems] = useState<MySIPInvestment[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await SIPForChildService.myApplications()
      setItems(res.items ?? [])
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load SIP investments")
      setItems([])
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    const id = setTimeout(() => void load(), 0)
    return () => clearTimeout(id)
  }, [load])

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5 text-orange-400" />
            <CardTitle className="text-base font-semibold">
              SIP For Child Investments
            </CardTitle>
          </div>
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
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-10">
            <Loader2 className="h-6 w-6 animate-spin text-orange-400" />
          </div>
        ) : error ? (
          <p className="py-8 text-center text-sm text-red-400">{error}</p>
        ) : items.length === 0 ? (
          <div className="py-8 text-center space-y-3">
            <p className="text-sm text-muted-foreground">
              You have no active SIP investments yet.
            </p>
            <Button
              asChild
              size="sm"
              className="bg-orange-600 hover:bg-orange-700 text-white"
            >
              <Link href="/investment/all-schemes/sip-for-child">
                Explore SIP For Child Schemes
              </Link>
            </Button>
          </div>
        ) : (
          items.map((inv) => <SIPInvestmentCard key={inv.id} inv={inv} />)
        )}
      </CardContent>
    </Card>
  )
}

function SIPInvestmentCard({ inv }: { inv: MySIPInvestment }) {
  const statusMeta =
    inv.status === "VERIFIED"
      ? { label: "ACTIVE", cls: "bg-green-500/10 text-green-500 border-green-500/20" }
      : inv.status === "REJECTED"
        ? { label: "REJECTED — REFUNDED", cls: "bg-red-500/10 text-red-500 border-red-500/20" }
        : { label: "PENDING APPROVAL", cls: "bg-yellow-500/10 text-yellow-500 border-yellow-500/20" }

  const progress =
    inv.cycle
      ? Math.min(100, Math.round((inv.cycle.monthsElapsed / inv.totalMonths) * 100))
      : 0

  return (
    <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-4">
      {/* Top row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="text-sm font-semibold">{inv.planLabel}</span>
            <span
              className={`inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium ${statusMeta.cls}`}
            >
              {statusMeta.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground">
            Applied on{" "}
            {format(new Date(inv.submittedAt ?? inv.createdAt), "dd MMM yyyy")}
          </p>
        </div>
        <div className="text-left sm:text-right">
          <p className="text-xs text-muted-foreground">Monthly SIP</p>
          <p className="text-xl font-bold">{inr(inv.monthlyInvestment)}</p>
        </div>
      </div>

      {/* Money flow note */}
      <div className="flex items-start gap-2 rounded-lg bg-white/[0.03] border border-white/5 px-3 py-2">
        {inv.status === "REJECTED" ? (
          <>
            <Undo2 className="h-4 w-4 mt-0.5 shrink-0 text-red-400" />
            <p className="text-xs text-muted-foreground">
              This application was rejected{inv.reviewNote ? `: ${inv.reviewNote}` : "."}{" "}
              The full amount was refunded to your wallet.
            </p>
          </>
        ) : inv.status === "PENDING" ? (
          <>
            <Wallet className="h-4 w-4 mt-0.5 shrink-0 text-yellow-500" />
            <p className="text-xs text-muted-foreground">
              Amount debited from your wallet and locked into{" "}
              <span className="font-medium text-foreground">{inv.planLabel}</span>.
              It will start earning once admin approves your request.
            </p>
          </>
        ) : (
          <>
            <BadgeCheck className="h-4 w-4 mt-0.5 shrink-0 text-green-500" />
            <p className="text-xs text-muted-foreground">
              Amount invested in <span className="font-medium text-foreground">{inv.planLabel}</span>.
              Monthly returns are credited to your wallet automatically.
            </p>
          </>
        )}
      </div>

      {inv.status === "VERIFIED" && inv.cycle && (
        <>
          {/* Stats row */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-px rounded-lg overflow-hidden border border-white/10 bg-white/10">
            <Stat label="Months Paid" value={`${inv.monthsPaid} / ${inv.totalMonths}`} accent />
            <Stat
              label={`Monthly Premium`}
              value={inv.planLabel}
            />
            <Stat
              label="Next Payment Due"
              value={
                inv.cycle.nextPaymentDue
                  ? format(new Date(inv.cycle.nextPaymentDue), "dd MMM yyyy")
                  : inv.monthsPaid >= inv.totalMonths
                    ? "Completed"
                    : "N/A"
              }
            />
            <Stat label="Months Missed" value={`${inv.monthsMissed} / 3`} />
          </div>

          {/* Cycle progress */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between text-xs text-muted-foreground">
              <span className="inline-flex items-center gap-1.5">
                <CalendarClock className="h-3.5 w-3.5" />
                Progress: {inv.monthsPaid} of {inv.totalMonths} months
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Clock3 className="h-3.5 w-3.5" />
                {inv.totalMonths - inv.monthsPaid} months remaining
              </span>
            </div>
            <div className="h-2 rounded-full bg-white/10 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[#E85B66] to-[#E85B66] transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-[11px] text-muted-foreground">
              Premium payments are due monthly starting from{" "}
              {inv.cycle.startAt && format(new Date(inv.cycle.startAt), "dd MMM")}.
            </p>
          </div>
        </>
      )}
    </div>
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
      <p
        className={`mt-0.5 font-bold truncate ${accent ? "text-green-500" : ""}`}
      >
        {value}
      </p>
    </div>
  )
}