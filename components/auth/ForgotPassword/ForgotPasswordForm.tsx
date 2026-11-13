"use client";

import type React from "react";
import Link from "next/link";
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
import { Mail, ArrowLeft, CheckCircle, Clock, Shield } from "lucide-react";
import type { UseFormReturn } from "react-hook-form";
import type { ForgotPasswordFormValues } from "@/lib/validations";

interface ForgotPasswordFormProps {
  form: UseFormReturn<ForgotPasswordFormValues>;
  onSubmit: (data: ForgotPasswordFormValues) => void;
  formLoading: boolean;
  errorMsg: string;
  isSuccess: boolean;
  onResendEmail: () => void;
}

export default function ForgotPasswordForm({
  form,
  onSubmit,
  formLoading,
  errorMsg,
  isSuccess,
  onResendEmail,
}: ForgotPasswordFormProps) {
  return (
    <div className="w-full max-w-md">
      {!isSuccess ? (
        <div className="space-y-6">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-2 text-slate-900">
              Forgot your password?
            </h2>
            <p className="text-slate-400">
              No worries! Enter your email address and we&apos;ll send you a
              link to reset your password.
            </p>
          </div>

          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-4"
            >
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-sm font-medium text-zinc-700">
                      Email address
                    </FormLabel>
                    <FormControl>
                      <div className="relative">
                        <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                        <Input
                          {...field}
                          type="email"
                          placeholder="Enter your email address"
                          className="h-12 text-zinc-900 rounded-xl border-zinc-200 bg-zinc-50/50 block w-full pl-10"
                        />
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
                disabled={formLoading}
                className="w-full h-12 font-medium rounded-xl bg-foreground hover:bg-foreground/80 text-white"
              >
                {formLoading ? "Sending reset link..." : "Send reset link"}
              </Button>
            </form>
          </Form>

          <div className="text-center">
            <Link
              href="/login"
              className="inline-flex items-center text-sm text-slate-400 hover:text-slate-600"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </div>
        </div>
      ) : (
        <div className="space-y-6 text-center">
          <div className="lg:hidden flex items-center justify-center mb-8">
            <div className="w-12 h-12 bg-slate-900 rounded-lg flex items-center justify-center mr-3">
              <span className="text-white font-bold text-xl">C</span>
            </div>
            <h1 className="text-2xl font-bold text-slate-900">CMS Full Form</h1>
          </div>

          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
            <CheckCircle className="w-8 h-8 text-green-600" />
          </div>

          <div>
            <h2 className="text-3xl font-bold text-slate-900 mb-2">
              Check your email
            </h2>
            <p className="text-slate-600 mb-4">
              We&apos;ve sent a password reset link to{" "}
              <strong>{form.getValues("email")}</strong>
            </p>
          </div>

          <div className="bg-slate-50 rounded-lg p-6 text-left">
            <h3 className="font-semibold text-slate-900 mb-4">
              What&apos;s next?
            </h3>
            <div className="space-y-3">
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">1</span>
                </div>
                <p className="text-sm text-slate-600">
                  Check your email inbox (and spam folder)
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">2</span>
                </div>
                <p className="text-sm text-slate-600">
                  Click the reset password link in the email
                </p>
              </div>
              <div className="flex items-start space-x-3">
                <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                  <span className="text-xs font-medium text-blue-600">3</span>
                </div>
                <p className="text-sm text-slate-600">
                  Create a new password and sign in
                </p>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <Button
              type="button"
              variant="outline"
              onClick={onResendEmail}
              disabled={formLoading}
              className="w-full h-12 rounded-xl border-zinc-200 font-medium"
            >
              {formLoading ? "Resending..." : "Resend email"}
            </Button>

            <Link
              href="/login"
              className="inline-flex items-center text-sm text-slate-600 hover:text-slate-900"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to sign in
            </Link>
          </div>

          <div className="border-t border-slate-200 pt-6">
            <div className="flex items-center justify-center space-x-6 text-sm text-slate-500">
              <div className="flex items-center space-x-2">
                <Clock className="w-4 h-4" />
                <span>Link expires in 24h</span>
              </div>
              <div className="flex items-center space-x-2">
                <Shield className="w-4 h-4" />
                <span>Secure &amp; encrypted</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 mt-4">
              Need help?{" "}
              <Link
                href="/support"
                className="text-slate-600 hover:text-slate-900"
              >
                Contact support
              </Link>
            </p>
          </div>
        </div>
      )}
    </div>
  );
}
