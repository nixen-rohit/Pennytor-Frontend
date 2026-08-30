import { type MySIPInvestment } from "@/services/sip-for-child.service";

export const RESEND_COOLDOWN = 30;

export function maskEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return email;
  const head = local.slice(0, 1);
  return `${head}***@${domain}`;
}

export const formatINR = (value: number) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(Math.round(value));

export const STEP_META = [
  { num: 1, label: "Payment Details" },
  { num: 2, label: "Verify & Pay" },
  { num: 3, label: "Confirmation" },
] as const;

export function getNextUnpaidMonth(application: MySIPInvestment): number {
  const paidMonths = new Set(
    (application.premiums ?? [])
      .filter((p) => p.status === "PAID")
      .map((p) => p.monthNumber),
  );
  let next = application.monthsPaid + 1;
  while (next <= application.totalMonths && paidMonths.has(next)) {
    next++;
  }
  return next;
}

export function DetailRow({
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

export function ReceiptRow({
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