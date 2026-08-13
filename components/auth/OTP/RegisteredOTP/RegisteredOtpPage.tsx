"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import RegisteredOtpDialog from "./index";

/**
 * Standalone page host for the RegisteredOTP dialog.
 *
 * Rendered at /otp-verify/register-acount after a successful registration.
 * The email is carried over in the query string. There is no way back into
 * the wizard from here — closing the dialog returns to the register page.
 */
export default function RegisteredOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") ?? "";

  return (
    <section className="relative hidden flex-1 flex-col items-center justify-center overflow-hidden bg-linear-to-b from-foreground to-mainground p-12 md:flex">
  {/* Background circles */}
  <div className="pointer-events-none absolute inset-0 opacity-10">
    <div className="absolute -bottom-20 -left-20 h-[600px] w-[600px] rounded-full border border-white" />

    <div className="absolute -bottom-10 -left-10 h-[600px] w-[600px] rounded-full border border-white" />

    <div className="absolute bottom-0 left-0 h-[600px] w-[600px] rounded-full border border-white" />
  </div>

  {/* OTP Dialog */}
  <div className="relative z-10 mx-auto w-full max-w-md">
    <RegisteredOtpDialog
      open
      email={email}
      onOpenChange={(nextOpen) => {
        if (!nextOpen) {
          router.push("/register");
        }
      }}
    />
  </div>
</section>
  );
}
