interface SlipRowProps {
  label: string;
  value: string;
  mono?: boolean;
  muted?: boolean;
  badge?: "pending" | "draft";
}

export function SlipRow({
  label,
  value,
  mono = false,
  muted = false,
  badge,
}: SlipRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-sm text-slate-400">{label}</span>
      {badge ? (
        <span
          className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${
            badge === "pending"
              ? "bg-amber-500/10 text-amber-300"
              : "bg-neutral-800 text-slate-400"
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
