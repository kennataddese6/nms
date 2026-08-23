"use client";

import * as React from "react";

import Image from "next/image";

import { BookOpen, Clock, Compass, MapPin, Shield, Sparkles, Users } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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

// Preset routines by age group for rich dynamic display
const routinesByAge: Record<string, Array<{ time: string; activity: string; details: string }>> = {
  babies: [
    {
      time: "07:30 - 08:30",
      activity: "Arrival & Quiet Play",
      details: "Welcoming babies, settling into the room, soft sensory play.",
    },
    {
      time: "08:30 - 09:15",
      activity: "Breakfast & Morning Milk",
      details: "Nutritious purées, cereals, or milk feeds tailored to each baby.",
    },
    {
      time: "09:15 - 10:30",
      activity: "Sensory Session & Outdoors",
      details: "Tummy time, bubble popping, and outdoor pram walks in our secure garden.",
    },
    {
      time: "10:30 - 11:30",
      activity: "Morning Nap Time",
      details: "Snoozing in dark, peaceful sleep pods with soothing white noise.",
    },
    {
      time: "11:30 - 12:30",
      activity: "Nutritious Lunch",
      details: "Freshly prepared warm lunch purées or finger foods.",
    },
    {
      time: "12:30 - 14:00",
      activity: "Messy Play & Discovery",
      details: "Water play, textured paint stamping, and crawling exploration.",
    },
    {
      time: "14:00 - 15:00",
      activity: "Afternoon Nap Time",
      details: "Resting to recharge for afternoon discoveries.",
    },
    {
      time: "15:00 - 15:45",
      activity: "Afternoon Snack & Milk",
      details: "Fresh fruit fingers, milk feeds, and soft cracker snacks.",
    },
    {
      time: "15:45 - 18:00",
      activity: "Soft Play & Story Pick-Up",
      details: "Interactive nursery rhymes, song circles, and quiet playtime till home.",
    },
  ],
  toddlers: [
    {
      time: "07:30 - 08:30",
      activity: "Arrival & Free Discovery",
      details: "Interactive block play, book corner exploration.",
    },
    {
      time: "08:30 - 09:00",
      activity: "Nutritious Breakfast",
      details: "Healthy cereals, toast fingers, and fresh fruit bowls.",
    },
    {
      time: "09:00 - 09:30",
      activity: "Morning Circle & Songs",
      details: "Singing circle, calendar check, and group sharing time.",
    },
    {
      time: "09:30 - 11:00",
      activity: "Messy Art & Outdoor Garden",
      details: "Puddle jumping, sand play, clay molding, and mud kitchen.",
    },
    {
      time: "11:00 - 11:30",
      activity: "Quiet Book Time & Hygiene",
      details: "Handwashing lessons, toilet training guides, and story relaxation.",
    },
    {
      time: "11:30 - 12:15",
      activity: "Hot Lunch Session",
      details: "Warm healthy meals encouraging toddler self-feeding habits.",
    },
    {
      time: "12:15 - 14:00",
      activity: "Quiet Nap Time",
      details: "Cozy rest mats, quiet music, recharging sleep session.",
    },
    {
      time: "14:00 - 15:30",
      activity: "Constructive Discovery",
      details: "Puzzles, pegboards, and shape sorters to build fine motor skills.",
    },
    {
      time: "15:30 - 16:00",
      activity: "Afternoon Tea & Snacks",
      details: "Healthy crackers, hummuses, cucumber sticks, and milk.",
    },
    {
      time: "16:00 - 18:00",
      activity: "Interactive Play & Pick-Up",
      details: "Puppet theaters, dress-up games, and soft music till departure.",
    },
  ],
  preschool: [
    {
      time: "07:30 - 08:30",
      activity: "Arrival & Table Tasks",
      details: "Puzzles, matching cards, and writing practice worksheets.",
    },
    {
      time: "08:30 - 09:00",
      activity: "Self-Serve Breakfast",
      details: "Children practice pouring milk and spreading spreads on toast.",
    },
    {
      time: "09:00 - 09:40",
      activity: "Circle Discussion & Phonics",
      details: "Letter of the day sounds, weather tracking, and child-led show-and-tell.",
    },
    {
      time: "09:40 - 11:30",
      activity: "STEAM Activity & Garden",
      details: "Science experiments (planting seeds, color mixing), active outdoor games.",
    },
    {
      time: "11:30 - 12:00",
      activity: "Math Circle & Story Time",
      details: "Counting block towers, sizing shapes, and complex story read-alouds.",
    },
    {
      time: "12:00 - 12:45",
      activity: "Warm Hot Lunch",
      details: "Enjoying family-style hot lunches with table manners practice.",
    },
    {
      time: "12:45 - 13:30",
      activity: "Mindfulness & Quiet Rest",
      details: "Audio stories, yoga stretches, and quiet reading.",
    },
    {
      time: "13:30 - 15:30",
      activity: "Creative Workshops",
      details: "Group roleplay projects, basic computer play, and building design.",
    },
    {
      time: "15:30 - 16:00",
      activity: "Healthy Afternoon Tea",
      details: "Nutritious sandwiches, dips, and fresh fruit platters.",
    },
    {
      time: "16:00 - 18:00",
      activity: "Free Creation & Pick-Up",
      details: "Board games, drawing tables, and puzzle projects till home time.",
    },
  ],
};

