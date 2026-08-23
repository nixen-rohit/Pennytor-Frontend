import { fetchApi } from "./api";

export interface ContactMessage {
  id: string;
  name: string;
  email: string;
  phone: string;
  service?: string | null;
  message: string;
  status?: string | null;
  createdAt: string;
  updatedAt?: string;
}

export interface ContactMessageListResponse {
  items: ContactMessage[];
  total: number;
  totalPages?: number;
  page?: number;
  limit?: number;
}

export class ContactAdminService {
  static async list(page = 1, limit = 20): Promise<ContactMessageListResponse> {
    return fetchApi(`/admin/contactus?page=${page}&limit=${limit}`);
  }
}
