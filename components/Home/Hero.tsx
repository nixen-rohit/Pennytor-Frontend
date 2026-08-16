"use client";

import  { useRef, useState } from "react";
import Link from "next/link";
import {
  Play,
  Pause,
  ArrowUpRight,
  Phone,
} from "lucide-react";
import Image from "next/image";
const statsCards = [
  {
    id: 1,
    title: "200+",
    subtitle: "Happy investors",
    type: "avatars",
    avatars: [
      "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&h=100&q=80",
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=100&h=100&q=80",
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=100&h=100&q=80",
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=100&h=100&q=80",
    ],
  },
  {
    id: 2,
    title: "98%",
    subtitle: "Growth rate",
    type: "graph",

    graphBars: [
      "h-2 bg-white/10",
      "h-4 bg-white/20",
      "h-6 bg-white/30",
      "h-8 bg-white/40",
      "h-12 bg-white/50",
      "h-16 bg-white/60",
      "h-20 bg-white/70",
      "h-24 bg-white/80",
      "h-26 bg-white/90",
      "h-28 bg-white/95",
    ],
  },
];

 

 

export default function Hero() {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  const handleVideoToggle = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  return (
   <section className="w-full min-h-screen bg-[#FFF9F6] px-4 sm:px-6 md:px-8 lg:px-16 xl:px-20 py-12 lg:py-0 flex flex-col justify-center items-center overflow-x-hidden">
  <div className="max-w-7xl w-full grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
    {/* LEFT CONTENT */}
    <div className="lg:col-span-5 flex flex-col justify-center">
      <div className="space-y-6 sm:space-y-8">
        <div className="flex flex-col items-center text-center md:items-start md:text-left">
          <h2 className="text-3xl  xs:text-4xl sm:text-5xl md:text-6xl xl:text-7xl tracking-tight leading-[1.1] text-[#111111]">
            Let's Build{" "}
            <span className="block font-normal font-serif italic  text-foreground sm:inline">
              Generational Wealth
            </span>
          </h2>

          <p className="mt-4 sm:mt-5 max-w-2xl text-sm sm:text-base md:text-lg leading-relaxed text-gray-600/95">
            Everything you need to know about us and our services. Can't
            find an answer? Feel free to contact us.
          </p>
        </div>

        {/* BUTTONS CONTAINER */}
        <div className="flex flex-col sm:flex-row w-full gap-3 items-center justify-center sm:justify-start">
          {/* primary button */}
          <Link href="/login" className="w-full sm:w-auto">
            <button className="group flex w-full sm:w-auto h-14 items-center justify-center sm:justify-start gap-3 rounded-full bg-mainground/90 px-6 text-white transition-all duration-300 hover:bg-mainground shadow-md hover:shadow-lg">
              <span className="text-sm font-semibold tracking-wide whitespace-nowrap">
                Get Started
              </span>
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-white/95 transition-transform duration-300 group-hover:rotate-45">
                <ArrowUpRight className="h-5 w-5 text-black" />
              </div>
            </button>
          </Link>

          {/* secondary button */}
          <button className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 bg-[#1D1B24] rounded-2xl border border-gray-200 px-4 sm:px-6 py-3 text-sm sm:text-base font-medium text-white shadow-sm transition-all duration-300 hover:border-blue-200 hover:bg-zinc-800 hover:shadow-md active:scale-[0.98]">
            <span className="flex h-10 w-10 sm:h-11 sm:w-11 shrink-0 items-center justify-center rounded-xl bg-white/15 backdrop-blur-md border border-white/10 text-white transition-all duration-300 group-hover:scale-110 group-hover:rotate-6">
              <Phone className="h-5 w-5" />
            </span>
            <span className="whitespace-nowrap">
              +91 {process.env.NEXT_PUBLIC_WHATSAPP_PHONE_NUMBER}
            </span>
          </button>
        </div>
      </div>
    </div>

    {/* RIGHT SECTION */}
    <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-12 gap-6 w-full">
      {/* STATS CARDS */}
      <div className="sm:col-span-1 md:col-span-5 grid grid-cols-1 xs:grid-cols-2 sm:grid-cols-1 gap-6">
        {statsCards.map((card) => (
          <div
            key={card.id}
            className="relative overflow-hidden rounded-3xl bg-linear-to-br from-mainground to-foreground p-5 sm:p-6 text-white shadow-[0_20px_60px_rgba(37,99,235,0.25)] flex-1 min-h-[140px] sm:min-h-[160px] flex flex-col justify-between"
          >
            <div className="absolute -bottom-10 -right-10 h-40 w-40 rounded-full bg-white/10 blur-3xl" />

            <div
              className={`relative z-10 flex h-full w-full justify-between ${
                card.type === "graph" || card.type === "avatars"
                  ? "flex-row items-center md:flex-col md:items-start"
                  : "flex-col items-start"
              }`}
            >
              {card.type === "avatars" && (
                <div className="flex -space-x-2 md:mb-4 order-2 md:order-1 pr-6 sm:pr-10 md:pr-0">
                  {card.avatars?.map((src, index) => (
                    <Image
                      height={500}
                      width={500}
                      key={index}
                      src={src}
                      alt="Client avatar"
                      className="h-9 w-9 sm:h-10 sm:w-10 md:h-11 md:w-11 rounded-full border-2 border-white object-cover shadow-sm transition-transform duration-300 hover:-translate-y-1"
                    />
                  ))}
                </div>
              )}

              <div className="space-y-1 w-full order-1 md:order-2">
                <h3 className="text-3xl sm:text-4xl md:text-5xl font-black tracking-tight">
                  {card.title}
                </h3>
                <p className="text-xs sm:text-sm font-medium text-blue-100">
                  {card.subtitle}
                </p>
              </div>

              {card.type === "graph" && (
                <div className="flex items-end gap-1.5 sm:gap-2 h-14 sm:h-16 justify-end md:justify-start order-2 md:order-3">
                  {card.graphBars?.map((bar, index) => (
                    <div key={index} className={`w-2.5 sm:w-3 rounded-t-md ${bar}`} />
                  ))}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* VIDEO BOX */}
      <div className="sm:col-span-1 md:col-span-7 relative min-h-[220px] xs:min-h-[260px] sm:min-h-[300px] md:min-h-[320px] lg:min-h-[336px] overflow-hidden rounded-3xl bg-gray-200 group">
        <video
          ref={videoRef}
          className="absolute inset-0 h-full w-full object-cover"
          poster="/img/video-cover.png"
          preload="metadata"
        >
          <source src="/video/work-video.mp4" type="video/mp4" />
        </video>

        <div className="absolute inset-0 bg-black/20" />

        <button
          onClick={handleVideoToggle}
          className="absolute left-1/2 top-1/2 z-20 flex h-14 w-14 sm:h-16 sm:w-16 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-4 border-[#FFF9F6] bg-[#1D1B24] text-white shadow-lg transition-all duration-300 hover:scale-105"
          aria-label={isPlaying ? "Pause video" : "Play video"}
        >
          {isPlaying ? (
            <Pause className="h-4 w-4 sm:h-5 sm:w-5 fill-current" />
          ) : (
            <Play className="ml-0.5 h-4 w-4 sm:h-5 sm:w-5 fill-current" />
          )}
        </button>
      </div>
    </div>
  </div>
</section>
  );
}
