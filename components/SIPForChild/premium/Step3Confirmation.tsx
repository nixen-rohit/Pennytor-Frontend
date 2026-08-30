"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle2, FileText, Send } from "lucide-react";
import { type MySIPInvestment } from "@/services/sip-for-child.service";
import { formatINR, ReceiptRow } from "./shared";

export function Step3Confirmation({
  application,
  paidMonth,
  monthlyAmount,
  isAdvanced,
  onComplete,
}: {
  application: MySIPInvestment;
  paidMonth: number;
  monthlyAmount: number;
  isAdvanced: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in-0 zoom-in-95 duration-500">
      {/* Success header */}
      <div className="text-center space-y-4 py-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15 ring-4 ring-emerald-400/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50">
            {isAdvanced ? "Advance Payment Successful!" : "Payment Successful!"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {isAdvanced
              ? `Month ${paidMonth} advance premium has been paid.`
              : `Month ${paidMonth} premium has been paid.`}
          </p>
        </div>
      </div>

      {/* Receipt card */}
      <Card className="border-white/10 bg-[#111217] shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-zinc-400" />
            <p className="text-sm font-semibold text-zinc-300">
              Payment Receipt
            </p>
          </div>

          <div className="space-y-3">
            <ReceiptRow
              label="Scheme"
              value={`Plan ${application.scheme}`}
            />
            {isAdvanced && (
              <ReceiptRow label="Type" value="Advance Payment" accent />
            )}
            <ReceiptRow
              label="Month"
              value={`${paidMonth} of ${application.totalMonths}`}
            />
            <ReceiptRow
              label="Amount Paid"
              value={`${formatINR(monthlyAmount)}/-`}
              accent
            />
            <ReceiptRow label="Payment Method" value="Wallet Balance" />
            <ReceiptRow
              label="Months Completed"
              value={`${paidMonth} / ${application.totalMonths}`}
            />
            {application.monthsMissed > 0 && (
              <ReceiptRow
                label="Months Missed"
                value={`${application.monthsMissed}`}
                danger
              />
            )}
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <Send className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
            <p className="text-xs text-emerald-300">
              A confirmation email with payment details has been sent to your
              registered email address.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          asChild
          variant="outline"
          className="flex-1 border-white/20"
        >
          <Link href="/investment/all-schemes/sip-for-child/reports">
            View Reports
          </Link>
        </Button>
        <Button
          type="button"
          onClick={onComplete}
          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
        >
          Back to Progress
        </Button>
      </div>
    </div>
  );
}