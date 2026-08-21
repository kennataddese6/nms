import { ArrowDown, Award, Briefcase, Heart, MapPin, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { ApplicationForm } from "./_components/application-form";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function CareersPage() {
  const supabase = await createClient();

  // Fetch dynamic job openings from database
  const { data: dbJobs } = await supabase.from("jobs").select("*").order("created_at", { ascending: false });

  const jobs = dbJobs || [];

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

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-50 text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-100 py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-yellow-300/30 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 text-sky-800 px-4 py-1.5 text-xs font-bold shadow-sm mb-4">
              <Heart className="h-4 w-4 text-pink-500 fill-pink-500" />
              Join Our Bubbly Family
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-sky-950 tracking-tight leading-[1.1]">
              Careers at Bubbly Day Nursery 💼
            </h1>
            <p className="mt-4 text-lg text-sky-900/80 max-w-2xl mx-auto leading-relaxed">
              We provide a supportive, warm, and highly professional environment where educators can flourish and shape
              the next generation.
            </p>
            <div className="mt-8">
              <Button
                asChild
                className="rounded-full px-8 font-bold bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white shadow-lg border-0 hover:scale-105 transition-all"
              >
                <a href="#apply-now" className="flex items-center gap-2">
                  Apply Online Now
                  <ArrowDown className="h-4 w-4" />
                </a>
              </Button>
            </div>
          </div>
        </section>

        {/* Benefits & Perks */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-bold rounded-full px-4 py-1.5 mb-4">
                🌟 Educator Benefits
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-foreground">Work Perks & Benefits 🌱</h2>
              <p className="mt-3 text-muted-foreground text-sm">
                We believe happy educators make happy children. We invest heavily in our practitioners&apos; careers and
                health.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {perks.map((perk) => (
                <div
                  key={perk.title}
                  className="p-6 rounded-3xl border-2 border-orange-200 bg-white/80 backdrop-blur-sm text-center shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="h-12 w-12 mx-auto flex items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mb-4 shadow-sm">
                    <perk.icon className="h-6 w-6" />
                  </div>
                  <h3 className="font-bold text-foreground text-lg mb-2">{perk.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{perk.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Active Openings Grid */}
        <section className="py-16 sm:py-24 bg-white/60 border-y border-orange-100">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <div className="inline-flex items-center gap-2 bg-emerald-100 border border-emerald-300 text-emerald-800 text-xs font-bold rounded-full px-4 py-1.5 mb-4">
                💼 Live Vacancies
              </div>
              <h2 className="font-heading text-3xl font-extrabold text-foreground">
                Current Job Openings ({jobs.length})
              </h2>
              <p className="mt-2 text-sm text-muted-foreground">All roles updated live by nursery administration.</p>
            </div>

            {jobs.length === 0 ? (
              <div className="text-center py-12 max-w-lg mx-auto bg-white p-8 rounded-3xl border border-orange-200 shadow-sm">
                <Sparkles className="h-10 w-10 text-orange-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-2">No active openings right now</h3>
                <p className="text-xs text-muted-foreground mb-6">
                  We are not currently advertising specific vacancies, but we are always excited to hear from passionate
                  Early Years practitioners!
                </p>
                <Button asChild variant="outline" className="rounded-full border-orange-300 text-orange-600">
                  <a href="#apply-now">Submit General Application</a>
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {jobs.map((job) => {
                  const reqArray = Array.isArray(job.requirements)
                    ? job.requirements
                    : typeof job.requirements === "string"
                      ? job.requirements
                          .split(/[,\n]/)
                          .map((r: string) => r.trim())
                          .filter(Boolean)
                      : [];

                  return (
                    <div
                      key={job.id || job.title}
                      className="p-8 rounded-3xl border-2 border-orange-200 bg-white flex flex-col justify-between shadow-sm hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div>
                        <div className="flex items-center justify-between gap-2 mb-4">
                          <span className="inline-block text-xs font-bold px-3 py-1 rounded-full bg-orange-100 text-orange-700">
                            {job.type}
                          </span>
                          {job.branch && (
                            <Badge
                              variant="outline"
                              className="text-[10px] font-bold border-teal-300 text-teal-700 bg-teal-50 flex items-center gap-1"
                            >
                              <MapPin className="h-3 w-3" /> {job.branch}
                            </Badge>
                          )}
                        </div>

                        <h3 className="text-xl font-extrabold text-foreground mb-2">{job.title}</h3>
                        {job.room && (
                          <div className="text-xs text-muted-foreground font-semibold italic mb-4">📍 {job.room}</div>
                        )}

                        <p className="text-muted-foreground text-sm mb-6 leading-relaxed">{job.description}</p>

                        {reqArray.length > 0 && (
                          <div className="space-y-2 mb-8 bg-orange-50/50 p-4 rounded-2xl border border-orange-100">
                            <h4 className="text-xs font-bold text-orange-950 uppercase tracking-wider">
                              Requirements:
                            </h4>
                            <ul className="space-y-1.5">
                              {reqArray.map((req: string, idx: number) => (
                                <li key={idx} className="flex gap-2 items-start text-xs text-muted-foreground">
                                  <div className="h-1.5 w-1.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                                  <span>{req}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <div className="border-t border-neutral-100 pt-6 flex flex-col gap-4">
                        <div className="text-base font-black text-orange-600">{job.salary}</div>
                        <Button
                          asChild
                          className="w-full rounded-full font-bold bg-gradient-to-r from-orange-400 to-pink-500 hover:from-orange-500 hover:to-pink-600 text-white border-0 shadow-md"
                        >
                          <a href="#apply-now">Apply for Role</a>
                        </Button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* Application Form Section */}
        <section id="apply-now" className="py-16 sm:py-24 scroll-mt-16">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="max-w-2xl mx-auto p-8 rounded-3xl border-2 border-orange-200 bg-white shadow-lg">
              <div className="text-center mb-8">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-100 text-orange-600 mx-auto mb-3 shadow-sm">
                  <Briefcase className="h-6 w-6" />
                </div>
                <h2 className="font-heading text-2xl font-black text-foreground">Online Job Application</h2>
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
