import { Compass, Eye, Heart, Smile } from "lucide-react";

export function Philosophy() {
  const pillars = [
    {
      icon: Heart,
      title: "Nurturing Care & Wellbeing",
      desc: "Creating an emotionally safe and warm environment that builds strong relationships, mutual trust, and healthy individual self-esteem.",
      cardBg: "bg-gradient-to-br from-orange-50 to-amber-50/60 dark:from-orange-950/30 dark:to-amber-950/20",
      border: "border-2 border-orange-200/80 dark:border-orange-800/40",
      iconBg: "bg-orange-500 text-white shadow-md shadow-orange-500/25",
    },
    {
      icon: Compass,
      title: "Play-Based Discovery",
      desc: "Fostering active exploration and natural curiosity through creative mess play, sensory toys, and physical outdoor garden activities.",
      cardBg: "bg-gradient-to-br from-teal-50 to-emerald-50/60 dark:from-teal-950/30 dark:to-emerald-950/20",
      border: "border-2 border-teal-200/80 dark:border-teal-800/40",
      iconBg: "bg-teal-600 text-white shadow-md shadow-teal-600/25",
    },
    {
      icon: Smile,
      title: "Inclusive Community",
      desc: "Promoting social skills, empathy, respect, and diversity in a collaborative peer learning environment where every child belongs.",
      cardBg: "bg-gradient-to-br from-rose-50 to-pink-50/60 dark:from-rose-950/30 dark:to-pink-950/20",
      border: "border-2 border-rose-200/80 dark:border-rose-800/40",
      iconBg: "bg-rose-500 text-white shadow-md shadow-rose-500/25",
    },
    {
      icon: Eye,
      title: "EYFS Framework Tracking",
      desc: "Ensuring daily childcare milestones align with UK educational standards, structured under clear practitioner observations and progress logs.",
      cardBg: "bg-gradient-to-br from-sky-50 to-blue-50/60 dark:from-sky-950/30 dark:to-blue-950/20",
      border: "border-2 border-sky-200/80 dark:border-sky-800/40",
      iconBg: "bg-sky-500 text-white shadow-md shadow-sky-500/25",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-orange-600 bg-orange-100 border border-orange-200 px-3 py-1 rounded-full mb-3">
            ✨ Core Guiding Pillars
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Our Early Years Philosophy 🎨
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            We structure our daily sessions around four key pillars to deliver a well-rounded, joyful foundation for child development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className={`p-8 rounded-3xl ${pillar.cardBg} ${pillar.border} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-5`}
            >
              <div className={`h-14 w-14 shrink-0 flex items-center justify-center rounded-2xl ${pillar.iconBg}`}>
                <pillar.icon className="h-7 w-7 stroke-[2.5]" />
              </div>
              <div>
                <h3 className="text-xl font-black text-foreground mb-2">{pillar.title}</h3>
                <p className="text-muted-foreground text-xs sm:text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
