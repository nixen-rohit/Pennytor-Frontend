import type { RegisteredOtpFormValues, RegisteredOtpFieldErrors } from "./RegisteredTypes";

export function validateRegisteredOtpForm(values: RegisteredOtpFormValues): RegisteredOtpFieldErrors {
  const errors: RegisteredOtpFieldErrors = {};

  if (!values.otp.trim()) {
    errors.otp = "Verification code is required";
  } else if (!/^\d{6}$/.test(values.otp)) {
    errors.otp = "Please enter a valid 6-digit code";
  }

  return errors;
}

export function hasErrors(errors: RegisteredOtpFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
