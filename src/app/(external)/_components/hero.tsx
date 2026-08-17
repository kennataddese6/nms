import Image from "next/image";
import Link from "next/link";

import { ArrowRight, Star } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-primary/10 via-background to-background py-16 sm:py-24">
      {/* Decorative background blobs */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-accent/20 blur-3xl" />
      <div className="absolute bottom-10 right-1/4 -z-10 h-96 w-96 rounded-full bg-secondary/25 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Text Content */}
          <div className="lg:col-span-6 flex flex-col justify-center text-center lg:text-left">
            {/* Trust badge */}
            <div className="mx-auto lg:mx-0 mb-6 inline-flex items-center gap-2 rounded-full bg-primary/10 px-4 py-1.5 text-xs font-semibold text-primary tracking-wide">
              <Star className="h-4 w-4.5 fill-primary stroke-primary" />
              Ofsted Registered • Excellent Care Standards
            </div>

            <h1 className="font-heading text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-foreground leading-[1.1]">
              Play-based <span className="text-primary">Curriculum</span> Aligned with EYFS Framework
            </h1>
            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0">
              Welcome to Bubbly Day Nursery, a warm and child-friendly environment where babies, toddlers, and
              preschoolers explore, learn, and grow through play-based discovery aligned with the EYFS framework.
            </p>

            <div className="mt-10 flex flex-col sm:flex-row gap-4 justify-center lg:justify-start">
              <Button asChild size="lg" className="rounded-full px-8 text-base font-semibold group shadow-lg">
                <Link href="/contact?tour=true" className="flex items-center gap-2">
                  Book a Visit
                  <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
                </Link>
              </Button>
              <Button
                asChild
                variant="outline"
                size="lg"
                className="rounded-full px-8 text-base font-semibold border-2"
              >
                <Link href="/rooms">Explore Rooms</Link>
              </Button>
            </div>

            {/* Quick Stats */}
            <div className="mt-12 grid grid-cols-3 gap-4 border-t pt-8 text-left">
              <div>
                <span className="block text-2xl font-extrabold text-primary">3m - 5y</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Age Range</span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-secondary-foreground">7:30 - 18:00</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">
                  Opening Hours
                </span>
              </div>
              <div>
                <span className="block text-2xl font-extrabold text-accent-foreground">EYFS</span>
                <span className="text-xs text-muted-foreground uppercase tracking-wider font-semibold">Curriculum</span>
              </div>
            </div>
          </div>

          {/* Graphic Artwork */}
          <div className="lg:col-span-6 flex justify-center">
            <div className="relative w-full max-w-[540px] aspect-square rounded-3xl overflow-hidden shadow-2xl bg-white border-8 border-white ring-1 ring-border">
              <Image
                src="/images/hero1.png"
                alt="Bubbly Day Nursery illustration of children playing"
                fill
                priority
                className="object-cover"
                sizes="(max-w-7xl) 50vw, 100vw"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
