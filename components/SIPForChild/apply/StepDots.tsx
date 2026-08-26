"use client";

import { STEPS } from "./types";

interface Props {
  currentStep: number;
}

export function StepDots({ currentStep }: Props) {
  return (
    <div className="flex items-center justify-center gap-2">
      {STEPS.map((step, index) => {
        const isActive = index + 1 <= currentStep;

        return (
          <div key={step.step} className="flex items-center">
            <div
              className={`flex h-8 w-8 items-center justify-center rounded-full text-xs font-medium transition-all duration-200 ${
                isActive
                  ? "bg-orange-400 text-black"
                  : "bg-white/10 text-zinc-500"
              }`}
            >
              {step.step}
            </div>
            {index < STEPS.length - 1 && (
              <div
                className={`hidden h-0.5 w-16 shrink-0 transition-all duration-200 sm:block ${
                  isActive ? "bg-orange-400" : "bg-white/10"
                }`}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}