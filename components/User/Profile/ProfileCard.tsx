"use client";

import { useState } from "react";
import { KycProfile } from "@/components/User/Profile/types";
import Image from "next/image";
import { BadgeCheck, BadgeAlert, BadgeX, Copy, Check } from "lucide-react";

interface ProfileCardProps {
  profile: KycProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const [copied, setCopied] = useState(false);

  const copyClientId = async () => {
    try {
      await navigator.clipboard.writeText(profile.client_id);
    } catch {
      return;
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <section className="overflow-hidden rounded-2xl border border-white/10 bg-[#111]">
      <div className="relative h-40">
        <Image
          src="/img/cover.webp"
          alt="Cover"
          fill
          className="object-cover"
        />
        <div className="absolute inset-0 bg-black/30" />
      </div>

      <div className="relative px-6 pb-8">
        <div className="-mt-16 flex justify-center">
          <Image
            src="/img/profile.png"
            alt="Profile"
            width={128}
            height={128}
            className="rounded-full border-4 border-[#111] object-cover"
          />
        </div>

        <h2 className="mt-4 text-center text-xl font-semibold text-white flex justify-center items-center ">
          {profile.name}
          <span className="ml-2" > 

         
          {profile.kyc_status === "verified" ? (
            <BadgeCheck className="text-sm text-green-500" />
          ) : profile.kyc_status === "rejected" ? (
            <BadgeX className="text-sm text-red-500" />
          ) : (
            <BadgeAlert className="text-sm text-yellow-500" />
          )}
           </span>
        </h2>
        <p className="text-center text-sm text-white/60">{profile.email}</p>

        <div className="my-8 h-px bg-white/10" />

        <div className="flex items-center justify-center gap-2">
          <p className="text-sm text-white/60">
            Client ID:{" "}
            <span className="font-medium text-white/90">{profile.client_id}</span>
          </p>
          <button
            type="button"
            onClick={copyClientId}
            aria-label="Copy client ID"
            title="Copy client ID"
            className="rounded-md p-1 text-white/40 transition-all duration-200 hover:bg-white/10 hover:text-white active:scale-75"
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400 animate-in zoom-in-75 duration-200" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </button>
          {copied && (
            <span className="text-xs text-green-400 animate-in fade-in-0 zoom-in-75 duration-200">
              Copied!
            </span>
          )}
        </div>
      </div>
    </section>
  );
}
