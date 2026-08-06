import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Wallet, Plus, ArrowUpRight, Clock, IndianRupee } from "lucide-react";
import Link from "next/link";

interface Props {
  balance: number;
  className?: string;
}

export function WalletBalanceCard({ balance, className }: Props) {
  return (
    <Card
      className={`relative overflow-hidden border-neutral-800 bg-neutral-950 shadow-sm ${className ?? ""}`}
    >
      <div className="pointer-events-none absolute -right-20 -top-24 h-64 w-64 rounded-full bg-indigo-600/10 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-28 -left-16 h-64 w-64 rounded-full bg-purple-600/10 blur-3xl" />

      <CardContent className="relative space-y-6 p-6 sm:p-8">
        <div className="space-y-3">
          <div className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20">
              <Wallet className="h-5 w-5 text-indigo-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-300">
                Wallet Balance
              </p>
              <p className="text-xs text-slate-500">Available balance</p>
            </div>
          </div>

          <p className="flex items-center gap-2 text-4xl sm:text-5xl font-bold tracking-tight text-slate-50">
            <span>
              <IndianRupee size={38} strokeWidth={3.5} />
            </span>

            {balance.toLocaleString("en-IN", {
              minimumFractionDigits: 2,
              maximumFractionDigits: 2,
            })}
          </p>

          <p className="text-xs text-slate-400">
            Add funds instantly via UPI, or request a withdrawal.
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row">
          <Button
            asChild
            className="flex-1 bg-indigo-600 text-white hover:bg-indigo-700"
          >
            <Link href="/funds/deposite">
              <Plus className="h-4 w-4" />
              Add Funds
            </Link>
          </Button>
          <Button
            asChild
            variant="outline"
            className="flex-1 border-white/20 text-slate-200 hover:bg-white/10"
          >
            <Link href="/funds/withdrawal">
              <ArrowUpRight className="h-4 w-4" />
              Withdraw
            </Link>
          </Button>
        </div>

        <div className="flex items-center gap-2 border-t border-neutral-800 pt-4 text-[11px] text-slate-400">
          <Clock className="h-3.5 w-3.5 shrink-0" />
          Withdrawals are processed within 30 minutes of admin verification.
        </div>
      </CardContent>
    </Card>
  );
}
