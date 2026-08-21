import { Award, HeartHandshake, Lock, ShieldCheck } from "lucide-react";

export function Safeguarding() {
  const safetyPoints = [
    {
      icon: ShieldCheck,
      title: "Ofsted Registered Care",
      desc: "Fully compliant with UK Early Years register standards, undergoing regular evaluations to verify top-tier quality care.",
      cardBg: "bg-emerald-50/80 dark:bg-emerald-950/30",
      border: "border-2 border-emerald-200 dark:border-emerald-800/40",
      iconColor: "text-emerald-600 dark:text-emerald-400",
    },
    {
      icon: Lock,
      title: "Secure Access Nursery",
      desc: "Monitored visitor gates, digital check-in/out records for guardians, and CCTV protection across all classrooms.",
      cardBg: "bg-sky-50/80 dark:bg-sky-950/30",
      border: "border-2 border-sky-200 dark:border-sky-800/40",
      iconColor: "text-sky-600 dark:text-sky-400",
    },
    {
      icon: Award,
      title: "First-Aid Certified Team",
      desc: "100% of our room leaders and practitioners hold current Pediatric First Aid (PFA) certifications.",
      cardBg: "bg-amber-50/80 dark:bg-amber-950/30",
      border: "border-2 border-amber-200 dark:border-amber-800/40",
      iconColor: "text-amber-600 dark:text-amber-400",
    },
    {
      icon: HeartHandshake,
      title: "Comprehensive Safeguarding",
      desc: "Robust child protection audits, strict background checks (DBS), and regular policy reviews to maintain safe environments.",
      cardBg: "bg-rose-50/80 dark:bg-rose-950/30",
      border: "border-2 border-rose-200 dark:border-rose-800/40",
      iconColor: "text-rose-600 dark:text-rose-400",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-5xl mx-auto">
          {/* Header text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider text-emerald-800 bg-emerald-100 border border-emerald-300 px-3.5 py-1.5 rounded-full">
              <ShieldCheck className="h-4 w-4 text-emerald-600" /> Safety & Child Protection
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-black text-foreground tracking-tight leading-[1.2]">
              Our Safeguarding Commitment 🛡️
            </h2>
            <p className="text-muted-foreground text-sm sm:text-base leading-relaxed">
              Nothing is more important than your child's safety and well-being. We implement strict, Ofsted-compliant
              processes to ensure our classrooms, garden spaces, and entry gates remain secure, sanitary, and
              supportive.
            </p>
          </div>

          {/* Cards grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {safetyPoints.map((point) => (
              <div
                key={point.title}
                className={`p-6 rounded-3xl ${point.cardBg} ${point.border} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
              >
                <div className="h-12 w-12 rounded-2xl bg-white dark:bg-neutral-900 border shadow-sm flex items-center justify-center mb-4">
                  <point.icon className={`h-6 w-6 stroke-[2.5] ${point.iconColor}`} />
                </div>
                <h3 className="font-black text-foreground text-lg mb-2">{point.title}</h3>
                <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
