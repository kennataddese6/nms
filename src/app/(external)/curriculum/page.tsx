import { BookOpen, Compass, Heart, MessageSquare, Palette, PenTool, Shield, Sparkles, Star, Trophy } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";

export default function CurriculumPage() {
  const primeAreas = [
    {
      icon: MessageSquare,
      title: "Communication & Language",
      desc: "Nurturing baby babbling, speech mimicry, listening habits, and storytelling confidence through interactive daily circles.",
      badge: "Language & Speech",
      colorScheme: {
        cardBg: "bg-gradient-to-br from-orange-50 to-amber-50/60 dark:from-orange-950/30 dark:to-amber-950/20",
        border: "border-2 border-orange-200/80 dark:border-orange-800/40",
        iconBg: "bg-orange-500 text-white shadow-lg shadow-orange-500/30",
        badgeBg: "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/40 dark:text-orange-200",
        accentText: "text-orange-600 dark:text-orange-400",
      },
    },
    {
      icon: Heart,
      title: "Personal, Social & Emotional",
      desc: "Developing self-regulation, empathy, peer relationships, sharing habits, and emotional resilience in a supportive community.",
      badge: "Emotional Wellbeing",
      colorScheme: {
        cardBg: "bg-gradient-to-br from-rose-50 to-pink-50/60 dark:from-rose-950/30 dark:to-pink-950/20",
        border: "border-2 border-rose-200/80 dark:border-rose-800/40",
        iconBg: "bg-rose-500 text-white shadow-lg shadow-rose-500/30",
        badgeBg: "bg-rose-100 text-rose-800 border-rose-200 dark:bg-rose-900/40 dark:text-rose-200",
        accentText: "text-rose-600 dark:text-rose-400",
      },
    },
    {
      icon: Shield,
      title: "Physical Development",
      desc: "Supporting gross motor skills (climbing, running, soft play balance) and fine motor precision (clay work, early grip control).",
      badge: "Motor Skills & Health",
      colorScheme: {
        cardBg: "bg-gradient-to-br from-emerald-50 to-teal-50/60 dark:from-emerald-950/30 dark:to-teal-950/20",
        border: "border-2 border-teal-200/80 dark:border-teal-800/40",
        iconBg: "bg-teal-600 text-white shadow-lg shadow-teal-600/30",
        badgeBg: "bg-teal-100 text-teal-800 border-teal-200 dark:bg-teal-900/40 dark:text-teal-200",
        accentText: "text-teal-600 dark:text-teal-400",
      },
    },
  ];

  const specificAreas = [
    {
      icon: BookOpen,
      title: "Literacy",
      desc: "Phonics fun, letter sounds, daily storytime, and early mark-making to inspire a lifelong love for reading.",
      badge: "Phonics & Stories",
      colorScheme: {
        cardBg: "bg-gradient-to-br from-sky-50 to-blue-50/60 dark:from-sky-950/30 dark:to-blue-950/20",
        border: "border-2 border-sky-200/80 dark:border-sky-800/40",
        iconBg: "bg-sky-500 text-white shadow-md shadow-sky-500/25",
        badgeBg: "bg-sky-100 text-sky-800 border-sky-200",
      },
    },
    {
      icon: Compass,
      title: "Mathematics",
      desc: "Counting blocks, identifying geometric shapes, weight sorting, and recognizing fun mathematical patterns.",
      badge: "Numbers & Logic",
      colorScheme: {
        cardBg: "bg-gradient-to-br from-purple-50 to-indigo-50/60 dark:from-purple-950/30 dark:to-indigo-950/20",
        border: "border-2 border-purple-200/80 dark:border-purple-800/40",
        iconBg: "bg-purple-600 text-white shadow-md shadow-purple-600/25",
        badgeBg: "bg-purple-100 text-purple-800 border-purple-200",
      },
    },
    {
      icon: PenTool,
      title: "Understanding the World",
      desc: "Sensory nature walks, planting seeds, weather observation, and discovering diverse communities and cultures.",
      badge: "Science & Nature",
      colorScheme: {
        cardBg: "bg-gradient-to-br from-green-50 to-emerald-50/60 dark:from-green-950/30 dark:to-emerald-950/20",
        border: "border-2 border-green-200/80 dark:border-green-800/40",
        iconBg: "bg-emerald-600 text-white shadow-md shadow-emerald-600/25",
        badgeBg: "bg-green-100 text-green-800 border-green-200",
      },
    },
    {
      icon: Palette,
      title: "Expressive Arts & Design",
      desc: "Puppet plays, costume dress-ups, finger painting, messy art, and nursery rhythm and movement sessions.",
      badge: "Art, Music & Play",
      colorScheme: {
        cardBg: "bg-gradient-to-br from-amber-50 to-yellow-50/60 dark:from-amber-950/30 dark:to-yellow-950/20",
        border: "border-2 border-amber-200/80 dark:border-amber-800/40",
        iconBg: "bg-amber-500 text-white shadow-md shadow-amber-500/25",
        badgeBg: "bg-amber-100 text-amber-800 border-amber-200",
      },
    },
  ];

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground animate-fade-in">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Colorful Hero Banner */}
        <section className="relative overflow-hidden bg-gradient-to-b from-orange-100/70 via-amber-50/40 to-background py-16 sm:py-24 text-center dark:from-orange-950/30 dark:via-amber-950/20">
          <div className="absolute top-10 left-10 h-64 w-64 rounded-full bg-amber-400/20 blur-3xl" />
          <div className="absolute bottom-10 right-10 h-72 w-72 rounded-full bg-teal-400/20 blur-3xl" />
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-rose-400/15 blur-3xl" />

          <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="inline-flex items-center gap-2 rounded-full border border-orange-300 bg-orange-100 px-4 py-1.5 text-xs font-black text-orange-800 shadow-sm dark:bg-orange-900/50 dark:text-orange-200 mb-6">
              <Sparkles className="h-4 w-4 text-orange-600 animate-spin" />
              Play-Based EYFS Excellence Framework
            </div>

            <h1 className="font-heading text-4xl sm:text-6xl font-black text-foreground tracking-tight leading-[1.1]">
              Inspiring Young Minds Through{" "}
              <span className="bg-gradient-to-r from-orange-600 via-amber-500 to-teal-600 bg-clip-text text-transparent">
                Play & Discovery
              </span>{" "}
              🌈
            </h1>

            <p className="mt-6 text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Our educational program follows the UK Early Years Foundation Stage (EYFS), creating joyful, vibrant learning environments across 7 essential developmental milestones.
            </p>

            {/* Age Stages Highlights */}
            <div className="mt-12 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border-2 border-orange-200 shadow-sm flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-xl bg-orange-500 text-white flex items-center justify-center font-black text-lg">
                  👶
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-foreground">Babies (3 - 12 months)</h4>
                  <p className="text-[11px] text-muted-foreground">Sensory exploration & nurture</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border-2 border-teal-200 shadow-sm flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-black text-lg">
                  🐥
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-foreground">Toddlers (1 - 2 years)</h4>
                  <p className="text-[11px] text-muted-foreground">Active play & speech building</p>
                </div>
              </div>

              <div className="p-4 rounded-2xl bg-white/80 dark:bg-neutral-900/80 border-2 border-rose-200 shadow-sm flex items-center gap-3 text-left">
                <div className="h-10 w-10 rounded-xl bg-rose-500 text-white flex items-center justify-center font-black text-lg">
                  🎨
                </div>
                <div>
                  <h4 className="font-extrabold text-xs text-foreground">Preschool (3 - 5 years)</h4>
                  <p className="text-[11px] text-muted-foreground">Phonics, math & school readiness</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* The 3 Prime Areas */}
        <section className="py-16 sm:py-24 bg-background">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 border border-orange-200 px-3 py-1 rounded-full mb-3">
                <Star className="h-3.5 w-3.5 fill-orange-500 text-orange-500" /> Essential Foundations
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
                The 3 Prime Areas of Learning 🌟
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                These core pillars spark curiosity, build physical confidence, and cultivate healthy social skills right from infancy.
              </p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
              {primeAreas.map((area) => (
                <div
                  key={area.title}
                  className={`p-8 rounded-3xl ${area.colorScheme.cardBg} ${area.colorScheme.border} flex flex-col justify-between text-left shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-6">
                      <div className={`h-14 w-14 flex items-center justify-center rounded-2xl ${area.colorScheme.iconBg}`}>
                        <area.icon className="h-7 w-7 stroke-[2.5]" />
                      </div>
                      <Badge variant="outline" className={`text-[10px] font-extrabold ${area.colorScheme.badgeBg}`}>
                        {area.badge}
                      </Badge>
                    </div>

                    <h3 className="font-black text-xl text-foreground mb-3">{area.title}</h3>
                    <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{area.desc}</p>
                  </div>

                  <div className="mt-8 pt-4 border-t border-black/5 dark:border-white/10 flex items-center justify-between text-xs font-bold">
                    <span className={area.colorScheme.accentText}>Key EYFS Milestone</span>
                    <span className="text-muted-foreground">Daily Focus</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* The 4 Specific Areas */}
        <section className="py-16 sm:py-24 bg-gradient-to-b from-teal-50/50 via-background to-orange-50/40 dark:from-teal-950/20 dark:to-orange-950/20 border-y">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-teal-700 bg-teal-100 border border-teal-200 px-3 py-1 rounded-full mb-3">
                <Trophy className="h-3.5 w-3.5 text-teal-600" /> Academic & Creative Growth
              </span>
              <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground">
                The 4 Specific Areas 🚀
              </h2>
              <p className="mt-4 text-base text-muted-foreground leading-relaxed">
                These enriched learning paths develop early literacy, mathematical reasoning, scientific curiosity, and artistic expression.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {specificAreas.map((area) => (
                <div
                  key={area.title}
                  className={`p-6 rounded-3xl ${area.colorScheme.cardBg} ${area.colorScheme.border} flex flex-col justify-between shadow-md hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300`}
                >
                  <div>
                    <div className="flex items-center justify-between mb-4">
                      <div className={`h-12 w-12 flex items-center justify-center rounded-2xl ${area.colorScheme.iconBg}`}>
                        <area.icon className="h-6 w-6 stroke-[2.5]" />
                      </div>
                      <Badge variant="outline" className={`text-[9px] font-black ${area.colorScheme.badgeBg}`}>
                        {area.badge}
                      </Badge>
                    </div>

                    <h3 className="font-extrabold text-foreground text-base mb-2">{area.title}</h3>
                    <p className="text-muted-foreground text-xs leading-relaxed">{area.desc}</p>
                  </div>

                  <div className="mt-6 pt-3 border-t border-black/5 dark:border-white/10 text-[11px] font-bold text-muted-foreground flex items-center justify-between">
                    <span>EYFS Specific</span>
                    <span className="text-emerald-600">✓ Enriched</span>
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
                <span className="text-xs font-black text-orange-600 bg-orange-100 border border-orange-200 px-3 py-1 rounded-full uppercase tracking-wider inline-block">
                  📸 Real-Time Progress Logs
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-foreground leading-tight">
                  How We Track & Share Learning Milestones 📲
                </h2>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Every child at Bubbly Day Nursery has a private digital **Learning Journal**. Practitioners record play achievements and photo observations live, sharing moments directly with parents.
                </p>

                <div className="space-y-4">
                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-orange-50 dark:bg-orange-950/30 border border-orange-200/80">
                    <div className="h-8 w-8 rounded-xl bg-orange-500 text-white font-bold flex items-center justify-center shrink-0">
                      📸
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Photo & Video Snapshots</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Real-time snapshots of artwork, sandbox builds, and outdoor discoveries delivered directly to parents.
                      </p>
                    </div>
                  </div>

                  <div className="flex gap-4 items-start p-4 rounded-2xl bg-teal-50 dark:bg-teal-950/30 border border-teal-200/80">
                    <div className="h-8 w-8 rounded-xl bg-teal-600 text-white font-bold flex items-center justify-center shrink-0">
                      💬
                    </div>
                    <div>
                      <h4 className="font-bold text-sm text-foreground">Two-Way Home Feedback</h4>
                      <p className="text-xs text-muted-foreground mt-0.5 leading-relaxed">
                        Parents can upload home milestone photos, comment on nursery observations, and co-author reports.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Graphical Journal Mockup Card */}
              <div className="lg:col-span-7 p-8 rounded-3xl border-2 border-orange-200 bg-gradient-to-br from-white via-orange-50/40 to-amber-50/50 dark:from-neutral-900 dark:to-neutral-950 shadow-xl space-y-4 relative overflow-hidden">
                <div className="flex items-center justify-between border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div className="h-9 w-9 rounded-full bg-orange-500 text-white font-black flex items-center justify-center text-sm shadow-md">
                      BD
                    </div>
                    <div>
                      <h4 className="font-black text-sm text-foreground">Bubbly Journal Sample</h4>
                      <p className="text-[10px] text-muted-foreground font-semibold">Live Parent Portal Update</p>
                    </div>
                  </div>
                  <Badge className="bg-emerald-500 text-white text-[10px] font-bold">
                    ✓ Verified EYFS
                  </Badge>
                </div>

                <div className="space-y-3">
                  <div className="p-4 rounded-2xl border-2 border-orange-100 bg-white dark:bg-neutral-900 space-y-2 shadow-sm">
                    <div className="flex items-center justify-between text-[10px] text-muted-foreground font-bold">
                      <span className="text-orange-600 uppercase tracking-wider">🌟 Observation Log</span>
                      <span>Today • 10:30 AM</span>
                    </div>
                    <h4 className="font-extrabold text-sm text-foreground">Architectural Block Tower & Co-op Play 🏰</h4>
                    <p className="text-xs text-muted-foreground leading-relaxed">
                      Leo worked cooperatively with Emily to assemble a tall 12-block wooden tower. Showed great fine motor coordination and shared blocks patiently.
                    </p>
                    <div className="flex gap-2 flex-wrap pt-1">
                      <Badge variant="secondary" className="text-[9px] font-bold bg-orange-100 text-orange-800 border-orange-200">
                        Physical Development
                      </Badge>
                      <Badge variant="secondary" className="text-[9px] font-bold bg-teal-100 text-teal-800 border-teal-200">
                        Social Interaction
                      </Badge>
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
