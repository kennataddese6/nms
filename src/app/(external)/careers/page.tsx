import { Briefcase, Sparkles } from "lucide-react";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export default function CareersPage() {
  const jobs = [
    { title: "Early Years Educator (Level 3)", type: "Full Time", room: "Toddlers Room" },
    { title: "Nursery Room Leader", type: "Full Time", room: "Babies Room" },
    { title: "Apprentice Nursery Practitioner", type: "Part Time / Full Time", room: "Nursery Floating Role" },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-primary/10 py-16 text-center">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight">
              Join Our Nursery Team
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Build a meaningful career in early childhood care and education. Work in a supportive and bubbly
              environment.
            </p>
          </div>
        </section>

        {/* Content */}
        <section className="py-16 sm:py-24 bg-card">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto space-y-6">
              <h2 className="text-2xl font-bold text-foreground mb-6">Current Job Openings</h2>
              {jobs.map((job) => (
                <div
                  key={job.title}
                  className="p-6 rounded-3xl border bg-background flex flex-col sm:flex-row justify-between sm:items-center gap-4 shadow-sm hover:border-primary/35 transition-colors"
                >
                  <div className="flex gap-4 items-start">
                    <div className="h-10 w-10 shrink-0 flex items-center justify-center rounded-xl bg-secondary/15 text-secondary-foreground">
                      <Briefcase className="h-5 w-5 stroke-[2]" />
                    </div>
                    <div>
                      <h3 className="font-bold text-foreground text-lg">{job.title}</h3>
                      <span className="text-xs text-muted-foreground">{job.room}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-accent/15 text-accent-foreground">
                      {job.type}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Placeholder info box */}
            <div className="mt-16 p-8 rounded-3xl bg-accent/10 border border-accent/20 text-center max-w-3xl mx-auto">
              <Sparkles className="h-8 w-8 text-accent-foreground mx-auto mb-4" />
              <h4 className="text-lg font-bold text-foreground mb-2">Online Application System Coming Soon</h4>
              <p className="text-muted-foreground text-sm">
                We are building our online recruitment system. Soon candidates can fill out direct registration forms,
                submit references, and upload CV files through this page.
              </p>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