const defaultPresetRooms: DbRoom[] = [
  {
    id: "preset-babies",
    name: "Baby Room",
    min_age_months: 3,
    max_age_months: 24,
    capacity: 12,
    description: "Cozy, sensory-rich environment tailored for infants and early walkers.",
    branch: "Branch 1",
    image_url: "/images/classroom-babies.png",
  },
  {
    id: "preset-toddlers",
    name: "Toddlers Room (Little Explorers)",
    min_age_months: 24,
    max_age_months: 36,
    capacity: 15,
    description: "Active discovery space encouraging early communication, messy art, and social play.",
    branch: "Branch 1",
    image_url: "/images/classroom-toddlers.png",
  },
  {
    id: "preset-preschool",
    name: "Preschool Room (Early Scholars)",
    min_age_months: 36,
    max_age_months: 60,
    capacity: 20,
    description: "Structured EYFS learning zone focusing on school readiness, phonics, and independence.",
    branch: "Branch 1",
    image_url: "/images/classroom-preschool.png",
  },
];

export function RoomsClientWorkspace({ dbRooms, dbRoutines }: RoomsClientWorkspaceProps) {
  const effectiveRooms = React.useMemo(() => {
    return dbRooms && dbRooms.length > 0 ? dbRooms : defaultPresetRooms;
  }, [dbRooms]);

  const [selectedRoomId, setSelectedRoomId] = React.useState<string | null>(
    effectiveRooms.length > 0 ? effectiveRooms[0].id : null,
  );

  const selectedRoom =
    effectiveRooms.find((r) => r.id === selectedRoomId) || effectiveRooms[0];

  const getAgeKey = (r?: DbRoom) => {
    if (!r) return "toddlers";
    const name = r.name.toLowerCase();
    const min = r.min_age_months || 0;
    if (name.includes("baby") || name.includes("infant") || min < 24) return "babies";
    if (name.includes("preschool") || min >= 36) return "preschool";
    return "toddlers";
  };

  const ageKey = getAgeKey(selectedRoom);

  const roomSpecificRoutines = (dbRoutines || []).filter(
    (r) => selectedRoom?.id && r.room_id === selectedRoom.id,
  );
  const ageGroupRoutines = (dbRoutines || []).filter(
    (r) => r.age_group === ageKey,
  );

  const routine =
    roomSpecificRoutines.length > 0
      ? roomSpecificRoutines
      : ageGroupRoutines.length > 0
      ? ageGroupRoutines
      : routinesByAge[ageKey] || [];

  return (
    <div className="space-y-12">
      {/* Room Selector Buttons */}
      {effectiveRooms.length > 0 && (
        <div className="flex flex-wrap justify-center gap-2.5 sm:gap-3">
          {effectiveRooms.map((room) => {
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
      )}

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

            {/* Vertical Timeline */}
            <div className="relative border-l-2 border-orange-300 pl-6 ml-4 space-y-6">
              {routine.map((item, index) => (
                <div key={index} className="relative group">
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
          </div>
        </div>
      ) : null}
    </div>
  );
}
