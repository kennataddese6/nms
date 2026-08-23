"use client";

import * as React from "react";

import Image from "next/image";

import { BookOpen, Clock, MapPin, Shield, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

interface DbRoom {
  id: string;
  name: string;
  min_age_months?: number;
  max_age_months?: number;
  capacity: number;
  description?: string;
  branch: string;
  image_url?: string;
}

interface DbRoutineItem {
  id?: string;
  room_id?: string | null;
  age_group?: string;
  time: string;
  activity: string;
  details: string;
  display_order?: number;
}

interface RoomsClientWorkspaceProps {
  dbRooms: DbRoom[];
  dbRoutines?: DbRoutineItem[];
}

export function formatAgeRange(minMonths?: number, maxMonths?: number): string {
  if (minMonths === undefined || maxMonths === undefined) return "All Ages";
  const formatMonths = (m: number) => {
    if (m < 12) return `${m}m`;
    const y = Math.floor(m / 12);
    const rem = m % 12;
    return rem > 0 ? `${y}y ${rem}m` : `${y}y`;
  };
  return `${formatMonths(minMonths)} - ${formatMonths(maxMonths)}`;
}

export function RoomsClientWorkspace({ dbRooms, dbRoutines }: RoomsClientWorkspaceProps) {
  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(
    dbRooms.length > 0 ? dbRooms[0].id : null,
  );

  const selectedRoom = dbRooms.find((r) => r.id === selectedRoomId) || dbRooms[0];

  const getAgeKey = (r?: DbRoom) => {
    if (!r) return "toddlers";
    const name = r.name.toLowerCase();
    const min = r.min_age_months || 0;
    if (name.includes("baby") || name.includes("infant") || min < 24) return "babies";
    if (name.includes("preschool") || min >= 36) return "preschool";
    return "toddlers";
  };

  const ageKey = getAgeKey(selectedRoom);

  // STRICT DATABASE ROUTINES: Only display routines that exist in the database for this room or age group
  const roomSpecificRoutines = (dbRoutines || []).filter(
    (r) => selectedRoom?.id && r.room_id === selectedRoom.id,
  );
  const ageGroupRoutines = (dbRoutines || []).filter(
    (r) => r.age_group === ageKey,
  );

  const routine = roomSpecificRoutines.length > 0 ? roomSpecificRoutines : ageGroupRoutines;

  if (dbRooms.length === 0) {
    return (
      <div className="py-16 text-center text-muted-foreground text-sm border-2 border-dashed rounded-3xl bg-white/60">
        No classrooms published yet.
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Room Selector Buttons */}
      <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
        {dbRooms.map((room) => {
          const isSelected = room.id === (selectedRoom?.id ?? "");
          return (
            <button
              key={room.id}
              type="button"
              onClick={() => setSelectedRoomId(room.id)}
              className={`flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 sm:py-3 rounded-full text-xs font-bold transition-all duration-200 shadow-sm w-full sm:w-auto ${
                isSelected
                  ? "bg-gradient-to-r from-orange-400 to-pink-500 text-white shadow-md scale-[1.02] sm:scale-105"
                  : "bg-white/90 backdrop-blur-sm text-foreground/80 hover:bg-white hover:text-foreground border border-orange-200"
              }`}
            >
              <span>🚪</span>
              <span>{room.name}</span>
              <span
                className={`text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full ${
                  isSelected ? "bg-white/20 text-white" : "bg-orange-100 text-orange-800"
                }`}
              >
                {formatAgeRange(room.min_age_months, room.max_age_months)}
              </span>
            </button>
          );
        })}
      </div>

      {/* Selected Room Details */}
      {selectedRoom ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Classroom Info Card */}
          <div className="lg:col-span-5 space-y-8">
            <Card className="p-8 rounded-3xl border-2 border-orange-200 bg-white/90 backdrop-blur-sm shadow-lg space-y-6 overflow-hidden">
              <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border border-orange-100 shadow-sm">
                <Image
                  src={
                    selectedRoom.image_url ||
                    (ageKey === "babies"
                      ? "/images/classroom-babies.png"
                      : ageKey === "preschool"
                        ? "/images/classroom-preschool.png"
                        : "/images/classroom-toddlers.png")
                  }
                  alt={selectedRoom.name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  priority
                />
              </div>

              <div>
                <div className="flex items-center justify-between gap-2 mb-2">
                  <Badge
                    variant="outline"
                    className="border-teal-300 text-teal-800 bg-teal-50 text-[10px] font-bold flex items-center gap-1"
                  >
                    <MapPin className="h-3 w-3" /> {selectedRoom.branch}
                  </Badge>
                  <span className="text-xs font-black text-orange-600 bg-orange-50 border border-orange-200 px-3 py-1 rounded-full">
                    {formatAgeRange(selectedRoom.min_age_months, selectedRoom.max_age_months)}
                  </span>
                </div>
                <h3 className="text-3xl font-black text-foreground mt-1 mb-2 leading-snug">{selectedRoom.name}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {selectedRoom.description ||
                    "A vibrant, tailored classroom environment nurturing milestones and early social development."}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 border-t border-orange-100 pt-6">
                <div className="flex gap-2.5 items-start">
                  <Users className="h-5 w-5 text-orange-500 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Max Capacity
                    </span>
                    <span className="text-sm font-black text-foreground">{selectedRoom.capacity} Children</span>
                  </div>
                </div>
                <div className="flex gap-2.5 items-start">
                  <Shield className="h-5 w-5 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="block text-[10px] text-muted-foreground font-bold uppercase tracking-wider">
                      Staff Ratio
                    </span>
                    <span className="text-sm font-black text-foreground">
                      {ageKey === "babies" ? "1:3 Ratio" : ageKey === "toddlers" ? "1:4 Ratio" : "1:8 Ratio"}
                    </span>
                  </div>
                </div>
              </div>
            </Card>

            {/* EYFS Learning Focus */}
            <div className="space-y-4">
              <h4 className="font-black text-foreground text-xl flex items-center gap-2">
                <BookOpen className="h-5 w-5 text-orange-500" />
                EYFS Learning Focus
              </h4>
              <div className="grid grid-cols-1 gap-3">
                {[
                  {
                    title:
                      ageKey === "babies"
                        ? "Sensory & Motor Development"
                        : ageKey === "toddlers"
                          ? "Speech & Vocabulary"
                          : "Early Phonics & Numeracy",
                    desc:
                      ageKey === "babies"
                        ? "Exploring textures, soft crawling zones, and balance."
                        : ageKey === "toddlers"
                          ? "Forming sentences, singing rhymes, and interactive books."
                          : "Sounding letters, counting towers, and pattern matching.",
                  },
                  {
                    title:
                      ageKey === "babies"
                        ? "Emotional Bonding"
                        : ageKey === "toddlers"
                          ? "Social Interaction & Sharing"
                          : "Independence & Self-Care",
                    desc:
                      ageKey === "babies"
                        ? "Consistent keyworker care and calming sleep routines."
                        : ageKey === "toddlers"
                          ? "Cooperative group play and identifying emotions."
                          : "Dressing themselves, tidy-up tasks, and self-serving snacks.",
                  },
                ].map((goal) => (
                  <div
                    key={goal.title}
                    className="p-4 rounded-2xl border-2 border-orange-100 bg-white/90 backdrop-blur-sm flex gap-3"
                  >
                    <div className="h-2.5 w-2.5 rounded-full bg-orange-400 shrink-0 mt-1.5" />
                    <div>
                      <h5 className="font-bold text-foreground text-sm">{goal.title}</h5>
                      <p className="text-muted-foreground text-xs leading-relaxed mt-0.5">{goal.desc}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Column: Daily Routine Timeline */}
          <div className="lg:col-span-7 space-y-6">
            <h4 className="font-black text-foreground text-xl flex items-center gap-2">
              <Clock className="h-5 w-5 text-orange-500" />
              Daily Classroom Routine
            </h4>

            {routine.length > 0 ? (
              <div className="relative border-l-2 border-orange-300 pl-6 ml-4 space-y-6">
                {routine.map((item, index) => (
                  <div key={item.id || index} className="relative group">
                    {/* Timeline marker */}
                    <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-orange-500 bg-white transition-transform group-hover:scale-125 shadow-sm" />

                    <div className="space-y-1 bg-white/90 backdrop-blur-sm p-4 rounded-2xl border border-orange-100 shadow-sm">
                      <span className="inline-block text-xs font-black text-orange-800 bg-orange-100 border border-orange-200 px-3 py-0.5 rounded-full">
                        {item.time}
                      </span>
                      <h5 className="font-extrabold text-foreground text-base mt-1">{item.activity}</h5>
                      <p className="text-muted-foreground text-xs leading-relaxed">{item.details}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-8 rounded-3xl border-2 border-dashed border-orange-200 bg-white/50 text-center text-muted-foreground text-sm font-medium">
                No daily routine scheduled for this classroom yet.
              </div>
            )}
          </div>
        </div>
      ) : null}
    </div>
  );
}
