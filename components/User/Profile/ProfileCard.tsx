import { useMemo } from "react";
import { KycProfile } from "@/components/User/Profile/types";
import Image from "next/image";
import { BadgeCheck, BadgeAlert } from "lucide-react";
import { BadgeX } from "lucide-react";

interface ProfileCardProps {
  profile: KycProfile;
}

export function ProfileCard({ profile }: ProfileCardProps) {
  const completedCount = useMemo(
    () => profile.items.filter((i) => i.state === "verified").length,
    [profile.items],
  );

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

         
          {profile.kyc_status === "pending" ? (
            <BadgeAlert className="text-sm text-yellow-500" />
          ) : profile.kyc_status === "verified" ? (
            <BadgeCheck className="text-sm text-green-500" />
          ) : (
            <BadgeX className="text-sm text-red-500" />
          )}
           </span>
        </h2>
        <p className="text-center text-sm text-white/60">{profile.email}</p>

        <div className="my-8 h-px bg-white/10" />

        <p className="text-center text-sm text-white/60">
          Client ID: {profile.client_id}
        </p>
      </div>
    </section>
  );
}
