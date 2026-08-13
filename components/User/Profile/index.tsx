"use client";

import { useEffect, useState } from "react";
import { Loader2, AlertCircle, RotateCcw } from "lucide-react";
import { ProfileCard } from "@/components/User/Profile/ProfileCard";
import { ProfileStatusBanner } from "@/components/User/Profile/ProfileStatusBanner";
import { VerificationTimeline } from "@/components/User/Profile/VerificationTimeline";
import { Button } from "@/components/ui/button";
import type {
  KycProfile,
  VerificationItem,
  VerificationState,
} from "@/components/User/Profile/types";
import { AuthService } from "@/services/auth.service";
import { KycService, type KycApplicationState, type KycFileType } from "@/services/kyc.service";
import { useAuthStore } from "@/store/auth.store";

const ITEM_DEFS: Array<{
  id: string;
  label: string;
  description: string;
  requires: (files: KycFileType[]) => boolean;
}> = [
  {
    id: "identity-data",
    label: "Identity data",
    description: "Personal details and selfie match against your government ID",
    requires: (files) => files.includes("SELFIE"),
  },
  {
    id: "identity-documents",
    label: "Identity documents",
    description: "Aadhaar and PAN card images verified",
    requires: (files) =>
      files.includes("AADHAAR_FRONT") &&
      files.includes("AADHAAR_BACK") &&
      files.includes("PAN"),
  },
  {
    id: "bank",
    label: "Bank details",
    description: "Penny-drop verification on your linked account",
    requires: () => true,
  },
  {
    id: "nominee",
    label: "Nominee details",
    description: "Nominee information verified",
    requires: () => true,
  },
  {
    id: "final-review",
    label: "Final Review",
    description: "Application reviewed by our team",
    requires: () => true,
  },
];

function mapStatus(status: KycApplicationState["status"] | null): VerificationState {
  switch (status) {
    case "VERIFIED":
      return "verified";
    case "REJECTED":
      return "rejected";
    case "SUBMITTED":
    case "UNDER_REVIEW":
      return "pending";
    default:
      return "not_started"; // DRAFT or no application
  }
}

function buildItems(app: KycApplicationState | null): VerificationItem[] {
  const kycState = mapStatus(app?.status ?? null);
  const files: KycFileType[] = app?.files.map((f) => f.type) ?? [];

  return ITEM_DEFS.map((def) => {
    const provided = def.requires(files);
    let state: VerificationState;
    if (!provided || kycState === "not_started") {
      // Nothing uploaded yet, or the application is still a DRAFT — nothing
      // has been submitted for review, so nothing can be pending.
      state = "not_started";
    } else if (kycState === "verified") {
      state = "verified";
    } else if (kycState === "rejected") {
      state = "rejected";
    } else {
      state = "pending";
    }
    return {
      id: def.id,
      label: def.label,
      description: def.description,
      state,
    };
  });
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<KycProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  const load = async () => {
    setLoading(true);
    setLoadError(false);
    try {
      const [me, app] = await Promise.all([
        AuthService.me(),
        KycService.myApplication(),
      ]);

      // /auth/me re-arms the CSRF cookie; keep the SPA's in-memory token in
      // sync so the next state-changing request isn't rejected.
      if (me?.data?.csrfToken) {
        useAuthStore.getState().setCsrfToken(me.data.csrfToken);
      }

      const user = me?.data?.user;
      setProfile({
        name: user
          ? `${user.firstName} ${user.lastName}`.trim()
          : "Your Account",
        email: user?.email ?? "",
        client_id: user?.clientId ?? "—",
        kyc_status: mapStatus(app?.status ?? null),
        items: buildItems(app),
        rejection_reason: app?.rejectionReason ?? null,
      });
    } catch {
      // A failed fetch must never be reported as "KYC not started" — show a
      // retry state instead so a transient error can't fake a fresh account.
      setLoadError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => void load(), 0);
    return () => clearTimeout(timeoutId);
  }, []);

  if (loading || !profile) {
    return (
      <div className="flex min-h-[50vh] items-center justify-center text-white">
        <Loader2 className="h-6 w-6 animate-spin text-[#90EF5D]" />
      </div>
    );
  }

  if (loadError) {
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

          <div className="flex flex-col items-center gap-4 rounded-2xl border border-red-400/20 bg-red-400/5 p-10 text-center">
            <AlertCircle className="h-8 w-8 text-red-400" />
            <div>
              <p className="text-sm font-semibold text-red-300">
                Couldn&apos;t load your KYC status
              </p>
              <p className="mt-1 text-xs text-white/50">
                A temporary problem fetching your account. Nothing changed —
                try again.
              </p>
            </div>
            <Button onClick={() => void load()} className="mt-2">
              <RotateCcw className="mr-2 h-4 w-4" />
              Retry
            </Button>
          </div>
        </main>
      </div>
    );
  }

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

        <ProfileStatusBanner profile={profile} />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-[minmax(0,340px)_1fr]">
          <ProfileCard profile={profile} />
          <VerificationTimeline profile={profile} />
        </div>
      </main>
    </div>
  );
}
