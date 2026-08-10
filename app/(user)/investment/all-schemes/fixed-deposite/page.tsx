"use client";
import { FixedDeposit } from "@/components/FixedDeposit";

export default function Page() {
  return (
    <FixedDeposit
      onContact={() => {
        console.log("Contact");
      }}
      onApply={(plan) => {
        console.log(plan);
      }}
    />
  );
}