import type {
  LoginRequest,
  LoginResponse,
  MeResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
} from "@/types/auth";
import { fetchApi } from "./api";

export const AuthService = {
  login: (data: LoginRequest) =>
    fetchApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  me: () => fetchApi<MeResponse>("/auth/me"),

  checkEmail: (email: string) =>
    fetchApi<{ available: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
    ),

  register: (data: RegisterRequest) =>
    fetchApi<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: (data: VerifyEmailRequest) =>
    fetchApi<{ message: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resendOtp: (data: ResendOtpRequest) =>
    fetchApi<{ message: string }>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logout: (data: { all?: boolean } = {}) =>
    fetchApi<{ message: string }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  logoutAll: () =>
    fetchApi<{ message: string }>("/auth/logout-all", {
      method: "POST",
      body: JSON.stringify({ all: true }),
    }),

  forgotPassword: (data: ForgotPasswordRequest) =>
    fetchApi<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPassword: (data: ResetPasswordRequest) =>
    fetchApi<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  changePassword: (data: ChangePasswordRequest) =>
    fetchApi<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};