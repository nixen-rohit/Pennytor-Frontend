"use client";

import { Mail, Sparkles, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import type { UseFormReturn } from "react-hook-form";
import type { RegisteredOtpFormValues } from "@/lib/validations";

interface RegisteredOtpFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  form: UseFormReturn<RegisteredOtpFormValues>;
  onSubmit: (data: RegisteredOtpFormValues) => void;
  formLoading: boolean;
  errorMsg: string;
  email: string;
  onResend: () => void;
  resendCooldown: number;
  onLogin?: () => void;
}

export default function RegisteredOtpForm({
  open,
  onOpenChange,
  form,
  onSubmit,
  formLoading,
  errorMsg,
  email,
  onResend,
  resendCooldown,
  onLogin,
}: RegisteredOtpFormProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-3xl border-0 bg-white px-8 py-10 shadow-2xl">
        <DialogHeader className="flex flex-col items-center text-center">
          {/* Icon */}
          <div className="relative mb-6">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl border-2 border-black">
              <Mail className="h-8 w-8 text-black" />
            </div>
            <Sparkles
              className="absolute -right-5 -top-2 h-6 w-6 fill-yellow-400 text-yellow-400"
              strokeWidth={1.5}
            />
          </div>

          <DialogTitle className="text-3xl font-bold tracking-tight text-slate-900">
            Verify your email
          </DialogTitle>
          <DialogDescription className="mt-4 text-sm leading-7 text-slate-500">
            To keep a trusted and safe community, we&apos;ve sent a verification
            code to{" "}
            <span className="font-semibold text-slate-700">{email}</span> for
            verification, and Thank You.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-6"
          >
            {/* OTP Input */}
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <div className="flex justify-center">
                      <InputOTP
                        maxLength={6}
                        pattern={REGEXP_ONLY_DIGITS}
                        value={field.value}
                        onChange={field.onChange}
                        disabled={formLoading}
                      >
                        <InputOTPGroup className=" text-black">
                          <InputOTPSlot
                            index={0}
                            className="h-12 w-12  text-lg"
                          />
                          <InputOTPSlot
                            index={1}
                            className="h-12 w-12  text-lg"
                          />
                          <InputOTPSlot
                            index={2}
                            className="h-12 w-12  text-lg"
                          />
                          <InputOTPSlot
                            index={3}
                            className="h-12 w-12  text-lg"
                          />
                          <InputOTPSlot
                            index={4}
                            className="h-12 w-12  text-lg"
                          />
                          <InputOTPSlot
                            index={5}
                            className="h-12 w-12  text-lg"
                          />
                        </InputOTPGroup>
                      </InputOTP>
                    </div>
                  </FormControl>
                  <FormMessage className="text-center" />
                </FormItem>
              )}
            />

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
              className="w-full h-12 font-medium rounded-xl text-sm bg-foreground hover:bg-foreground/80 text-white"
            >
              {formLoading ? (
                <span className="flex items-center gap-2 justify-center">
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Verifying...
                </span>
              ) : (
                "Verify Code"
              )}
            </Button>
          </form>
        </Form>

        {/* Resend */}
        <p className="text-center text-sm text-slate-500">
          Did not receive the code?{" "}
          {resendCooldown > 0 ? (
            <span className="font-medium text-slate-400">
              Resend in {resendCooldown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={onResend}
              className="font-medium text-foreground hover:underline"
            >
              Resend code
            </button>
          )}
        </p>

        {/* Footer */}
        <p className="text-center text-sm text-slate-500">
          Have an account?{" "}
          <button
            type="button"
            onClick={() => (onLogin ? onLogin() : onOpenChange(false))}
            className="font-semibold text-slate-900 hover:underline"
          >
            Log in
          </button>
        </p>
      </DialogContent>
    </Dialog>
  );
}
