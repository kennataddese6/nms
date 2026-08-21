import Image from "next/image";

import { Sparkles } from "lucide-react";

export function AboutHero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 to-background py-16 sm:py-24">
      {/* Decorative background blobs */}
      <div className="absolute top-10 left-10 -z-10 h-72 w-72 rounded-full bg-secondary/15 blur-3xl" />
      <div className="absolute bottom-10 right-10 -z-10 h-72 w-72 rounded-full bg-accent/15 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
        <div className="mx-auto max-w-3xl">
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary mb-6">
            <Sparkles className="h-4 w-4" />
            Nurturing Hearts & Minds Since 2018
          </div>

          <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
            Our Vision, Mission & <span className="text-primary">Philosophy</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted-foreground leading-relaxed">
            At Bubbly Day Nursery, our mission is to create a secure, child-centric, and stimulating
            home-away-from-home. We believe every child deserves a bubbly, happy childhood loaded with opportunities to
            explore, wonder, and build confidence.
          </p>
        </div>

        <div className="mt-12 mx-auto max-w-4xl rounded-[2rem] overflow-hidden shadow-xl border bg-white p-2">
          <div className="relative aspect-[16/9] w-full rounded-[1.75rem] overflow-hidden">
            <Image
              src="/images/about-nursery.png"
              alt="Bubbly Day Nursery environment"
              fill
              className="object-cover"
              sizes="(max-w-7xl) 100vw, 1024px"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  );
}
