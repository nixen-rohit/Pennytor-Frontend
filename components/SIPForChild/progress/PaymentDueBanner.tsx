"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertCircle, CheckCircle2, Zap, ArrowRight } from "lucide-react";
import { format } from "date-fns";
import { type MySIPInvestment } from "@/services/sip-for-child.service";

const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export function PaymentDueBanner({
  inv,
  onPayNow,
}: {
  inv: MySIPInvestment;
  onPayNow: () => void;
}) {
  const isVerified = inv.status === "VERIFIED";
  const isPaymentDue = isVerified && inv.monthsPaid < inv.totalMonths;
  const monthlyAmount = Number(inv.monthlyInvestment);

  if (!isPaymentDue) return null;

  const paidMonths = new Set(
    (inv.premiums ?? [])
      .filter((p) => p.status === "PAID")
      .map((p) => p.monthNumber),
  );
  let nextUnpaidMonth = inv.monthsPaid + 1;
  while (
    nextUnpaidMonth <= inv.totalMonths &&
    paidMonths.has(nextUnpaidMonth)
  ) {
    nextUnpaidMonth++;
  }
  const isAdvance = nextUnpaidMonth > inv.monthsPaid + 1;

  const isOverdue =
    inv.nextPaymentDue && new Date(inv.nextPaymentDue) < new Date();

  return (
    <Card
      className={`border-2 ${
        isOverdue
          ? "border-red-500/40 bg-gradient-to-r from-red-500/10 to-amber-500/5"
          : isAdvance
            ? "border-emerald-500/30 bg-gradient-to-r from-emerald-500/10 to-indigo-500/5"
            : "border-amber-500/30 bg-gradient-to-r from-amber-500/10 to-emerald-500/5"
      } shadow-lg`}
    >
      <CardContent className="p-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-start gap-4">
            <div
              className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${
                isOverdue
                  ? "bg-red-500/20"
                  : isAdvance
                    ? "bg-emerald-500/20"
                    : "bg-amber-500/20"
              }`}
            >
              {isOverdue ? (
                <AlertCircle className="h-6 w-6 text-red-400" />
              ) : isAdvance ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <Zap className="h-6 w-6 text-amber-400" />
              )}
            </div>
            <div className="space-y-1">
              <h3 className="text-base font-bold text-white">
                {isAdvance
                  ? "Advance Premium"
                  : inv.monthsPaid === 0
                    ? "First Premium Payment Due"
                    : isOverdue
                      ? "Payment Overdue"
                      : "Monthly Premium Due"}
              </h3>
              <p className="text-sm text-zinc-400">
                {isAdvance
                  ? `Month ${inv.monthsPaid} is already paid. Pay Month ${nextUnpaidMonth} of ${inv.totalMonths} now to stay ahead.`
                  : inv.monthsPaid === 0
                    ? "Your application has been approved! Pay your first premium to activate the SIP."
                    : isOverdue
                      ? `Month ${nextUnpaidMonth} payment was due on ${
                          inv.nextPaymentDue
                            ? format(
                                new Date(inv.nextPaymentDue),
                                "dd MMM yyyy",
                              )
                            : "earlier"
                        }. Pay now to avoid missing it.`
                      : `Month ${nextUnpaidMonth} of ${inv.totalMonths} — ${
                          inv.nextPaymentDue
                            ? `due ${format(new Date(inv.nextPaymentDue), "dd MMM yyyy")}`
                            : "pay now to continue"
                        }`}
              </p>
              <div className="flex items-center gap-3 pt-1">
                <span className="text-lg font-bold text-green-400">
                  {inr(monthlyAmount)}
                </span>
                <span className="text-xs text-zinc-500">per month</span>
                {isAdvance && (
                  <span className="rounded-md bg-emerald-500/15 px-2 py-0.5 text-[11px] font-bold text-emerald-300">
                    ADVANCE
                  </span>
                )}
              </div>
            </div>
          </div>
          <Button
            type="button"
            onClick={onPayNow}
            className={`shrink-0 px-8 py-3 text-sm font-bold shadow-lg ${
              isOverdue
                ? "bg-red-600 hover:bg-red-700 shadow-red-500/20"
                : isAdvance
                  ? "bg-emerald-600 hover:bg-emerald-700 shadow-emerald-500/20"
                  : "bg-amber-600 hover:bg-amber-700 shadow-amber-500/20"
            } text-white`}
          >
            {isAdvance ? "Pay Advance" : "Pay Now"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>

        {inv.monthsMissed >= 2 && (
          <div className="mt-3 rounded-lg border border-red-500/20 bg-red-500/10 px-3 py-2">
            <p className="text-xs font-medium text-red-300">
              Warning: You have {inv.monthsMissed} missed payment(s). On the 4th
              missed payment, your SIP will be auto-rejected and refunded.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}