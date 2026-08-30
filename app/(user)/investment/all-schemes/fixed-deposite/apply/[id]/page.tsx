"use client";

import { useParams, useSearchParams } from "next/navigation";
import FDApply from "@/components/FixedDeposit/apply/FDApply";

export default function Page() {
  const params = useParams<{ id: string }>();
  const searchParams = useSearchParams();
  const planId = params?.id as string;

  const planDetails = {
    amount: searchParams.get("name") || "",
    lockInPeriod: searchParams.get("lockIn") || "",
    payoutMode: searchParams.get("payoutMode") || "",
    emi: searchParams.get("emi") || "",
    totalPayout: searchParams.get("totalPayout") || "",
  };

  return <FDApply planId={planId} planDetails={planDetails} />;
}
