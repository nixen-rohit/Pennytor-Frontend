import { API_URL, ApiError, fetchApi } from "@/services/api";
import { useAuthStore } from "@/store/auth.store";

export type KycStatus =
  | "DRAFT"
  | "SUBMITTED"
  | "UNDER_REVIEW"
  | "VERIFIED"
  | "REJECTED";

export type KycFileType =
  | "SELFIE"
  | "AADHAAR_FRONT"
  | "AADHAAR_BACK"
  | "PAN"
  | "SIGNATURE";

export interface KycFileMeta {
  id: string;
  type: KycFileType;
  originalName: string;
  mimeType: string;
  fileSize: number;
  createdAt: string;
}

export interface KycApplicationSummary {
  id: string;
  status: KycStatus;
  createdAt: string;
  user: { email: string; clientId: string | null };
  _count: { files: number };
}

export interface KycApplicationListResponse {
  items: KycApplicationSummary[];
  total: number;
}

export interface KycApplicationDetail {
  id: string;
  clientId: string | null;
  status: KycStatus;
  createdAt: string;
  updatedAt: string;
  submittedAt: string | null;
  reviewedAt: string | null;
  reviewNote: string | null;
  personal: {
    fullName: string;
    phone: string;
    dob: string;
    gender: string | null;
    maritalStatus: string | null;
  };
  documents: { aadhaarNumber: string; panNumber: string };
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
  files: KycFileMeta[];
}

/**
 * Admin-only KYC API client. All private documents flow through the
 * authenticated endpoints below — there is deliberately no public file URL
 * of any kind.
 */
export class KycAdminService {
  static async listApplications(
    status?: KycStatus,
    page = 1,
    search?: string,
    pageSize = 20,
  ): Promise<KycApplicationListResponse> {
    const query = new URLSearchParams({ page: String(page), pageSize: String(pageSize) });
    if (status) query.set("status", status);
    if (search) query.set("search", search);
    return fetchApi(`/admin/kyc/applications?${query.toString()}`);
  }

  static async getApplication(id: string): Promise<KycApplicationDetail> {
    return fetchApi(`/admin/kyc/applications/${id}`);
  }

  static async updateStatus(
    id: string,
    status: KycStatus,
    note?: string,
  ): Promise<{ id: string; status: KycStatus }> {
    return fetchApi(`/admin/kyc/applications/${id}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status, ...(note ? { note } : {}) }),
    });
  }

  /** Private document URL. Works with the `sid` HttpOnly cookie
   * (same-site request, lax policy). Must be used via <img> or fetch with
   * credentials — embedding it publicly is useless, the API rejects it. */
  static fileUrl(applicationId: string, fileId: string): string {
    return `${API_URL}/admin/kyc/applications/${applicationId}/files/${fileId}`;
  }

  static downloadUrl(applicationId: string, fileId: string): string {
    return `${KycAdminService.fileUrl(applicationId, fileId)}/download`;
  }

  /** Credential-carrying fetch of a private file (blob). */
  static async fetchFile(
    applicationId: string,
    fileId: string,
  ): Promise<Blob> {
    const response = await fetch(KycAdminService.fileUrl(applicationId, fileId), {
      credentials: "include",
      cache: "no-store",
    });
    if (!response.ok) {
      throw new Error(`Unable to load private file (${response.status})`);
    }
    return response.blob();
  }

  static async deleteFile(
    applicationId: string,
    fileId: string,
  ): Promise<void> {
    await fetchApi(
      `/admin/kyc/applications/${applicationId}/files/${fileId}`,
      { method: "DELETE" },
    );
  }

  /**
   * Replace an existing document in place. Uses multipart/form-data, so it
   * bypasses `fetchApi` (which always sets a JSON Content-Type) while still
   * sending the session cookie and CSRF token. The backend keeps the same
   * metadata row/id, writes a REPLACE audit entry, then deletes the old file.
   */
  static async replaceFile(params: {
    applicationId: string;
    fileId: string;
    file: File;
    reason: string;
  }): Promise<{
    id: string;
    type: KycFileType;
    mimeType: string;
    fileSize: number;
    originalName: string;
    message: string;
  }> {
    const form = new FormData();
    form.append("file", params.file);
    form.append("reason", params.reason.trim());

    const send = () => {
      const csrfToken = useAuthStore.getState().csrfToken;
      return fetch(
        KycAdminService.fileUrl(params.applicationId, params.fileId),
        {
          method: "PUT",
          headers: csrfToken ? { "X-CSRF-Token": csrfToken } : {},
          credentials: "include",
          body: form,
          cache: "no-store",
        },
      );
    };

    let response = await send();

    // Same stale-CSRF recovery as fetchApi: re-arm once from /auth/me.
    if (response.status === 403) {
      try {
        const meResponse = await fetch(`${API_URL}/auth/me`, {
          credentials: "include",
          cache: "no-store",
        });
        const meData = await meResponse.json().catch(() => null);
        const freshToken = meData?.data?.csrfToken;
        if (meResponse.ok && freshToken) {
          useAuthStore.getState().setCsrfToken(freshToken);
          response = await send();
        }
      } catch {
        // Fall through with the original 403.
      }
    }

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      if (response.status === 401) {
        useAuthStore.getState().clearAuth();
      }
      throw new ApiError(
        response.status,
        data?.message || "Failed to replace document",
      );
    }

    return data;
  }
}