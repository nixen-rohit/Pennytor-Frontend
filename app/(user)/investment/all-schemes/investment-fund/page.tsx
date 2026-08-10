"use client"
import { InvestmentFund } from "@/components/InvestmentFund";

export default function Page() {
  return (
    <InvestmentFund
      onContact={() => {
        // Open contact modal / navigate to contact
      }}
      onApply={(plan) => {
        // Start application flow
        console.log(plan);
      }}
    />
  );
}