"use client";

import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { TrendingUp } from "lucide-react";

export function EmptyState() {
  return (
    <div className="min-h-screen bg-[#09090b] px-4 py-12 text-white sm:px-6 lg:px-8">
      <div className="mx-auto max-w-4xl text-center">
        <Card className="border-white/10 bg-[#111217] p-8">
          <CardContent className="p-0 space-y-4">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-amber-400/10">
              <TrendingUp className="h-8 w-8 text-amber-400" />
            </div>
            <h2 className="text-xl font-bold text-white">
              No Fixed Deposits Yet
            </h2>
            <p className="text-sm text-zinc-400">
              You haven&apos;t applied for any Fixed Deposit plans yet.
            </p>
            <Link href="/investment/all-schemes/fixed-deposite">
              <Button className="bg-amber-400 text-black hover:bg-amber-300">
                Browse Plans
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}