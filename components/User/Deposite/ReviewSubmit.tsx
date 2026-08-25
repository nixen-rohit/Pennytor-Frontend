import { TriangleAlert } from "lucide-react";
import { SESSION } from "./types";
import type { FormState } from "./types";
import { SlipRow } from "./SlipRow";
import { currency } from "./format";
import { useAuthStore } from "@/store/auth.store";

interface ReviewSubmitProps {
  data: FormState;
}

export function ReviewSubmit({ data }: ReviewSubmitProps) {
  const user = useAuthStore((s) => s.user);
  const requestedBy = user
    ? `${user.firstName} ${user.lastName}`
    : SESSION.userName;

  return (
    <div className="space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="rounded-xl border border-neutral-800 bg-neutral-950 p-5">
        <div className="mb-3 flex text-yellow-600 items-center gap-2 text-md font-bold  -slate-400">
          <TriangleAlert   className="h-6 w-6  " />
          Everything looks right?
        </div>

          

        <p className="border-b pb-2 mb-2  font-bold text-4xl flex justify-end items-center">
          <span className="mr-auto">Amount </span>
          <span className="text-green-600">
            {data.amount ? `+ ${currency(data.amount)}` : "NONE"}
          </span>
        </p>
        <div className="divide-y divide-neutral-800">
          <SlipRow label="Transaction id" value={data.txnId} mono />
          <SlipRow label="Requested by" value={requestedBy} />
          <SlipRow label="User type" value={SESSION.userType} />
          <SlipRow label="Request type" value="Credit (CR)" />
          <SlipRow label="Screenshot" value={data.screenshot?.name ?? "-"} />
        </div>
      </div>

      <p className="text-sm text-slate-400">
        Once submitted, this request goes to the admin dashboard as{" "}
        <span className="font-medium text-yellow-400">Pending</span> until your
        balance is not update.
      </p>
    </div>
  );
}