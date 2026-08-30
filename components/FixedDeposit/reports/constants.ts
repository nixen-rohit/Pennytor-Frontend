export const inr = (value: string | number) =>
  `₹${Number(value || 0).toLocaleString("en-IN", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;

export const TYPE_BADGE: Record<string, { label: string; cls: string }> = {
  FD_DEPOSIT: { label: "Deposit", cls: "bg-amber-500/20 text-amber-400" },
  FD_PAYOUT: { label: "EMI Credit", cls: "bg-emerald-500/20 text-emerald-400" },
};