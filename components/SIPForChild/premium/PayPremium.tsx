"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Loader2,
  Lock,
  Eye,
  EyeOff,
  ShieldCheck,
  Mail,
  CheckCircle2,
  AlertCircle,
  Wallet,
  Calendar,
  Clock,
  CreditCard,
  FileText,
  ArrowRight,
  ArrowLeft,
  Check,
  Send,
} from "lucide-react";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
  REGEXP_ONLY_DIGITS,
} from "@/components/ui/input-otp";
import { useAuthStore } from "@/store/auth.store";
import {
  SIPForChildService,
  type MySIPInvestment,
} from "@/services/sip-for-child.service";
import { format } from "date-fns";

interface Props {
  application: MySIPInvestment;
  onPaid: () => void;
  onCancel: () => void;
}

const RESEND_COOLDOWN = 30;

function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
}

const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

const STEP_META = [
  { num: 1, label: "Payment Details" },
  { num: 2, label: "Verify & Pay" },
  { num: 3, label: "Confirmation" },
] as const;

export function PayPremium({ application, onPaid, onCancel }: Props) {
  const email = useAuthStore((s) => s.user?.email ?? "");
  const [step, setStep] = useState(1);
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordVerified, setPasswordVerified] = useState(false);
  const [sendingOtp, setSendingOtp] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(RESEND_COOLDOWN);
  const [paidMonth, setPaidMonth] = useState<number | null>(null);
  const [isAdvanced, setIsAdvanced] = useState(false);

  const monthlyAmount = Number(application.monthlyInvestment);

  // Find the actual next unpaid month
  const paidMonths = new Set(
    (application.premiums ?? [])
      .filter((p) => p.status === "PAID")
      .map((p) => p.monthNumber),
  );
  let nextUnpaidMonth = application.monthsPaid + 1;
  while (
    nextUnpaidMonth <= application.totalMonths &&
    paidMonths.has(nextUnpaidMonth)
  ) {
    nextUnpaidMonth++;
  }

  // Guard: all months paid or application not active
  const allPaid = nextUnpaidMonth > application.totalMonths;
  if (allPaid || application.status !== "VERIFIED") {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <CheckCircle2 className="h-16 w-16 text-emerald-400 mb-4" />
        <h2 className="text-xl font-bold text-slate-50 mb-2">
          {allPaid ? "All Premiums Paid" : "Application Not Active"}
        </h2>
        <p className="text-sm text-zinc-400 mb-6">
          {allPaid
            ? "You've completed all monthly premiums for this SIP."
            : "This application is no longer active."}
        </p>
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="border-white/10 bg-transparent text-zinc-300 hover:bg-white/5"
        >
          Go Back
        </Button>
      </div>
    );
  }

  const isAdvancePayment = nextUnpaidMonth > application.monthsPaid + 1;

  const now = useMemo(() => new Date(), []);

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown((c) => c - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const handleVerifyPassword = async () => {
    setError(null);
    setSendingOtp(true);
    try {
      await SIPForChildService.verifyPasswordAndSendOtp(
        password,
        application.scheme,
      );
      setPasswordVerified(true);
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Password is incorrect");
    } finally {
      setSendingOtp(false);
    }
  };

  const handleResendOtp = async () => {
    setSendingOtp(true);
    try {
      await SIPForChildService.verifyPasswordAndSendOtp(
        password,
        application.scheme,
      );
      setCooldown(RESEND_COOLDOWN);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to resend OTP");
    } finally {
      setSendingOtp(false);
    }
  };

  const handlePayPremium = async () => {
    if (!password || otp.length !== 6) {
      setError("Please enter password and 6-digit OTP");
      return;
    }

    setSubmitting(true);
    setError(null);
    try {
      const result = await SIPForChildService.payPremium(
        application.id,
        password,
        otp,
      );
      setPaidMonth(result.monthNumber);
      setIsAdvanced(result.advanced);
      setStep(3);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Payment failed");
      setOtp("");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#08090f] p-4">
      <div className="mx-auto max-w-lg space-y-6">
        {/* Back button */}
        <button
          type="button"
          onClick={onCancel}
          className="flex items-center gap-2 text-sm text-zinc-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Progress
        </button>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2">
          {STEP_META.map((s, i) => (
            <div key={s.num} className="flex items-center gap-2">
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-bold transition-colors ${
                  step > s.num
                    ? "bg-emerald-500 text-white"
                    : step === s.num
                      ? "bg-amber-500 text-white"
                      : "bg-zinc-800 text-zinc-500"
                }`}
              >
                {step > s.num ? (
                  <Check className="h-4 w-4" />
                ) : (
                  s.num
                )}
              </div>
              <span
                className={`hidden sm:inline text-xs font-medium ${
                  step === s.num ? "text-white" : "text-zinc-500"
                }`}
              >
                {s.label}
              </span>
              {i < STEP_META.length - 1 && (
                <div
                  className={`w-8 h-px ${
                    step > s.num ? "bg-emerald-500" : "bg-zinc-700"
                  }`}
                />
              )}
            </div>
          ))}
        </div>

        {/* Step 1: Payment Details */}
        {step === 1 && (
          <Step1PaymentDetails
            application={application}
            nextUnpaidMonth={nextUnpaidMonth}
            monthlyAmount={monthlyAmount}
            isAdvance={isAdvancePayment}
            now={now}
            onContinue={() => setStep(2)}
            onCancel={onCancel}
          />
        )}

        {/* Step 2: Verify & Pay */}
        {step === 2 && (
          <Step2VerifyPay
            application={application}
            nextUnpaidMonth={nextUnpaidMonth}
            monthlyAmount={monthlyAmount}
            email={email}
            password={password}
            setPassword={setPassword}
            showPassword={showPassword}
            setShowPassword={setShowPassword}
            passwordVerified={passwordVerified}
            otp={otp}
            setOtp={setOtp}
            sendingOtp={sendingOtp}
            sendingPassword={sendingOtp && !passwordVerified}
            cooldown={cooldown}
            error={error}
            setError={setError}
            submitting={submitting}
            onVerifyPassword={handleVerifyPassword}
            onResendOtp={handleResendOtp}
            onPay={handlePayPremium}
            onBack={() => setStep(1)}
          />
        )}

        {/* Step 3: Confirmation */}
        {step === 3 && (
          <Step3Confirmation
            application={application}
            paidMonth={paidMonth ?? nextUnpaidMonth}
            monthlyAmount={monthlyAmount}
            isAdvanced={isAdvanced}
            onComplete={onPaid}
          />
        )}
      </div>
    </div>
  );
}

function Step1PaymentDetails({
  application,
  nextUnpaidMonth,
  monthlyAmount,
  isAdvance,
  now,
  onContinue,
  onCancel,
}: {
  application: MySIPInvestment;
  nextUnpaidMonth: number;
  monthlyAmount: number;
  isAdvance: boolean;
  now: Date;
  onContinue: () => void;
  onCancel: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
          {isAdvance ? "Advance Payment" : "Payment Details"}
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          {isAdvance
            ? `Pay ahead for Month ${nextUnpaidMonth} — stay on track with your SIP.`
            : "Review your premium payment details before proceeding."}
        </p>
      </div>

      {/* Main info card */}
      <Card className="border-white/10 bg-[#111217] shadow-xl">
        <CardContent className="p-6 space-y-5">
          {/* Month & amount header */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl ${isAdvance ? "bg-emerald-500/15" : "bg-amber-500/15"}`}>
                <CreditCard className={`h-7 w-7 ${isAdvance ? "text-emerald-400" : "text-amber-400"}`} />
              </div>
              <div>
                <p className="text-sm text-zinc-400">
                  {isAdvance ? "Advance Premium" : "Monthly Premium"}
                </p>
                <p className="text-3xl font-bold text-green-400">
                  {formatINR(monthlyAmount)}/-
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-zinc-400">
                {isAdvance ? "Paying Month" : "Month"}
              </p>
              <p className="text-2xl font-bold text-amber-400">
                {nextUnpaidMonth}/{application.totalMonths}
              </p>
            </div>
          </div>

          {isAdvance && (
            <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-3 py-2">
              <p className="text-xs font-medium text-emerald-300">
                You already paid Month {application.monthsPaid}. This payment covers Month {nextUnpaidMonth} — keeping your SIP ahead of schedule.
              </p>
            </div>
          )}

          <div className="h-px bg-white/10" />

          {/* Details grid */}
          <div className="grid grid-cols-2 gap-4">
            <DetailRow
              icon={<Calendar className="h-4 w-4 text-indigo-400" />}
              label="Payment Date"
              value={format(now, "dd MMM yyyy")}
            />
            <DetailRow
              icon={<Clock className="h-4 w-4 text-indigo-400" />}
              label="Payment Time"
              value={format(now, "hh:mm a")}
            />
            <DetailRow
              icon={<FileText className="h-4 w-4 text-indigo-400" />}
              label="Scheme"
              value={`Plan ${application.scheme}`}
            />
            <DetailRow
              icon={<Wallet className="h-4 w-4 text-indigo-400" />}
              label="Months Paid"
              value={`${application.monthsPaid} / ${application.totalMonths}`}
            />
          </div>

          <div className="h-px bg-white/10" />

          {/* Summary */}
          <div className="rounded-xl border border-white/10 bg-white/[0.03] p-4 space-y-2">
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Premium Amount</span>
              <span className="font-bold text-white">{formatINR(monthlyAmount)}/-</span>
            </div>
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Payment Method</span>
              <span className="font-bold text-white">Wallet Balance</span>
            </div>
            <div className="h-px bg-white/10" />
            <div className="flex items-center justify-between text-sm">
              <span className="text-zinc-400">Total After Payment</span>
              <span className="font-bold text-emerald-400">
                {nextUnpaidMonth}/{application.totalMonths} months
              </span>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          className="flex-1 border-white/20"
        >
          Cancel
        </Button>
        <Button
          type="button"
          onClick={onContinue}
          className="flex-1 bg-amber-600 text-white hover:bg-amber-700 shadow-lg shadow-amber-500/20"
        >
          Continue to Pay
          <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}

function Step2VerifyPay({
  application,
  nextUnpaidMonth,
  monthlyAmount,
  email,
  password,
  setPassword,
  showPassword,
  setShowPassword,
  passwordVerified,
  otp,
  setOtp,
  sendingOtp,
  sendingPassword,
  cooldown,
  error,
  setError,
  submitting,
  onVerifyPassword,
  onResendOtp,
  onPay,
  onBack,
}: {
  application: MySIPInvestment;
  nextUnpaidMonth: number;
  monthlyAmount: number;
  email: string;
  password: string;
  setPassword: (v: string) => void;
  showPassword: boolean;
  setShowPassword: (v: boolean | ((prev: boolean) => boolean)) => void;
  passwordVerified: boolean;
  otp: string;
  setOtp: (v: string) => void;
  sendingOtp: boolean;
  sendingPassword: boolean;
  cooldown: number;
  error: string | null;
  setError: (v: string | null) => void;
  submitting: boolean;
  onVerifyPassword: () => void;
  onResendOtp: () => void;
  onPay: () => void;
  onBack: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
          Verify & Pay
        </h1>
        <p className="mt-2 text-sm text-zinc-400">
          Enter your password and OTP to authorize the payment.
        </p>
      </div>

      {/* Mini summary */}
      <Card className="border-white/10 bg-[#111217]">
        <CardContent className="p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <CreditCard className="h-5 w-5 text-amber-400" />
            <div>
              <p className="text-xs text-zinc-500">Month {nextUnpaidMonth} Premium</p>
              <p className="text-lg font-bold text-green-400">
                {formatINR(monthlyAmount)}/-
              </p>
            </div>
          </div>
          <span className="rounded-lg bg-amber-500/15 px-3 py-1 text-xs font-bold text-amber-300">
            {application.scheme}
          </span>
        </CardContent>
      </Card>

      {/* Auth card */}
      <Card className="border-white/10 bg-[#111217] shadow-xl">
        <CardContent className="p-6 space-y-5">
          {!passwordVerified ? (
            <>
              <div className="space-y-1">
                <label className="block text-sm font-medium text-slate-200">
                  Password
                </label>
                <p className="text-xs text-zinc-500">
                  Enter your account password to verify identity.
                </p>
              </div>
              <div className="relative flex items-center">
                <Input
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => {
                    setPassword(e.target.value);
                    setError(null);
                  }}
                  onKeyDown={(e) => {
                    if (e.key === "Enter" && password) onVerifyPassword();
                  }}
                  className="h-11 bg-black/40 pr-10"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-2 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-md text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>

              <Button
                type="button"
                onClick={onVerifyPassword}
                disabled={sendingPassword || !password}
                className="w-full bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-60"
              >
                {sendingPassword ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                    Verifying & Sending OTP...
                  </>
                ) : (
                  <>
                    <Lock className="h-4 w-4 mr-2" />
                    Verify Password & Send OTP
                  </>
                )}
              </Button>
            </>
          ) : (
            <>
              <div className="flex items-center gap-3 text-green-400 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">
                <CheckCircle2 className="h-5 w-5 shrink-0" />
                <span className="text-sm font-medium">
                  Password verified! OTP sent to your email.
                </span>
              </div>

              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600/20">
                  <Mail className="h-5 w-5 text-indigo-400" />
                </span>
                <div>
                  <p className="text-sm font-medium text-slate-100">
                    Enter the OTP
                  </p>
                  <p className="text-xs text-slate-400">
                    Sent to{" "}
                    <span className="font-medium text-slate-200">
                      {maskEmail(email)}
                    </span>
                  </p>
                </div>
              </div>

              <div className="flex justify-center py-2">
                <InputOTP
                  maxLength={6}
                  pattern={REGEXP_ONLY_DIGITS}
                  value={otp}
                  onChange={(v) => {
                    setOtp(v);
                    setError(null);
                  }}
                >
                  <InputOTPGroup>
                    {[0, 1, 2, 3, 4, 5].map((index) => (
                      <InputOTPSlot
                        key={index}
                        index={index}
                        className="h-15 w-13 border-neutral-700 bg-black/40 text-lg"
                      />
                    ))}
                  </InputOTPGroup>
                </InputOTP>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="flex items-center gap-1.5">
                  <ShieldCheck className="h-3.5 w-3.5 text-emerald-400" />
                  OTP expires in 5 minutes
                </span>
                {cooldown > 0 ? (
                  <span>Resend in {cooldown}s</span>
                ) : (
                  <button
                    type="button"
                    onClick={onResendOtp}
                    disabled={sendingOtp}
                    className="flex items-center gap-1.5 font-medium text-indigo-400 hover:text-indigo-300 disabled:opacity-50"
                  >
                    {sendingOtp && (
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                    )}
                    Resend OTP
                  </button>
                )}
              </div>
            </>
          )}

          {error && (
            <div className="flex items-start gap-2 rounded-lg border border-red-600/40 bg-red-600/10 px-4 py-3 text-sm text-red-400">
              <AlertCircle className="h-4 w-4 mt-0.5 shrink-0" />
              <span>{error}</span>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onBack}
          disabled={submitting}
          className="flex-1 border-white/20"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        <Button
          type="button"
          onClick={onPay}
          disabled={!passwordVerified || otp.length !== 6 || submitting}
          className="flex-1 bg-amber-600 text-white hover:bg-amber-700 disabled:opacity-60 shadow-lg shadow-amber-500/20"
        >
          {submitting ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin mr-2" />
              Processing...
            </>
          ) : (
            <>
              <Wallet className="h-4 w-4 mr-2" />
              Pay {formatINR(monthlyAmount)}/-
            </>
          )}
        </Button>
      </div>
    </div>
  );
}

function Step3Confirmation({
  application,
  paidMonth,
  monthlyAmount,
  isAdvanced,
  onComplete,
}: {
  application: MySIPInvestment;
  paidMonth: number;
  monthlyAmount: number;
  isAdvanced: boolean;
  onComplete: () => void;
}) {
  return (
    <div className="space-y-5 animate-in fade-in-0 zoom-in-95 duration-500">
      {/* Success header */}
      <div className="text-center space-y-4 py-6">
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-emerald-400/15 ring-4 ring-emerald-400/20">
          <CheckCircle2 className="h-10 w-10 text-emerald-400" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-50">
            {isAdvanced ? "Advance Payment Successful!" : "Payment Successful!"}
          </h1>
          <p className="mt-2 text-sm text-zinc-400">
            {isAdvanced
              ? `Month ${paidMonth} advance premium has been paid.`
              : `Month ${paidMonth} premium has been paid.`}
          </p>
        </div>
      </div>

      {/* Receipt card */}
      <Card className="border-white/10 bg-[#111217] shadow-xl">
        <CardContent className="p-6 space-y-4">
          <div className="flex items-center gap-2 mb-2">
            <FileText className="h-4 w-4 text-zinc-400" />
            <p className="text-sm font-semibold text-zinc-300">Payment Receipt</p>
          </div>

          <div className="space-y-3">
            <ReceiptRow label="Scheme" value={`Plan ${application.scheme}`} />
            {isAdvanced && (
              <ReceiptRow label="Type" value="Advance Payment" accent />
            )}
            <ReceiptRow label="Month" value={`${paidMonth} of ${application.totalMonths}`} />
            <ReceiptRow label="Amount Paid" value={`${formatINR(monthlyAmount)}/-`} accent />
            <ReceiptRow label="Payment Method" value="Wallet Balance" />
            <ReceiptRow label="Months Completed" value={`${paidMonth} / ${application.totalMonths}`} />
            {application.monthsMissed > 0 && (
              <ReceiptRow
                label="Months Missed"
                value={`${application.monthsMissed}`}
                danger
              />
            )}
          </div>

          <div className="h-px bg-white/10" />

          <div className="flex items-start gap-2 rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3">
            <Send className="h-4 w-4 mt-0.5 shrink-0 text-emerald-400" />
            <p className="text-xs text-emerald-300">
              A confirmation email with payment details has been sent to your
              registered email address.
            </p>
          </div>
        </CardContent>
      </Card>

      {/* Actions */}
      <div className="flex gap-3">
        <Button
          type="button"
          asChild
          variant="outline"
          className="flex-1 border-white/20"
        >
          <Link href="/investment/all-schemes/sip-for-child/reports">
            View Reports
          </Link>
        </Button>
        <Button
          type="button"
          onClick={onComplete}
          className="flex-1 bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-500/20"
        >
          Back to Progress
        </Button>
      </div>
    </div>
  );
}

function DetailRow({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-start gap-2.5">
      <span className="mt-0.5">{icon}</span>
      <div>
        <p className="text-xs text-zinc-500">{label}</p>
        <p className="text-sm font-bold text-zinc-100">{value}</p>
      </div>
    </div>
  );
}

function ReceiptRow({
  label,
  value,
  accent = false,
  danger = false,
}: {
  label: string;
  value: string;
  accent?: boolean;
  danger?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-zinc-400">{label}</span>
      <span
        className={`font-bold ${
          accent
            ? "text-emerald-400"
            : danger
              ? "text-red-400"
              : "text-white"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
