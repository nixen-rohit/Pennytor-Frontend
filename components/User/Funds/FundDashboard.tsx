"use client"

import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Wallet,
  ArrowUpRight ,
  Receipt,
  Clock,
  Landmark,
  Plus,
} from "lucide-react"
import Link from "next/link"

const SLIP = {
  beneficiary: "Pennytor Financial Services",
  txnId: "402917583920",
  dateTime: "02 Aug 2026, 10:45 AM",
  requestType: "Credit (CR)",
  status: "Pending review",
}

interface SlipRowProps {
  label: string
  value: string
  mono?: boolean
}

function SlipRow({ label, value, mono = false }: SlipRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-xs text-slate-400">{label}</span>
      <span
        className={`truncate text-right text-xs text-slate-200 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  )
}

export default function FundDashboard() {
  return (
    <div className="min-h-screen p-4">
      <div className="max-w-5xl mx-auto space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            Wallet & Funds
          </h1>
        </div>

        <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-6">
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <Wallet className="h-5 w-5 text-indigo-600" />
                  <span className="text-sm text-slate-400">
                    Wallet Balance
                  </span>
                </div>
                <p className="text-4xl font-bold tracking-tight text-slate-50">
                  ₹687.50
                </p>
                <p className="text-xs text-slate-400">
                  Add funds instantly via UPI, or request a withdrawal.
                </p>
              </div>

              <div className="flex flex-col gap-3 sm:flex-row">
                <Button
                  asChild
                  className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white"
                >
                  <Link href="/funds/add-fund">
                    <Plus className="h-4 w-4" />
                    Add Funds
                  </Link>
                </Button>
                <Button
                  asChild
                  variant="outline"
                  className="flex-1 border-white/20 text-slate-200 hover:bg-white/10"
                >
                  <Link href="/funds/withdrawal-fund">
                    <ArrowUpRight   className="h-4 w-4" />
                    Withdraw
                  </Link>
                </Button>
              </div>

              <div className="flex items-center gap-2 text-xs text-slate-400">
                <Clock className="h-3.5 w-3.5" />
                Withdrawals are processed within 24-48 hours.
              </div>
            </CardContent>
          </Card>

          <Card className="shadow-sm">
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-sm text-slate-400">
                  <Receipt className="h-4 w-4" />
                  Payment slip
                </div>
                <Badge
                  variant="outline"
                  className="bg-amber-500/10 text-amber-300 border-amber-500/20 text-xs"
                >
                  {SLIP.status}
                </Badge>
              </div>

              <div className="divide-y divide-neutral-800">
                <SlipRow label="Paid to" value={SLIP.beneficiary} />
                <SlipRow label="Transaction id" value={SLIP.txnId} mono />
                <SlipRow label="Date and time" value={SLIP.dateTime} />
                <SlipRow label="Request type" value={SLIP.requestType} />
              </div>

              <div className="flex items-center gap-2 text-[11px] text-slate-400">
                <Landmark className="h-3.5 w-3.5" />
                Verified by the admin team within 30 minutes of submission
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
