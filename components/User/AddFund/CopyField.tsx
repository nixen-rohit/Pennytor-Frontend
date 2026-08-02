"use client";

import { useCallback, useState } from "react";
import { Copy as IconCopy, Check as IconCheck } from "lucide-react";

interface CopyFieldProps {
  label: string;
  value: string;
  mono?: boolean;
}

export function CopyField({ label, value, mono = true }: CopyFieldProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = useCallback(() => {
    navigator.clipboard?.writeText(value).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  }, [value]);

  return (
    <div className="flex items-center justify-between gap-3 py-2.5">
      <div className="min-w-0">
        <p className="text-[11px] uppercase tracking-wide text-slate-400">
          {label}
        </p>
        <p
          className={`truncate text-sm text-slate-100 ${
            mono ? "font-mono" : ""
          }`}
        >
          {value}
        </p>
      </div>
      <button
        type="button"
        onClick={handleCopy}
        className="flex shrink-0 items-center gap-1 rounded-md border border-neutral-700 px-2 py-1 text-xs text-slate-400 transition hover:border-neutral-600 hover:text-slate-200"
      >
        {copied ? (
          <>
            <IconCheck className="h-3.5 w-3.5 text-emerald-400" />
            <span className="text-emerald-400">Copied</span>
          </>
        ) : (
          <>
            <IconCopy className="h-3.5 w-3.5" />
            Copy
          </>
        )}
      </button>
    </div>
  );
}
