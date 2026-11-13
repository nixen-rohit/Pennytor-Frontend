"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ErrorMessage } from "@/components/ui/error-message";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import PasswordRequirements from "@/components/auth/Register/Passwordrequirements";
import type { UseFormReturn } from "react-hook-form";
import type { ResetPasswordFormValues } from "@/lib/validations";

function passwordMeetsRequirements(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
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

interface ResetPasswordFormProps {
  form: UseFormReturn<ResetPasswordFormValues>;
  onSubmit: (data: ResetPasswordFormValues) => void;
  formLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
  showConfirmPassword: boolean;
  onTogglePassword: () => void;
  onToggleConfirmPassword: () => void;
  isValidToken: boolean;
}

export default function ResetPasswordForm({
  form,
  onSubmit,
  formLoading,
  errorMsg,
  showPassword,
  showConfirmPassword,
  onTogglePassword,
  onToggleConfirmPassword,
  isValidToken,
}: ResetPasswordFormProps) {
  const [password, setPassword] = useState(form.getValues("password") || "");

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password" || name === undefined) {
        setPassword(value.password || "");
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  if (!isValidToken) {
    return (
      <div className="w-full max-w-md space-y-6 text-center">
        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto">
          <span className="text-2xl">⚠️</span>
        </div>
        <div>
          <h2 className="text-3xl font-bold text-slate-900 mb-2">
            Invalid or expired link
          </h2>
          <p className="text-slate-600">
            This password reset link is invalid or has expired. Please request a
            new one.
          </p>
        </div>
        <Link href="/forgot-password">
          <Button className="w-full h-12 font-medium rounded-xl bg-foreground hover:bg-foreground/80 text-white">
            Request new link
          </Button>
        </Link>
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-slate-400 hover:text-slate-600"
        >
          Back to sign in
        </Link>
      </div>
    );
  }

  return (
    <div className="w-full max-w-md space-y-6">
      <div className="text-center lg:text-left">
        <h2 className="text-3xl font-bold mb-2 text-slate-900">
          Reset your password
        </h2>
        <p className="text-slate-400">
          Enter your new password below. Make sure it meets the requirements.
        </p>
      </div>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4"
        >
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  New password
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your new password"
                      className="h-12 text-zinc-900 rounded-xl border-zinc-200 bg-zinc-50/50 pr-10 block w-full"
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
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {password && (
            <div className="space-y-3 pt-1">
              <div className="space-y-1.5">
                <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                  <div
                    className={`h-full rounded-full transition-all ${
                      getPasswordStrength(password) <= 1
                        ? "bg-red-500"
                        : getPasswordStrength(password) <= 2
                          ? "bg-yellow-500"
                          : getPasswordStrength(password) <= 3
                            ? "bg-purple-500"
                            : getPasswordStrength(password) <= 4
                              ? "bg-blue-500"
                              : "bg-green-500"
                    }`}
                    style={{
                      width: `${(getPasswordStrength(password) / 5) * 100}%`,
                    }}
                  />
                </div>
                <p className="text-xs text-zinc-500">
                  Password strength:{" "}
                  <span className="font-medium">
                    {getStrengthLabel(getPasswordStrength(password))}
                  </span>
                </p>
              </div>

              <PasswordRequirements password={password} />
            </div>
          )}

          {!password && (
            <PasswordRequirements password="" />
          )}

          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Confirm password
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your new password"
                      className="h-12 text-zinc-900 rounded-xl border-zinc-200 bg-zinc-50/50 pr-10 block w-full"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={onToggleConfirmPassword}
                      className="absolute right-1 top-1/2 -translate-y-1/2 h-9 w-9"
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="h-4 w-4 text-zinc-400" />
                      ) : (
                        <Eye className="h-4 w-4 text-zinc-400" />
                      )}
                    </Button>
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          {errorMsg && (
            <ErrorMessage variant="box" className="text-xs">
              {errorMsg}
            </ErrorMessage>
          )}

          <Button
            type="submit"
            disabled={formLoading || !passwordMeetsRequirements(password)}
            className="w-full h-12 font-medium rounded-xl bg-foreground hover:bg-foreground/80 text-white"
          >
            {formLoading ? (
              <span className="flex items-center gap-2 justify-center">
                <Loader2 className="h-4 w-4 animate-spin" />
                Resetting password...
              </span>
            ) : (
              "Reset password"
            )}
          </Button>
        </form>
      </Form>

      <div className="text-center">
        <Link
          href="/login"
          className="inline-flex items-center text-sm text-slate-400 hover:text-slate-600"
        >
          Back to sign in
        </Link>
      </div>
    </div>
  );
}
