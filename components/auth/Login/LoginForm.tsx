"use client";

import React from "react";
import { Eye, EyeOff, Loader2, Asterisk } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { LoginFieldErrors } from "./LoginTypes";

interface LoginFormProps {
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  formLoading: boolean;
  errorMsg: string;
  showPassword: boolean;
  keepSignedIn: boolean;
  fieldErrors: LoginFieldErrors;
  onTogglePassword: () => void;
  onToggleKeepSignedIn: () => void;
  onResetPassword: () => void;
  onGoogleSignIn: () => void;
  onRegister: () => void;
}

export default function LoginForm({
  onSubmit,
  formLoading,
  errorMsg,
  showPassword,
  keepSignedIn,
  fieldErrors,
  onTogglePassword,
  onToggleKeepSignedIn,
  onResetPassword,
  onGoogleSignIn,
  onRegister,
}: LoginFormProps) {
  return (
    <div className="w-full max-w-sm mx-auto space-y-8 ">      

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
      <form onSubmit={onSubmit} className="space-y-5">
        <div className="space-y-2">
          <Label
            htmlFor="email"
            className="text-sm font-medium text-zinc-700"
          >
            Your email
          </Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="name@example.com"
            required
            className="h-12 text-zinc-900 rounded-xl border-zinc-200 bg-zinc-50/50 block w-full"
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
              placeholder="Enter your Password"
              required
              className="h-12 rounded-xl text-zinc-900  border-zinc-200 bg-zinc-50/50   pr-10 block w-full"
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
            <p className="text-xs text-red-500">{fieldErrors.password}</p>
          )}
        </div>

        <div className="flex justify-between items-center text-sm">
          <label className="flex items-center gap-2 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={keepSignedIn}
              onChange={onToggleKeepSignedIn}
              className="rounded border-zinc-300 text-indigo-600 focus:ring-indigo-500"
            />
            <span className="text-zinc-600">Keep me signed in</span>
          </label>
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
          <p className="text-xs font-medium text-red-500 bg-red-50 border border-red-200 px-3 py-2 rounded-lg animate-in fade-in-50">
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

      {/* Separator */}
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-zinc-200" />
        </div>
        <div className="relative flex justify-center text-xs">
          <span className="px-2 bg-white text-zinc-400 tracking-wider uppercase">
            Or continue with
          </span>
        </div>
      </div>

      {/* OAuth Button */}
      <Button
        type="button"
        variant="outline"
        onClick={onGoogleSignIn}
        className="w-full h-12 border-zinc-200 rounded-xl gap-2 font-medium"
      >
        <GoogleIcon /> Continue with Google
      </Button>

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

const GoogleIcon: React.FC = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    className="h-5 w-5"
    viewBox="0 0 48 48"
  >
    <path
      fill="#FFC107"
      d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8-6.627 0-12-5.373-12-12s12-5.373 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 12.955 4 4 12.955 4 24s8.955 20 20 20 20-8.955 20-20c0-2.641-.21-5.236-.611-7.743z"
    />
    <path
      fill="#FF3D00"
      d="M6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4 16.318 4 9.656 8.337 6.306 14.691z"
    />
    <path
      fill="#4CAF50"
      d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238C29.211 35.091 26.715 36 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z"
    />
    <path
      fill="#1976D2"
      d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.022 35.026 44 30.038 44 24c0-2.641-.21-5.236-.611-7.743z"
    />
  </svg>
);