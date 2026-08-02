import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Receipt, Landmark } from "lucide-react";

import { SLIP, slipRows } from "./types";
import { SlipRow } from "./SlipRow";

export function PaymentSlipCard() {
  return (
    <Card className="border-neutral-800 bg-neutral-950 shadow-sm">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-800">
              <Receipt className="h-4 w-4 text-slate-300" />
            </span>
            <div>
              <p className="text-sm font-medium text-slate-200">Payment Slip</p>
              <p className="text-[11px] text-slate-500">Latest fund request</p>
            </div>
          </div>
          <Badge
            variant="outline"
            className="border-amber-500/20 bg-amber-500/10 text-xs text-amber-300"
          >
            {SLIP.status}
          </Badge>
        </div>

        <div className="divide-y divide-neutral-800 rounded-lg border border-neutral-800 bg-black/30 px-4">
          {slipRows.map((row) => (
            <SlipRow
              key={row.label}
              label={row.label}
              value={row.value}
              mono={row.mono}
            />
          ))}
        </div>

        <div className="flex items-start gap-2 text-[11px] text-slate-400">
          <Landmark className="mt-0.5 h-3.5 w-3.5 shrink-0" />
          Verified by the admin team within 30 minutes of submission
        </div>
      </CardContent>
    </Card>
  );
}
