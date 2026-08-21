import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

/* ─── Floating decoration element ─────────────────────────── */
function Deco({
  emoji,
  size,
  className,
  animClass,
  delay = "0s",
}: {
  emoji: string;
  size: string;
  className: string;
  animClass: string;
  delay?: string;
}) {
  return (
    <span
      aria-hidden="true"
      className={`absolute pointer-events-none select-none leading-none z-0 ${size} ${className} ${animClass}`}
      style={{ animationDelay: delay }}
    >
      {emoji}
    </span>
  );
}

/* ─── Cloud SVG ────────────────────────────────────────────── */
function Cloud({ className, animDelay = "0s" }: { className?: string; animDelay?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 120 60"
      className={`absolute pointer-events-none select-none fill-white/70 z-0 nursery-float ${className}`}
      style={{ animationDelay: animDelay }}
    >
      <ellipse cx="60" cy="40" rx="50" ry="22" />
      <ellipse cx="38" cy="32" rx="26" ry="20" />
      <ellipse cx="78" cy="28" rx="22" ry="18" />
    </svg>
  );
}

/* ─── Rainbow arc SVG ─────────────────────────────────────── */
function Rainbow({ className }: { className?: string }) {
  return (
    <svg
      aria-hidden="true"
      viewBox="0 0 200 110"
      className={`absolute pointer-events-none select-none z-0 nursery-float-slow ${className}`}
      style={{ animationDelay: "0.4s" }}
    >
      <path d="M10 100 Q100 -20 190 100" fill="none" stroke="#f87171" strokeWidth="10" strokeLinecap="round" />
      <path d="M20 100 Q100 -8 180 100" fill="none" stroke="#fb923c" strokeWidth="8" strokeLinecap="round" />
      <path d="M30 100 Q100  4  170 100" fill="none" stroke="#fbbf24" strokeWidth="8" strokeLinecap="round" />
      <path d="M40 100 Q100 14  160 100" fill="none" stroke="#4ade80" strokeWidth="8" strokeLinecap="round" />
      <path d="M50 100 Q100 24  150 100" fill="none" stroke="#60a5fa" strokeWidth="8" strokeLinecap="round" />
      <path d="M60 100 Q100 34  140 100" fill="none" stroke="#a78bfa" strokeWidth="8" strokeLinecap="round" />
    </svg>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden py-16 sm:py-24 bg-gradient-to-br from-sky-300 via-cyan-100 to-emerald-200">
      {/* ── Ambient glow blobs ─────────────────────────────── */}
      <div className="absolute top-0 left-1/4 -z-10 h-80 w-80 rounded-full bg-yellow-300/30 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-96 w-96 rounded-full bg-pink-300/25 blur-3xl" />
      <div className="absolute top-1/2 left-0 -z-10 h-60 w-60 rounded-full bg-purple-300/20 blur-3xl" />

      {/* ── Floating decorations ───────────────────────────── */}

      {/* Clouds */}
      <Cloud className="w-36 top-4 left-8 opacity-80" animDelay="0s" />
      <Cloud className="w-28 top-8 right-20 opacity-60" animDelay="1.2s" />
      <Cloud className="w-20 bottom-16 left-1/3 opacity-50 hidden sm:block" animDelay="0.6s" />

      {/* Rainbow — top right */}
      <Rainbow className="w-44 top-2 right-4 opacity-90 hidden sm:block" />

      {/* Stars — scattered */}
      <Deco emoji="⭐" size="text-4xl" className="top-6 left-6" animClass="nursery-twinkle" delay="0s" />
      <Deco
        emoji="⭐"
        size="text-2xl"
        className="top-24 left-1/4 hidden sm:block"
        animClass="nursery-twinkle"
        delay="0.8s"
      />
      <Deco
        emoji="🌟"
        size="text-3xl"
        className="top-10 right-1/3 hidden md:block"
        animClass="nursery-twinkle"
        delay="1.4s"
      />
      <Deco
        emoji="✨"
        size="text-2xl"
        className="bottom-24 left-8 hidden sm:block"
        animClass="nursery-twinkle"
        delay="0.5s"
      />

      {/* Animals */}
      <Deco
        emoji="🦋"
        size="text-4xl"
        className="top-1/3 right-5 hidden lg:block"
        animClass="nursery-wiggle"
        delay="0.3s"
      />
      <Deco
        emoji="🐸"
        size="text-4xl"
        className="bottom-16 left-6 hidden sm:block"
        animClass="nursery-float"
        delay="0.9s"
      />
      <Deco
        emoji="🐰"
        size="text-3xl"
        className="bottom-10 right-1/4 hidden md:block"
        animClass="nursery-wiggle"
        delay="1.1s"
      />
      <Deco
        emoji="🐣"
        size="text-3xl"
        className="top-1/2 left-4 hidden lg:block"
        animClass="nursery-float"
        delay="0.7s"
      />
      <Deco
        emoji="🦁"
        size="text-4xl"
        className="top-1/4 right-8 hidden xl:block"
        animClass="nursery-float-slow"
        delay="0.2s"
      />

      {/* Earth & balloon */}
      <Deco
        emoji="🌍"
        size="text-5xl"
        className="bottom-8 right-6 hidden sm:block"
        animClass="nursery-spin-slow"
        delay="0s"
      />
      <Deco
        emoji="🎈"
        size="text-4xl"
        className="top-2/3 left-10 hidden sm:block"
        animClass="nursery-float-slow"
        delay="0.6s"
      />
      <Deco
        emoji="🎈"
        size="text-3xl"
        className="top-1/4 left-20 hidden md:block"
        animClass="nursery-float"
        delay="1.3s"
      />

      {/* Nature */}
      <Deco
        emoji="🌸"
        size="text-3xl"
        className="bottom-1/3 left-1/4 hidden md:block"
        animClass="nursery-drift"
        delay="0.4s"
      />
      <Deco
        emoji="🌈"
        size="text-3xl"
        className="top-6 left-1/2 hidden lg:block"
        animClass="nursery-float"
        delay="1s"
      />

      {/* ABC badge */}
      <span
        aria-hidden="true"
        className="absolute top-8 right-6 sm:right-16 hidden sm:flex items-center gap-1 bg-yellow-400 text-yellow-900 text-xs font-black px-3 py-1.5 rounded-full shadow-md nursery-pop-in z-0"
        style={{ animationDelay: "0.5s" }}
      >
        🔤 A B C
      </span>

      {/* 123 badge */}
      <span
        aria-hidden="true"
        className="absolute bottom-12 left-1/2 hidden md:flex items-center gap-1 bg-purple-400 text-white text-xs font-black px-3 py-1.5 rounded-full shadow-md nursery-pop-in z-0"
        style={{ animationDelay: "0.8s" }}
      >
        🔢 1 2 3
      </span>

      {/* ── Main content ───────────────────────────────────── */}
      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            {/* Trust badge */}
            <div className="mx-auto lg:mx-0 mb-6 inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 px-4 py-1.5 text-xs font-bold text-sky-700 tracking-wide shadow-sm nursery-pop-in">
              ⭐ Ofsted Registered • Excellent Care Standards
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-sky-900 leading-[1.1]">
              Play-based{" "}
              <span className="relative inline-block">
                <span className="relative z-10 text-white drop-shadow-md">Curriculum</span>
                <span className="absolute inset-0 -z-0 rotate-[-1deg] rounded-xl bg-gradient-to-r from-orange-400 to-pink-500" />
              </span>{" "}
              <br className="hidden sm:block" />
              Aligned with <span className="text-emerald-700">EYFS</span> Framework
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-sky-800/90 max-w-2xl mx-auto lg:mx-0 leading-relaxed">
              Welcome to Bubbly Day Nursery — a warm, colourful environment where babies, toddlers, and preschoolers
              explore, learn, and grow through play-based discovery 🌱
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 text-base font-bold group shadow-lg bg-gradient-to-r from-orange-400 to-pink-500 border-0 text-white hover:from-orange-500 hover:to-pink-600 hover:scale-105 transition-transform"
              >
                <Link href="/contact?tour=true" className="flex items-center gap-2">
                  🎒 Book a Visit
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base font-bold border-2 border-white/80 bg-white/60 backdrop-blur-sm text-sky-800 hover:bg-white hover:scale-105 transition-transform"
              >
                <Link href="/rooms">🚪 Explore Rooms</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t border-white/40 pt-8 text-left">
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-3">
                <span className="block text-2xl font-extrabold text-orange-500">3m – 5y</span>
                <span className="text-xs text-sky-700 uppercase tracking-wider font-bold">Age Range</span>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-3">
                <span className="block text-2xl font-extrabold text-emerald-600">7:30–18:00</span>
                <span className="text-xs text-sky-700 uppercase tracking-wider font-bold">Open Hours</span>
              </div>
              <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-3">
                <span className="block text-2xl font-extrabold text-purple-600">EYFS</span>
                <span className="text-xs text-sky-700 uppercase tracking-wider font-bold">Curriculum</span>
              </div>
            </div>
          </div>

          {/* Hero Image */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative">
              {/* Spinning star badge */}
              <div
                className="absolute -top-5 -right-5 z-20 flex h-14 w-14 items-center justify-center rounded-full bg-yellow-400 text-2xl shadow-lg nursery-spin-slow border-4 border-white"
                aria-hidden="true"
              >
                ⭐
              </div>
              {/* Wiggling heart badge */}
              <div
                className="absolute -bottom-4 -left-4 z-20 flex h-12 w-12 items-center justify-center rounded-full bg-pink-400 text-xl shadow-lg nursery-wiggle border-4 border-white"
                aria-hidden="true"
                style={{ animationDelay: "0.5s" }}
              >
                💛
              </div>

              {/* Main image frame */}
              <div className="relative w-full max-w-[520px] aspect-square rounded-[2rem] overflow-hidden shadow-2xl border-[6px] border-white ring-4 ring-yellow-300/60">
                <Image
                  src="/images/hero1.png"
                  alt="Children playing at Bubbly Day Nursery"
                  fill
                  priority
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 50vw"
                />
              </div>

              {/* Floating mini badge bottom-right */}
              <div
                className="absolute -bottom-3 right-8 z-20 bg-emerald-400 text-white text-xs font-black px-4 py-2 rounded-full shadow-lg nursery-float border-2 border-white"
                aria-hidden="true"
                style={{ animationDelay: "1s" }}
              >
                🌱 EYFS Ready
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
