"use client";

import { Check } from "lucide-react";
import { cn } from "@/lib/utils";

interface Props {
  currentStep: number;
}

export function StepDots({ currentStep }: Props) {
  const steps = [
    "Scheme Details",
    "Payment",
    "Authenticate",
  ];

  return (
    <div className="w-full py-4">
      {/* Desktop */}
      <div className="relative hidden sm:block">
        {/* Connector Line */}
        <div className="absolute left-[16.666%] right-[16.666%] top-5 h-0.5 bg-zinc-800">
          <div
            className="h-full bg-emerald-400 transition-all duration-500"
            style={{
              width:
                currentStep === 1
                  ? "0%"
                  : currentStep === 2
                    ? "50%"
                    : "100%",
            }}
          />
        </div>

        {/* Steps */}
        <div className="relative grid grid-cols-3">
          {steps.map((label, index) => {
            const step = index + 1;

            const isActive = step === currentStep;
            const isCompleted = step < currentStep;

            return (
              <div
                key={step}
                className="flex flex-col items-center"
              >
                {/* Circle */}
                <div
                  className={cn(
                    "relative z-10 flex h-10 w-10 items-center justify-center rounded-full border-2 bg-zinc-950 transition-all duration-300",
                    isCompleted &&
                      "border-emerald-400 bg-emerald-400 text-zinc-950",
                    isActive &&
                      "border-amber-400 bg-zinc-950 text-white ring-4 ring-amber-400/10",
                    !isCompleted &&
                      !isActive &&
                      "border-zinc-800 text-zinc-500"
                  )}
                >
                  {isCompleted ? (
                    <Check className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-semibold">
                      {step}
                    </span>
                  )}
                </div>

                {/* Label */}
                <p
                  className={cn(
                    "mt-3 text-center text-xs font-medium",
                    isActive && "text-amber-400",
                    isCompleted && "text-emerald-400",
                    !isActive &&
                      !isCompleted &&
                      "text-zinc-500"
                  )}
                >
                  {label}
                </p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mobile */}
      <div className="sm:hidden space-y-3">
        <div className="flex gap-1.5">
          {steps.map((_, index) => {
            const step = index + 1;

            return (
              <div
                key={step}
                className={cn(
                  "h-1.5 flex-1 rounded-full transition-colors duration-300",
                  currentStep >= step
                    ? "bg-amber-400"
                    : "bg-zinc-800"
                )}
              />
            );
          })}
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs text-zinc-500">
              Step {currentStep} of {steps.length}
            </p>

            <p className="mt-0.5 text-sm font-semibold text-amber-400">
              {steps[currentStep - 1]}
            </p>
          </div>

          <span className="text-xs text-zinc-500">
            {Math.round((currentStep / steps.length) * 100)}%
          </span>
        </div>
      </div>
    </div>
  );
}
