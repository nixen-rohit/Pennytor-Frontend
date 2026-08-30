"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeft, Loader2, RefreshCw } from "lucide-react";
import {
  FixedDepositService,
  type FDApplication,
} from "@/services/fixed-deposit.service";
import { ProgressCard } from "./ProgressCard";
import { EmptyState } from "./EmptyState";

const planLabel = (planId: string) => {
  const n = parseInt(planId.replace("FD_", ""), 10);
  return `₹${n.toLocaleString("en-IN")}`;
};

export default function FDProgressPage() {
  const [applications, setApplications] = useState<FDApplication[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState<string>("");

  const fetchApps = async (isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    setError(null);
    try {
      const data = await FixedDepositService.myApplications();
      setApplications(data);
      if (data.length > 0 && !activeTab) {
        const verified = data.find((a) => a.status === "VERIFIED");
        setActiveTab(verified?.id || data[0].id);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApps();
  }, []);

  if (!loading && !error && applications.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="min-h-screen bg-[#09090b] px-4 py-8 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-5xl">
        <Link
          href="/investment/all-schemes/fixed-deposite"
          className="mb-2 inline-flex items-center gap-1.5 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Plans
        </Link>

        <div className="mb-6 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-white">
              Fixed Deposit Progress
            </h1>
            <p className="mt-1 text-sm text-zinc-400">
              Track your Fixed Deposit investments and EMI payouts.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Link href="/investment/all-schemes/fixed-deposite/reports">
              <Button
                variant="outline"
                size="sm"
                className="border-white/10 bg-white/5 text-white hover:bg-white/10"
              >
                Reports
              </Button>
            </Link>
            <Button
              onClick={() => fetchApps(true)}
              variant="outline"
              size="sm"
              disabled={refreshing}
              className="border-white/10 bg-white/5 text-white hover:bg-white/10"
            >
              <RefreshCw
                className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`}
              />
            </Button>
          </div>
        </div>

        {loading && (
          <div className="flex items-center justify-center py-16">
            <Loader2 className="h-7 w-7 animate-spin text-amber-400" />
          </div>
        )}

        {error && (
          <div className="py-16 text-center">
            <p className="text-sm text-red-400">{error}</p>
          </div>
        )}

        {!loading && !error && applications.length > 0 && (
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="mb-6 bg-[#111217] border border-white/10">
              {applications.map((app) => (
                <TabsTrigger
                  key={app.id}
                  value={app.id}
                  className="data-[state=active]:bg-amber-400 data-[state=active]:text-black"
                >
                  {planLabel(app.planId)}
                </TabsTrigger>
              ))}
            </TabsList>

            {applications.map((app) => (
              <TabsContent key={app.id} value={app.id}>
                <ProgressCard app={app} />
              </TabsContent>
            ))}
          </Tabs>
        )}
      </div>
    </div>
  );
}