import type { ForgotPasswordFormValues, ForgotPasswordFieldErrors } from "./ForgotPasswordTypes";

export function validateForgotPasswordForm(values: ForgotPasswordFormValues): ForgotPasswordFieldErrors {
  const errors: ForgotPasswordFieldErrors = {};

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(values.email)) {
    errors.email = "Please enter a valid email address";
  }

  return errors;
}

export function hasErrors(errors: ForgotPasswordFieldErrors): boolean {
  return Object.keys(errors).length > 0;
}
