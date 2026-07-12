export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export async function fetchApi(endpoint: string, options: RequestInit = {}) {
  const headers = new Headers(options.headers || {});
  headers.set('Content-Type', 'application/json');

  const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
  if (token) {
    headers.set('Authorization', `Bearer ${token}`);
  }

  const response = await fetch(`${API_URL}${endpoint}`, {
    ...options,
    headers,
  });

  const data = await response.json().catch(() => null);

  if (!response.ok) {
    throw new Error(data?.message || 'Something went wrong');
  }

  return data;
}
