import { BookOpen, Compass, Heart, MessageSquare, PenTool, Shield, Sparkles } from "lucide-react";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export default function CurriculumPage() {
  const primeAreas = [
    {
      icon: MessageSquare,
      title: "Communication & Language",
      desc: "Nurturing baby babbling, speech mimicry, listening habits, and storytelling confidence in daily circles.",
    },
    {
      icon: Heart,
      title: "Personal, Social & Emotional",
      desc: "Developing self-regulation, empathy, peer relationships, sharing, and confidence in managing feelings.",
    },
    {
      icon: Shield,
      title: "Physical Development",
      desc: "Supporting gross motor skills (climbing, running) and fine motor skills (clay modeling, early write grips).",
    },
  ];

  const specificAreas = [
    {
      icon: BookOpen,
      title: "Literacy",
      desc: "Linking letters to sounds (phonics), vocabulary games, and early spelling/writing practice.",
    },
    {
      icon: Compass,
      title: "Mathematics",
      desc: "Counting blocks, identifying geometric shapes, and recognizing basic mathematical patterns.",
    },
    {
      icon: PenTool,
      title: "Understanding the World",
      desc: "Exploring simple science (planting seeds, color mixes) and taking nature walks in our garden.",
    },
    {
      icon: Sparkles,
      title: "Expressive Arts & Design",
      desc: "Unlocking creativity through puppet play, dressing up, finger painting, and nursery songs.",
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-primary/10 py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-secondary/15 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-secondary/15 text-secondary-foreground px-4 py-1.5 text-xs font-semibold mb-4">
              <BookOpen className="h-4 w-4" />
              Play-Based Learning
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              EYFS Curriculum Framework
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Our educational program follows the UK Early Years Foundation Stage (EYFS), supporting child development
              across seven core milestones.
            </p>
          </div>
        </section>

        {/* Prime Areas of Learning */}
        <section className="py-16 sm:py-20 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl font-extrabold text-foreground">The 3 Prime Areas</h2>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                These foundational pillars are essential for sparking natural curiosity, supporting healthy physical
                growth, and developing relationship building blocks.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {primeAreas.map((area) => (
                <div
                  key={area.title}
                  className="p-8 rounded-3xl border bg-card flex flex-col items-center text-center shadow-sm"
                >
                  <div className="h-12 w-12 flex items-center justify-center rounded-2xl bg-primary/10 text-primary mb-6">
                    <area.icon className="h-6 w-6 stroke-[2]" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-3">{area.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{area.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Specific Areas of Learning */}
        <section className="py-16 sm:py-20 bg-card border-y">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl font-extrabold text-foreground">The 4 Specific Areas</h2>
              <p className="mt-3 text-muted-foreground text-sm leading-relaxed">
                These learning paths enrich a child's understanding of academic frameworks, simple science, and
                self-expression.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {specificAreas.map((area) => (
                <div
                  key={area.title}
                  className="p-6 rounded-3xl border bg-background flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <div className="h-10 w-10 flex items-center justify-center rounded-xl bg-secondary/15 text-secondary-foreground mb-4">
                      <area.icon className="h-5 w-5 stroke-[2]" />
                    </div>
                    <h3 className="font-bold text-foreground text-sm mb-2">{area.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{area.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Observation Tracking & Learning Journals */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center max-w-6xl mx-auto">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs font-bold text-primary uppercase tracking-wider block">
                  Real-time Progress Logs
                </span>
                <h2 className="text-3xl font-extrabold text-foreground">How We Track Development</h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every child at Bubbly Day Nursery is assigned a secure, private **Learning Journal**. Our educators
                  document play activities and developmental milestones through the staff dashboard.
                </p>
                <div className="space-y-4">
                  <div className="flex gap-3.5 items-start">
                    <div className="h-6 w-6 rounded-full bg-secondary/15 text-secondary-foreground flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      **Photo & Video Observations**: Real-time snapshots of classroom creations, sandbox play, and
                      science discoveries linked directly to parent accounts.
                    </p>
                  </div>
                  <div className="flex gap-3.5 items-start">
                    <div className="h-6 w-6 rounded-full bg-secondary/15 text-secondary-foreground flex items-center justify-center shrink-0 mt-0.5">
                      ✓
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      **Co-Authoring Journals**: Parents can comment on logs, share home accomplishments, and download
                      progress logs.
                    </p>
                  </div>
                </div>
              </div>

              {/* Graphic Mockup Box */}
              <div className="lg:col-span-7 p-8 rounded-3xl border bg-card shadow-sm space-y-4 relative overflow-hidden">
                <div className="absolute top-0 right-0 h-24 w-24 rounded-full bg-primary/10 blur-xl" />
                <h3 className="font-bold text-foreground text-lg mb-2">Learning Journal Sample</h3>
                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border bg-background space-y-2">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-semibold">
                      <span>OBSERVATION LOG</span>
                      <span>10:30 AM</span>
                    </div>
                    <h4 className="font-bold text-sm text-foreground">Building block castles & structures</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Leo worked cooperatively with Emily today to assemble a tall wooden tower. Showed great fine motor
                      coordination and shared blocks patiently.
                    </p>
                    <div className="flex gap-1.5 flex-wrap pt-1">
                      <span className="text-[9px] font-bold bg-primary/10 text-primary px-2 py-0.5 rounded-full uppercase">
                        Physical Development
                      </span>
                      <span className="text-[9px] font-bold bg-secondary/15 text-secondary-foreground px-2 py-0.5 rounded-full uppercase">
                        Social Interaction
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
