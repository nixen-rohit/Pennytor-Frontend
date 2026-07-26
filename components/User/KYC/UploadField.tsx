import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Upload, FileUp, X } from "lucide-react";
 

interface UploadFieldProps {
  label: string;
  hint: string;
  accept: string;
  file: File | null;
  onSelect: (f: File) => void;
  onRemove: () => void;
}

export function UploadField({
  label,
  hint,
  accept,
  file,
  onSelect,
  onRemove,
}: UploadFieldProps) {
  return (
    <div className="space-y-2">
      <Label>{label}</Label>

      <label className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-neutral-700 p-8 text-center transition-colors hover:border-indigo-400  hover:bg-indigo-950/20">
        <Upload className="mb-3 h-8 w-8 text-slate-400" />
        <p className="text-sm font-medium text-slate-300">
          {file ? "Change file" : "Click to upload"}
        </p>
        <p className="mt-1 text-xs text-slate-400">{hint}</p>
        <input
          type="file"
          accept={accept}
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onSelect(f);
            e.target.value = "";
          }}
        />
      </label>

      {file && (
        <div className="flex items-center gap-2 rounded-lg border  bg-neutral-900 px-3 py-2 text-sm">
          <FileUp className="h-4 w-4 shrink-0 text-indigo-600" />
          <span className="truncate flex-1 text-slate-300">
            {file.name}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="h-6 w-6 shrink-0 text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={onRemove}
            aria-label="Remove file"
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}
