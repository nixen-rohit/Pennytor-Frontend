"use client";
import { SIPForChild } from "@/components/SIPForChild";

const page = () => {
  return (
    <SIPForChild
  example={{
    monthlyInvestment: 10000,
    investmentYears: 15,
    annualReturn: 12,
    withdrawalMonthly: 30000,
    withdrawalYears: 10,
  }}
/>
  )
}

export default page