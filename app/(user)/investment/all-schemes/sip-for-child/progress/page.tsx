"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp, Loader2 } from "lucide-react";
import Link from "next/link";

export default function SIPProgressPage() {
  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-5xl space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            SIP For Child Progress
          </h1>
        </div>

        <Card className="shadow-sm border-white/10 bg-white/5">
          <CardContent className="p-6 text-center">
            <TrendingUp className="mx-auto h-12 w-12 text-orange-400" />
            <h2 className="mt-4 text-xl font-semibold text-white">SIP Progress Tracking</h2>
            <p className="mt-2 text-zinc-400">
              Track your SIP investment progress, monthly returns, and SWP withdrawals.
            </p>
            <div className="mt-6 flex gap-3 justify-center">
              <Button asChild>
                <Link href="/investment/all-schemes/sip-for-child">
                  Back to Schemes
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}