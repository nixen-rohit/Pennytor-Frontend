"use client";

import { useState, useCallback, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Copy,
  Link,
  UserCheck,
  Share2,
  Check,
  Users,
  Lock,
  TrendingUp,
} from "lucide-react";
import { ReferralService, EligibilityResponse } from "@/services/referral.service";

interface MyStatsView {
  directReferrals: number;
  verifiedDirectReferrals: number;
  currentUnlockedLevel: number;
  rates: { l1: number; l2: number; l3: number; l4: number; l5: number };
  totalEarnings: string;
  monthlyEarnings: string;
}

function StatsCards({ stats }: { stats: MyStatsView }) {
  const cards = [
    {
      label: "Total Referrals",
      value: stats.directReferrals,
      icon: Users,
      color: "text-blue-500",
      bg: "bg-blue-500/10",
    },
    {
      label: "Verified Direct",
      value: stats.verifiedDirectReferrals,
      icon: UserCheck,
      color: "text-green-500",
      bg: "bg-green-500/10",
    },
    {
      label: "This Month Earnings",
      value: `₹${Number(stats.monthlyEarnings).toLocaleString("en-IN")}`,
      icon: TrendingUp,
      color: "text-purple-500",
      bg: "bg-purple-500/10",
    },
  ];

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.label}
            className="rounded-xl border border-neutral-800 bg-neutral-900/50 p-5 transition-colors hover:border-neutral-700"
          >
            <div className="flex items-start justify-between">
              <div className="space-y-2">
                <p className="text-sm text-slate-400">{card.label}</p>
                <p className={`text-2xl font-bold ${card.color}`}>{card.value}</p>
              </div>
              <div className={`rounded-lg ${card.bg} p-2.5`}>
                <Icon className={`h-5 w-5 ${card.color}`} />
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function LockedState({ reason }: { reason: string | null }) {
  return (
    <div className="rounded-xl border border-amber-500/20 bg-amber-500/5 p-6 text-center">
      <div className="mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-amber-500/10">
        <Lock className="h-6 w-6 text-amber-400" />
      </div>
      <h3 className="text-base font-semibold text-amber-200">
        Referral program locked
      </h3>
      <p className="mt-2 text-sm text-amber-100/70 max-w-md mx-auto">
        {reason ??
          "Make an investment to unlock your referral program. Once your investment is verified, your referral code will be generated."}
      </p>
    </div>
  );
}

function ReferralCode({ code }: { code: string }) {
  const [copiedCode, setCopiedCode] = useState(false);
  const [copiedLink, setCopiedLink] = useState(false);

  const linkText = `${process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"}/register?ref=${code}`;

  const handleCopy = useCallback(
    async (text: string, setter: (v: boolean) => void) => {
      try {
        await navigator.clipboard.writeText(text);
        setter(true);
        setTimeout(() => setter(false), 2000);
      } catch {
        const ta = document.createElement("textarea");
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand("copy");
        document.body.removeChild(ta);
        setter(true);
        setTimeout(() => setter(false), 2000);
      }
    },
    [],
  );

  return (
    <Card className="border border-white/10 bg-white/5 backdrop-blur-sm">
      <CardHeader className="p-4 pb-0">
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="text-base font-semibold">
              Your Referral Code
            </CardTitle>
            <p className="text-xs text-muted-foreground mt-1">
              Share with friends to grow your network
            </p>
          </div>
          <Share2 className="h-5 w-5 text-[#E85B66]" />
        </div>
      </CardHeader>
      <CardContent className="p-4 space-y-4">
        <div className="relative flex items-center justify-between p-3 rounded-lg bg-white/10 border border-white/10">
          <code className="text-sm font-mono font-bold tracking-wider text-white">
            {code || "Loading..."}
          </code>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleCopy(code, setCopiedCode)}
            disabled={!code}
            className={cn(
              "text-xs gap-1.5 transition-all duration-300",
              copiedCode && "text-green-500",
            )}
          >
            <span className="relative">
              <Copy
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  copiedCode ? "opacity-0 scale-0" : "opacity-100 scale-100",
                )}
              />
              <Check
                className={cn(
                  "h-3.5 w-3.5 absolute inset-0 transition-all duration-300",
                  copiedCode ? "opacity-100 scale-100" : "opacity-0 scale-0",
                )}
              />
            </span>
            {copiedCode ? "Copied!" : "Copy"}
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <div className="flex-1 px-3 py-2 rounded-lg bg-white/5 border border-white/10 text-xs text-muted-foreground truncate">
            {linkText}
          </div>
          <Button
       
            size="sm"
            onClick={() => handleCopy(linkText, setCopiedLink)}
            disabled={!code}
            className={cn(
              "text-xs gap-1.5 border-white/20 shrink-0 transition-all duration-300 bg-zinc-700 hover:bg-zinc-700/80",
              copiedLink && "text-green-500 border-green-500/30 bg-green-500/10",
            )}
          >
            <span className="relative">
              <Link
                className={cn(
                  "h-3.5 w-3.5 transition-all duration-300",
                  copiedLink ? "opacity-0 scale-0" : "opacity-100 scale-100",
                )}
              />
              <Check
                className={cn(
                  "h-3.5 w-3.5 absolute inset-0 transition-all duration-300",
                  copiedLink ? "opacity-100 scale-100" : "opacity-0 scale-0",
                )}
              />
            </span>
            {copiedLink ? "Copied!" : "Copy Link"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

export default function ReferralOverviewPage() {
  const [eligibility, setEligibility] = useState<EligibilityResponse | null>(
    null,
  );
  const [stats, setStats] = useState<MyStatsView | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchData = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const [elig, st] = await Promise.all([
        ReferralService.getEligibility(),
        ReferralService.getStats(),
      ]);
      setEligibility(elig);
      setStats(st);
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

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-current border-t-transparent text-muted-foreground" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm">
        {error}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Referral Overview
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Track your referral network and commission performance
        </p>
      </div>

      {stats && <StatsCards stats={stats} />}

      {/* Spec §30: when there is no qualifying investment, only show the
          "make an investment" prompt — never the code or share link. */}
      {eligibility && !eligibility.canRefer ? (
        <LockedState reason={eligibility.reason} />
      ) : eligibility?.referralCode ? (
        <ReferralCode code={eligibility.referralCode} />
      ) : null}
    </div>
  );
}
