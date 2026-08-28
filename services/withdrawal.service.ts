import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

export type WithdrawalStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED";

export type WithdrawMethod = "bank" | "upi";

export interface WithdrawalRequestRef {
  id: string;
  status: WithdrawalStatus;
  amount: string;
}

export interface MyWithdrawal {
  id: string;
  amount: string;
  method: WithdrawMethod;
  destination: string;
  status: WithdrawalStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  createdAt: string;
}

export interface MyWithdrawalsResponse {
  balance: string;
  items: MyWithdrawal[];
}

export interface UserBankAccount {
  accountHolderName: string;
  accountNumber: string;  // masked (last 4)
  ifscCode: string;       // masked (last 4)
  bankName: string;
  branchName: string;
  accountType: string | null;
  branchAddress: string | null;
}

function csrfHeaders(): Record<string, string> {
  const token = useAuthStore.getState().csrfToken;
  return token ? { "X-CSRF-Token": token } : {};
}

async function assertOk<T>(response: Response): Promise<T> {
  if (!response.ok) {
    throw new ApiError(
      response.status,
      (await response.json().catch(() => null))?.message ||
        "Something went wrong",
    );
  }
  return response.json().catch(() => null);
}

export class WithdrawalService {
  static async verifyPasswordAndSendOtp(password: string): Promise<void> {
    const response = await fetch(`${API_URL}/withdrawals/verify-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify({ password }),
      cache: "no-store",
    });
    await assertOk(response);
  }

  static async create(data: {
    method: WithdrawMethod;
    destination: string;
    amount: string;
    password: string;
    otp: string;
  }): Promise<WithdrawalRequestRef> {
    const response = await fetch(`${API_URL}/withdrawals`, {
      method: "POST",
      headers: { "Content-Type": "application/json", ...csrfHeaders() },
      credentials: "include",
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async myWithdrawals(): Promise<MyWithdrawalsResponse> {
    const response = await fetch(`${API_URL}/withdrawals/mine`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async getUserBankAccount(): Promise<UserBankAccount | null> {
    const response = await fetch(`${API_URL}/kyc/applications/me`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    const data = await assertOk<{ bank?: UserBankAccount } | null>(response);
    return data?.bank ?? null;
  }
}