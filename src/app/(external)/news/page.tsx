import Link from "next/link";
import Image from "next/image";
import { Calendar, Download, FileText, MapPin, Newspaper, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { createClient } from "@/lib/supabase/server";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function NewsPage() {
  const supabase = await createClient();

  // Fetch live news & events from database
  const { data: posts } = await supabase
    .from("news_events")
    .select("*")
    .order("created_at", { ascending: false });

  const newsEvents = posts || [];

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-50 text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-100 py-16 sm:py-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-yellow-300/30 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-pink-300/20 blur-3xl" />

          {/* Floating decorations */}
          <span aria-hidden="true" className="absolute top-6 left-10 text-3xl pointer-events-none select-none nursery-twinkle opacity-60 hidden sm:block">⭐</span>
          <span aria-hidden="true" className="absolute top-10 right-12 text-3xl pointer-events-none select-none nursery-float opacity-60 hidden sm:block" style={{ animationDelay: "0.8s" }}>📰</span>
          <span aria-hidden="true" className="absolute bottom-6 left-1/4 text-2xl pointer-events-none select-none nursery-wiggle opacity-50 hidden md:block">🎈</span>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 text-sky-800 px-4 py-1.5 text-xs font-bold shadow-sm mb-4">
              <Newspaper className="h-4 w-4 text-orange-500" />
              Nursery Bulletin
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-sky-950 tracking-tight leading-[1.1]">
              News & Upcoming Events 📢
            </h1>
            <p className="mt-4 text-lg text-sky-900/80 max-w-2xl mx-auto leading-relaxed">
              Stay up to date with Bubbly Day Nursery announcements, open days, holiday schedules, and learning celebrations across our settings.
            </p>
          </div>
        </section>

        {/* News & Events Grid */}
        <section className="py-12 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-bold rounded-full px-4 py-1.5 mb-3">
                🌟 Latest Updates
              </div>
              <h2 className="font-heading text-3xl font-black text-foreground">What&apos;s Happening at Bubbly</h2>
              <p className="text-sm text-muted-foreground mt-2">
                Published updates directly from nursery management.
              </p>
            </div>

            {newsEvents.length === 0 ? (
              <div className="text-center py-16 max-w-lg mx-auto bg-white/80 backdrop-blur-sm p-8 rounded-3xl border-2 border-orange-200 shadow-sm">
                <Sparkles className="h-10 w-10 text-orange-400 mx-auto mb-3" />
                <h3 className="text-lg font-bold text-foreground mb-2">No news items posted yet</h3>
                <p className="text-xs text-muted-foreground">
                  Check back soon for upcoming nursery events, open days, and monthly newsletters!
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {newsEvents.map((post) => {
                  const isPdf = post.image_url?.toLowerCase().endsWith(".pdf");
                  const createdDateStr = post.created_at
                    ? new Date(post.created_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })
                    : "";

                  return (
                    <div
                      key={post.id}
                      className="p-7 rounded-3xl border-2 border-orange-200 bg-white/90 backdrop-blur-sm flex flex-col justify-between shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                    >
                      <div>
                        {/* Badges Bar */}
                        <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                          <span
                            className={`inline-flex items-center gap-1 text-xs font-black px-3 py-1 rounded-full ${
                              post.category === "event"
                                ? "bg-purple-100 text-purple-800 border border-purple-300"
                                : "bg-orange-100 text-orange-800 border border-orange-300"
                            }`}
                          >
                            {post.category === "event" ? "📅 Event" : "📰 News"}
                          </span>

                          {post.branch && (
                            <Badge variant="outline" className="text-[10px] font-bold border-teal-300 text-teal-700 bg-teal-50 flex items-center gap-1">
                              <MapPin className="h-3 w-3" /> {post.branch}
                            </Badge>
                          )}
                        </div>

                        {/* Title */}
                        <h3 className="text-xl font-extrabold text-foreground mb-3 leading-snug">
                          {post.title}
                        </h3>

                        {/* Dates */}
                        {(post.event_date || createdDateStr) && (
                          <div className="flex items-center gap-2 text-xs font-bold text-sky-800 mb-4 bg-sky-50 border border-sky-200 p-2.5 rounded-2xl">
                            <Calendar className="h-4 w-4 text-sky-600 shrink-0" />
                            {post.event_date ? (
                              <span>Event Date: <strong>{post.event_date}</strong></span>
                            ) : (
                              <span>Posted on {createdDateStr}</span>
                            )}
                          </div>
                        )}

                        {/* Content text */}
                        <div className="text-foreground/80 text-sm leading-relaxed whitespace-pre-line mb-6">
                          {post.content}
                        </div>

                        {/* Media Attachment */}
                        {post.image_url && (
                          <div className="mt-4 mb-6">
                            {isPdf ? (
                              <a
                                href={post.image_url}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center justify-between p-3.5 rounded-2xl bg-orange-50 border-2 border-orange-200 hover:bg-orange-100 transition-colors group"
                              >
                                <div className="flex items-center gap-2.5 text-xs font-bold text-orange-950">
                                  <FileText className="h-5 w-5 text-orange-500" />
                                  <span>Download Event Flyer (PDF)</span>
                                </div>
                                <Download className="h-4 w-4 text-orange-500 group-hover:translate-y-0.5 transition-transform" />
                              </a>
                            ) : (
                              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border-2 border-orange-100 shadow-sm">
                                <Image
                                  src={post.image_url}
                                  alt={post.title}
                                  fill
                                  unoptimized
                                  className="object-cover"
                                  sizes="(max-width: 768px) 90vw, 33vw"
                                />
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Footer Link */}
                      <div className="border-t border-orange-100 pt-4 flex items-center justify-between text-xs font-bold text-muted-foreground">
                        <span>Bubbly Day Nursery</span>
                        <a href="/contact" className="text-orange-600 hover:underline flex items-center gap-1">
                          Enquire / Visit →
                        </a>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA section */}
        <section className="py-12 bg-white/70 border-t border-orange-100 text-center">
          <div className="mx-auto max-w-4xl px-4">
            <h3 className="text-2xl font-black text-foreground mb-3">Want to stay updated?</h3>
            <p className="text-sm text-muted-foreground mb-6">
              Follow our news bulletin or schedule a personal visit to meet our team.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <Button asChild size="lg" className="rounded-full px-8 font-bold bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md hover:scale-105 transition-all">
                <Link href="/contact?tour=true">🎒 Book a Nursery Tour</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="rounded-full px-8 font-bold border-2">
                <Link href="/contact">✉️ Send Enquiry</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
