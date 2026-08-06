import { Button } from "@/components/ui/button";
import { Clock, Home } from "lucide-react";
import Link from "next/link";

export function SubmissionSuccess() {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center space-y-6 animate-in fade-in-0 slide-in-from-right-4 duration-300">
      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600/20 text-emerald-500">
        <Clock className="h-7 w-7" />
      </div>

      <div className="space-y-1.5">
        <h3 className="text-xl font-semibold text-slate-50">
          We&apos;re reviewing your details
        </h3>
        <p className="text-sm text-slate-400 max-w-md mx-auto">
          Your KYC details have been submitted successfully. Our team is
          reviewing them now. You&apos;ll be notified once your verification is
          complete.
        </p>
      </div>

      <Button
        asChild
        className="bg-indigo-600 hover:bg-indigo-700 text-white flex items-center gap-1.5"
      >
        <Link href="/dashboard">
          <Home className="h-4 w-4" />
          Go to Dashboard
        </Link>
      </Button>
    </div>
  );
}
