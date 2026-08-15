'use client'
import {Gullak} from "@/components/Gullak/index"


export default function Page() {
  return (
    <Gullak 
   
      onContact={() => {
        console.log('done')
      }}
      onApply={(plan) => {
        console.log("Applying for:", plan);
      }}
    />
  );
}