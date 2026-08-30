"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export function EmptyState() {
  return (
    <Card className="border-dashed border-white/15 bg-white/[0.02] shadow-none">
      <CardContent className="flex flex-col items-center py-16 text-center space-y-4">
        <div className="rounded-full bg-indigo-500/10 p-4 ring-1 ring-indigo-400/30">
          <TrendingUp className="h-8 w-8 text-indigo-400" />
        </div>
        <div>
          <h2 className="text-lg font-semibold">No active SIP yet</h2>
          <p className="mx-auto mt-1 max-w-sm text-sm text-zinc-400">
            Apply to a SIP for Child plan and your progress dashboard will
            appear here with month-by-month payment tracking.
          </p>
        </div>
        <Button
          asChild
          className="bg-indigo-600 hover:bg-indigo-700 text-white"
        >
          <Link href="/investment/all-schemes/sip-for-child">Browse Plans</Link>
        </Button>
      </CardContent>
    </Card>
  );
}