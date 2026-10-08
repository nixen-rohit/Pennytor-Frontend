"use client"
import { useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  ShieldCheck,
  Award,
  UserPlus,
  RefreshCw,
  Users,
  ChevronRight,
  IndianRupee,
} from "lucide-react"
import Link from "next/link"
import { useDashboardStore } from "@/store/dashboard.store"

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`

interface ReferralStats {
  code: string | null
  level: number
  referrals: number
  totalCommission: string
}

export default function ReferralSummary() {
  const { summary, loading, error, fetch } = useDashboardStore()
  const stats: ReferralStats | null = summary?.referral
    ? {
        code: summary.referral.referralCode,
        level: summary.referral.currentUnlockedLevel,
        referrals: summary.referral.verifiedDirectReferrals,
        totalCommission: summary.referral.totalEarnings,
      }
    : null

  useEffect(() => {
    void fetch()
  }, [fetch])

  if (loading) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardHeader className="p-4 pb-0">
          <div className="h-5 w-32 animate-pulse rounded bg-white/10" />
        </CardHeader>
        <CardContent className="p-4 grid grid-cols-3 gap-3">
          <div className="h-20 animate-pulse rounded-lg bg-white/10" />
          <div className="h-20 animate-pulse rounded-lg bg-white/10" />
          <div className="h-20 animate-pulse rounded-lg bg-white/10" />
        </CardContent>
      </Card>
    )
  }

  if (error && !stats) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
            <Users className="h-5 w-5 text-red-400" />
          </div>
          <p className="text-sm font-medium">Referral data unavailable</p>
          <p className="text-xs text-muted-foreground">
            We couldn't load your referral stats right now.
          </p>
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
        </CardContent>
      </Card>
    )
  }

  if (!stats) {
    return (
      <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
        <CardContent className="p-6 flex flex-col items-center gap-3 text-center">
          <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium">No referral data yet</p>
          <p className="text-xs text-muted-foreground">
            Refer friends to earn commission on their investments.
          </p>
          <Button asChild className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white">
            <Link href="/rewards">
              View Referral Program
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-[#E85B66]" />
            <CardTitle className="text-base font-semibold">Referral Summary</CardTitle>
          </div>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={loading}
            onClick={() => void fetch(true)}
            className="text-muted-foreground hover:text-white"
          >
            <RefreshCw className={`h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          </Button>
        </div>
      </CardHeader>

      <CardContent className="p-4 space-y-4">
        <div className="grid grid-cols-3 gap-3">
          <div className="rounded-lg bg-white/5 p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <UserPlus className="h-3.5 w-3.5 text-[#E85B66]" />
              <span className="text-[10px] text-muted-foreground">Verified Referrals</span>
            </div>
            <p className="text-xl font-bold text-green-500">{stats.referrals}</p>
          </div>

          <div className="rounded-lg bg-white/5 p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <Award className="h-3.5 w-3.5 text-[#E85B66]" />
              <span className="text-[10px] text-muted-foreground">Current Level</span>
            </div>
            <p className="text-xl font-bold">Level {stats.level}</p>
          </div>

          <div className="rounded-lg bg-white/5 p-3 space-y-1">
            <div className="flex items-center gap-1.5">
              <IndianRupee className="h-3.5 w-3.5 text-[#E85B66]" />
              <span className="text-[10px] text-muted-foreground">Total Commission</span>
            </div>
            <p className="text-xl font-bold text-green-500">{inr(stats.totalCommission)}</p>
          </div>
        </div>

        {stats.code && (
          <div className="flex items-center justify-between rounded-lg border border-white/10 bg-white/[0.03] px-4 py-3">
            <div>
              <p className="text-[11px] text-muted-foreground">Your referral code</p>
              <p className="font-mono text-sm font-semibold tracking-wider">{stats.code}</p>
            </div>
            <Button asChild size="sm" className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white">
              <Link href="/rewards">
                Program
                <ChevronRight className="ml-1 h-3.5 w-3.5" />
              </Link>
            </Button>
          </div>
        )}

        {stats.referrals >= 3 && (
          <div className="flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2">
            <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              You have enough referrals to earn Level 2 commissions
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
