import { CheckCircle2 as IconCheckCircle2 } from "lucide-react";
import type { FormState } from "./types";
import { currency } from "./format";

interface SubmitRequestProps {
  data: FormState;
}

export function SubmitRequest({ data }: SubmitRequestProps) {
  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <SectionHeading title="Submit your request" />

      <div className="flex flex-col items-center rounded-xl border border-neutral-800 bg-neutral-950 p-8 text-center">
        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-indigo-500/10 ring-1 ring-indigo-400/30">
          <IconCheckCircle2 className="h-7 w-7 text-indigo-400" />
        </div>
        <h3 className="mt-4 text-lg font-medium text-slate-50">
          Ready to add {data.amount ? currency(data.amount) : "your deposit"}?
        </h3>
        <p className="mt-2 max-w-sm text-sm text-slate-400">
          Once submitted, this request goes to the admin dashboard as{" "}
          <span className="font-medium text-slate-200">Pending</span> until
          the team verifies your transaction id and screenshot.
        </p>
      </div>
    </div>
  );
}

function SectionHeading({ title }: { title: string }) {
  return (
    <div className="border-b pb-2">
      <h3 className="text-base font-semibold text-slate-50">{title}</h3>
    </div>
  );
}
