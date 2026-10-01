"use client"
import { useCallback, useEffect, useState } from "react"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  ShieldCheck,
  Award,
  UserPlus,
  RefreshCw,
  Users,
  ChevronRight,
} from "lucide-react"
import Link from "next/link"
import { ReferralService } from "@/services/referral.service"

interface ReferralStats {
  code: string | null
  level: number
  referrals: number
}

export default function ReferralSummary() {
  const [stats, setStats] = useState<ReferralStats | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = useCallback(async () => {
    setLoading(true)
    setError(null)
    try {
      const elig = await ReferralService.getStats()
      const codeRes = await ReferralService.getMyCode()
      setStats({
        code: codeRes.referralCode,
        level: elig.currentUnlockedLevel,
        referrals: elig.verifiedDirectReferrals,
      })
    } catch {
      setError("Could not load referral data")
      setStats(null)
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
        <div className="flex flex-col sm:flex-row items-start gap-4 animate-pulse">
          <div className="flex-1 space-y-4">
            <div className="space-y-2">
              <div className="h-3 w-28 rounded bg-white/10" />
              <div className="h-6 w-16 rounded bg-white/10" />
            </div>
            <div className="space-y-2">
              <div className="h-3 w-24 rounded bg-white/10" />
              <div className="h-6 w-24 rounded bg-white/10" />
            </div>
          </div>
          <div className="h-8 w-40 rounded bg-white/10" />
        </div>
      </Card>
    )
  }

  if (error && !stats) {
    return (
      <Card className="border-white/10 bg-white/5 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-500/10">
              <Users className="h-5 w-5 text-red-400" />
            </div>
            <div>
              <p className="text-sm font-medium">Referral data unavailable</p>
              <p className="text-xs text-muted-foreground">
                We couldn't load your referral stats right now.
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

  if (!stats) {
    return (
      <Card className="border-white/10 bg-white/5 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10">
              <Users className="h-5 w-5 text-muted-foreground" />
            </div>
            <div>
              <p className="text-sm font-medium">No referral data yet</p>
              <p className="text-xs text-muted-foreground">
                Refer friends to earn commission on their investments.
              </p>
            </div>
          </div>
          <Button asChild className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white">
            <Link href="/rewards">
              View Referral Program
              <ChevronRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </Card>
    )
  }

  return (
    <Card className="border-white/10 bg-white/5 p-6">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 min-w-0 space-y-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E85B66]/10">
              <UserPlus className="h-5 w-5 text-[#E85B66]" />
            </div>
            <div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Verified Referrals
              </span>
              <p className="text-xl font-bold text-green-500">{stats.referrals}</p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E85B66]/10">
              <Award className="h-5 w-5 text-[#E85B66]" />
            </div>
            <div>
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                Current Level
              </span>
              <p className="text-xl font-bold">Level {stats.level}</p>
            </div>
          </div>
        </div>

        <div className="flex flex-col gap-2 sm:min-w-0">
          <Button type="button" size="sm" variant="outline" className="border-white/20 text-slate-300" onClick={() => void load()}>
            <RefreshCw className="mr-2 h-3.5 w-3.5" />
            Refresh
          </Button>
          <Button asChild size="sm" className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white">
            <Link href="/rewards">
              View Referral Program
              <ChevronRight className="ml-2 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>
      </div>

      {stats.referrals >= 3 && (
        <div className="mt-4 flex items-center gap-2 rounded-lg border border-green-500/20 bg-green-500/10 px-3 py-2">
          <ShieldCheck className="h-4 w-4 shrink-0 text-green-500" />
          <span className="text-sm font-medium text-green-500">
            You have enough referrals to earn Level 2 commissions
          </span>
        </div>
      )}
    </Card>
  )
}
