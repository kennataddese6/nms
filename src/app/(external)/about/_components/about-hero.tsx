import Image from "next/image";

import { HeartHandshake, ShieldCheck, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-orange-100/70 via-amber-50/40 to-background py-16 sm:py-24 text-center dark:from-orange-950/30 dark:via-amber-950/20">
      {/* Decorative colorful background blobs */}
      <div className="absolute top-10 left-10 h-72 w-72 rounded-full bg-amber-400/20 blur-3xl animate-pulse" />
      <div className="absolute bottom-10 right-10 h-80 w-80 rounded-full bg-teal-400/20 blur-3xl" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-rose-400/15 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100 px-4 py-1.5 text-xs font-black text-orange-800 shadow-sm dark:bg-orange-900/50 dark:text-orange-200 mb-6">
            <Sparkles className="h-4 w-4 text-orange-600 animate-spin" />
            Nurturing Hearts & Minds Across London
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
            Our Vision, Purpose &{" "}
            <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-teal-600 bg-clip-text text-transparent">
              Care Philosophy
            </span>{" "}
            🌻
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            At Bubbly Day Nursery, our mission is to create a safe, vibrant, child-centric, and stimulating
            home-away-from-home. We believe every child deserves a bubbly, happy childhood packed with discovery and
            curiosity.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Badge className="bg-emerald-500 text-white font-bold text-xs px-3.5 py-1.5 gap-1.5 shadow-sm">
              <ShieldCheck className="h-4 w-4" /> Ofsted Outstanding Standard
            </Badge>
            <Badge className="bg-orange-500 text-white font-bold text-xs px-3.5 py-1.5 gap-1.5 shadow-sm">
              <HeartHandshake className="h-4 w-4" /> Qualified EYFS Educators
            </Badge>
          </div>
        </div>

        <div className="mt-12 mx-auto max-w-4xl rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-orange-200 bg-white p-2.5">
          <div className="relative aspect-[16/9] w-full rounded-[2rem] overflow-hidden">
            <Image
              src="/images/about-nursery.png"
              alt="Bubbly Day Nursery environment"
              fill
              className="object-cover hover:scale-105 transition-transform duration-700"
              sizes="(max-w-7xl) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
