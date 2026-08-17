import { Apple, ShieldCheck, Sparkles, Trees } from "lucide-react";

export function Highlights() {
  const items = [
    {
      icon: Sparkles,
      title: "Play-Based Learning",
      description:
        "Our curriculum focuses on child-led play, ensuring toddlers build natural curiosity, communication, and cognitive skills.",
      bgColor: "bg-primary/10 text-primary",
      cardBg: "hover:bg-primary/5",
    },
    {
      icon: ShieldCheck,
      title: "Ofsted & DBS Cleared Staff",
      description:
        "Your child’s safety comes first — all our staff are fully DBS checked and vetted. Our nursery operates with strict safeguarding compliance, security, and child-to-staff ratios.",
      bgColor: "bg-secondary/10 text-secondary-foreground",
      cardBg: "hover:bg-secondary/5",
    },
    {
      icon: Apple,
      title: "Healthy & Balanced Meals",
      description: "A variety of healthy snacks and freshly prepared healthy food served at lunch and at tea time.",
      bgColor: "bg-accent/15 text-accent-foreground",
      cardBg: "hover:bg-accent/5",
    },
    {
      icon: Trees,
      title: "Secure Outdoor Play",
      description:
        "A wide, secure garden and sensory exploration area allowing children to build motor skills, explore nature, and enjoy learning environment 👏.",
      bgColor: "bg-destructive/10 text-destructive",
      cardBg: "hover:bg-destructive/5",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Why Parents Love Bubbly Day Nursery
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We offer excellent childcare including a nurturing. We provide a nurturing foundation that prepares children
            for school.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className={`flex flex-col p-8 rounded-3xl border bg-background transition-all duration-300 hover:shadow-xl hover:-translate-y-1 ${item.cardBg}`}
            >
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl mb-6 ${item.bgColor}`}>
                <item.icon className="h-6 w-6 stroke-[2]" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-3">{item.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
