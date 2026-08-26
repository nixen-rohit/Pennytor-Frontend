"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Check, Loader2, TrendingUp, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { formatINR } from "./types";

interface Props {
  data: {
    planId: string | null;
    amount: string;
  };
  requestId: string;
  status: string;
  onReset: () => void;
  ineligible: { planId: string; lockInPeriod: string } | null;
}

export function Submitted({ data, requestId, status, onReset, ineligible }: Props) {
  if (ineligible) {
    return (
      <div className="min-h-screen p-4">
        <div className="mx-auto flex min-h-[560px] max-w-md flex-col items-center justify-center px-6 text-center">
          <div className="mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-yellow-500/10 ring-1 ring-yellow-400/30">
            <GraduationCap className="h-8 w-8 text-yellow-400" />
          </div>
          <h1 className="text-xl font-semibold text-slate-50">
            Scheme {ineligible.planId} is already active
          </h1>
          <p className="mt-3 text-sm leading-6 text-slate-400">
            You already have an active application for Plan {ineligible.planId}.
            You have to wait until the scheme ends before applying again.
          </p>
          <div className="mt-8 flex w-full flex-col gap-3 sm:flex-row">
            <Button
              asChild
              className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
            >
              <Link href="/investment/all-schemes/sip-for-child/progress">
                View Progress
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              className="flex-1 border-white/20"
            >
              <Link href="/investment/all-schemes/sip-for-child">
                Back to Schemes
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const isPending = status === "PENDING";

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-5xl space-y-5">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
            Application Submitted
          </h1>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="mb-4 flex items-center gap-2">
              <TrendingUp className="h-5 w-5 shrink-0 text-orange-400" />
              <h2 className="text-sm font-semibold text-slate-300">
                SIP For Child - Plan {data.planId}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {isPending ? (
                <>
                  <Loader2 className="h-5 w-5 animate-spin text-yellow-400" />
                  <span className="inline-flex rounded-full border border-yellow-500/20 bg-yellow-500/10 px-3 py-1 text-sm font-medium text-yellow-400">
                    Pending Approval
                  </span>
                </>
              ) : (
                <>
                  <Check className="h-5 w-5 text-green-400" />
                  <span className="inline-flex rounded-full border border-green-500/20 bg-green-500/10 px-3 py-1 text-sm font-medium text-green-400">
                    Approved
                  </span>
                </>
              )}
            </div>

            <div className="mt-6 space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-zinc-500">Request ID</p>
                  <p className="mt-1 font-mono text-sm text-white">{requestId}</p>
                </div>

                <div className="rounded-lg border border-white/10 bg-white/[0.03] p-4">
                  <p className="text-xs text-zinc-500">Investment Amount</p>
                  <p className="mt-1 text-lg font-bold text-white">
                    ₹{formatINR(Number(data.amount || 0))}/-
                  </p>
                </div>
              </div>

              {isPending && (
                <div className="rounded-lg border border-yellow-500/20 bg-yellow-500/[0.04] p-4">
                  <p className="text-sm text-yellow-300">
                    Your application is under review. The amount has been debited from your wallet
                    and will be locked into the scheme once approved by the admin team.
                    You will receive an email notification once the status changes.
                  </p>
                </div>
              )}
            </div>

            <div className="mt-6 flex flex-col gap-3 sm:flex-row">
              <Button
                asChild
                className="flex-1 bg-orange-600 text-white hover:bg-orange-700"
              >
                <Link href="/investment/all-schemes/sip-for-child/progress">
                  View Progress
                </Link>
              </Button>
              <Button
                variant="outline"
                onClick={onReset}
                className="flex-1 border-white/20"
              >
                Apply for Another Plan
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}