"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import {
  CALCULATOR_LIMITS,
  calculateFdPlan,
  formatINR,
  periodsPerYear,
  solveImpliedRate,
} from "@/utils/fixeddeposite-calculations";
import type { PayoutFrequency } from "@/types/fixedDeposite";
import { cn } from "@/lib/utils";

export function FdCalculator() {
  const [principal, setPrincipal] = useState<number>(CALCULATOR_LIMITS.principal.default);
  const [tenureMonths, setTenureMonths] = useState<number>(CALCULATOR_LIMITS.tenureMonths.default);
  const [frequency, setFrequency] = useState<PayoutFrequency>("quarterly");
  const [annualRatePercent, setAnnualRatePercent] = useState<number>(
    CALCULATOR_LIMITS.annualRatePercent.default,
  );
  const [knownPayout, setKnownPayout] = useState<number>(3130);

  function clampNumber(value: number, min: number, max: number) {
    if (Number.isNaN(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  const forwardPlan = useMemo(
    () => calculateFdPlan({ principal, tenureMonths, frequency, annualRatePercent }),
    [principal, tenureMonths, frequency, annualRatePercent],
  );

  const impliedRate = useMemo(
    () => solveImpliedRate({ principal, tenureMonths, frequency, payoutAmount: knownPayout }),
    [principal, tenureMonths, frequency, knownPayout],
  );

  const periods = periodsPerYear(frequency);

  return (
    <section className="container py-14 sm:py-20">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-fd-gold-deep">
          Try it yourself
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-fd-vault sm:text-4xl">
          Payout calculator
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Work forward from a rate, or backward from a quoted payout.
        </p>
      </div>

      <Card className="mx-auto max-w-3xl">
        <CardContent className="pt-6">
          {/* Shared deposit terms */}
          <div className="grid gap-6 border-b border-dashed border-fd-paper-line pb-6 sm:grid-cols-3">
            <FieldWithSlider
              label="Principal"
              suffix="₹"
              value={principal}
              min={CALCULATOR_LIMITS.principal.min}
              max={CALCULATOR_LIMITS.principal.max}
              step={CALCULATOR_LIMITS.principal.step}
              onChange={(v) =>
                setPrincipal(clampNumber(v, CALCULATOR_LIMITS.principal.min, CALCULATOR_LIMITS.principal.max))
              }
            />
            <FieldWithSlider
              label="Lock-in period"
              suffix="months"
              value={tenureMonths}
              min={CALCULATOR_LIMITS.tenureMonths.min}
              max={CALCULATOR_LIMITS.tenureMonths.max}
              step={CALCULATOR_LIMITS.tenureMonths.step}
              onChange={(v) =>
                setTenureMonths(
                  clampNumber(v, CALCULATOR_LIMITS.tenureMonths.min, CALCULATOR_LIMITS.tenureMonths.max),
                )
              }
            />
            <div className="space-y-3">
              <Label>Payout mode</Label>
              <div className="flex gap-2">
                {(["monthly", "quarterly"] as const).map((f) => (
                  <button
                    key={f}
                    type="button"
                    onClick={() => setFrequency(f)}
                    className={cn(
                      "flex-1 rounded-md border px-3 py-2 text-sm capitalize transition-colors",
                      frequency === f
                        ? "border-fd-gold bg-fd-gold text-fd-vault-deep font-semibold"
                        : "border-fd-paper-line text-secondary hover:border-fd-gold",
                    )}
                  >
                    {f}
                  </button>
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                {Math.round(tenureMonths / (frequency === "monthly" ? 1 : 3))} payouts
                over the lock-in.
              </p>
            </div>
          </div>

          <Tabs defaultValue="forward" className="mt-6">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="forward">I know the rate</TabsTrigger>
              <TabsTrigger value="reverse">I know the payout</TabsTrigger>
            </TabsList>

            {/* Forward: rate -> payout */}
            <TabsContent value="forward" className="space-y-6">
              <FieldWithSlider
                label="Annual interest rate"
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
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultStat label="Payout per period" value={forwardPlan.payoutAmount} emphasize />
                <ResultStat label="Total payout" value={forwardPlan.totalPayout} />
                <ResultStat label="Total interest" value={forwardPlan.totalInterest} />
              </div>
            </TabsContent>

            {/* Reverse: payout -> implied rate */}
            <TabsContent value="reverse" className="space-y-6">
              <FieldWithSlider
                label="Quoted payout"
                suffix="₹ / period"
                value={knownPayout}
                min={100}
                max={Math.round(principal / 2)}
                step={10}
                onChange={(v) => setKnownPayout(clampNumber(v, 100, Math.round(principal / 2)))}
              />
              <div className="grid gap-4 sm:grid-cols-3">
                <ResultStat
                  label="Per-period rate"
                  value={impliedRate.periodicRatePercent}
                  isPercent
                />
                <ResultStat
                  label="Nominal annual"
                  value={impliedRate.nominalAnnualRatePercent}
                  isPercent
                />
                <ResultStat
                  label="Effective annual"
                  value={impliedRate.effectiveAnnualRatePercent}
                  isPercent
                  emphasize
                />
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={impliedRate.effectiveAnnualRatePercent > 15 ? "outline" : "emerald"}>
                  {impliedRate.effectiveAnnualRatePercent > 15 ? "Above typical FD range" : "Typical FD range"}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  compounded {periods}&times; a year
                </span>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
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
  const inputId = `${label.toLowerCase().replace(/\s+/g, "-")}-${suffix.replace(/[^a-z]/gi, "")}`;
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
  emphasize,
  isPercent,
}: {
  label: string;
  value: number;
  emphasize?: boolean;
  isPercent?: boolean;
}) {
  return (
    <div
      className={cn(
        "animate-count-pop rounded-md border border-fd-paper-line bg-fd-paper p-4",
        emphasize && "border-fd-gold/50 bg-fd-gold/10",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className="mt-1 font-mono text-xl font-semibold tabular text-fd-vault sm:text-2xl">
        {isPercent ? `${value.toFixed(2)}%` : formatINR(value)}
      </p>
    </div>
  );
}
