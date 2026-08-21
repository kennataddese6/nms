import Image from "next/image";
import Link from "next/link";

import { ArrowRight } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RoomsPreview() {
  const rooms = [
    {
      name: "Babies Room",
      emoji: "🍼",
      ageRange: "3 Months – 2 Years",
      ratio: "1:3 staff to child ratio",
      focus: ["Sensory exploration", "Cosy nap pods", "Gross motor skill development"],
      cardBg: "bg-pink-100 border-pink-300",
      pillBg: "bg-pink-200 text-pink-800",
      badgeColor: "bg-pink-400 text-white",
      ctaClass: "bg-pink-400 hover:bg-pink-500 text-white border-0",
      ctaHref: "/rooms#babies",
      imageSrc: "/images/classroom-babies.png",
      tilt: "-rotate-1",
      decoration: "🌸",
    },
    {
      name: "Toddlers Room",
      emoji: "🧸",
      ageRange: "2 – 3 Years",
      ratio: "1:4 staff to child ratio",
      focus: ["Language development", "Expressive Art & Design", "Building friendships and relationships"],
      cardBg: "bg-sky-100 border-sky-300",
      pillBg: "bg-sky-200 text-sky-800",
      badgeColor: "bg-sky-400 text-white",
      ctaClass: "bg-sky-400 hover:bg-sky-500 text-white border-0",
      ctaHref: "/rooms#toddlers",
      imageSrc: "/images/classroom-toddlers.png",
      tilt: "rotate-1",
      decoration: "🎨",
    },
    {
      name: "Preschool Room",
      emoji: "🎒",
      ageRange: "3 – 5 Years",
      ratio: "1:8 staff to child ratio",
      focus: ["Number recognition", "Building confidence and independence", "Transition to school"],
      cardBg: "bg-violet-100 border-violet-300",
      pillBg: "bg-violet-200 text-violet-800",
      badgeColor: "bg-violet-400 text-white",
      ctaClass: "bg-violet-400 hover:bg-violet-500 text-white border-0",
      ctaHref: "/rooms#preschool",
      imageSrc: "/images/classroom-preschool.png",
      tilt: "-rotate-1",
      decoration: "🌟",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Ambient floating decorations */}
      <span
        aria-hidden="true"
        className="absolute top-8 left-6 text-4xl pointer-events-none select-none nursery-float opacity-60 hidden sm:block"
        style={{ animationDelay: "0.4s" }}
      >
        🎪
      </span>
      <span
        aria-hidden="true"
        className="absolute top-12 right-8 text-4xl pointer-events-none select-none nursery-twinkle opacity-60 hidden sm:block"
        style={{ animationDelay: "0.9s" }}
      >
        ⭐
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-10 left-1/4 text-3xl pointer-events-none select-none nursery-wiggle opacity-50 hidden md:block"
        style={{ animationDelay: "0.6s" }}
      >
        🎈
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-8 right-1/3 text-3xl pointer-events-none select-none nursery-float-slow opacity-50 hidden lg:block"
        style={{ animationDelay: "1.1s" }}
      >
        🦋
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 text-orange-800 text-xs font-bold rounded-full px-4 py-1.5 mb-4">
              🏫 Our Classrooms
            </div>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Our Nursery Rooms 🚀
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We separate our classes into specific rooms tailored exactly to your child&apos;s age group and
              development stage.
            </p>
          </div>
          <Button
            asChild
            variant="outline"
            className="rounded-full border-2 self-start md:self-auto hover:scale-105 transition-transform"
          >
            <Link href="/rooms" className="flex items-center gap-2">
              View Class Details
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {rooms.map((room) => (
            <div
              key={room.name}
              className={`relative flex flex-col p-6 rounded-3xl border-2 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:rotate-0 transition-all duration-300 ${room.cardBg} ${room.tilt}`}
            >
              {/* Corner decoration */}
              <span
                aria-hidden="true"
                className="absolute top-4 right-4 text-2xl opacity-40 nursery-float pointer-events-none select-none"
                style={{ animationDelay: "0.5s" }}
              >
                {room.decoration}
              </span>

              {/* Image */}
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden mb-5 border-2 border-white/60 shadow-sm">
                <Image
                  src={room.imageSrc}
                  alt={room.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 90vw, 33vw"
                />
                {/* Age badge on image */}
                <div
                  className={`absolute top-3 left-3 text-xs font-bold px-3 py-1 rounded-full shadow ${room.badgeColor}`}
                >
                  {room.ageRange}
                </div>
              </div>

              {/* Ratio */}
              <span className="text-xs font-semibold text-muted-foreground mb-3 italic">{room.ratio}</span>

              <h3 className="text-2xl font-black text-foreground mb-4">
                {room.emoji} {room.name}
              </h3>

              <ul className="space-y-2.5 mb-6 flex-grow">
                {room.focus.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-foreground/70 text-sm">
                    <span className="text-base shrink-0 mt-0.5">✨</span>
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button
                asChild
                className={`w-full rounded-full font-bold hover:scale-105 transition-transform ${room.ctaClass}`}
              >
                <Link href={room.ctaHref}>🚪 Explore the Routine</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
