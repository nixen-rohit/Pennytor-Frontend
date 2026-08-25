"use client";

import { CheckCircle2, TrendingUp, Loader2, AlertCircle, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, type FormState } from "./types";

interface Props {
  data: FormState;
  requestId: string;
  status: string;
  onReset: () => void;
  ineligible?: { scheme: string; lockInPeriod: string } | null;
}

export function Submitted({ data, requestId, status, onReset, ineligible }: Props) {
  const getRoi = (scheme: string) => {
    switch (scheme) {
      case "A": return "3%";
      case "B": return "3.5%";
      case "C": return "4%";
      case "D": return "4.5%";
      case "E": return "5%";
      default: return "3%";
    }
  };

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
                <p className="text-sm font-medium text-slate-300">Lock-in Period</p>
                <p className="text-sm text-amber-400 font-medium">{ineligible.lockInPeriod}</p>
              </div>
            </div>

            <p className="text-sm text-slate-400">
              You are eligible to apply again after <span className="font-medium text-amber-400">{ineligible.lockInPeriod}</span> when the current scheme completes.
            </p>
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
            Your investment fund application has been sent for review.
          </p>
        </div>

        <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-6 space-y-4">
          <div className="flex items-center gap-3">
            <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400/20">
              <TrendingUp className="h-5 w-5 text-amber-400" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-300">Scheme {data.scheme}</p>
              <p className="text-sm text-slate-400">Investment Fund Scheme</p>
            </div>
          </div>

          <div className="divide-y divide-neutral-800">
            <div className="flex items-center justify-between py-2">
              <span className="text-sm text-slate-400">Amount</span>
              <span className="text-sm font-mono text-emerald-400">
                {data.amount ? formatCurrency(Number(data.amount)) : "—"}
              </span>
            </div>
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
          Your wallet has been debited. The admin will review your application
          within 30 minutes. Monthly returns of{" "}
          <span className="font-medium text-emerald-400">
            {getRoi(data.scheme ?? "A")}
          </span>{" "}
          will be credited upon approval.
        </p>

        <Button
          onClick={onReset}
          className="w-full bg-amber-600 text-white hover:bg-amber-700"
        >
          <TrendingUp className="mr-2 h-4 w-4" />
          Make Another Investment
        </Button>
      </div>
    </div>
  );
}

function getRoi(scheme: string) {
  switch (scheme) {
    case "A": return "3%";
    case "B": return "3.5%";
    case "C": return "4%";
    case "D": return "4.5%";
    case "E": return "5%";
    default: return "3%";
  }
}