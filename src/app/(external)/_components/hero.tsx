import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden py-24 sm:py-32 lg:py-40 text-white min-h-[85vh] flex items-center justify-center">
      {/* ── Background Image hero1.png with Gradient Overlay ── */}
      <div className="absolute inset-0 z-0">
        <Image
          src="/images/hero1.png"
          alt="Bubbly Day Nursery Hero Background"
          fill
          priority
          className="object-cover object-center"
          sizes="100vw"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-sky-950/85 via-sky-900/65 to-emerald-950/75 mix-blend-multiply" />
        <div className="absolute inset-0 bg-black/20" />
      </div>

      <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center text-center">
          {/* Text Content */}
          <div className="flex flex-col items-center max-w-3xl">
            {/* Nursery Logo & Brand Badge (unrounded logo) */}
            <div className="mx-auto mb-6 inline-flex items-center gap-3 rounded-full bg-white/95 backdrop-blur-md border border-white/40 px-5 py-2 shadow-lg">
              <div className="relative h-9 w-9 overflow-hidden shrink-0">
                <Image
                  src="/images/newlogo.png"
                  alt="Bubbly Day Nursery logo"
                  fill
                  className="object-contain"
                  sizes="36px"
                  priority
                />
              </div>
              <span className="font-heading font-black text-base sm:text-lg text-sky-950">
                Bubbly <span className="text-orange-500">Day Nursery</span> 🌟
              </span>
            </div>

            {/* Main Heading */}
            <h1 className="font-heading text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1] drop-shadow-md">
              Where Little Explorers <br className="hidden sm:inline" />
              <span className="bg-gradient-to-r from-yellow-300 via-amber-200 to-pink-300 bg-clip-text text-transparent">
                Grow & Shine 🌈
              </span>
            </h1>

            {/* Subtitle */}
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-sky-100 font-medium leading-relaxed max-w-2xl drop-shadow">
              Ofsted-registered Early Years nursery in London. Providing warm, stimulating, and child-centric childcare for
              babies, toddlers, and preschool children.
            </p>

            {/* Action Buttons */}
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Button
                asChild
                size="lg"
                className="rounded-full px-8 py-6 font-bold text-base bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-xl hover:scale-105 transition-all duration-200"
              >
                <Link href="/contact?tour=true">
                  🎒 Book a Tour <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 py-6 font-bold text-base bg-white/20 hover:bg-white/30 text-white border-2 border-white/60 backdrop-blur-md shadow-lg hover:scale-105 transition-all duration-200"
              >
                <Link href="/rooms">🚪 Explore Our Rooms</Link>
              </Button>
            </div>

            {/* Feature Pills */}
            <div className="mt-12 flex flex-wrap justify-center gap-3 text-xs sm:text-sm font-bold text-sky-950">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 shadow-md">
                🛡️ Ofsted Registered
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 shadow-md">
                🌱 EYFS Curriculum
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 shadow-md">
                🍎 Healthy Meals
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-full bg-white/90 backdrop-blur-md px-4 py-2 shadow-md">
                ⏰ 7:30 AM - 6:00 PM
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
