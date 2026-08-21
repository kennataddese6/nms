export function Testimonials() {
  const reviews = [
    {
      parent: "Dee",
      relation: "Google Review • 5 months ago",
      avatar: "👩",
      bgColor: "bg-yellow-100 border-yellow-300",
      starColor: "text-yellow-500",
      tilt: "rotate-1",
      text: "We couldn’t be happier with this nursery. Since my son started, his speech has improved incredibly and he surprises us almost every day with new words he’s learned. The staff are extremely friendly, attentive, and supportive — it truly feels like a hidden gem...",
    },
    {
      parent: "Safia Benaissi",
      relation: "Google Review • 1 year ago",
      avatar: "👩‍👦",
      bgColor: "bg-emerald-100 border-emerald-300",
      starColor: "text-emerald-500",
      tilt: "-rotate-1",
      text: "Since my child Ayub joined the nursery, I have seen such a transformation in his confidence and social skills. When he started, he was very shy, but thanks to your nurturing environment and encouragement, he’s blossomed in ways I couldn’t have imagined...",
    },
    {
      parent: "Hannah Aziha",
      relation: "Google Review • 7 months ago",
      avatar: "👩",
      bgColor: "bg-pink-100 border-pink-300",
      starColor: "text-pink-500",
      tilt: "rotate-1",
      text: "Nice little nursery with lovely staff! Special thanks to Vicky, she's always smiling and my son loves her — he's always babbling on about her at home.",
    },
  ];

  return (
    <section className="relative py-16 sm:py-24 overflow-hidden">
      {/* Ambient glow blobs */}
      <div className="absolute top-0 left-1/4 -z-10 h-72 w-72 rounded-full bg-yellow-200/40 blur-3xl" />
      <div className="absolute bottom-0 right-1/4 -z-10 h-72 w-72 rounded-full bg-pink-200/30 blur-3xl" />

      {/* Floating decorations */}
      <span
        aria-hidden="true"
        className="absolute top-8 right-10 text-4xl pointer-events-none select-none nursery-float opacity-60 hidden sm:block"
        style={{ animationDelay: "0.3s" }}
      >
        💬
      </span>
      <span
        aria-hidden="true"
        className="absolute top-6 left-8 text-3xl pointer-events-none select-none nursery-twinkle opacity-60 hidden sm:block"
        style={{ animationDelay: "1s" }}
      >
        ⭐
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-12 right-6 text-3xl pointer-events-none select-none nursery-wiggle opacity-50 hidden md:block"
        style={{ animationDelay: "0.7s" }}
      >
        🌸
      </span>
      <span
        aria-hidden="true"
        className="absolute bottom-8 left-10 text-4xl pointer-events-none select-none nursery-float-slow opacity-50 hidden sm:block"
        style={{ animationDelay: "0.5s" }}
      >
        🎈
      </span>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-pink-100 border border-pink-300 text-pink-800 text-xs font-bold rounded-full px-4 py-1.5 mb-4">
            ⭐ Verified 5-Star Reviews
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Hear From Our Parents 🗣️
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are proud to provide exceptional nursery care. Read real 5-star Google reviews from our parent community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.parent}
              className={`relative flex flex-col p-7 rounded-3xl border-2 shadow-sm hover:shadow-xl hover:-translate-y-2 hover:rotate-0 transition-all duration-300 ${review.bgColor} ${review.tilt}`}
            >
              {/* Big quote mark */}
              <span
                aria-hidden="true"
                className="absolute top-5 right-6 text-5xl font-black opacity-10 leading-none select-none pointer-events-none"
              >
                "
              </span>

              {/* Stars */}
              <div className={`flex items-center gap-1 mb-5 ${review.starColor}`}>
                {[...Array(5)].map((_, i) => (
                  <span key={i} className="text-xl">
                    ⭐
                  </span>
                ))}
                <span className="ml-2 text-xs font-black text-foreground/80 bg-white/80 px-2 py-0.5 rounded-full border border-black/5">
                  5.0 Google
                </span>
              </div>

              <p className="text-foreground/75 text-sm leading-relaxed mb-6 italic flex-grow">
                &ldquo;{review.text}&rdquo;
              </p>

              {/* Author */}
              <div className="flex items-center gap-3 border-t border-white/60 pt-4">
                <div className="flex h-11 w-11 items-center justify-center rounded-full bg-white text-2xl shadow-sm shrink-0">
                  {review.avatar}
                </div>
                <div>
                  <span className="block font-extrabold text-foreground text-sm">{review.parent}</span>
                  <span className="text-xs font-semibold text-muted-foreground">{review.relation}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA strip */}
        <div className="mt-16 flex flex-col items-center gap-3">
          <p className="text-muted-foreground text-sm">Ready to give your child the best start? 🌱</p>
          <a
            href="/contact?tour=true"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-orange-400 to-pink-500 text-white font-bold text-sm px-8 py-3 rounded-full shadow-lg hover:scale-105 hover:shadow-xl transition-all"
          >
            🎒 Book a Free Nursery Tour
          </a>
        </div>
      </div>
    </section>
  );
}
