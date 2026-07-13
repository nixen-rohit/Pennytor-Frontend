"use client";

import React from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { RegisterFieldErrors } from "./RegisterTypes";
import PasswordRequirements from "@/components/auth/Register/Passwordrequirements";

interface RegisterFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
  fieldErrors: RegisterFieldErrors;
  onTogglePassword: () => void;
  onLogin: () => void;
}

function getPasswordStrength(password: string) {
  let score = 0;

  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;

  return score;
}

function getStrengthLabel(score: number) {
  if (score <= 1) return "Weak";
  if (score <= 3) return "Medium";
  if (score === 4) return "Strong";

  return "Very Strong";
}

export default function RegisterForm({
  onSubmit,
  formLoading,
  errorMsg,
  showPassword,
  fieldErrors,
  onTogglePassword,
  onLogin,
}: RegisterFormProps) {
  const [password, setPassword] = React.useState("");
  const passwordStrength = getPasswordStrength(password);

  return (
    <div className="w-full max-w-sm mx-auto space-y-8">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-zinc-900">
          Create your account
        </h1>
        <p className="text-sm text-zinc-500">
          Join with thousands of investors and start earning today
        </p>
      </div>

      {/* Form */}
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label
              htmlFor="firstName"
              className="text-sm font-medium text-zinc-700"
            >
              First name
            </Label>
            <Input
              id="firstName"
              name="firstName"
              type="text"
              placeholder="John"
              required
              className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 block w-full"
            />
            {fieldErrors.firstName && (
              <p className="text-xs text-red-500">{fieldErrors.firstName}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label
              htmlFor="lastName"
              className="text-sm font-medium text-zinc-700"
            >
              Last name
            </Label>
            <Input
              id="lastName"
              name="lastName"
              type="text"
              placeholder="Doe"
              required
              className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 block w-full"
            />
            {fieldErrors.lastName && (
              <p className="text-xs text-red-500">{fieldErrors.lastName}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-zinc-700"
          >
            Email address
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="john@example.com"
            required
            className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 block w-full"
          />
          {fieldErrors.email && (
            <p className="text-xs text-red-500">{fieldErrors.email}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="password"
            className="text-sm font-medium text-zinc-700"
          >
            Password
          </Label>
          <div className="relative flex items-center">
            <Input
              id="password"
              name="password"
              type={showPassword ? "text" : "password"}
              placeholder="Create a strong password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 pr-10 block w-full"
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={onTogglePassword}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4 text-zinc-400" />
              ) : (
                <Eye className="h-4 w-4 text-zinc-400" />
              )}
            </Button>
          </div>
          {fieldErrors.password && (
            <p className="text-sm text-red-500">{fieldErrors.password}</p>
          )}

          {/* Password Strength Bar */}
          {password && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      passwordStrength <= 1
                        ? "bg-red-500"
                        : passwordStrength <= 2
                          ? "bg-yellow-500"
                          : passwordStrength <= 3
                            ? "bg-blue-500"
                            : "bg-green-500"
                    }`}
                    style={{
                      width: `${(passwordStrength / 5) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Password strength:{" "}
                  <span className="font-medium">
                    {getStrengthLabel(passwordStrength)}
                  </span>
                </p>
              </div>

              <PasswordRequirements password={password} />
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="referralCode"
            className="text-sm font-medium text-zinc-700"
          >
            Referral code <span className="text-zinc-400 font-normal">(optional)</span>
          </Label>
          <Input
            id="referralCode"
            name="referralCode"
            type="text"
            placeholder="Enter referral code"
            className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 block w-full"
          />
          {fieldErrors.referralCode && (
            <p className="text-xs text-red-500">{fieldErrors.referralCode}</p>
          )}
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-2">
            <input
              type="checkbox"
              name="agreeToTerms"
              id="terms"
              required
              className="mt-1 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <Label
              htmlFor="terms"
              className="text-sm text-zinc-600 leading-5"
            >
              I agree to the{" "}
              <Link
                href="/terms"
                className="font-medium text-foreground hover:underline"
              >
                Terms of Service
              </Link>{" "}
              and{" "}
              <Link
                href="/privacy"
                className="font-medium text-foreground hover:underline"
              >
                Privacy Policy
              </Link>
            </Label>
          </div>
          {fieldErrors.agreeToTerms && (
            <p className="text-xs text-red-500">{fieldErrors.agreeToTerms}</p>
          )}
          <label className="flex items-start gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              name="subscribeNewsletter"
              className="mt-1 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-sm text-zinc-600">
              Subscribe to our newsletter for updates and tips
            </span>
          </label>
        </div>

        {/* Error Message */}
        {errorMsg && (
          <p className="text-sm font-bold text-center text-red-500 border border-red-500 px-3 py-2 rounded-lg animate-in fade-in-50">
            {errorMsg}
          </p>
        )}

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={formLoading}
          className="w-full h-12 font-medium rounded-xl bg-foreground hover:bg-foreground/80 text-white"
        >
          {formLoading ? (
            <span className="flex items-center gap-2 justify-center">
              <Loader2 className="h-4 w-4 animate-spin" />
              Creating account...
            </span>
          ) : (
            "Create account"
          )}
        </Button>
      </form>

      {/* Footer */}
      <p className="text-center text-sm text-zinc-500">
        Already have an account?{" "}
        <Button
          type="button"
          variant="link"
          onClick={onLogin}
          className="text-sm font-medium text-foreground hover:underline p-0 h-auto inline-flex"
        >
          Sign in
        </Button>
      </p>
    </div>
  );
}