"use client";
import Image from "next/image";
import { ArrowUpRight } from "lucide-react";
import { FaLinkedin } from "react-icons/fa";
import { FaSquareXTwitter } from "react-icons/fa6";

const founders = [
  {
    name: "Rahul Mehta",
    role: "Founder & CEO",
    image: "/img/rahul-ceo.jpg",
    description:
      "Ex-Goldman Sachs, IIT Bombay Alumnus. 15+ years in investment banking and wealth management.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Priya Sharma",
    role: "Co-Founder & CIO",
    image: "/img/Priya-cio.jpg",
    description:
      "Ex-Morgan Stanley, IIM Ahmedabad. CFA Charterholder with 12+ years in portfolio management.",
    linkedin: "#",
    twitter: "#",
  },
  {
    name: "Amit Kumar",
    role: "Co-Founder & CTO",
    image: "/img/Amit-cto.jpg",
    description:
      "Ex-Google, BITS Pilani. Fintech expert with 10+ years in building scalable trading platforms.",
    linkedin: "#",
    twitter: "#",
  },
];

export default function FoundersPage() {
  return (
    <main className="min-h-screen bg-white text-slate-900">
      {/* Hero */}
      <section className="relative overflow-hidden bg-[#4E385E]/90 px-6 py-24 sm:px-10 lg:px-20">
        {/* Background decoration */}
        <div className="absolute -left-32 -top-32 h-96 w-96 rounded-full bg-[#E85B66]/30 blur-3xl" />
        <div className="absolute -bottom-32 -right-32 h-96 w-96 rounded-full bg-[#E85B66]/30 blur-3xl" />

        <div className="relative mx-auto max-w-7xl text-center">
          <span className="mb-5 inline-block rounded-full border border-white/10 bg-[#E85B66]/10 px-4 py-2 text-sm font-medium text-[#E85B66]">
            Our Leadership
          </span>

          <h1 className="mx-auto max-w-4xl text-4xl font-bold tracking-tight text-white sm:text-5xl lg:text-6xl">
            Meet Our <span className="text-[#E85B66]">Founders</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-base leading-7 text-slate-400 sm:text-lg">
            Visionaries behind WealthGate&apos;s success, bringing decades of
            experience across investment banking, wealth management, technology,
            and fintech.
          </p>
        </div>
      </section>

      {/* Founders */}
      <section className="px-6 py-20 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-7xl">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {founders.map((founder) => (
              <article
                key={founder.name}
                className="group relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl"
              >
                {/* Image */}
                <div className="relative mx-auto mb-7 h-48 w-48 overflow-hidden rounded-full border-8 border-slate-50 shadow-lg">
                  <Image
                    src={founder.image}
                    alt={founder.name}
                    fill
                    sizes="192px"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                {/* Content */}
                <div className="text-center">
                  <p className="mb-2 text-sm font-semibold uppercase tracking-wider text-blue-600">
                    {founder.role}
                  </p>

                  <h2 className="text-2xl font-bold text-slate-900">
                    {founder.name}
                  </h2>

                  <p className="mt-4 min-h-[84px] text-sm leading-6 text-slate-500">
                    {founder.description}
                  </p>
                </div>

                {/* Social links */}
                <div className="mt-7 flex items-center justify-center gap-3">
                  <a
                    href={founder.linkedin}
                    target="_self"
                    rel="noopener noreferrer"
                    aria-label={`${founder.name} LinkedIn`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 text-slate-600 transition-all hover:border-blue-600 hover:bg-blue-500 hover:text-white"
                  >
                    <FaLinkedin size={18} />
                  </a>

                  <a
                    href={founder.twitter}
                   target="_self"
                    rel="noopener noreferrer"
                    aria-label={`${founder.name} Twitter`}
                    className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-500 text-slate-600 transition-all hover:border-slate-900 hover:bg-slate-900 hover:text-white"
                  >
                    <FaSquareXTwitter size={18} />
                  </a>
                </div>

                {/* Bottom accent */}
                <div className="absolute bottom-0 left-0 h-1 w-0 bg-blue-600 transition-all duration-300 group-hover:w-full" />
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Closing section */}
      <section className="bg-slate-50 px-6 py-20 sm:px-10 lg:px-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="text-3xl font-bold tracking-tight text-slate-900 sm:text-4xl">
            Experience Meets Innovation
          </h2>

          <p className="mx-auto mt-5 max-w-2xl leading-7 text-slate-500">
            Our leadership team combines deep financial expertise with
            technology-driven thinking to build a smarter and more accessible
            wealth management experience.
          </p>

          <a
            href="#"
            target="_self"
            className="mt-8 inline-flex items-center gap-2 rounded-full bg-slate-900 px-6 py-3 text-sm font-semibold text-white transition-all hover:bg-[#E85B66] "
          >
            Learn More
            <ArrowUpRight size={17} />
          </a>
        </div>
      </section>
    </main>
  );
}
