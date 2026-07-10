import { Mail, Users } from "lucide-react";

import { Button } from "@/components/ui/button";

export function Team() {
  const members = [
    {
      name: "Clara Benson",
      role: "Nursery Manager",
      bio: "Over 12 years of experience in early childcare operations and educational leadership.",
      initials: "CB",
      avatarBg: "bg-primary/20 text-primary",
    },
    {
      name: "Liam O'Connor",
      role: "Deputy Manager & SENCO",
      bio: "Specializes in supporting diverse learning needs and coordinating early speech intervention plans.",
      initials: "LO",
      avatarBg: "bg-secondary/20 text-secondary-foreground",
    },
    {
      name: "Hannah Patel",
      role: "Babies Room Leader",
      bio: "Dedicated child educator holding a Level 4 certification in early child nutrition and infant care.",
      initials: "HP",
      avatarBg: "bg-accent/20 text-accent-foreground",
    },
    {
      name: "Marcus Davies",
      role: "Preschool Room Leader",
      bio: "Focused on phonics integration, early math challenges, and primary school transition games.",
      initials: "MD",
      avatarBg: "bg-destructive/15 text-destructive",
    },
  ];

  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Meet Our Leadership Team
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our qualified management team works closely with parents and Ofsted practitioners to maintain exceptional
            standards.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
          {members.map((member) => (
            <div
              key={member.name}
              className="p-8 rounded-3xl border bg-background text-center shadow-sm flex flex-col items-center"
            >
              {/* Playful placeholder avatar */}
              <div
                className={`h-20 w-20 flex items-center justify-center rounded-full text-2xl font-black mb-6 ${member.avatarBg}`}
              >
                {member.initials}
              </div>

              <h3 className="text-xl font-bold text-foreground mb-1">{member.name}</h3>
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-4 block">
                {member.role}
              </span>
              <p className="text-muted-foreground text-sm leading-relaxed mb-6 flex-grow">{member.bio}</p>

              <Button variant="outline" size="sm" className="rounded-full w-full justify-center gap-2">
                <Mail className="h-4 w-4" />
                Contact
              </Button>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
