import Link from "next/link";

import { ArrowRight, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

export function RoomsPreview() {
  const rooms = [
    {
      name: "Babies Room",
      ageRange: "3 Months - 2 Years",
      ratio: "1:3 staff to child ratio",
      focus: ["Sensory exploration", "Cozy nap pods", "Gross motor skill development"],
      borderColor: "border-primary/20",
      pillBg: "bg-primary/10 text-primary",
      ctaHref: "/rooms#babies",
    },
    {
      name: "Toddlers Room",
      ageRange: "2 - 3 Years",
      ratio: "1:4 staff to child ratio",
      focus: ["Language development", "Expressive Art and Design", "Building friendships and relationships"],
      borderColor: "border-secondary/20",
      pillBg: "bg-secondary/10 text-secondary-foreground",
      ctaHref: "/rooms#toddlers",
    },
    {
      name: "Preschool Room",
      ageRange: "3 - 5 Years",
      ratio: "1:8 staff to child ratio",
      focus: ["Number recognition", "Building confidence and independence", "Transition to school"],
      borderColor: "border-accent/20",
      pillBg: "bg-accent/15 text-accent-foreground",
      ctaHref: "/rooms#preschool",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-background to-primary/5">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div className="max-w-2xl">
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
              Our Nursery Rooms
            </h2>
            <p className="mt-4 text-lg text-muted-foreground">
              We separate our classes into specific rooms tailored exactly to your child's age group and development
              stage.
            </p>
          </div>
          <Button asChild variant="outline" className="rounded-full border-2 self-start md:self-auto">
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
              className={`flex flex-col p-8 rounded-3xl border bg-background shadow-sm hover:shadow-xl transition-shadow ${room.borderColor}`}
            >
              <div className="flex items-center justify-between mb-6">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${room.pillBg}`}
                >
                  {room.ageRange}
                </span>
                <span className="text-xs text-muted-foreground italic">{room.ratio}</span>
              </div>

              <h3 className="text-2xl font-bold text-foreground mb-4">{room.name}</h3>

              <ul className="space-y-3 mb-8 flex-grow">
                {room.focus.map((item) => (
                  <li key={item} className="flex items-start gap-2.5 text-muted-foreground text-sm">
                    <Sparkles className="h-4.5 w-4.5 text-primary shrink-0 mt-0.5" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>

              <Button asChild variant="secondary" className="w-full rounded-full">
                <Link href={room.ctaHref}>Explore the Routine</Link>
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
