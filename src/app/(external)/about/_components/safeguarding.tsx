import { Award, HeartHandshake, Lock, ShieldCheck } from "lucide-react";

export function Safeguarding() {
  const safetyPoints = [
    {
      icon: ShieldCheck,
      title: "Ofsted Registered Care",
      desc: "Fully compliant with the UK Early Years register standards, undergoing regular evaluations to verify quality care.",
    },
    {
      icon: Lock,
      title: "Secure Access Nursery",
      desc: "Monitored visitor gates, digital check-in/out records for guardians, and CCTV protection across classrooms.",
    },
    {
      icon: Award,
      title: "First-Aid Certified Team",
      desc: "100% of our room leaders and practitioners hold current Pediatric First Aid (PFA) certifications.",
    },
    {
      icon: HeartHandshake,
      title: "Comprehensive Safeguarding",
      desc: "Robust child protection audits, strict background checks (DBS), and regular policy reviews to maintain safe rooms.",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-background">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center max-w-5xl mx-auto">
          {/* Header text */}
          <div className="lg:col-span-5 space-y-6">
            <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-accent/20 text-accent-foreground">
              Safety & Protection
            </span>
            <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight leading-[1.2]">
              Our Uncompromising Safeguarding Commitment
            </h2>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Nothing is more important than your child's safety and well-being. We implement strict, Ofsted-compliant
              processes to ensure our classrooms, gardens, and entries remain secure, sanitary, and supportive
              environment.
            </p>
          </div>

          {/* Cards grid */}
          <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {safetyPoints.map((point) => (
              <div key={point.title} className="p-6 rounded-3xl border bg-card shadow-sm">
                <point.icon className="h-8 w-8 text-primary mb-4 stroke-[2]" />
                <h3 className="font-bold text-foreground text-base mb-2">{point.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed">{point.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
