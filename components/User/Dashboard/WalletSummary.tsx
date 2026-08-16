"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Wallet, Gift, ArrowRight } from "lucide-react"
import Link from "next/link"

export default function WalletSummary() {
  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Wallet className="h-5 w-5 text-[#E85B66]" />
              <span className="text-sm text-muted-foreground">Wallet Balance</span>
            </div>
            <p className="text-3xl font-bold">₹ 0</p>
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Gift className="h-4 w-4 text-green-500" />
              <span>
                Earned from referrals: <span className="font-semibold text-green-500">₹687.5</span>
              </span>
            </div>
          </div>
          <Button asChild className="bg-[#E85B66] hover:bg-[#E85B66]/90 text-white">
            <Link href="/fund/add-fund">
              Invest Now
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
        <p className="mt-4 text-xs text-muted-foreground">
          Explore top mutual funds
        </p>
      </CardContent>
    </Card>
  )
}
