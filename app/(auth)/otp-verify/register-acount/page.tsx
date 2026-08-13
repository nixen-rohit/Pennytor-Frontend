import { Suspense } from "react";
import RegisteredOtpPage from "@/components/auth/OTP/RegisteredOTP/RegisteredOtpPage";

export default function RegisterAccountOtpPage() {
  return (
    <Suspense
      fallback={<div className="flex h-screen items-center justify-center bg-white " />}
    >
      <RegisteredOtpPage />
    </Suspense>
  );
}
