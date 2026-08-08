"use client";

import { useMemo, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { GrowthHarvestChart } from "./GrowthHarvestChart";
import {
  CALCULATOR_LIMITS,
  formatINR,
  simulateSip,
  simulateSwp,
} from "@/utils/sip-calculations";
import { cn } from "@/lib/utils";

export function SipCalculator() {
  const [sipMonthly, setSipMonthly] = useState<number>(CALCULATOR_LIMITS.sipMonthly.default);
  const [sipYears, setSipYears] = useState<number>(CALCULATOR_LIMITS.sipYears.default);
  const [sipRate, setSipRate] = useState<number>(CALCULATOR_LIMITS.sipRate.default);

  const [swpMonthly, setSwpMonthly] = useState<number>(CALCULATOR_LIMITS.swpMonthly.default);
  const [swpYears, setSwpYears] = useState<number>(CALCULATOR_LIMITS.swpYears.default);
  const [swpRate, setSwpRate] = useState<number>(CALCULATOR_LIMITS.swpRate.default);

  const sip = useMemo(
    () => simulateSip({ monthlyInvestment: sipMonthly, years: sipYears, annualRatePercent: sipRate }),
    [sipMonthly, sipYears, sipRate],
  );
  const swp = useMemo(
    () =>
      simulateSwp(sip.corpusAtEnd, {
        monthlyWithdrawal: swpMonthly,
        years: swpYears,
        annualRatePercent: swpRate,
      }),
    [sip.corpusAtEnd, swpMonthly, swpYears, swpRate],
  );

  function clampNumber(value: number, min: number, max: number) {
    if (Number.isNaN(value)) return min;
    return Math.min(max, Math.max(min, value));
  }

  return (
    <section className="container py-14 sm:py-20">
      <div className="mx-auto mb-8 max-w-2xl text-center">
        <p className="font-mono text-xs uppercase tracking-[0.3em] text-sip-harvest-deep">
          Try it yourself
        </p>
        <h2 className="mt-2 font-display text-3xl font-semibold text-sip-navy sm:text-4xl">
          Grow, then harvest
        </h2>
        <p className="mt-2 text-sm text-muted-foreground sm:text-base">
          Set your own SIP and withdrawal-phase numbers and watch both acts
          play out.
        </p>
      </div>

      <div className="mx-auto grid max-w-5xl gap-6 lg:grid-cols-2">
        {/* Phase 1: SIP */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sip-sapling" />
              <CardTitle>Phase 1 &middot; Grow</CardTitle>
            </div>
            <CardDescription>Monthly SIP investment.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldWithSlider
              label="Monthly SIP"
              suffix="₹ / month"
              value={sipMonthly}
              min={CALCULATOR_LIMITS.sipMonthly.min}
              max={CALCULATOR_LIMITS.sipMonthly.max}
              step={CALCULATOR_LIMITS.sipMonthly.step}
              onChange={(v) =>
                setSipMonthly(clampNumber(v, CALCULATOR_LIMITS.sipMonthly.min, CALCULATOR_LIMITS.sipMonthly.max))
              }
            />
            <FieldWithSlider
              label="Duration"
              suffix="years"
              value={sipYears}
              min={CALCULATOR_LIMITS.sipYears.min}
              max={CALCULATOR_LIMITS.sipYears.max}
              step={CALCULATOR_LIMITS.sipYears.step}
              onChange={(v) =>
                setSipYears(clampNumber(v, CALCULATOR_LIMITS.sipYears.min, CALCULATOR_LIMITS.sipYears.max))
              }
            />
            <FieldWithSlider
              label="Expected return"
              suffix="%"
              value={sipRate}
              min={CALCULATOR_LIMITS.sipRate.min}
              max={CALCULATOR_LIMITS.sipRate.max}
              step={CALCULATOR_LIMITS.sipRate.step}
              onChange={(v) =>
                setSipRate(clampNumber(v, CALCULATOR_LIMITS.sipRate.min, CALCULATOR_LIMITS.sipRate.max))
              }
            />

            <div className="grid grid-cols-2 gap-3 border-t border-dashed border-sip-paper-line pt-4">
              <MiniStat label="Invested" value={sip.investedAmount} />
              <MiniStat label="Corpus" value={sip.corpusAtEnd} tone="sapling" />
            </div>
          </CardContent>
        </Card>

        {/* Phase 2: SWP */}
        <Card>
          <CardHeader>
            <div className="flex items-center gap-2">
              <span className="h-2.5 w-2.5 rounded-full bg-sip-harvest" />
              <CardTitle>Phase 2 &middot; Harvest</CardTitle>
            </div>
            <CardDescription>Monthly withdrawal from the corpus above.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <FieldWithSlider
              label="Monthly withdrawal"
              suffix="₹ / month"
              value={swpMonthly}
              min={CALCULATOR_LIMITS.swpMonthly.min}
              max={CALCULATOR_LIMITS.swpMonthly.max}
              step={CALCULATOR_LIMITS.swpMonthly.step}
              onChange={(v) =>
                setSwpMonthly(clampNumber(v, CALCULATOR_LIMITS.swpMonthly.min, CALCULATOR_LIMITS.swpMonthly.max))
              }
            />
            <FieldWithSlider
              label="Duration"
              suffix="years"
              value={swpYears}
              min={CALCULATOR_LIMITS.swpYears.min}
              max={CALCULATOR_LIMITS.swpYears.max}
              step={CALCULATOR_LIMITS.swpYears.step}
              onChange={(v) =>
                setSwpYears(clampNumber(v, CALCULATOR_LIMITS.swpYears.min, CALCULATOR_LIMITS.swpYears.max))
              }
            />
            <FieldWithSlider
              label="Expected return"
              suffix="%"
              value={swpRate}
              min={CALCULATOR_LIMITS.swpRate.min}
              max={CALCULATOR_LIMITS.swpRate.max}
              step={CALCULATOR_LIMITS.swpRate.step}
              onChange={(v) =>
                setSwpRate(clampNumber(v, CALCULATOR_LIMITS.swpRate.min, CALCULATOR_LIMITS.swpRate.max))
              }
            />

            <div className="grid grid-cols-2 gap-3 border-t border-dashed border-sip-paper-line pt-4">
              <MiniStat label="Withdrawn" value={swp.totalWithdrawn} />
              <MiniStat label="Left at end" value={swp.finalBalance} tone="harvest" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Outcome + chart */}
      <Card className="mx-auto mt-6 max-w-5xl">
        <CardHeader>
          <CardTitle>Outcome</CardTitle>
          <CardDescription>
            {swp.depletedAtYear !== null ? (
              <span className="text-sip-harvest-deep">
                The corpus runs out around year {sipYears + swp.depletedAtYear} of the plan
                &mdash; withdrawals were reduced to what remained after that point.
              </span>
            ) : (
              "The corpus lasts the full withdrawal period."
            )}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="grid gap-4 sm:grid-cols-3">
            <ResultStat label="Total invested" value={sip.investedAmount} tone="navy" />
            <ResultStat
              label="Corpus at handoff"
              value={sip.corpusAtEnd}
              tone="sapling"
              emphasize
            />
            <ResultStat label="Left at year 20" value={swp.finalBalance} tone="harvest" />
          </div>

          <div className="flex items-center gap-2">
            <Badge variant={swp.depletedAtYear === null ? "emerald" : "outline"}>
              {swp.depletedAtYear === null ? "Sustained" : "Depleted early"}
            </Badge>
            <span className="text-xs text-muted-foreground">
              across {sipYears + swpYears} years total
            </span>
          </div>

          <div>
            <p className="mb-3 text-xs font-medium uppercase tracking-wide text-muted-foreground">
              Corpus, year by year &mdash; grow (green) then harvest (coral)
            </p>
            <GrowthHarvestChart sipPoints={sip.yearlyBalances} swpPoints={swp.yearlyBalances} />
          </div>
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

function MiniStat({
  label,
  value,
  tone = "navy",
}: {
  label: string;
  value: number;
  tone?: "navy" | "sapling" | "harvest";
}) {
  const toneClass = {
    navy: "text-sip-navy",
    sapling: "text-sip-sapling-deep",
    harvest: "text-sip-harvest-deep",
  }[tone];
  return (
    <div className="rounded-md border border-sip-paper-line bg-sip-paper p-3">
      <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-0.5 font-mono text-sm font-semibold tabular", toneClass)}>
        {formatINR(value)}
      </p>
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
  tone: "navy" | "sapling" | "harvest";
  emphasize?: boolean;
}) {
  const toneClass = {
    navy: "text-sip-navy",
    sapling: "text-sip-sapling-deep",
    harvest: "text-sip-harvest-deep",
  }[tone];

  return (
    <div
      className={cn(
        "animate-count-pop rounded-md border border-sip-paper-line bg-sip-paper p-4",
        emphasize && "border-sip-gold/50 bg-sip-gold/10",
      )}
    >
      <p className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
        {label}
      </p>
      <p className={cn("mt-1 font-mono text-xl font-semibold tabular sm:text-2xl", toneClass)}>
        {formatINR(value)}
      </p>
    </div>
  );
}
