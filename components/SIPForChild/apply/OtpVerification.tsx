"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Loader2, Mail, Lock, ShieldCheck } from "lucide-react";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";

interface Props {
  data: { password: string; otp: string };
  errors: { password?: string; otp?: string };
  onChange: (key: "password" | "otp", value: string) => void;
  onResend: () => void;
  onSendOtp: () => Promise<void>;
  resendBusy: boolean;
  sendingOtp: boolean;
}

export function OtpVerification({
  data,
  errors,
  onChange,
  onResend,
  onSendOtp,
  resendBusy,
  sendingOtp,
}: Props) {
  const handleSendOtp = async () => {
    if (!data.password) {
      onChange("password", "");
      return;
    }
    await onSendOtp();
  };

  return (
    <div className="space-y-6">
      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="p-5">
          <div className="flex items-center gap-2">
            <Lock className="h-5 w-5 shrink-0 text-orange-400" />
            <h3 className="text-sm font-semibold text-white">Password Verification</h3>
          </div>

          <div className="mt-4">
            <Label htmlFor="password" className="block text-sm font-medium text-white">
              Password
            </Label>
            <div className="mt-2 relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500">
                <Lock className="h-5 w-5" />
              </span>
              <Input
                id="password"
                type="password"
                value={data.password}
                onChange={(e) => onChange("password", e.target.value)}
                className="pl-10"
                placeholder="Enter your password"
                aria-invalid={!!errors.password}
                aria-describedby={errors.password ? "password-error" : undefined}
                disabled={sendingOtp}
              />
            </div>
            {errors.password && (
              <p id="password-error" className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.password}
              </p>
            )}
          </div>

          <Button
            type="button"
            variant="outline"
            onClick={handleSendOtp}
            disabled={!data.password || sendingOtp}
            className="mt-4 w-full flex items-center justify-center gap-2 border-white/15 bg-white/5 text-white hover:bg-orange-400 hover:text-black disabled:opacity-50"
          >
            {sendingOtp ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Sending OTP…
              </>
            ) : (
              <>
                <Mail className="h-4 w-4" />
                Send OTP to Email
              </>
            )}
          </Button>
        </CardContent>
      </Card>

      <Card className="border-white/10 bg-white/[0.03]">
        <CardContent className="p-5">
          <div className="flex items-center gap-2">
            <ShieldCheck className="h-5 w-5 shrink-0 text-emerald-400" />
            <h3 className="text-sm font-semibold text-white">OTP Verification</h3>
          </div>

          <p className="mt-2 text-sm text-zinc-500">
            A 6-digit OTP has been sent to your registered email address.
          </p>

          <div className="mt-4">
            <Label htmlFor="otp" className="block text-sm font-medium text-white">
              Enter OTP
            </Label>
            <InputOTP
              className="mt-2"
              value={data.otp}
              onChange={(value) => onChange("otp", value)}
              onComplete={(value) => onChange("otp", value)}
              disabled={sendingOtp}
            >
              <InputOTPGroup className="flex gap-2">
                <InputOTPSlot index={0} className="w-12 h-12 text-center text-lg" />
                <InputOTPSlot index={1} className="w-12 h-12 text-center text-lg" />
                <InputOTPSlot index={2} className="w-12 h-12 text-center text-lg" />
                <InputOTPSlot index={3} className="w-12 h-12 text-center text-lg" />
                <InputOTPSlot index={4} className="w-12 h-12 text-center text-lg" />
                <InputOTPSlot index={5} className="w-12 h-12 text-center text-lg" />
              </InputOTPGroup>
            </InputOTP>
            {errors.otp && (
              <p className="mt-1.5 text-sm text-red-400" role="alert">
                {errors.otp}
              </p>
            )}
          </div>

          <div className="mt-4 flex items-center justify-between">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={onResend}
              disabled={resendBusy}
              className="text-zinc-400 hover:text-white disabled:opacity-50"
            >
              {resendBusy ? (
                <>
                  <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                  Resending…
                </>
              ) : (
                "Resend OTP"
              )}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}