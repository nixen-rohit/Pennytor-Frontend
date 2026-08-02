"use client";

import { WalletBalanceCard } from "./WalletBalanceCard";
import { PaymentSlipCard } from "./PaymentSlipCard";
import { WALLET_BALANCE } from "./types";

export default function FundDashboard() {
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
          <WalletBalanceCard balance={WALLET_BALANCE} className="lg:col-span-2" />
          <PaymentSlipCard />
        </div>
      </div>
    </div>
  );
}
