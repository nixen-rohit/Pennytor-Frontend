"use client";

import { useParams } from "next/navigation";
import InvestmentFundApply from "@/components/InvestmentFund/apply/InvestmentFundApply";

export default function Page() {
  const params = useParams<{ id: string }>();
  const schemeId = params?.id;

  return <InvestmentFundApply initialSchemeId={schemeId} />;
}