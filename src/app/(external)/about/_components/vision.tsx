import { Brain, Heart, RefreshCw, Shield, Smile, Users } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

export function Vision() {
  const ethosPillars = [
    {
      title: "Happy Team, Happy Families",
      desc: "We place a strong emphasis on building a healthy team. We believe that Happy Team = Happy Children = Happy Families. We aim to create a setting in which our team know that they are valued, supported, and loved.",
      icon: Smile,
      color: "text-primary bg-primary/10",
    },
    {
      title: "Nurturing Every Uniqueness",
      desc: "We focus on developing the uniqueness of every child to meet their specific development needs, providing a safe, warm, and highly supportive atmosphere for each unique child to flourish.",
      icon: Heart,
      color: "text-secondary-foreground bg-secondary/15",
    },
    {
      title: "Relational Family Bonds",
      desc: "We build strong relational bonds with families. This is nurtured and maintained through the medium of consistent, transparent, and high-quality communication.",
      icon: Users,
      color: "text-accent-foreground bg-accent/20",
    },
    {
      title: "Confident Lifelong Learners",
      desc: "We focus on developing the right mindset in our children, enabling each child to acquire the skills to become a confident learner who goes on to lead a successful happy life.",
      icon: Brain,
      color: "text-amber-600 bg-amber-100/50 dark:text-amber-400 dark:bg-amber-950/20",
    },
    {
      title: "Safe & Nurturing Well-being",
      desc: "We provide a safe, secure, and nurturing environment where we endeavour to meet the health, security, and emotional well-being needs of every single child in our care.",
      icon: Shield,
      color: "text-destructive bg-destructive/10",
    },
    {
      title: "Normalizing Mistakes to Learn",
      desc: "Our curriculum ensures that children learn through making mistakes, and that process of mistake-making is actively modeled, embraced, and normalized throughout the nursery.",
      icon: RefreshCw,
      color: "text-teal-600 bg-teal-100/50 dark:text-teal-400 dark:bg-teal-950/20",
    },
  ];

  const coreValues = [
    {
      letter: "B",
      title: "Buds",
      desc: "We nourish our children with love, care, and a remarkable curriculum and education, so they can develop and grow to a confident child.",
      bgColor: "bg-primary/10 border-primary/20",
      textColor: "text-primary",
    },
    {
      letter: "U",
      title: "Unique",
      desc: "We celebrate and embrace every child’s uniqueness, tailoring our care to their distinct personality and learning pace.",
      bgColor: "bg-secondary/10 border-secondary/20",
      textColor: "text-secondary-foreground",
    },
    {
      letter: "B",
      title: "Bright start",
      desc: "A bright start to learning in the early years, where each child is equipped and encouraged to thrive and reach their full potential.",
      bgColor: "bg-accent/15 border-accent/20",
      textColor: "text-accent-foreground",
    },
    {
      letter: "B",
      title: "Believe",
      desc: "Encouraging children to see their bright future, cultivating self-belief, resilience, and optimism from day one.",
      bgColor: "bg-pink-50 dark:bg-pink-950/10 border-pink-200/50",
      textColor: "text-pink-600 dark:text-pink-400",
    },
    {
      letter: "L",
      title: "Laugh",
      desc: "Helping children to be happy, emotionally stable, and self-regulate their own emotions in a positive environment.",
      bgColor: "bg-amber-50 dark:bg-amber-950/10 border-amber-200/50",
      textColor: "text-amber-600 dark:text-amber-400",
    },
    {
      letter: "Y",
      title: "Youth",
      desc: "Encourage children to embrace lifelong learning that will help them to grow and succeed in their youth and adult life.",
      bgColor: "bg-teal-50 dark:bg-teal-950/10 border-teal-200/50",
      textColor: "text-teal-600 dark:text-teal-400",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-primary/5 via-background to-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Ethos Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-2 rounded-full bg-primary/10 text-primary px-4 py-1.5 text-xs font-semibold mb-4">
            Our Core Mission
          </span>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Our Vision & Ethos
          </h2>
          <p className="mt-4 text-base sm:text-lg text-muted-foreground leading-relaxed">
            At Bubbly Day Nursery,{" "}
            <strong className="text-foreground">“We want the best for all our children, families, and our team”</strong>
            . We aim to create a setting in which each unique child can flourish.
          </p>
        </div>

        {/* Ethos Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24">
          {ethosPillars.map((pillar) => (
            <Card
              key={pillar.title}
              className="rounded-3xl border bg-background shadow-sm hover:shadow-md transition-shadow"
            >
              <CardContent className="p-8 space-y-4">
                <div className={`h-12 w-12 flex items-center justify-center rounded-2xl ${pillar.color}`}>
                  <pillar.icon className="h-6 w-6 stroke-[2]" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-foreground mb-2">{pillar.title}</h3>
                  <p className="text-muted-foreground text-xs leading-relaxed">{pillar.desc}</p>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* BUBBLY Core Values */}
        <div className="border-t pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">Acronym of Values</span>
            <h3 className="text-2xl sm:text-3xl font-black text-foreground mt-2">
              We Are <span className="text-primary">B.U.B.B.L.Y.</span>
            </h3>
            <p className="text-muted-foreground text-sm mt-2">
              Our 6 core values reflect how we guide every child towards a happy, confident start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className={`p-6 rounded-3xl border flex gap-4 bg-background shadow-sm hover:shadow-md transition-all ${value.bgColor}`}
              >
                <div className={`text-4xl font-black shrink-0 ${value.textColor} select-none`}>{value.letter}</div>
                <div>
                  <h4 className="font-bold text-foreground text-sm uppercase tracking-wide mb-1">{value.title}</h4>
                  <p className="text-muted-foreground text-xs leading-relaxed">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
