"use client";
import Gullak from "@/components/Gullak/Gullak";

export default function Page() {
  return (
    <Gullak
      onContact={() => {
        console.log('done')
      }}
      onApply={() => {
        console.log("Applying for:");
      }}
    />
  );
}