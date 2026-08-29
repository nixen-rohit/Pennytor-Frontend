"use client";
import FixedDeposit from "@/components/FixedDeposit/FixedDeposit";

export default function Page() {
  return (
    <FixedDeposit
      onContact={() => {
        console.log("Contact");
      }}
    />
  );
}