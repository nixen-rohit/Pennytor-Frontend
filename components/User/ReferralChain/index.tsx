"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Network, RefreshCw } from "lucide-react";

import { initialReferralState } from "@/components/User/ReferralChain/types";
import type { ReferralState } from "@/components/User/ReferralChain/types";
import { ReferralList } from "@/components/User/ReferralChain/ReferralList";
import { ReferralTree } from "@/components/User/ReferralChain/ReferralTree";
import { ReferralService } from "@/services/referral.service";

export {
  initialReferralState,
} from "@/components/User/ReferralChain/types";
export type {
  ReferralState,
  ReferralUser,
  ReferralStats,
  ReferralTreeData,
} from "@/components/User/ReferralChain/types";
export { ReferralList } from "@/components/User/ReferralChain/ReferralList";
export { ReferralTree } from "@/components/User/ReferralChain/ReferralTree";

export default function ReferralDashboard() {
  const [data, setData] = useState<ReferralState>(initialReferralState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [stats, code, referralsRes, tree] = await Promise.all([
        ReferralService.getStats(),
        ReferralService.getMyCode(),
        ReferralService.getReferrals(1, 100),
        ReferralService.getTree(),
      ]);

      setData({
        stats,
        myCode: code.referralCode,
        referrals: referralsRes.referrals,
        treeData: tree,
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load referral data");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            Referral Network
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your referral network
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="border-white/20 text-slate-300 shrink-0"
          onClick={fetchData}
          disabled={loading}
        >
          <RefreshCw className={`mr-2 h-4 w-4 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
          {error}
        </div>
      )}

      <Tabs defaultValue="referrals" className="space-y-6">
        <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
          <TabsTrigger value="referrals" className="flex items-center gap-2">
            <Users className="h-4 w-4" />
            My Referrals
          </TabsTrigger>
          <TabsTrigger value="tree" className="flex items-center gap-2">
            <Network className="h-4 w-4" />
            Referral Tree
          </TabsTrigger>
        </TabsList>

        <TabsContent value="referrals">
          <ReferralList data={data} />
        </TabsContent>

        <TabsContent value="tree">
          <ReferralTree data={data} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
