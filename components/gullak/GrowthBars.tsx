"use client";

import { formatCompactINR } from "@/utils/gullak-calculations";
import type { YearlyBreakdownRow } from "@/types/gullak";

interface GrowthBarsProps {
  rows: YearlyBreakdownRow[];
}

/**
 * Each year is rendered as a stack of coins — the bar's height tracks the
 * maturity value, and the horizontal rings evoke coins dropped one on top
 * of another, literal to a "gullak" (piggy bank) filling up.
 */
export function GrowthBars({ rows }: GrowthBarsProps) {
  const max = Math.max(...rows.map((r) => r.finalAmount), 1);

  return (
    <div className="flex items-end gap-3 sm:gap-4">
      {rows.map((row, i) => {
        const heightPct = Math.max(6, (row.finalAmount / max) * 100);
        const isLast = i === rows.length - 1;
        return (
          <div
            key={row.year}
            className="flex flex-1 flex-col items-center gap-2"
          >
            <span className="font-mono text-[11px] text-muted-foreground tabular">
              {formatCompactINR(row.finalAmount)}
            </span>
            <div className="flex h-40 w-full items-end sm:h-48">
              <div
                className="animate-coin-drop w-full rounded-t-md bg-coin-stack"
                style={{
                  height: `${heightPct}%`,
                  backgroundColor: isLast ? "#EFA23A" : "#BD5B2C",
                  animationDelay: `${i * 60}ms`,
                }}
              />
            </div>
            <span className="text-xs font-medium text-secondary">
              Yr {Math.round(row.year * 10) / 10}
            </span>
          </div>
        );
      })}
    </div>
  );
}
