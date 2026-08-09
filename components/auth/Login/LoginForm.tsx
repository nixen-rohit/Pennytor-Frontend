"use client";

import React from "react";
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
import type { LoginFormValues } from "@/lib/validations";

interface LoginFormProps {
  form: UseFormReturn<LoginFormValues>;
  onSubmit: (data: LoginFormValues) => void;
  formLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
  onTogglePassword: () => void;
  onResetPassword: () => void;
  onRegister: () => void;
}

export default function LoginForm({
  form,
  onSubmit,
  formLoading,
  errorMsg,
  showPassword,
  onTogglePassword,
  onResetPassword,
  onRegister,
}: LoginFormProps) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-8  ">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight text-black ">
          Welcome back
        </h1>
        <p className="text-sm text-zinc-500">
          Access your tasks, notes, and projects anytime, anywhere — and keep
          everything flowing in one place.
        </p>
      </div>

      {/* Form */}
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-medium text-zinc-700">
                  Your email
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    placeholder="name@example.com"
                    className="h-12 text-zinc-900 rounded-xl border-zinc-200 bg-zinc-50/50 block w-full"
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
                  <div className="relative flex items-center  ">
                    <Input
                      {...field}
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your Password"
                      className="h-12 text-zinc-900 rounded-xl  border-zinc-200 bg-zinc-50/50   pr-10 block w-full"
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

          <div className="flex justify-end items-center text-sm">
            <button
              type="button"
              onClick={onResetPassword}
              className="text-zinc-500 hover:text-zinc-900 hover:underline"
            >
              Forgot password
            </button>
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
                Signing in...
              </span>
            ) : (
              "Get Started"
            )}
          </Button>
        </form>
      </Form>

      {/* Footer */}
      <p className="text-center text-sm text-zinc-500">
        New to our platform?{" "}
        <Button
          type="button"
          variant="link"
          onClick={onRegister}
          className="text-sm font-medium text-foreground hover:underline p-0 h-auto inline-flex"
        >
          Create account
        </Button>
      </p>
    </div>
  );
}
