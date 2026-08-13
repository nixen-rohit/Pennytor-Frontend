"use client";

import Link from "next/link";
import {
  AlertCircle,
  CheckCircle2,
  Clock,
  ArrowRight,
  PartyPopper ,
} from "lucide-react";
import type { KycProfile } from "@/components/User/Profile/types";

const KYC_URL = "/account-kyc";

export function ProfileStatusBanner({ profile }: { profile: KycProfile }) {
  if (profile.kyc_status === "verified") {
    return (
      <>
        <div className="mb-5 flex flex-col gap-3 rounded-2xl border border-emerald-400/20 bg-emerald-400/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-400" />
            <div>
              <p className="text-sm font-semibold text-emerald-300">
                Your KYC is verified
              </p>
              <p className="mt-0.5 text-xs text-white/50">
                All documents approved.
              </p>
            </div>
          </div>
        </div>

        <div className="mb-10 flex flex-col gap-3 rounded-2xl border border-green-400/20 bg-green-400/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <PartyPopper  className="mt-0.5 h-5 w-5 shrink-0 text-green-400" />
            <div>
              <p className="text-sm font-semibold text-green-300">
                Congrats , Now you can start Investments !
              </p>
            </div>
          </div>
        </div>
      </>
    );
  }

  if (profile.kyc_status === "pending") {
    return (
      <>
        <div className="mb-10 flex flex-col gap-3 rounded-2xl border border-amber-400/20 bg-amber-400/5 p-5 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-3">
            <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-400" />
            <div>
              <p className="text-sm font-semibold text-amber-300">
                KYC request is pending review
              </p>
              <p className="mt-0.5 text-xs text-white/50">
                Your details have been submitted and are awaiting admin
                verification. We&apos;ll notify you by email once reviewed.
              </p>
            </div>
          </div>
        </div>

        
      </>
    );
  }

  if (profile.kyc_status === "rejected") {
    return (
      <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-red-400/20 bg-red-400/5 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-start gap-3">
          <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
          <div>
            <p className="text-sm font-semibold text-red-300">
              Your KYC request was rejected
            </p>
            {profile.rejection_reason && (
              <p className="mt-1 rounded-lg bg-red-400/10 px-3 py-2 text-xs text-red-200/90">
                Reason: {profile.rejection_reason}
              </p>
            )}
            <p className="mt-1.5 text-xs text-white/50">
              Fix the issue above and resubmit your details to continue.
            </p>
          </div>
        </div>
        <Link
          href={KYC_URL}
          className="inline-flex items-center gap-2 self-start rounded-lg bg-red-500/90 px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-red-500 sm:self-center"
        >
          Resubmit KYC
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>
    );
  }

  return (
    <div className="mb-10 flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/[0.03] p-5 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-white/40" />
        <div>
          <p className="text-sm font-semibold text-white/90">KYC not started</p>
          <p className="mt-0.5 text-xs text-white/50">
            Please submit your KYC details to start investing.
          </p>
        </div>
      </div>
      <Link
        href={KYC_URL}
        className="inline-flex items-center gap-2 self-start rounded-lg bg-[#90EF5D] px-4 py-2.5 text-sm font-semibold text-black transition hover:brightness-110 sm:self-center"
      >
        Submit KYC
        <ArrowRight className="h-4 w-4" />
      </Link>
    </div>
  );
}
