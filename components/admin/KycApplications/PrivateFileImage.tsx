"use client";

import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye, Loader2, Download, AlertTriangle } from "lucide-react";
import { KycAdminService } from "@/services/kyc-admin.service";

/**
 * Loads a private KYC document through the authenticated file endpoint
 * (session cookie + credentials) and renders it as an object URL — the
 * actual file bytes never leave the backend as a public URL.
 */
export function PrivateFileImage({
  applicationId,
  fileId,
  alt,
  className,
  previewClassName,
  buttonLabel,
}: {
  applicationId: string;
  fileId: string;
  alt: string;
  className?: string;
  previewClassName?: string;
  /** When set, render a text button (e.g. "View") instead of an inline thumbnail. */
  buttonLabel?: string;
}) {
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let objectUrl: string | null = null;
    let cancelled = false;

    (async () => {
      try {
        const blob = await KycAdminService.fetchFile(applicationId, fileId);
        if (cancelled) return;
        objectUrl = URL.createObjectURL(blob);
        setUrl(objectUrl);
      } catch {
        if (!cancelled) setFailed(true);
      }
    })();

    return () => {
      cancelled = true;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [applicationId, fileId]);

  if (failed) {
    return (
      <span className="inline-flex items-center gap-1 text-xs text-red-400">
        <AlertTriangle className="h-3.5 w-3.5" /> Failed to load
      </span>
    );
  }

  if (!url) {
    return <Loader2 className="h-5 w-5 animate-spin text-slate-500" />;
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {buttonLabel ? (
          <button
            type="button"
            className="inline-flex items-center gap-1 text-xs text-indigo-400 hover:text-indigo-300"
            title={`View ${alt}`}
          >
            <Eye className="h-3.5 w-3.5" />
            {buttonLabel}
          </button>
        ) : (
          <button
            type="button"
            className="group relative inline-flex cursor-zoom-in"
            aria-label={`View ${alt}`}
          >
            <img src={url} alt={alt} className={className} />
            <span className="absolute inset-0 flex items-center justify-center rounded-md bg-black/40 opacity-0 transition-opacity group-hover:opacity-100">
              <Eye className="h-6 w-6 text-white" />
            </span>
          </button>
        )}
      </DialogTrigger>
      <DialogContent
        className="max-w-[90vw] sm:max-w-3xl border-neutral-800"
        aria-describedby={undefined}
      >
        <DialogTitle className="sr-only">{alt}</DialogTitle>
        <div className="flex flex-col items-center gap-3 p-2">
          <img
            src={url}
            alt={alt}
            className={`max-h-[80vh] w-auto object-contain rounded-md ${previewClassName ?? ""}`}
          />
          <div className="flex items-center gap-4">
            <p className="text-sm text-slate-400">{alt}</p>
            <a
              href={KycAdminService.downloadUrl(applicationId, fileId)}
              className="inline-flex items-center gap-1.5 text-sm text-indigo-400 hover:text-indigo-300"
              onClick={(e) => e.stopPropagation()}
            >
              <Download className="h-4 w-4" />
              Download
            </a>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}