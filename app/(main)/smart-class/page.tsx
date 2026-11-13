"use client";

import { useRouter } from "next/navigation";

import SmartClass from "@/components/SmartClass";

const Page = () => {
  const router = useRouter();

  return <SmartClass onContact={() => router.push("/contact-us")} />;
};

export default Page;