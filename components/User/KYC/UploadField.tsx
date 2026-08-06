"use client";

import { useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Upload, X } from "lucide-react";

interface UploadFieldProps {
  label: string;
  hint: string;
  accept: string;
  icon?: React.ElementType;
  error?: string;
  file: File | null;
  onSelect: (f: File) => void;
  onRemove: () => void;
}

export function UploadField({
  label,
  hint,
  accept,
  icon: Icon = Upload,
  error,
  file,
  onSelect,
  onRemove,
}: UploadFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          const f = e.dataTransfer.files?.[0];
          if (f) onSelect(f);
        }}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? "border-indigo-400 bg-indigo-950/20"
            : "border-neutral-700 hover:border-indigo-400 hover:bg-indigo-950/20"
        }`}
      >
        {preview ? (
          <div className="relative">
            <img
              src={preview}
              alt={label}
              className="max-h-48 rounded-md border border-neutral-700 object-contain"
            />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                onRemove();
              }}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-red-600"
              aria-label="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            <Icon className="mb-3 h-8 w-8 text-slate-400" />
            <p className="text-sm font-medium text-slate-300">
              Click to upload or drag & drop
            </p>
            <p className="mt-1 text-xs text-slate-400">{hint}</p>
          </>
        )}
      </div>

      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) onSelect(f);
          e.target.value = "";
        }}
      />
      {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
    </div>
  );
}
