"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  CreditCard,
  Calendar,
  Clock,
  FileText,
  Wallet,
  ArrowRight,
} from "lucide-react";
import { format } from "date-fns";
import { type MySIPInvestment } from "@/services/sip-for-child.service";
import { formatINR, DetailRow } from "./shared";

export function Step1PaymentDetails({
  application,
  nextUnpaidMonth,
  monthlyAmount,
  isAdvance,
  now,
  onContinue,
  onCancel,
}: {
  application: MySIPInvestment;
  nextUnpaidMonth: number;
  monthlyAmount: number;
  isAdvance: boolean;
  now: Date;
  onContinue: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
          {isAdvance ? "Advance Payment" : "Payment Details"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {isAdvance
            ? `Pay ahead for Month ${nextUnpaidMonth} — stay on track with your SIP.`
            : "Review your premium payment details before proceeding."}
        </p>
      </div>

      <Card className="border-white/10 bg-[#111217] shadow-xl">
        <CardContent className="p-6 space-y-5">
          {/* Month & amount header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isAdvance ? "bg-emerald-500/15" : "bg-amber-500/15"}`}
              >
                <CreditCard
                  className={`h-7 w-7 ${isAdvance ? "text-emerald-400" : "text-amber-400"}`}
                />
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {isAdvance ? "Advance Premium" : "Monthly Premium"}
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {formatINR(monthlyAmount)}/-
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">
                {isAdvance ? "Paying Month" : "Month"}
              </p>
              <p className="text-2xl font-bold text-amber-400">
                {nextUnpaidMonth}/{application.totalMonths}
              </p>
            </div>
          </div>

          {isAdvance && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
              <p className="text-xs font-medium text-emerald-300">
                You already paid Month {application.monthsPaid}. This payment
                covers Month {nextUnpaidMonth} — keeping your SIP ahead of
                schedule.
              </p>
            </div>
          )}

          <div className="h-px bg-white/10" />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailRow
              icon={<Calendar className="h-4 w-4 text-indigo-400" />}
              label="Payment Date"
              value={format(now, "dd MMM yyyy")}
            />
            <DetailRow
              icon={<Clock className="h-4 w-4 text-indigo-400" />}
              label="Payment Time"
              value={format(now, "hh:mm a")}
            />
            <DetailRow
              icon={<FileText className="h-4 w-4 text-indigo-400" />}
              label="Scheme"
              value={`Plan ${application.scheme}`}
            />
            <DetailRow
              icon={<Wallet className="h-4 w-4 text-indigo-400" />}
              label="Months Paid"
              value={`${application.monthsPaid} / ${application.totalMonths}`}
            />
          </div>

          <div className="h-px bg-white/10" />

          {/* Summary */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Premium Amount</span>
              <span className="font-bold text-white">
                {formatINR(monthlyAmount)}/-
              </span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Payment Method</span>
              <span className="font-bold text-white">Wallet Balance</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Total After Payment</span>
              <span className="font-bold text-emerald-400">
                {nextUnpaidMonth}/{application.totalMonths} months
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-white/20"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="flex-1 bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/20"
        >
          Continue to Pay
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}