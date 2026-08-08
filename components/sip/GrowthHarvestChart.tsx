"use client";

import { formatCompactINR } from "@/utils/sip-calculations";
import type { YearPoint } from "@/types/sip";
import { cn } from "@/lib/utils";

interface GrowthHarvestChartProps {
  sipPoints: YearPoint[];
  swpPoints: YearPoint[];
}

/**
 * Renders both phases as one continuous timeline: green bars while the
 * corpus is being grown, coral bars while it's being drawn down — literal
 * to the plan's own "plant, then harvest" shape.
 */
export function GrowthHarvestChart({ sipPoints, swpPoints }: GrowthHarvestChartProps) {
  const sipYearsLen = sipPoints.length;
  const combined = [
    ...sipPoints.map((p) => ({ ...p, phase: "sip" as const })),
    ...swpPoints.map((p) => ({
      ...p,
      year: p.year + sipYearsLen,
      phase: "swp" as const,
    })),
  ];

  const max = Math.max(...combined.map((p) => p.balance), 1);

  return (
    <div className="flex items-end gap-1.5 sm:gap-2">
      {combined.map((point, i) => {
        const heightPct = Math.max(4, (point.balance / max) * 100);
        const isPhaseBoundary = i === sipYearsLen - 1;
        return (
          <div key={i} className="flex flex-1 flex-col items-center gap-1.5">
            {i % 2 === 0 && (
              <span className="font-mono text-[10px] text-muted-foreground tabular">
                {formatCompactINR(point.balance)}
              </span>
            )}
            {i % 2 !== 0 && <span className="h-[13px]" />}
            <div className="flex h-36 w-full items-end sm:h-44">
              <div
                className={cn(
                  "animate-grow-in w-full origin-bottom rounded-t-sm",
                  point.phase === "sip" ? "bg-sip-sapling" : "bg-sip-harvest",
                  isPhaseBoundary && "ring-2 ring-sip-gold ring-offset-1",
                )}
                style={{ height: `${heightPct}%`, animationDelay: `${i * 40}ms` }}
              />
            </div>
            <span className="text-[10px] font-medium text-secondary">
              Yr {Math.round(point.year * 10) / 10}
            </span>
          </div>
        );
      })}
    </div>
  );
}
