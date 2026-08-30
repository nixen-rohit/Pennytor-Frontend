"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Loader2, RefreshCw } from "lucide-react";
import {
  SIPForChildService,
  type MySIPInvestment,
} from "@/services/sip-for-child.service";
import { PayPremium } from "../premium/PayPremium";
import { PaymentDueBanner } from "./PaymentDueBanner";
import { ProgressCard } from "./ProgressCard";
import { EmptyState } from "./EmptyState";

const planLabel = (scheme: string) => {
  const n = parseInt(scheme.replace("PLAN_", ""), 10);
  const letter = scheme === "PLAN_5000" ? "A" : "B";
  return `SIP PLAN ${letter} (₹${n.toLocaleString("en-IN")})`;
};

export default function SIPProgress() {
  const [items, setItems] = useState<MySIPInvestment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [tabOverride, setTabOverride] = useState<string | null>(null);
  const [payingAppId, setPayingAppId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await SIPForChildService.myApplications();
      setItems(res.items ?? []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load progress");
      setItems([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const id = setTimeout(() => void load(), 0);
    return () => clearTimeout(id);
  }, [load]);

  const plans = useMemo(() => {
    const seen = new Set<string>();
    const list: Array<{ scheme: string; apps: MySIPInvestment[] }> = [];
    for (const inv of items) {
      if (!seen.has(inv.scheme)) {
        seen.add(inv.scheme);
        list.push({
          scheme: inv.scheme,
          apps: items.filter((i) => i.scheme === inv.scheme),
        });
      }
    }
    return list;
  }, [items]);

  const defaultTab = useMemo(() => {
    const verified = plans.find((p) =>
      p.apps.some((a) => a.status === "VERIFIED"),
    );
    return (verified ?? plans[0])?.scheme ?? "";
  }, [plans]);

  const activeTab = tabOverride ?? defaultTab;

  const payingApp = payingAppId
    ? (items.find((i) => i.id === payingAppId) ?? null)
    : null;

  if (payingApp) {
    return (
      <PayPremium
        application={payingApp}
        onPaid={() => {
          setPayingAppId(null);
          void load();
        }}
        onCancel={() => setPayingAppId(null)}
      />
    );
  }

  return (
    <div className="min-h-screen bg-[#08090f] px-4 py-10 text-white sm:px-6 lg:px-8">
      <div className="mx-auto w-full max-w-4xl space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">
              SIP Progress
            </h1>
            <p className="text-sm text-zinc-400">
              Your SIP for Child payment history and month-by-month tracking.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-white/15 bg-white/5 text-white"
            >
              <Link href="/investment/all-schemes/sip-for-child/reports">
                Reports
              </Link>
            </Button>
            <Button
              type="button"
              variant="outline"
              size="icon"
              disabled={loading}
              onClick={() => void load()}
              className="border-white/15 bg-white/5"
              aria-label="Refresh"
            >
              {loading ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <RefreshCw className="h-4 w-4" />
              )}
            </Button>
          </div>
        </div>

        {loading && items.length === 0 ? (
          <div className="flex items-center justify-center py-24">
            <Loader2 className="h-7 w-7 animate-spin text-indigo-500" />
          </div>
        ) : error ? (
          <p className="py-24 text-center text-sm text-red-400">{error}</p>
        ) : plans.length === 0 ? (
          <EmptyState />
        ) : (
          <Tabs value={activeTab} onValueChange={setTabOverride}>
            <TabsList className="mb-6 bg-[#111217] border border-white/10">
              {plans.map((p) => (
                <TabsTrigger
                  key={p.scheme}
                  value={p.scheme}
                  className="data-[state=active]:bg-amber-400 data-[state=active]:text-black"
                >
                  {planLabel(p.scheme)}
                </TabsTrigger>
              ))}
            </TabsList>
            {plans.map((p) => (
              <TabsContent
                key={p.scheme}
                value={p.scheme}
                className="space-y-6"
              >
                {p.apps.map((inv) => (
                  <div key={inv.id} className="space-y-4">
                    <PaymentDueBanner
                      inv={inv}
                      onPayNow={() => setPayingAppId(inv.id)}
                    />
                    <ProgressCard
                      inv={inv}
                      onPayNow={() => setPayingAppId(inv.id)}
                    />
                  </div>
                ))}
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}