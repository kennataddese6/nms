import { ArrowDown, Award, Briefcase, Heart } from "lucide-react";

import { Button } from "@/components/ui/button";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { ApplicationForm } from "./_components/application-form";

export default function CareersPage() {
  const perks = [
    {
      icon: Award,
      title: "Funded Training",
      desc: "We fund childcare certifications (Level 3/4, PFA first-aid) to support your career growth.",
    },
    {
      icon: Heart,
      title: "Health & Wellbeing",
      desc: "Mental health days, free fresh snacks/lunches daily, and private medical advice support.",
    },
    {
      icon: Briefcase,
      title: "Career Progression",
      desc: "Clear promotion tracks from practitioner to room leader and deputy manager roles.",
    },
  ];

  const jobs = [
    {
      title: "Early Years Educator (Level 3)",
      type: "Full Time (40 hrs)",
      salary: "£26,000 - £29,500 / year",
      room: "Toddlers Room",
      desc: "Nurturing creative play, language progression, and sensory activities for children aged 2-3 years.",
      requirements: [
        "NVQ Level 3 in Early Years/Childcare",
        "Current DBS check (or willing to undergo one)",
        "Pediatric First Aid",
      ],
    },
    {
      title: "Nursery Room Leader",
      type: "Full Time (40 hrs)",
      salary: "£30,000 - £34,000 / year",
      room: "Babies Room",
      desc: "Leading infant practitioners, coordinating sleeping routine matching, and monitoring room ratio metrics.",
      requirements: ["NVQ Level 3 or higher", "Minimum 2 years nursery leadership experience", "Pediatric First Aid"],
    },
    {
      title: "Apprentice Nursery Practitioner",
      type: "Part Time or Full Time",
      salary: "£18,000 - £21,000 / year",
      room: "Nursery Floating Role",
      desc: "Hands-on learning under qualified leaders while earning your certified Level 3 childcare qualifications.",
      requirements: ["Passionate about child development", "Strong work ethic and communication skills"],
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-primary/10 py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-4 py-1.5 text-xs font-semibold mb-4">
              <Heart className="h-4 w-4" />
              Join Our Bubbly Family
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Careers at Bubbly Day Nursery
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              We provide a supportive, warm, and highly professional environment where educators can flourish and shape
              the next generation.
            </p>
            <div className="mt-8">
              <Button asChild className="rounded-full px-6">
                <a href="#apply-now" className="flex items-center gap-2">
                  Apply Online Now
                  <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="font-heading text-3xl font-extrabold text-foreground">Work Perks & Benefits</h2>
              <p className="mt-3 text-muted-foreground text-sm">
                We believe happy educators make happy children. We invest heavily in our practitioners' careers and
                health.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {perks.map((perk) => (
                <div key={perk.title} className="p-6 rounded-3xl border bg-card text-center shadow-sm">
                  <div className="h-10 w-10 mx-auto flex items-center justify-center rounded-xl bg-secondary/15 text-secondary-foreground mb-4">
                    <perk.icon className="h-5 w-5" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{perk.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Active Openings Grid */}
        <section className="py-16 sm:py-24 bg-card border-y">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <h2 className="font-heading text-3xl font-extrabold text-foreground text-center mb-16">
              Current Job Openings
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {jobs.map((job) => (
                <div
                  key={job.title}
                  className="p-8 rounded-3xl border bg-background flex flex-col justify-between shadow-sm"
                >
                  <div>
                    <span className="inline-block text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent/15 text-accent-foreground mb-4">
                      {job.type}
                    </span>
                    <h3 className="text-xl font-bold text-foreground mb-2">{job.title}</h3>
                    <div className="text-xs text-muted-foreground italic mb-4">{job.room}</div>

                    <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{job.desc}</p>

                    <div className="space-y-2 mb-8">
                      <h4 className="text-xs font-bold text-foreground uppercase tracking-wider">Requirements:</h4>
                      <ul className="space-y-1.5">
                        {job.requirements.map((req) => (
                          <li key={req} className="flex gap-2 items-center text-xs text-muted-foreground">
                            <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  <div className="border-t pt-6 flex flex-col gap-4">
                    <div className="text-sm font-black text-primary">{job.salary}</div>
                    <Button asChild variant="outline" className="w-full rounded-full">
                      <a href="#apply-now">Apply for Role</a>
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Application Form Section */}
        <section id="apply-now" className="py-16 sm:py-24 bg-background scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto p-8 rounded-3xl border bg-card shadow-sm">
              <div className="text-center mb-8">
                <Briefcase className="h-8 w-8 text-primary mx-auto mb-3" />
                <h2 className="font-heading text-2xl font-bold text-foreground">Online Job Application</h2>
                <p className="text-muted-foreground text-xs leading-relaxed mt-2">
                  Please submit your CV/Resume and details below. We review all applications and coordinate interviews
                  within 5 working days.
                </p>
              </div>
              <ApplicationForm />
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
