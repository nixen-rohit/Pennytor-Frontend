"use client"
import { useCallback, useEffect, useState } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Loader2, ShieldCheck, Award, UserPlus } from "lucide-react"
import Link from "next/link"
import { ReferralService } from "@/services/referral.service"

export default function ReferralSummary() {
  const [stats, setStats] = useState<{code: string | null; level: number; referrals: number} | null>(null)
  const [loading, setLoading] = useState(true)

  const load = useCallback(async () => {
    setLoading(true)
    try {
      const elig = await ReferralService.getStats()
      const codeRes = await ReferralService.getMyCode()
      setStats({
        code: codeRes.referralCode,
        level: elig.currentUnlockedLevel,
        referrals: elig.verifiedDirectReferrals,
      })
    } catch (err) {
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
      <div className="h-48 flex items-center justify-center">
        <Loader2 className="h-4 w-4 animate-spin" />
      </div>
    )
  }

  if (!stats) {
    return (
      <div className="h-48 border border-white/10 bg-white/5 backdrop-blur-sm p-8 text-center">
        <p className="text-sm text-muted-foreground">Referral data not available</p>
      </div>
    )
  }

  return (
    <Card className="border-white/10 bg-white/5 p-6">
      <div className="flex flex-col sm:flex-row items-start gap-4">
        <div className="flex-1 min-w-0">
          <div className="px-4 py-3 border-b border-white/10 last:border-0">
            <div className="flex items-center gap-2">
              <UserPlus className="h-4 w-4 text-[#E85B66]" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                VERIFIED REFERRALS
              </span>
            </div>
            <p className="text-lg font-bold text-green-500 mt-1">
              {stats!.referrals}
            </p>
          </div>
          <div className="px-4 py-3 border-b border-white/10 last:border-0">
            <div className="flex items-center gap-2">
              <Award className="h-4 w-4 text-[#E85B66]" />
              <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                CURRENT LEVEL
              </span>
            </div>
            <p className="text-lg font-bold mt-1">
              Level {stats!.level}
            </p>
          </div>
        </div>

        <div className="flex-1 sm:min-w-0 border-t border-white/10 pt-4">
          <Button
            type="button"
            size="sm"
            variant="ghost"
            className="w-full justify-center text-sm text-orange-500 hover:text-orange-400"
            onClick={() => window.location.href="/rewards"}
          >
            View Referral Program
          </Button>
        </div>
      </div>

      {stats!.referrals >= 3 && (
        <div className="mt-4 p-3 rounded-lg bg-green-500/10 border border-green-500/20">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 text-green-500" />
            <span className="text-sm font-medium text-green-500">
              You have enough referrals to earn Level 2 commissions
            </span>
          </div>
        </div>
      )}
    </Card>
  )
}