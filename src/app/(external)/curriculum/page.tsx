import { GraduationCap, Sparkles } from "lucide-react";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export default function CurriculumPage() {
  const areas = [
    {
      title: "Communication & Language",
      desc: "Building speaking, vocabulary, and active listening skills through storytelling, music, and classroom interactions.",
    },
    {
      title: "Physical Development",
      desc: "Sensory outdoor environments and physical play tasks that develop both gross and fine motor coordination.",
    },
    {
      title: "Personal, Social & Emotional",
      desc: "Promoting self-confidence, emotional regulation, peer friendships, and cooperative play values.",
    },
    {
      title: "Literacy & Mathematics",
      desc: "Early letter recognition, phonics games, shapes, sorting activities, and number concepts.",
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
              Our EYFS Curriculum
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              How we nurture, track, and support early child development under the UK Early Years Foundation Stage
              (EYFS) guidelines.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 sm:py-24 bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
              {areas.map((area) => (
                <div key={area.title} className="p-8 rounded-3xl border bg-background flex gap-4 items-start shadow-sm">
                  <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-secondary/15 text-secondary-foreground">
                    <GraduationCap className="h-5 w-5 stroke-[2]" />
                  </div>
                  <div>
                    <h3 className="text-xl font-bold text-foreground mb-2">{area.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{area.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Placeholder info box */}
            <div className="mt-16 p-8 rounded-3xl bg-accent/10 border border-accent/20 text-center max-w-3xl mx-auto">
              <Sparkles className="h-8 w-8 text-accent-foreground mx-auto mb-4" />
              <h4 className="text-lg font-bold text-foreground mb-2">Development Tracking Tools Coming Soon</h4>
              <p className="text-muted-foreground text-sm">
                Our learning journal dashboard is under development. Soon, parents can log in to check observations,
                download progress charts, and coordinate milestone tracking directly with staff practitioners.
              </p>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
