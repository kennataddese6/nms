import Link from "next/link";

import { Baby, DoorOpen, Sparkles } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export default function RoomsPage() {
  const rooms = [
    {
      name: "Babies Room",
      ageRange: "3 Months - 2 Years",
      ratio: "1:3 ratio",
      desc: "A warm, sensory-rich environment with quiet sleeping pods and soft-play creeping zones.",
    },
    {
      name: "Toddlers Room",
      ageRange: "2 - 3 Years",
      ratio: "1:4 ratio",
      desc: "Designed for budding independence, speech progression, and messy play exploration.",
    },
    {
      name: "Preschool Room",
      ageRange: "3 - 5 Years",
      ratio: "1:8 ratio",
      desc: "Focuses on early phonics, numeracy, social coordination, and primary school readiness.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-primary/10 py-16 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              Our Nursery Classrooms
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Custom classrooms tailored exactly to early development milestones. We provide dedicated spaces for quiet
              naps, active play, and education.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 sm:py-24 bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {rooms.map((room) => (
                <div key={room.name} className="p-8 rounded-3xl border bg-background shadow-sm flex flex-col">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-secondary/15 text-secondary-foreground mb-6">
                    <DoorOpen className="h-6 w-6 stroke-[2]" />
                  </div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-2xl font-bold text-foreground">{room.name}</h3>
                    <span className="text-xs bg-primary/10 text-primary px-2.5 py-0.5 rounded-full font-semibold">
                      {room.ageRange}
                    </span>
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">{room.desc}</p>
                  <div className="border-t pt-4 text-xs text-muted-foreground font-medium italic">
                    Ratio details: {room.ratio}
                  </div>
                </div>
              ))}
            </div>

            {/* Placeholder info box */}
            <div className="mt-16 p-8 rounded-3xl bg-accent/10 border border-accent/20 text-center max-w-3xl mx-auto">
              <Sparkles className="h-8 w-8 text-accent-foreground mx-auto mb-4" />
              <h4 className="text-lg font-bold text-foreground mb-2">Interactive Daily Schedules Coming Soon</h4>
              <p className="text-muted-foreground text-sm mb-6">
                We are currently building out an interactive schedule tracker. Parents will soon be able to check
                real-time session timetables, active staff ratios, and classroom activity guides from the portal.
              </p>
              <Button asChild rounded-full className="rounded-full">
                <Link href="/contact">Book a Visit to See the Rooms</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
