"use client";

import { useEffect, useState } from "react";
import { WalletBalanceCard } from "./WalletBalanceCard";
import { PaymentSlipCard, PaymentSlipData } from "./PaymentSlipCard";
import { DepositService } from "@/services/deposit.service";

export default function FundDashboard() {
  const [balance, setBalance] = useState<number | null>(null);
  const [latestSlip, setLatestSlip] = useState<PaymentSlipData | null>(null);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    let cancelled = false;
    void DepositService.myDeposits()
      .then((res) => {
        if (cancelled) return;
        setBalance(Number(res.balance) || 0);
        const latest = res.items[0];
        if (latest) {
          setLatestSlip({
            txnId: latest.transactionId,
            amount: latest.amount,
            submittedAt: latest.submittedAt,
            createdAt: latest.createdAt,
            status: latest.status,
          });
        }
      })
      .catch(() => {
        if (cancelled) return;
        setBalance(0);
      })
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

        <div className="grid gap-5 grid-cols-1 lg:grid-cols-3">
          <WalletBalanceCard
            balance={balance ?? 0}
            loading={!loaded}
            className="lg:col-span-2"
          />
          <PaymentSlipCard slip={latestSlip} />
        </div>
      </div>
    </div>
  );
}