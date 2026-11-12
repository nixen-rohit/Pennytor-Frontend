import { API_URL, ApiError } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";

/**
 * User-facing KYC API client. Multipart uploads go through a dedicated
 * fetch (no JSON Content-Type — the browser sets the multipart boundary),
 * still carrying the CSRF token and session cookie.
 */

export type KycFileType =
  | "SELFIE"
  | "AADHAAR_FRONT"
  | "AADHAAR_BACK"
  | "PAN"
  | "SIGNATURE";

export interface KycApplicationRef {
  id: string;
  status:
    | "DRAFT"
    | "SUBMITTED"
    | "UNDER_REVIEW"
    | "VERIFIED"
    | "REJECTED";
}

export interface KycApplicationState extends KycApplicationRef {
  /** Uploaded document types — the only file info exposed to the owner. */
  files: Array<{ type: KycFileType }>;
  /** Present only when the application was rejected. */
  rejectionReason: string | null;
  /** Own-submitted details, shown read-only after submission. */
  personal: {
    fullName: string;
    phone: string;
    dob: string;
    gender: string | null;
    maritalStatus: string | null;
  };
  documents: {
    aadhaarNumber: string;
    panNumber: string;
  };
  bank: {
    accountHolderName: string;
    accountNumber: string;
    ifscCode: string;
    bankName: string;
    branchName: string;
    accountType: string | null;
    branchAddress: string | null;
  };
  nominee: {
    nomineeName: string;
    nomineeDob: string;
    nomineePhone: string | null;
    nomineeAadhaar: string | null;
  };
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

export class KycService {
  static async createApplication(data: Record<string, unknown>): Promise<KycApplicationRef> {
    const response = await fetch(`${API_URL}/kyc/applications`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...csrfHeaders(),
      },
      credentials: "include",
      body: JSON.stringify(data),
      cache: "no-store",
    });
    return assertOk(response);
  }

  static async uploadFile(
    applicationId: string,
    fileType: KycFileType,
    file: File,
  ): Promise<{ id: string; type: KycFileType }> {
    const form = new FormData();
    form.append("fileType", fileType);
    form.append("file", file);

    const response = await fetch(
      `${API_URL}/kyc/applications/${applicationId}/files`,
      {
        method: "POST",
        headers: csrfHeaders(),
        credentials: "include",
        body: form,
        cache: "no-store",
      },
    );
    return assertOk(response);
  }

  static async sendSubmissionOtp(applicationId: string): Promise<void> {
    const response = await fetch(
      `${API_URL}/kyc/applications/${applicationId}/otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...csrfHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({}),
        cache: "no-store",
      },
    );
    await assertOk(response);
  }

  static async submit(applicationId: string, otp: string): Promise<KycApplicationRef> {
    const response = await fetch(
      `${API_URL}/kyc/applications/${applicationId}/submit`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...csrfHeaders(),
        },
        credentials: "include",
        body: JSON.stringify({ otp }),
        cache: "no-store",
      },
    );
    return assertOk(response);
  }

  static async myApplication(): Promise<KycApplicationState | null> {
    const response = await fetch(`${API_URL}/kyc/applications/me`, {
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      cache: "no-store",
    });
    return assertOk(response);
  }
}