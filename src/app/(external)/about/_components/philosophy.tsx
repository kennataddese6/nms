import { Compass, Eye, Heart, Smile } from "lucide-react";

export function Philosophy() {
  const pillars = [
    {
      icon: Heart,
      title: "Nurturing Care",
      desc: "Creating an emotionally safe and warm space that builds strong relationships, trust, and individual self-esteem.",
      color: "text-primary bg-primary/10",
    },
    {
      icon: Compass,
      title: "Play-Based Discovery",
      desc: "Fostering active exploration and natural curiosity through creative mess play, sensory toys, and physical outdoor garden tasks.",
      color: "text-secondary-foreground bg-secondary/15",
    },
    {
      icon: Smile,
      title: "Inclusive Community",
      desc: "Promoting social skills, empathy, respect, and diversity in a collaborative peer learning environment.",
      color: "text-accent-foreground bg-accent/20",
    },
    {
      icon: Eye,
      title: "EYFS Framework Tracking",
      desc: "Ensuring daily childcare milestones align exactly with UK educational standards, structured under clear practitioner observations.",
      color: "text-destructive bg-destructive/10",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Our Early Years Philosophy
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We structure our daily sessions around four key pillars to deliver a well-rounded foundation for child
            development.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          {pillars.map((pillar) => (
            <div
              key={pillar.title}
              className="p-8 rounded-3xl border bg-background shadow-sm hover:shadow-md transition-shadow flex gap-5"
            >
              <div className={`h-12 w-12 shrink-0 flex items-center justify-center rounded-2xl ${pillar.color}`}>
                <pillar.icon className="h-6 w-6 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-foreground mb-2">{pillar.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{pillar.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
