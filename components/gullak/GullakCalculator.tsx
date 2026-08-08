"use client";

import { useMemo, useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { GrowthBars } from "./GrowthBars";
import {
  CALCULATOR_LIMITS,
  PRESET_SCHEMES,
  calculateGullak,
  calculateYearlyBreakdown,
  formatINR,
} from "@/utils/gullak-calculations";
import { cn } from "@/lib/utils";

export function GullakCalculator() {
  const [dailyDeposit, setDailyDeposit] = useState<number>(
    CALCULATOR_LIMITS.dailyDeposit.default,
  );
  const [years, setYears] = useState<number>(CALCULATOR_LIMITS.years.default);
  const [annualRatePercent, setAnnualRatePercent] = useState<number>(
    CALCULATOR_LIMITS.annualRatePercent.default,
  );

  const result = useMemo(
    () => calculateGullak({ dailyDeposit, years, annualRatePercent }),
    [dailyDeposit, years, annualRatePercent],
  );
  const breakdown = useMemo(
    () => calculateYearlyBreakdown({ dailyDeposit, years, annualRatePercent }),
    [dailyDeposit, years, annualRatePercent],
  );

  const activePresetId = PRESET_SCHEMES.find(
    (p) =>
      p.dailyDeposit === dailyDeposit &&
      p.years === years &&
      p.annualRatePercent === annualRatePercent,
  )?.id;

  function applyPreset(id: string) {
    const preset = PRESET_SCHEMES.find((p) => p.id === id);
    if (!preset) return;
    setDailyDeposit(preset.dailyDeposit);
    setYears(preset.years);
    setAnnualRatePercent(preset.annualRatePercent);
  }

  function clampNumber(value: number, min: number, max: number) {
    if (Number.isNaN(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  return (
    <section className="container py-14  sm:py-20">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-gullak-saffron-deep">
          Try it yourself
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-gullak-indigo sm:text-4xl">
          Your Gullak calculator
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Adjust the daily deposit, term, and annual return to see how your own
          gullak would grow.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-5">
        {/* Controls */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Deposit slip</CardTitle>
            <CardDescription>
              Fill this in like you would at the counter.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-7">
            <div className="flex flex-wrap gap-2">
              {PRESET_SCHEMES.map((preset) => (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => applyPreset(preset.id)}
                  className={cn(
                    "rounded-full border px-3 py-1 font-mono text-xs transition-colors",
                    activePresetId === preset.id
                      ? "border-gullak-saffron bg-gullak-saffron text-gullak-indigo-deep"
                      : "border-gullak-paper-line text-secondary hover:border-gullak-saffron",
                  )}
                >
                  {preset.label}/day
                </button>
              ))}
            </div>

            <FieldWithSlider
              label="Daily deposit"
              suffix="₹ / day"
              value={dailyDeposit}
              min={CALCULATOR_LIMITS.dailyDeposit.min}
              max={CALCULATOR_LIMITS.dailyDeposit.max}
              step={CALCULATOR_LIMITS.dailyDeposit.step}
              onChange={(v) =>
                setDailyDeposit(
                  clampNumber(
                    v,
                    CALCULATOR_LIMITS.dailyDeposit.min,
                    CALCULATOR_LIMITS.dailyDeposit.max,
                  ),
                )
              }
            />

            <FieldWithSlider
              label="Time period"
              suffix="years"
              value={years}
              min={CALCULATOR_LIMITS.years.min}
              max={CALCULATOR_LIMITS.years.max}
              step={CALCULATOR_LIMITS.years.step}
              onChange={(v) =>
                setYears(
                  clampNumber(
                    v,
                    CALCULATOR_LIMITS.years.min,
                    CALCULATOR_LIMITS.years.max,
                  ),
                )
              }
            />

            <FieldWithSlider
              label="Annual return"
              suffix="%"
              value={annualRatePercent}
              min={CALCULATOR_LIMITS.annualRatePercent.min}
              max={CALCULATOR_LIMITS.annualRatePercent.max}
              step={CALCULATOR_LIMITS.annualRatePercent.step}
              onChange={(v) =>
                setAnnualRatePercent(
                  clampNumber(
                    v,
                    CALCULATOR_LIMITS.annualRatePercent.min,
                    CALCULATOR_LIMITS.annualRatePercent.max,
                  ),
                )
              }
            />

            <p className="border-t border-dashed border-gullak-paper-line pt-4 text-xs text-muted-foreground">
              Rolled up to a monthly installment of{" "}
              <span className="font-mono font-semibold text-gullak-indigo">
                {formatINR(result.monthlyDeposit)}
              </span>{" "}
              over {result.months} months.
            </p>
          </CardContent>
        </Card>

        {/* Results */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Maturity outlook</CardTitle>
            <CardDescription>
              Updates as you adjust the deposit slip.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            <div className="grid gap-4 sm:grid-cols-3">
              <ResultStat
                label="Invested"
                value={result.investedAmount}
                tone="indigo"
              />
              <ResultStat
                label="Maturity value"
                value={result.finalAmount}
                tone="saffron"
                emphasize
              />
              <ResultStat
                label="Net profit"
                value={result.netProfit}
                tone="emerald"
              />
            </div>

            <div className="flex items-center gap-2">
              <Badge variant="emerald">+{result.profitPercentage}%</Badge>
              <span className="text-xs text-muted-foreground">
                return on total deposits over {years}{" "}
                {years === 1 ? "year" : "years"}
              </span>
            </div>

            <div>
              <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
                Growth, year by year
              </p>
              <GrowthBars rows={breakdown} />
            </div>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}

function FieldWithSlider({
  label,
  suffix,
  value,
  min,
  max,
  step,
  onChange,
}: {
  label: string;
  suffix: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (value: number) => void;
}) {
  const inputId = label.toLowerCase().replace(/\s+/g, "-");
  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <Label htmlFor={inputId}>{label}</Label>
        <div className="flex items-center gap-1.5">
          <Input
            id={inputId}
            type="number"
            value={value}
            min={min}
            max={max}
            step={step}
            onChange={(e) => onChange(parseFloat(e.target.value))}
            className="h-8 w-24 px-2 text-right text-sm"
          />
          <span className="text-xs text-muted-foreground">{suffix}</span>
        </div>
      </div>
      <Slider
        value={[value]}
        min={min}
        max={max}
        step={step}
        onValueChange={(vals) => {
          const next = vals[0];
          if (next !== undefined) onChange(next);
        }}
        aria-label={label}
      />
    </div>
  );
}

function ResultStat({
  label,
  value,
  tone,
  emphasize,
}: {
  label: string;
  value: number;
  tone: "indigo" | "saffron" | "emerald";
  emphasize?: boolean;
}) {
  const toneClass = {
    indigo: "text-gullak-indigo",
    saffron: "text-gullak-saffron-deep",
    emerald: "text-gullak-emerald",
  }[tone];

  return (
    <div
      className={cn(
        "animate-count-pop rounded-md border border-gullak-paper-line bg-gullak-paper p-4",
        emphasize && "border-gullak-saffron/40 bg-gullak-saffron/10",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p
        className={cn(
          "mt-1 font-mono text-xl font-semibold tabular sm:text-2xl",
          toneClass,
        )}
      >
        {formatINR(value)}
      </p>
    </div>
  );
}
