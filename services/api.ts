export const API_URL = process.env.NEXT_PUBLIC_API_URL;

export class ApiError extends Error {
  constructor(public status: number, message: string) {
    super(message);
    this.name = 'ApiError';
  }
}

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
    throw new ApiError(response.status, data?.message || 'Something went wrong');
  }

  return data;
}

/**
 * Reusable API error handler.
 * Pass your setErrorMsg state setter and an optional map of
 * custom messages keyed by HTTP status code.
 *
 * Usage:
 *   } catch (err) {
 *     handleApiError(err, setErrorMsg, { 409: 'Email already registered.' });
 *   }
 */
export function handleApiError(
  err: unknown,
  setErrorMsg: (msg: string) => void,
  customMessages: Record<number, string> = {},
) {
  if (err instanceof ApiError) {
    const custom = customMessages[err.status];
    if (custom) {
      setErrorMsg(custom);
      return;
    }
    switch (err.status) {
      case 400:
        setErrorMsg(err.message || 'Invalid details. Please check your information and try again.');
        break;
      case 401:
        setErrorMsg('You are not authorized. Please log in again.');
        break;
      case 403:
        setErrorMsg('Access denied. You do not have permission to perform this action.');
        break;
      case 404:
        setErrorMsg('Resource not found. Please try again.');
        break;
      case 409:
        setErrorMsg('A conflict occurred. Please check your information and try again.');
        break;
      case 410:
        setErrorMsg('This link or code has expired. Please request a new one.');
        break;
      case 422:
        setErrorMsg('Some fields are invalid. Please review your information.');
        break;
      case 429:
        setErrorMsg('Too many attempts. Please wait a moment and try again.');
        break;
      case 500:
      case 502:
      case 503:
        setErrorMsg('Server error. Please try again later.');
        break;
      default:
        setErrorMsg(err.message || 'Something went wrong. Please try again.');
    }
  } else {
    setErrorMsg('Unable to connect. Please check your internet connection and try again.');
  }
}
