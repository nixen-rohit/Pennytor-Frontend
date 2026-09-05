interface SlipRowProps {
  label: string;
  value: string;
  mono?: boolean;
  muted?: boolean;
  badge?: "pending" | "draft" | "under_review" | "verified" | "rejected";
}

export function SlipRow({
  label,
  value,
  mono = false,
  muted = false,
  badge,
}: SlipRowProps) {
  const badgeStyles: Record<string, string> = {
    pending: "bg-amber-500/10 text-amber-300",
    under_review: "bg-blue-500/10 text-blue-300",
    verified: "bg-green-600/10 text-green-400",
    rejected: "bg-red-600/10 text-red-400",
    draft: "bg-neutral-800 text-slate-400",
  };

  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-slate-400">{label}</span>
      {badge ? (
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            badgeStyles[badge] || badgeStyles.draft
          }`}
        >
          {value}
        </span>
      ) : (
        <span
          className={`truncate text-right text-sm ${
            mono ? "font-mono" : ""
          } ${muted ? "text-slate-500" : "text-white"}`}
        >
          {value}
        </span>
      )}
    </div>
  );
}