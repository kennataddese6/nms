import { Quote, Star } from "lucide-react";

export function Testimonials() {
  const reviews = [
    {
      parent: "Sarah Jenkins",
      relation: "Mother of Leo (Toddlers Room)",
      text: "Leaving my son at Bubbly Day Nursery was the best decision I made. The daily updates on the portal about his sleep and meals keep me fully informed, and the staff are incredibly warm and caring.",
    },
    {
      parent: "David Miller",
      relation: "Father of Mia (Preschool Room)",
      text: "Mia's language and confidence have skyrocketed since she started at Bubbly. She loves writing, singing, and exploring the garden. The EYFS learning journal has been wonderful to look through.",
    },
    {
      parent: "Emily Watson",
      relation: "Mother of Noah (Babies Room)",
      text: "The baby room staff are fantastic. The ratio is perfect, the room is super cozy, and Noah settled in so quickly. The team really takes the time to replicate his home routines. Highly recommend!",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-card relative overflow-hidden">
      <div className="absolute top-1/2 left-0 -translate-y-1/2 -z-10 h-72 w-72 rounded-full bg-accent/10 blur-3xl" />
      <div className="absolute bottom-0 right-0 -z-10 h-72 w-72 rounded-full bg-primary/10 blur-3xl" />

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Hear From Our Parents
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            We are proud to provide exceptional nursery care. Read about the experiences of our parent community.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {reviews.map((review) => (
            <div
              key={review.parent}
              className="flex flex-col p-8 rounded-3xl border bg-background relative shadow-sm hover:shadow-md transition-shadow"
            >
              <Quote className="absolute top-6 right-6 h-8 w-8 text-primary/10 stroke-[2.5]" />

              {/* Star Rating */}
              <div className="flex gap-1 mb-6 text-accent-foreground">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-4.5 w-4.5 fill-accent text-accent-foreground" />
                ))}
              </div>

              <p className="text-muted-foreground text-sm leading-relaxed mb-6 italic flex-grow">"{review.text}"</p>

              <div className="border-t pt-4">
                <span className="block font-bold text-foreground text-base">{review.parent}</span>
                <span className="text-xs text-muted-foreground">{review.relation}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
