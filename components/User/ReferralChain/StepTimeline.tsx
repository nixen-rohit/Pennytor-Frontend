import { cn } from "@/lib/utils";
import { PHASES } from "@/components/User/ReferralChain/types";

interface StepTimelineProps {
  currentStep: number;
  onStepClick?: (step: number) => void;
}

export function StepTimeline({ currentStep, onStepClick }: StepTimelineProps) {
  return (
    <div className="w-full overflow-x- pb-2">
      <div className="overflow-x-auto pb-4 -mx-2 px-2">
        <div className="flex items-start min-w-[500px]">
          {PHASES.map((phase, index) => {
            const isCompleted = currentStep > phase.step;
            const isActive = currentStep === phase.step;
            const Icon = phase.icon;
            const isLast = index === PHASES.length - 1;

            return (
              <div key={phase.step} className="flex-1 flex flex-col items-center relative">
                <div className="flex items-center pt-2 w-full">
                  <div className="flex-1 h-0.5">
                    {index > 0 && (
                      <div className={cn(
                        "h-full transition-colors duration-300",
                        currentStep >= phase.step ? "bg-indigo-600" : "bg-neutral-800"
                      )} />
                    )}
                  </div>
                  <button
                    type="button"
                    disabled={!isCompleted}
                    onClick={() => onStepClick?.(phase.step)}
                    className={cn(
                      "relative z-10 flex h-10 w-10 shrink-0 items-center justify-center rounded-full border-2 transition-all duration-300",
                      isCompleted && "border-indigo-600 bg-indigo-600 text-white cursor-pointer",
                      isActive && "border-indigo-600 bg-indigo-600 text-white ring-4 ring-indigo-900/50",
                      !isCompleted && !isActive && "border-neutral-700 text-slate-500 cursor-default"
                    )}
                  >
                    <Icon className="h-4 w-4" />
                  </button>
                  <div className="flex-1 h-0.5">
                    {!isLast && (
                      <div className={cn(
                        "h-full transition-colors duration-300",
                        isCompleted ? "bg-indigo-600" : "bg-neutral-800"
                      )} />
                    )}
                  </div>
                </div>
                <div className="mt-3 text-center px-1 w-full pl-5">
                  <p className={cn(
                    "text-xs font-medium mb-0.5",
                    isActive ? "text-indigo-600" : "text-slate-400"
                  )}>
                    Step {phase.step}
                  </p>
                  <h4 className={cn(
                    "text-sm font-semibold truncate",
                    isActive ? "text-indigo-600" : "text-slate-100"
                  )}>
                    {phase.title}
                  </h4>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="flex sm:hidden flex-col gap-3">
        <div className="flex items-center gap-1">
          {PHASES.map((phase) => (
            <div
              key={phase.step}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-300",
                currentStep >= phase.step
                  ? "bg-indigo-600"
                  : "bg-neutral-700"
              )}
            />
          ))}
        </div>
        <div className="flex items-center justify-between text-sm">
          <span className="font-semibold text-indigo-600">
            Step {currentStep} of {PHASES.length}:{" "}
            {PHASES[currentStep - 1].title}
          </span>
        </div>
      </div>
    </div>
  );
}