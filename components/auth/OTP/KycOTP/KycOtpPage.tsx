"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import KycOtpDialog from "./index";

/**
 * Standalone page host for the KYC OTP dialog.
 *
 * Rendered at /otp-verify/kyc-acount after the KYC wizard has persisted the
 * draft and uploaded the documents. The application id is carried over in the
 * query string. Closing the dialog returns to the KYC wizard — nothing is
 * submitted until the OTP is verified.
 */
export default function KycOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const applicationId = searchParams.get("applicationId") ?? "";

  return (
    <section className="relative flex flex-1 flex-col items-center justify-center overflow-hidden bg-linear-to-b from-foreground to-mainground p-12">
      {/* Background circles */}
      <div className="pointer-events-none absolute inset-0 opacity-10">
        <div className="absolute -bottom-20 -left-20 h-[600px] w-[600px] rounded-full border border-white" />
        <div className="absolute -bottom-10 -left-10 h-[600px] w-[600px] rounded-full border border-white" />
        <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full border border-white" />
      </div>

      {/* OTP Dialog */}
      <div className="relative z-10 mx-auto w-full max-w-md">
        <KycOtpDialog
          open
          applicationId={applicationId}
          onOpenChange={(nextOpen) => {
            if (!nextOpen) {
              router.push("/account-kyc");
            }
          }}
        />
      </div>
    </section>
  );
}