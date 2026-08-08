import { fetchApi } from "./api";
import type {
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  VerifyEmailRequest,
  ResendOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  LogoutRequest,
  RefreshResponse,
} from "@/types/auth";

export const AuthService = {
  login: async (data: LoginRequest) =>
    fetchApi<LoginResponse>("/auth/login", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  checkEmail: (email: string) =>
    fetchApi<{ available: boolean }>(
      `/auth/check-email?email=${encodeURIComponent(email)}`,
    ),

  register: async (data: RegisterRequest) =>
    fetchApi<RegisterResponse>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  verifyEmail: async (data: VerifyEmailRequest) =>
    fetchApi<{ message: string }>("/auth/verify-email", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resendOtp: async (data: ResendOtpRequest) =>
    fetchApi<{ message: string }>("/auth/resend-otp", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  refresh: async () =>
    fetchApi<RefreshResponse>("/auth/refresh", {
      method: "POST",
    }),

  logout: async (data: LogoutRequest = { all: false }) =>
    fetchApi<{ message: string }>("/auth/logout", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  forgotPassword: async (data: ForgotPasswordRequest) =>
    fetchApi<{ message: string }>("/auth/forgot-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  resetPassword: async (data: ResetPasswordRequest) =>
    fetchApi<{ message: string }>("/auth/reset-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),

  changePassword: async (data: ChangePasswordRequest) =>
    fetchApi<{ message: string }>("/auth/change-password", {
      method: "POST",
      body: JSON.stringify(data),
    }),
};
