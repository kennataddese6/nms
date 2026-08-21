import Link from "next/link";

import { Mail, MapPin, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

interface LeadershipMember {
  id: string;
  title: string; // Name
  room: string; // Role Title
  description: string; // Bio
  salary?: string; // Email
  branch: string; // Branch
}

interface TeamProps {
  leadershipMembers: LeadershipMember[];
}

export function Team({ leadershipMembers }: TeamProps) {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .substring(0, 2)
      .toUpperCase();
  };

  const colorPalettes = [
    "bg-orange-100 text-orange-800 border-orange-200",
    "bg-teal-100 text-teal-800 border-teal-200",
    "bg-sky-100 text-sky-800 border-sky-200",
    "bg-purple-100 text-purple-800 border-purple-200",
  ];

  return (
    <section className="py-16 sm:py-24 bg-card">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-orange-100 border border-orange-300 text-orange-800 text-xs font-bold rounded-full px-4 py-1.5 mb-3">
            <Users className="h-4 w-4 text-orange-600" />
            Nursery Management
          </div>
          <h2 className="font-heading text-3xl sm:text-4xl font-extrabold text-foreground tracking-tight">
            Meet Our Leadership Team 🌟
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Our qualified management team works closely with parents and Ofsted practitioners to maintain exceptional
            standards across all settings.
          </p>
        </div>

        {leadershipMembers.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">No leadership profiles published yet.</div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 max-w-6xl mx-auto">
            {leadershipMembers.map((member, index) => {
              const palette = colorPalettes[index % colorPalettes.length];
              const initials = getInitials(member.title);

              return (
                <div
                  key={member.id}
                  className="p-8 rounded-3xl border-2 border-orange-200 bg-white/90 backdrop-blur-sm text-center shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 flex flex-col items-center justify-between"
                >
                  <div className="w-full flex flex-col items-center">
                    {/* Branch Badge */}
                    {member.branch && (
                      <Badge
                        variant="outline"
                        className="text-[10px] font-bold border-teal-300 text-teal-800 bg-teal-50 flex items-center gap-1 mb-4"
                      >
                        <MapPin className="h-3 w-3" /> {member.branch}
                      </Badge>
                    )}

                    {/* Initials Avatar */}
                    <div
                      className={`h-20 w-20 flex items-center justify-center rounded-full text-2xl font-black mb-5 border-2 shadow-inner ${palette}`}
                    >
                      {initials}
                    </div>

                    <h3 className="text-xl font-black text-foreground mb-1">{member.title}</h3>
                    <span className="text-xs sm:text-sm font-black text-orange-600 uppercase tracking-wider mb-4 block">
                      {member.room}
                    </span>
                    <p className="text-muted-foreground text-sm sm:text-base leading-relaxed font-medium mb-6 flex-grow">
                      {member.description}
                    </p>
                  </div>

                  <Button
                    asChild
                    variant="outline"
                    size="sm"
                    className="rounded-full w-full justify-center gap-2 border-2 font-bold"
                  >
                    <Link href={`mailto:${member.salary || "contact@bubblynursery.co.uk"}`}>
                      <Mail className="h-4 w-4 text-orange-500" />
                      Contact Leader
                    </Link>
                  </Button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
