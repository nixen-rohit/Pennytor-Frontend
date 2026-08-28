"use client";

import { CheckCircle2, TrendingUp, AlertCircle, Clock, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, type FormState } from "./types";

interface Props {
  data: FormState;
  requestId: string;
  status: string;
  onReset: () => void;
  ineligible?: { scheme: string } | null;
}

export function Submitted({ data, requestId, status, onReset, ineligible }: Props) {
  // Show ineligible message if user tries to apply for same scheme again
  if (ineligible) {
    return (
      <div className="min-h-screen p-4">
        <div className="mx-auto max-w-md space-y-6">
          <div className="text-center space-y-4">
            <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-amber-400/20">
              <AlertCircle className="h-10 w-10 text-amber-400" />
            </div>
            <h1 className="text-2xl font-bold text-slate-50">
              Already Applied
            </h1>
            <p className="text-sm text-slate-400">
              You already have an active <span className="font-medium text-amber-400">Scheme {ineligible.scheme}</span> application.
            </p>
          </div>

          <div className="rounded-xl border border-amber-500/30 bg-amber-500/10 p-6 space-y-4">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
                <Clock className="h-5 w-5 text-amber-400" />
              </span>
              <div>
                <p className="text-sm font-medium text-slate-300">Active Application</p>
                <p className="text-sm text-amber-400 font-medium">Waiting for admin review</p>
              </div>
            </div>
          </div>

          <Button
            onClick={onReset}
            className="w-full bg-amber-600 text-white hover:bg-amber-700"
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Back to Schemes
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-4">
      <div className="mx-auto max-w-md space-y-6">
        <div className="text-center space-y-4">
          <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/20">
            <CheckCircle2 className="h-10 w-10 text-emerald-400" />
          </div>
          <h1 className="text-2xl font-bold text-slate-50">
            Application Submitted
          </h1>
          <p className="text-sm text-slate-400">
            Your SIP for Child application has been sent for review.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-300">Scheme {data.scheme}</p>
              <p className="text-sm text-slate-400">SIP for Child</p>
            </div>
          </div>

          <div className="divide-y divide-neutral-800">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-400">Status</span>
              <span className="text-sm font-medium text-yellow-400">{status}</span>
            </div>
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-400">Reference ID</span>
              <span className="text-sm font-mono text-slate-300">{requestId}</span>
            </div>
          </div>
        </div>

        <p className="text-center text-sm text-slate-400">
          After admin approval, you will receive an email to pay your first monthly premium. 
          Once paid, your SIP will start counting months.
        </p>

        <Button
          onClick={onReset}
          className="w-full bg-amber-600 text-white hover:bg-amber-700"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Make Another Application
        </Button>
      </div>
    </div>
  );
}
