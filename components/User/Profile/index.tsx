"use client";

import { profile } from "@/components/User/Profile/data";
import { ProfileCard } from "@/components/User/Profile/ProfileCard";
import { VerificationTimeline } from "@/components/User/Profile/VerificationTimeline";

export default function ProfilePage() {
  return (
    <div className="text-white antialiased">
      <main className="relative mx-auto max-w-5xl p-6">
        <header className="mb-10">
          <p className="text-[11px] uppercase tracking-[0.24em] text-[#90EF5D]">
            Account · Verification
          </p>
          <h1 className="mt-2 text-3xl font-medium text-white/95 sm:text-4xl">
            Profile Details
          </h1>
        </header>

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
          <ProfileCard profile={profile} />
          <VerificationTimeline profile={profile} />
        </div>
      </main>
    </div>
  );
}
