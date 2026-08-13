import { Suspense } from "react";
import KycOtpPage from "@/components/auth/OTP/KycOTP/KycOtpPage";

export default function KycAccountOtpPage() {
  return (
    <Suspense
      fallback={<div className="flex h-screen items-center justify-center bg-white" />}
    >
      <KycOtpPage />
    </Suspense>
  );
}