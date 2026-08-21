import { Brain, Heart, RefreshCw, Shield, Smile, Sparkles, Users } from "lucide-react";

export function Vision() {
  const ethosPillars = [
    {
      title: "Happy Team, Happy Families",
      desc: "We place a strong emphasis on building a healthy team. We believe that Happy Team = Happy Children = Happy Families. We ensure our staff feel valued, supported, and loved.",
      icon: Smile,
      cardBg: "bg-gradient-to-br from-orange-50 to-amber-50/60 dark:from-orange-950/30 dark:to-amber-950/20",
      border: "border-2 border-orange-200 dark:border-orange-800/40",
      iconBg: "bg-orange-500 text-white shadow-md shadow-orange-500/25",
    },
    {
      title: "Nurturing Every Uniqueness",
      desc: "We focus on developing the unique qualities of every child to meet their specific developmental needs in a safe, warm, and highly supportive atmosphere.",
      icon: Heart,
      cardBg: "bg-gradient-to-br from-rose-50 to-pink-50/60 dark:from-rose-950/30 dark:to-pink-950/20",
      border: "border-2 border-rose-200 dark:border-rose-800/40",
      iconBg: "bg-rose-500 text-white shadow-md shadow-rose-500/25",
    },
    {
      title: "Relational Family Bonds",
      desc: "We build strong relational bonds with families, nurtured and maintained through consistent, transparent, and high-quality communication.",
      icon: Users,
      cardBg: "bg-gradient-to-br from-teal-50 to-emerald-50/60 dark:from-teal-950/30 dark:to-emerald-950/20",
      border: "border-2 border-teal-200 dark:border-teal-800/40",
      iconBg: "bg-teal-600 text-white shadow-md shadow-teal-600/25",
    },
    {
      title: "Confident Lifelong Learners",
      desc: "We focus on developing the right mindset in our children, enabling each child to acquire skills to become a confident, curious lifelong learner.",
      icon: Brain,
      cardBg: "bg-gradient-to-br from-sky-50 to-blue-50/60 dark:from-sky-950/30 dark:to-blue-950/20",
      border: "border-2 border-sky-200 dark:border-sky-800/40",
      iconBg: "bg-sky-500 text-white shadow-md shadow-sky-500/25",
    },
    {
      title: "Safe & Nurturing Wellbeing",
      desc: "We provide a safe, secure, and nurturing environment where we endeavour to meet the health, security, and emotional well-being needs of every single child.",
      icon: Shield,
      cardBg: "bg-gradient-to-br from-purple-50 to-indigo-50/60 dark:from-purple-950/30 dark:to-indigo-950/20",
      border: "border-2 border-purple-200 dark:border-purple-800/40",
      iconBg: "bg-purple-600 text-white shadow-md shadow-purple-600/25",
    },
    {
      title: "Normalizing Mistakes to Learn",
      desc: "Our curriculum ensures that children learn through making mistakes, actively modeling, embracing, and normalizing mistake-making as a key growth step.",
      icon: RefreshCw,
      cardBg: "bg-gradient-to-br from-amber-50 to-yellow-50/60 dark:from-amber-950/30 dark:to-yellow-950/20",
      border: "border-2 border-amber-200 dark:border-amber-800/40",
      iconBg: "bg-amber-500 text-white shadow-md shadow-amber-500/25",
    },
  ];

  const coreValues = [
    {
      letter: "B",
      title: "Buds",
      desc: "We nourish our children with love, care, and a remarkable curriculum so they develop into confident children.",
      badgeColor: "bg-orange-500 text-white shadow-md shadow-orange-500/30",
      cardBg: "bg-orange-50/90 dark:bg-orange-950/30 border-2 border-orange-200",
    },
    {
      letter: "U",
      title: "Unique",
      desc: "We celebrate every child's uniqueness, tailoring our care to their distinct personality and learning pace.",
      badgeColor: "bg-teal-600 text-white shadow-md shadow-teal-600/30",
      cardBg: "bg-teal-50/90 dark:bg-teal-950/30 border-2 border-teal-200",
    },
    {
      letter: "B",
      title: "Bright start",
      desc: "A bright start to early learning, equipping and encouraging each child to thrive and reach their full potential.",
      badgeColor: "bg-rose-500 text-white shadow-md shadow-rose-500/30",
      cardBg: "bg-rose-50/90 dark:bg-rose-950/30 border-2 border-rose-200",
    },
    {
      letter: "B",
      title: "Believe",
      desc: "Encouraging children to see their bright future, cultivating self-belief, resilience, and optimism from day one.",
      badgeColor: "bg-sky-500 text-white shadow-md shadow-sky-500/30",
      cardBg: "bg-sky-50/90 dark:bg-sky-950/30 border-2 border-sky-200",
    },
    {
      letter: "L",
      title: "Laugh",
      desc: "Helping children to be happy, emotionally stable, and self-regulate in a warm, joyous environment.",
      badgeColor: "bg-purple-600 text-white shadow-md shadow-purple-600/30",
      cardBg: "bg-purple-50/90 dark:bg-purple-950/30 border-2 border-purple-200",
    },
    {
      letter: "Y",
      title: "Youth",
      desc: "Encouraging children to embrace lifelong learning that will help them grow and succeed throughout life.",
      badgeColor: "bg-amber-500 text-white shadow-md shadow-amber-500/30",
      cardBg: "bg-amber-50/90 dark:bg-amber-950/30 border-2 border-amber-200",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-gradient-to-b from-orange-50/40 via-background to-teal-50/30 dark:from-orange-950/20 dark:to-teal-950/20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Ethos Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-flex items-center gap-1.5 text-sm font-black uppercase tracking-wider text-orange-800 bg-orange-100 border border-orange-300 px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="h-4 w-4 text-orange-600" /> Core Nursery Ethos
          </span>
          <h2 className="font-heading text-3xl sm:text-5xl font-black text-foreground tracking-tight">
            Our Vision & Values 💖
          </h2>
          <p className="mt-4 text-base sm:text-xl text-muted-foreground leading-relaxed font-medium">
            At Bubbly Day Nursery,{" "}
            <strong className="text-foreground font-black">
              “We want the best for all our children, families, and our team”
            </strong>
            . We aim to create a setting in which each unique child can flourish.
          </p>
        </div>

        {/* Ethos Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-24 max-w-6xl mx-auto">
          {ethosPillars.map((pillar) => (
            <div
              key={pillar.title}
              className={`p-8 rounded-3xl ${pillar.cardBg} ${pillar.border} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between`}
            >
              <div className="space-y-4">
                <div className={`h-14 w-14 flex items-center justify-center rounded-2xl ${pillar.iconBg}`}>
                  <pillar.icon className="h-7 w-7 stroke-[2.5]" />
                </div>
                <div>
                  <h3 className="text-xl sm:text-2xl font-black text-foreground mb-3">{pillar.title}</h3>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">
                    {pillar.desc}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* BUBBLY Core Values */}
        <div className="border-t-2 border-dashed border-orange-200 dark:border-orange-900/50 pt-16">
          <div className="text-center max-w-2xl mx-auto mb-12">
            <span className="text-xs sm:text-sm font-black text-orange-600 uppercase tracking-widest bg-orange-100 px-3.5 py-1.5 rounded-full border border-orange-200">
              Core Values Acronym
            </span>
            <h3 className="text-3xl sm:text-5xl font-black text-foreground mt-3">
              We Are{" "}
              <span className="bg-gradient-to-r from-orange-600 via-rose-500 to-teal-600 bg-clip-text text-transparent">
                B.U.B.B.L.Y.
              </span>{" "}
              🎈
            </h3>
            <p className="text-muted-foreground text-base sm:text-lg mt-2 font-bold">
              Our 6 core values reflect how we guide every child towards a happy, confident start.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 max-w-6xl mx-auto">
            {coreValues.map((value, idx) => (
              <div
                key={idx}
                className={`p-7 rounded-3xl ${value.cardBg} shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex gap-4 items-start`}
              >
                <div
                  className={`h-14 w-14 rounded-2xl flex items-center justify-center text-3xl font-black shrink-0 ${value.badgeColor}`}
                >
                  {value.letter}
                </div>
                <div>
                  <h4 className="font-black text-foreground text-lg uppercase tracking-wide mb-1">{value.title}</h4>
                  <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium">{value.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
