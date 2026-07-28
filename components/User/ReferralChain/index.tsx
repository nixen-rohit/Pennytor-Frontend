"use client";

import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Users, ChevronLeft, ChevronRight, RefreshCw } from "lucide-react";

import { PHASES, initialReferralState } from "@/components/User/ReferralChain/types";
import { StepTimeline } from "@/components/User/ReferralChain/StepTimeline";
import { ReferralStats } from "@/components/User/ReferralChain/ReferralStats";
import { ReferralList } from "@/components/User/ReferralChain/ReferralList";
import { ReferralCommission } from "@/components/User/ReferralChain/ReferralCommission";
import { ReferralTree } from "@/components/User/ReferralChain/ReferralTree";

export default function ReferralDashboard() {
  const [currentStep, setCurrentStep] = useState(1);

  const isFirst = currentStep === 1;
  const isLast = currentStep === PHASES.length;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-7xl mx-auto space-y-5">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-slate-50">
              Referral Chain
            </h1>
          </div>
          <Button
            type="button"
            variant="outline"
            className="border-white/20 text-slate-300"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        </div>

        <Card className="shadow-sm">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-4">
              <Users className="h-5 w-5 text-indigo-600 shrink-0" />
              <h2 className="text-sm font-semibold text-slate-300">
                Referral Network Overview
              </h2>
            </div>
            <StepTimeline
              currentStep={currentStep}
              onStepClick={(step) => step < currentStep && setCurrentStep(step)}
            />
          </CardContent>
        </Card>

        <Card className="shadow-sm">
          <CardContent className="p-6">
            <div className="space-y-6">
              {currentStep === 1 && <ReferralStats data={initialReferralState} />}
              {currentStep === 2 && <ReferralList data={initialReferralState} />}
              {currentStep === 3 && <ReferralCommission data={initialReferralState} />}
              {currentStep === 4 && <ReferralTree data={initialReferralState} />}

              <div className="flex items-center justify-between gap-3 pt-5 border-t border-neutral-800">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setCurrentStep((s) => s - 1)}
                  disabled={isFirst}
                  className="flex items-center gap-1.5 border-white/20"
                >
                  <ChevronLeft className="h-4 w-4" />
                  Previous
                </Button>

                {!isLast && (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep((s) => s + 1)}
                    className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
                  >
                    Continue
                    <ChevronRight className="h-4 w-4" />
                  </Button>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}