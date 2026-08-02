interface SlipRowProps {
  label: string;
  value: string;
  mono?: boolean;
}

export function SlipRow({ label, value, mono = false }: SlipRowProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-2.5">
      <span className="text-xs text-slate-400">{label}</span>
      <span
        className={`truncate text-right text-xs text-slate-200 ${
          mono ? "font-mono" : ""
        }`}
      >
        {value}
      </span>
    </div>
  );
}
