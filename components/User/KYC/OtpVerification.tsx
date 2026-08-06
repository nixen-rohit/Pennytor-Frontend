"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ShieldCheck, Loader2, Check, ArrowLeft } from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp";

interface Props {
  onBack: () => void;
  onVerified: (otp: string) => void;
}

export function OtpVerification({ onBack, onVerified }: Props) {
  const [otp, setOtp] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const isComplete = otp.length === 6;

  const handleVerify = async () => {
    if (!isComplete || submitting) return;
    setSubmitting(true);
    await new Promise((r) => setTimeout(r, 800));
    setSubmitting(false);
    onVerified(otp);
  };

  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-600/20 text-indigo-500">
        <ShieldCheck className="h-7 w-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold text-slate-50">
          OTP Verification
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Enter the 6-digit code sent to your registered email address to verify
          and submit your KYC details.
        </p>
      </div>

      <div className="flex justify-center py-2">
        <InputOTP
          maxLength={6}
          pattern={REGEXP_ONLY_DIGITS}
          value={otp}
          onChange={setOtp}
          autoFocus
        >
          <InputOTPGroup>
            {[0, 1, 2, 3, 4, 5].map((index) => (
              <InputOTPSlot
                key={index}
                index={index}
                className="h-15 w-13 border-neutral-700 bg-black/40 text-lg"
              />
            ))}
          </InputOTPGroup>
        </InputOTP>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          className="flex items-center gap-1.5 border-white/20"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Review
        </Button>

        <Button
          type="button"
          onClick={handleVerify}
          disabled={!isComplete || submitting}
          className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
        >
          {submitting ? (
            <Loader2 className="h-4 w-4 animate-spin" />
          ) : (
            <Check className="h-4 w-4" />
          )}
          {submitting ? "Verifying..." : "Verify & Submit"}
        </Button>
      </div>
    </div>
  );
}
