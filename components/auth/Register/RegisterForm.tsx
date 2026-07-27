"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { RegisterFormValues } from "@/lib/validations";
import PasswordRequirements from "@/components/auth/Register/Passwordrequirements";

interface RegisterFormProps {
  form: UseFormReturn<RegisterFormValues>;
  onSubmit: (data: RegisterFormValues) => void;
  formLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
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

function passwordMeetsRequirements(password: string): boolean {
  return (
    password.length >= 8 &&
    /[A-Z]/.test(password) &&
    /[a-z]/.test(password) &&
    /[0-9]/.test(password) &&
    /[^A-Za-z0-9]/.test(password)
  );
}

function getStrengthLabel(score: number) {
  if (score <= 1) return "Weak";
  if (score <= 3) return "Medium";
  if (score === 4) return "Strong";

  return "Very Strong";
}

export default function RegisterForm({
  form,
  onSubmit,
  formLoading,
  errorMsg,
  showPassword,
  onTogglePassword,
  onLogin,
}: RegisterFormProps) {
  // Local state kept in sync with RHF via subscription — avoids
  // watch()-in-render reactivity issues.
  const [password, setPassword] = useState(form.getValues("password") || "");
  const [agreeToTerms, setAgreeToTerms] = useState(
    form.getValues("agreeToTerms") || false,
  );

  useEffect(() => {
    const subscription = form.watch((value, { name }) => {
      if (name === "password" || name === undefined) {
        setPassword(value.password || "");
      }
      if (name === "agreeToTerms" || name === undefined) {
        setAgreeToTerms(value.agreeToTerms || false);
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

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
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <div className="grid grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="firstName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-zinc-700">
                    First name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="John"
                      className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 block w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="lastName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-sm font-medium text-zinc-700">
                    Last name
                  </FormLabel>
                  <FormControl>
                    <Input
                      {...field}
                      type="text"
                      placeholder="Doe"
                      className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 block w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Email address
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="john@example.com"
                    className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 block w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Password
                </FormLabel>
                <FormControl>
                  <div className="relative flex items-center">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
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
                </FormControl>

                {/* Password Strength Bar */}
                {password && (
                  <div className="space-y-3 pt-1">
                    <div className="space-y-1.5">
                      <div className="h-2 overflow-hidden rounded-full bg-zinc-100">
                        <div
                          className={`h-full rounded-full transition-all ${passwordStrength <= 1
                              ? "bg-red-500"
                              : passwordStrength <= 2
                                ? "bg-yellow-500"
                                : passwordStrength <= 3
                                  ? "bg-purple-500"
                                  : passwordStrength <= 4
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="referralCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Referral code{" "}
                  <span className="text-zinc-400 font-normal">(optional)</span>
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="text"
                    placeholder="Enter referral code"
                    className="h-12 rounded-xl text-black border-zinc-200 bg-zinc-50/50 block w-full"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-3">
            <FormField
              control={form.control}
              name="agreeToTerms"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="mt-1 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel className="text-sm text-zinc-600 leading-5 font-normal">
                      I agree to the{" "}
                      <Link
                        href="/termsservice"
                        className="font-bold text-blue-600 underline"
                      >
                        Terms of Service
                      </Link>{" "}
                      and{" "}
                      <Link
                        href="/privacypolicy"
                        className="font-bold text-blue-600 underline"
                      >
                        Privacy Policy
                      </Link>
                    </FormLabel>
                    <FormMessage />
                  </div>
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="subscribeNewsletter"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <input
                      type="checkbox"
                      checked={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      name={field.name}
                      ref={field.ref}
                      className="mt-1 rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
                    />
                  </FormControl>
                  <FormLabel className="text-sm text-zinc-600 font-normal">
                    Subscribe to our newsletter for updates and tips
                  </FormLabel>
                </FormItem>
              )}
            />
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
            disabled={formLoading || !passwordMeetsRequirements(password) || !agreeToTerms}
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
      </Form>

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
