import { fetchApi } from "./api";
import type { VerifyEmailRequest, ResendOtpRequest } from "@/types/auth";

export const OtpService = {
  verifyOtp: (data: VerifyEmailRequest) =>
    fetchApi<{ message: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resendOtp: (data: ResendOtpRequest) =>
    fetchApi<{ message: string }>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
