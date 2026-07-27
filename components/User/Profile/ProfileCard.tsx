import { useMemo } from "react";
import { KycProfile } from "@/components/User/Profile/types";
import { KycSeal } from "@/components/User/Profile/KycSeal";
import Image from "next/image";

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

        <h2 className="mt-4 text-center text-xl font-semibold text-white">
          {profile.name}
        </h2>

        <p className="text-center text-sm text-white/60">{profile.email}</p>

        <div className="my-8 h-px bg-white/10" />

        <div className="flex flex-col items-center">
          <KycSeal percent={profile.kycPercent} />

          <p className="mt-5 max-w-[220px] text-center text-xs text-white/40">
            {completedCount} of {profile.items.length} checks complete.
          </p>
        </div>
      </div>
    </section>
  );
}
