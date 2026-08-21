import { Apple, ShieldCheck, Sparkles, Trees } from "lucide-react";

export function Highlights() {
  const items = [
    {
      icon: Sparkles,
      emoji: "🎨",
      title: "Play-Based Learning",
      description:
        "Our curriculum focuses on child-led play, ensuring toddlers build natural curiosity, communication, and cognitive skills.",
      cardBg: "bg-sky-100 border-sky-200",
      iconBg: "bg-sky-200 text-sky-700",
      tilt: "rotate-1",
      accentColor: "text-sky-600",
    },
    {
      icon: ShieldCheck,
      emoji: "🛡️",
      title: "Ofsted & DBS Cleared Staff",
      description:
        "Your child's safety comes first — all our staff are fully DBS checked and vetted. Our nursery operates with strict safeguarding compliance, security, and child-to-staff ratios.",
      cardBg: "bg-emerald-100 border-emerald-200",
      iconBg: "bg-emerald-200 text-emerald-700",
      tilt: "-rotate-1",
      accentColor: "text-emerald-600",
    },
    {
      icon: Apple,
      emoji: "🍎",
      title: "Healthy & Balanced Meals",
      description: "A variety of healthy snacks and freshly prepared healthy food served at lunch and at tea time.",
      cardBg: "bg-orange-100 border-orange-200",
      iconBg: "bg-orange-200 text-orange-700",
      tilt: "rotate-1",
      accentColor: "text-orange-600",
    },
    {
      icon: Trees,
      emoji: "🌳",
      title: "Secure Outdoor Play",
      description:
        "A wide, secure garden and sensory exploration area allowing children to build motor skills, explore nature, and enjoy learning environment 👏.",
      cardBg: "bg-violet-100 border-violet-200",
      iconBg: "bg-violet-200 text-violet-700",
      tilt: "-rotate-1",
      accentColor: "text-violet-600",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Subtle ambient decorations */}
      <span
        aria-hidden="true"
        className="absolute top-6 left-8 text-4xl pointer-events-none select-none nursery-twinkle opacity-60"
        style={{ animationDelay: "0.3s" }}
      >
        🌟
      </span>
      <span
        aria-hidden="true"
        className="absolute top-10 right-12 text-3xl pointer-events-none select-none nursery-float opacity-50 hidden sm:block"
        style={{ animationDelay: "1s" }}
      >
        🎈
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-8 left-1/3 text-3xl pointer-events-none select-none nursery-wiggle opacity-50 hidden md:block"
        style={{ animationDelay: "0.7s" }}
      >
        🦋
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-6 right-10 text-3xl pointer-events-none select-none nursery-float-slow opacity-50 hidden sm:block"
        style={{ animationDelay: "0.2s" }}
      >
        ⭐
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-yellow-100 border border-yellow-300 text-yellow-800 text-xs font-bold rounded-full px-4 py-1.5 mb-4">
            💛 Why Choose Us
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Why Parents Love Bubbly Day Nursery 🏡
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We offer excellent childcare including a nurturing foundation that prepares children for school and beyond.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {items.map((item) => (
            <div
              key={item.title}
              className={`relative flex flex-col p-7 rounded-3xl border-2 transition-all duration-300 hover:shadow-xl hover:-translate-y-2 hover:rotate-0 ${item.cardBg} ${item.tilt}`}
            >
              {/* Emoji decoration top-right corner */}
              <span
                aria-hidden="true"
                className="absolute top-3 right-4 text-2xl opacity-40 nursery-float"
                style={{ animationDelay: "0.5s" }}
              >
                {item.emoji}
              </span>

              <div className={`flex h-14 w-14 items-center justify-center rounded-2xl mb-5 ${item.iconBg}`}>
                <item.icon className="h-7 w-7 stroke-[2]" />
              </div>
              <h3 className={`text-xl font-extrabold mb-3 ${item.accentColor}`}>
                {item.emoji} {item.title}
              </h3>
              <p className="text-foreground/70 text-sm leading-relaxed">{item.description}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
