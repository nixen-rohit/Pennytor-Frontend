import { z } from "zod";

export const emailSchema = z
  .string()
  .min(1, "Email is required")
  .email("Please enter a valid email address");

export const passwordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters")
  .regex(/[A-Z]/, "Must contain at least one uppercase letter")
  .regex(/[a-z]/, "Must contain at least one lowercase letter")
  .regex(/[0-9]/, "Must contain at least one number")
  .regex(/[^A-Za-z0-9]/, "Must contain at least one special character");

export const phoneSchema = z
  .string()
  .regex(/^\+?[1-9]\d{6,14}$/, "Please enter a valid phone number");

export const urlSchema = z.string().url("Please enter a valid URL");

export const createPasswordConfirmSchema = <
  T extends { password: string; confirmPassword: string },
>(
  schema: z.ZodType<T>,
) =>
  schema.refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const UNSAFE_PATTERN =
  /(<\s*\/?\s*(script|iframe|object|embed|frame|meta|link|style)\b)|(<\s*[a-z0-9]+[^>]*\son[a-z]+\s*=)|(javascript\s*:)|(<\s*!|<\s*\?)/i;

export function containsUnsafe(value: string): boolean {
  return UNSAFE_PATTERN.test(value);
}

export function sanitizeText(value: string): string {
  return value
    .replace(
      /<\s*\/?\s*(script|iframe|object|embed|frame|meta|link|style)\b[^>]*>/gi,
      "",
    )
    .replace(/\son[a-z]+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]*)/gi, "")
    .replace(/javascript\s*:/gi, "")
    .replace(/[<>]/g, "")
    .replace(/[\u0000-\u0008\u000B\u000C\u000E-\u001F\u007F]/g, "");
}

export function sanitizeDigits(value: string): string {
  return value.replace(/[^\d\s-]/g, "").slice(0, 32);
}

export function sanitizePhone(value: string): string {
  return value.replace(/\D/g, "").slice(0, 15);
}

export function sanitizePAN(value: string): string {
  return value.replace(/[^A-Za-z0-9]/g, "").toUpperCase().slice(0, 10);
}

export function sanitizeAadhaar(value: string): string {
  return value.replace(/\D/g, "").slice(0, 12);
}

export function sanitizeAmount(value: string): string {
  const clean = value.replace(/[^\d.]/g, "");
  const firstDot = clean.indexOf(".");
  return firstDot === -1
    ? clean
    : clean.slice(0, firstDot + 1) + clean.slice(firstDot + 1).replace(/\./g, "");
}

export function sanitizeTransactionId(value: string): string {
  return value.replace(/[^\w.-]/g, "").slice(0, 40);
}

export const PAN_PATTERN = /^[A-Z]{5}[0-9]{4}[A-Z]$/;
export const IFSC_PATTERN = /^[A-Z]{4}0[A-Z0-9]{6}$/;
export const AADHAAR_PATTERN = /^\d{12}$/;
export const PHONE_PATTERN = /^\+?[0-9\s-]{10,15}$/;
export const ACCOUNT_NUMBER_PATTERN = /^\d{9,18}$/;
export const AMOUNT_PATTERN = /^\d+(\.\d{1,2})?$/;
export const TRANSACTION_ID_PATTERN = /^[A-Za-z0-9_.-]{6,40}$/;
export const CLIENT_ID_PATTERN = /^[A-Z0-9]{6,9}$/;
