"use client";

import { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Network, RefreshCw } from "lucide-react";

import { initialReferralState } from "@/components/User/ReferralChain/types";
import type {
  ReferralState,
  ReferralUser,
  ReferralTreeNode,
} from "@/components/User/ReferralChain/types";
import { ReferralList } from "@/components/User/ReferralChain/ReferralList";
import { ReferralTree } from "@/components/User/ReferralChain/ReferralTree";
import { ReferralService } from "@/services/referral.service";

export {
  initialReferralState,
} from "@/components/User/ReferralChain/types";
export type {
  ReferralState,
  ReferralUser,
  ReferralTreeNode,
} from "@/components/User/ReferralChain/types";
export { ReferralList } from "@/components/User/ReferralChain/ReferralList";
export { ReferralTree } from "@/components/User/ReferralChain/ReferralTree";

/**
 * Flatten the L1 children of the tree into a list — the new backend
 * has no flat-list endpoint for normal users, but the tree always
 * carries L1 under each top-level node. This is a client-side
 * projection of the same data the old `/referral/referrals` endpoint
 * used to return.
 */
function flattenL1(tree: ReferralTreeNode[]): ReferralUser[] {
  const out: ReferralUser[] = [];
  for (const node of tree) {
    out.push({
      id: node.id,
      firstName: node.firstName,
      lastName: node.lastName,
      email: node.email,
      referralCode: node.referralCode,
      referralCodeStatus: node.referralCodeStatus,
      userType: node.userType,
      createdAt: node.createdAt,
      totalCommission: node.totalCommission,
    });
  }
  return out;
}

export default function ReferralDashboard() {
  const [data, setData] = useState<ReferralState>(initialReferralState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      // Spec §26 endpoints. There is no flat list endpoint any more;
      // we derive the L1 list from the tree.
      const [stats, eligibility, tree] = await Promise.all([
        ReferralService.getStats(),
        ReferralService.getEligibility(),
        ReferralService.getTree(),
      ]);

      setData({
        stats,
        eligibility,
        myCode: eligibility.referralCode,
        treeData: tree,
        referrals: flattenL1(tree),
      });
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to load referral data",
      );
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

          className={"text-xs gap-1.5 border-white/20 shrink-0 transition-all duration-300 bg-zinc-700 hover:bg-zinc-700/80"}

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
