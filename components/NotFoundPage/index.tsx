import React from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

const NotFoundPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 bg-linear-to-br from-mainground to-foreground relative overflow-hidden">
      {/* Background decorative circles */}
      <div className="absolute inset-0 opacity-10 pointer-events-none">
        <div className="absolute -top-32 -right-32 w-125 h-125 rounded-full border border-white" />
        <div className="absolute -top-20 -right-20 w-125 h-125 rounded-full border border-white" />
        <div className="absolute -bottom-32 -left-32 w-150 h-150 rounded-full border border-white" />
        <div className="absolute -bottom-20 -left-20 w-150 h-150 rounded-full border border-white" />
      </div>

      <div className="text-center max-w-lg mx-auto relative z-10">
        <h1 className="text-[160px] leading-none font-extrabold text-white/20 select-none mb-0">
          404
        </h1>
        <div className="-mt-8 mb-6">
          <span className="text-8xl font-extrabold text-white drop-shadow-lg">
            Oops!
          </span>
        </div>
        <h2 className="text-2xl font-semibold text-white/90 mb-4">
          Page Not Found
        </h2>
        <p className="text-white/70 mb-10 text-base leading-relaxed">
          The page you are looking for might have been removed, had its name
          changed, or is temporarily unavailable.
        </p>

        <Link
          href="/"
          className="inline-flex items-center justify-center px-8 py-3 text-base font-semibold rounded-full text-mainground bg-white hover:bg-white/90 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-105 focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-foreground"
        >
          <ArrowLeft className="w-5 h-5 mr-2" />
          Back to Homepage
        </Link>
      </div>

      <div className="absolute bottom-6 text-white/40 text-sm">
        {new Date().getFullYear()} Pennytor. All rights reserved.
      </div>
    </div>
  );
};

export default NotFoundPage;