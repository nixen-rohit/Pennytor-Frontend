"use client";

import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Network, RefreshCw } from "lucide-react";

import { initialReferralState } from "@/components/User/ReferralChain/types";
import { ReferralList } from "@/components/User/ReferralChain/ReferralList";
import { ReferralTree } from "@/components/User/ReferralChain/ReferralTree";

export {
  initialReferralState,
 
} from "@/components/User/ReferralChain/types";
export type {
  ReferralState,
  ReferralUser,
  CommissionRecord,
  ReferralStats,
  ReferralTreeData,
} from "@/components/User/ReferralChain/types";
export { ReferralList } from "@/components/User/ReferralChain/ReferralList";
export { ReferralTree } from "@/components/User/ReferralChain/ReferralTree";

export default function ReferralDashboard() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            Referral Network
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Track and manage your referral network and earnings
          </p>
        </div>

        <Button
          type="button"
          variant="outline"
          className="border-white/20 text-slate-300 shrink-0"
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

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
          <ReferralList data={initialReferralState} />
        </TabsContent>

        <TabsContent value="tree">
          <ReferralTree data={initialReferralState} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
