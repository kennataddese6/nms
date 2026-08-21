import * as React from "react";

import Image from "next/image";

import { BookOpen, Clock, Compass, Shield, Sparkles, Users } from "lucide-react";

import { Card } from "@/components/ui/card";

export interface RoutineItem {
  time: string;
  activity: string;
  details: string;
}

export interface LearningGoal {
  title: string;
  desc: string;
}

export interface EnvironmentHighlight {
  title: string;
  desc: string;
}

interface RoomDetailsProps {
  roomKey: "babies" | "toddlers" | "preschool";
}

export function RoomDetails({ roomKey }: RoomDetailsProps) {
  const roomData = {
    babies: {
      name: "Babies Room",
      ageRange: "3 Months - 2 Years",
      ratio: "1:3 staff to child ratio",
      capacity: "9 Babies",
      imageSrc: "/images/classroom-babies.png",
      description:
        "A peaceful, sensory-rich nursery room tailored to infant milestones. Features soft-creeping zones, safe sensory pools, and dedicated dark nap pods to match your child's home sleep schedules.",
      learningGoals: [
        { title: "Sensory Development", desc: "Exploring textures, sounds, and soft lights to build brain pathways." },
        { title: "Physical Coordination", desc: "Supporting rolling, crawling, and taking those first bubbly steps." },
        { title: "Early Interaction", desc: "Encouraging baby babbling, speech mimicry, and emotional connection." },
      ],
      routine: [
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
      environment: [
        { title: "Sleep Sanctuary", desc: "Darkened nap room with individual wooden cots and smart temp monitors." },
        { title: "Sensory Floor Zone", desc: "Padded floor mats, tactile wall textures, and safety mirrors." },
      ],
    },
    toddlers: {
      name: "Toddlers Room",
      ageRange: "2 - 3 Years",
      ratio: "1:4 staff to child ratio",
      capacity: "16 Toddlers",
      imageSrc: "/images/classroom-toddlers.png",
      description:
        "An active, exploratory classroom focused on budding speech, motor coordination, and peer-to-peer social dynamics. Fully equipped with messy art stations, creative sandpits, and child-height tables.",
      learningGoals: [
        { title: "Speech & Language", desc: "Expanding vocabulary, singing songs, and forming complete sentences." },
        { title: "Creative Expression", desc: "Finger painting, sand sculpting, and building block structures." },
        {
          title: "Social Coordination",
          desc: "Sharing toys, identifying simple emotions, and cooperative group play.",
        },
      ],
      routine: [
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
      environment: [
        { title: "Messy Mud Kitchen", desc: "Dedicated outdoor and indoor sand-water splash tables." },
        { title: "Construction Corner", desc: "Loaded with wooden blocks, tracks, and building shapes." },
      ],
    },
    preschool: {
      name: "Preschool Room",
      ageRange: "3 - 5 Years",
      ratio: "1:8 staff to child ratio",
      capacity: "24 Preschoolers",
      imageSrc: "/images/classroom-preschool.png",
      description:
        "A bright, structured pre-school classroom preparing children for the transition to primary school. Focuses on phonics, numbers, independence, science observation, and collaborative problem-solving.",
      learningGoals: [
        { title: "Early Phonics & Reading", desc: "Sounding out letters, recognizing names, and story comprehension." },
        { title: "Mathematical Concepts", desc: "Counting blocks, identifying basic patterns, and sorting sizes." },
        { title: "Independence & Confidence", desc: "Dressing themselves, tidy-up tasks, and self-serving snacks." },
      ],
      routine: [
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
          details: "Audio stories, yoga stretches, and quiet reading (no forced nap).",
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
      environment: [
        {
          title: "Phonics & Writing Hub",
          desc: "Equipped with letter templates, sand trays, and early reading books.",
        },
        { title: "Science Discovery Lab", desc: "Magnifying glasses, seed planters, and weight balance scales." },
      ],
    },
  };

  const currentRoom = roomData[roomKey];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 animate-in fade-in duration-300">
      {/* Left Column: Details & Goals */}
      <div className="lg:col-span-5 space-y-8">
        {/* Core Specs Card */}
        <Card className="p-8 rounded-3xl border shadow-sm space-y-6 bg-background overflow-hidden">
          <div className="relative aspect-[16/10] w-full rounded-2xl overflow-hidden border">
            <Image
              src={currentRoom.imageSrc}
              alt={currentRoom.name}
              fill
              className="object-cover"
              sizes="(max-w-7xl) 50vw, 400px"
              priority
            />
          </div>
          <div>
            <h3 className="text-3xl font-extrabold text-foreground mb-2">{currentRoom.name}</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">{currentRoom.description}</p>
          </div>

          <div className="grid grid-cols-2 gap-4 border-t pt-6">
            <div className="flex gap-2.5 items-start">
              <Users className="h-5 w-5 text-primary shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Age Group
                </span>
                <span className="text-sm font-bold text-foreground">{currentRoom.ageRange}</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-start">
              <Shield className="h-5 w-5 text-secondary-foreground shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Staff Ratio
                </span>
                <span className="text-sm font-bold text-foreground">{currentRoom.ratio.split(" ")[0]}</span>
              </div>
            </div>
            <div className="flex gap-2.5 items-start col-span-2 border-t pt-4">
              <Compass className="h-5 w-5 text-accent-foreground shrink-0 mt-0.5" />
              <div>
                <span className="block text-xs text-muted-foreground font-semibold uppercase tracking-wider">
                  Classroom Size
                </span>
                <span className="text-sm font-bold text-foreground">{currentRoom.capacity}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* EYFS Goals Grid */}
        <div className="space-y-4">
          <h4 className="font-bold text-foreground text-xl flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            EYFS Learning Focus
          </h4>
          <div className="grid grid-cols-1 gap-4">
            {currentRoom.learningGoals.map((goal) => (
              <div key={goal.title} className="p-5 rounded-2xl border bg-background flex gap-4">
                <div className="h-2 w-2 rounded-full bg-primary shrink-0 mt-2" />
                <div>
                  <h5 className="font-bold text-foreground text-sm mb-1">{goal.title}</h5>
                  <p className="text-muted-foreground text-xs leading-relaxed">{goal.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Room highlights */}
        <div className="space-y-4">
          <h4 className="font-bold text-foreground text-xl flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-accent-foreground" />
            Unique Room Features
          </h4>
          <div className="grid grid-cols-2 gap-4">
            {currentRoom.environment.map((env) => (
              <div key={env.title} className="p-5 rounded-2xl border bg-background">
                <h5 className="font-bold text-foreground text-sm mb-1">{env.title}</h5>
                <p className="text-muted-foreground text-xs leading-relaxed">{env.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Right Column: Daily Routine Timeline */}
      <div className="lg:col-span-7 space-y-6">
        <h4 className="font-bold text-foreground text-xl flex items-center gap-2">
          <Clock className="h-5 w-5 text-primary" />
          Daily Classroom Routine
        </h4>

        {/* Vertical Timeline */}
        <div className="relative border-l-2 border-primary/20 pl-6 ml-4 space-y-8">
          {currentRoom.routine.map((item, index) => (
            <div key={index} className="relative group animate-in slide-in-from-left-4 duration-300">
              {/* Timeline marker */}
              <div className="absolute -left-[31px] top-1.5 h-4 w-4 rounded-full border-2 border-primary bg-background transition-transform group-hover:scale-125" />

              <div className="space-y-1">
                <span className="inline-block text-xs font-bold text-primary tracking-wide bg-primary/10 px-2.5 py-0.5 rounded-full">
                  {item.time}
                </span>
                <h5 className="font-bold text-foreground text-base mt-1">{item.activity}</h5>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.details}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
