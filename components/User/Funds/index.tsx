"use client";

import { useEffect, useState } from "react";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { WithdrawalService } from "@/services/withdrawal.service";

export default function FundDashboard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void WithdrawalService.myWithdrawals()
      .then((res) => {
        if (cancelled) return;
        setBalance(Number(res.balance) || 0);
      })
      .catch(() => {})
      .finally(() => {
        if (!cancelled) setLoaded(true);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-6xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-slate-50 sm:text-3xl">
            My Investments
          </h1>
          <p className="mt-1 text-sm text-slate-400">
            Manage your wallet, add funds and track payment slips.
          </p>
        </div>

        <WalletBalanceCard
          balance={balance ?? 0}
          loading={!loaded}
        />
      </div>
    </div>
  );
}