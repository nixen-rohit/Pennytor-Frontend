import { fetchApi } from "./api";

export type ContactMessageStatus = "NEW" | "IN_PROGRESS" | "DONE";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service?: string | null;
  message: string;
  status?: ContactMessageStatus | null;
  reviewNote?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessageListResponse {
  items: ContactMessage[];
  total: number;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export class ContactAdminService {
  static async list(page = 1, limit = 20): Promise<ContactMessageListResponse> {
    return fetchApi(`/admin/contactus?page=${page}&limit=${limit}`);
  }

  static async getMessage(id: string): Promise<ContactMessage> {
    return fetchApi(`/admin/contactus/${id}`);
  }

  static async updateStatus(id: string, status: ContactMessageStatus, note?: string): Promise<ContactMessage> {
    return fetchApi(`/admin/contactus/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status, note }),
    });
  }

  static async delete(id: string): Promise<{ success: boolean }> {
    return fetchApi(`/admin/contactus/${id}`, { method: "DELETE" });
  }
}
