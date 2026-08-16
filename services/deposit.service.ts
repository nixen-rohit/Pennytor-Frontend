import { API_URL, ApiError } from "./api";
import { useAuthStore } from "@/store/auth.store";

export type DepositStatus =
  | "PENDING"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED";

export interface DepositRequestRef {
  id: string;
  status: DepositStatus;
  amount: string;
}

export interface MyDeposit {
  id: string;
  amount: string;
  transactionId: string;
  status: DepositStatus;
  reviewNote: string | null;
  submittedAt: string | null;
  createdAt: string;
}

export interface MyDepositsResponse {
  balance: string;
  items: MyDeposit[];
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

export class DepositService {
  static async create(data: {
    amount: string;
    transactionId: string;
    screenshot: File;
  }): Promise<DepositRequestRef> {
    const form = new FormData();
    form.append("amount", data.amount);
    form.append("transactionId", data.transactionId);
    form.append("file", data.screenshot);

    const response = await fetch(`${API_URL}/deposits`, {
      method: "POST",
      headers: csrfHeaders(),
      credentials: "include",
      body: form,
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async myDeposits(): Promise<MyDepositsResponse> {
    const response = await fetch(`${API_URL}/deposits/mine`, {
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }
}