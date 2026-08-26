"use client";
import { useEffect, useState } from "react";
import SIPForChildApplyPage from "@/components/SIPForChild/apply/SIPForChildApply";

interface Props {
  params: Promise<{ planId: string }>;
}

export default function ApplyPage({ params }: Props) {
  const [planId, setPlanId] = useState<string | null>(null);

  useEffect(() => {
    params.then((p) => setPlanId(p.planId));  
  }, [params]);

  if (!planId) return null;

  return <SIPForChildApplyPage initialPlanId={planId} />;
}