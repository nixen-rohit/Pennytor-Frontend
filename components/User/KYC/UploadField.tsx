"use client";

import { useMemo, useRef, useState } from "react";
import { Label } from "@/components/ui/label";
import { Upload, X, AlertCircle } from "lucide-react";

interface UploadFieldProps {
  label: string;
  hint: string;
  accept: string;
  icon?: React.ElementType;
  error?: string;
  file: File | null;
  onSelect: (f: File) => void;
  onRemove: () => void;
  allowedTypes?: string[];
  maxSizeMB?: number;
}

const DEFAULT_MAX_SIZE_MB = 2;

function validateFile(file: File, allowedTypes: string[], maxSizeMB: number): string | null {
  // Check file size
  const maxBytes = maxSizeMB * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File size exceeds ${maxSizeMB} MB limit.`;
  }

  // Check MIME type against allowed types
  const isAllowed = allowedTypes.some((type) => {
    if (type.endsWith("/*")) {
      return file.type.startsWith(type.slice(0, -1));
    }
    return file.type === type;
  });

  if (!isAllowed) {
    const friendly = allowedTypes
      .map((t) => (t.endsWith("/*") ? t.slice(0, -2).toUpperCase() : t.toUpperCase()))
      .join(", ");
    return `Invalid file type. Allowed: ${friendly}.`;
  }

  return null;
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
  allowedTypes = ["image/jpeg", "image/png", "image/webp"],
  maxSizeMB = DEFAULT_MAX_SIZE_MB,
}: UploadFieldProps) {
  const [dragOver, setDragOver] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const preview = useMemo(
    () => (file ? URL.createObjectURL(file) : null),
    [file],
  );

  const handleFileSelect = (f: File) => {
    const err = validateFile(f, allowedTypes, maxSizeMB);
    if (err) {
      setValidationError(err);
      return;
    }
    setValidationError(null);
    onSelect(f);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files?.[0];
    if (f) handleFileSelect(f);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFileSelect(f);
    e.target.value = "";
  };

  const displayError = error || validationError;

  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <div
        onDragOver={(e) => {
          e.preventDefault();
          setDragOver(true);
        }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 text-center transition-colors ${
          dragOver
            ? "border-indigo-400 bg-indigo-950/20"
            : displayError
              ? "border-red-500 bg-red-950/20"
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
                setValidationError(null);
              }}
              className="absolute -right-2 -top-2 flex h-6 w-6 items-center justify-center rounded-full bg-neutral-800 text-white hover:bg-red-600"
              aria-label="Remove file"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : (
          <>
            {displayError ? (
              <AlertCircle className="mb-3 h-8 w-8 text-red-500" />
            ) : (
              <Icon className="mb-3 h-8 w-8 text-slate-400" />
            )}
            <p className="text-sm font-medium text-slate-300">
              {displayError ? "Invalid file — see error below" : "Click to upload or drag & drop"}
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
        onChange={handleInputChange}
      />
      {displayError && (
        <p className="mt-1.5 text-xs text-red-500 flex items-center gap-1">
          <AlertCircle className="h-3.5 w-3.5 flex-shrink-0" />
          {displayError}
        </p>
      )}
    </div>
  );
}
