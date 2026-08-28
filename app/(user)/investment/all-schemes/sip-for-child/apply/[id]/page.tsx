"use client";

import { useParams } from "next/navigation";
import SIPForChildApply from "@/components/SIPForChild/apply/SIPForChildApply";

export default function Page() {
  const params = useParams<{ id: string }>();
  const schemeId = params?.id;

  return <SIPForChildApply initialSchemeId={schemeId} />;
}
