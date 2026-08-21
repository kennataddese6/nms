"use client";

import * as React from "react";

import { Apple, Clock, Coffee, Cookie, IceCream, Soup, Utensils } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";

interface MenuWorkspaceProps {
  menu: {
    name: string;
    breakfast: string;
    morning_snack: string;
    lunch: Record<string, string>;
    desserts: Record<string, string>;
    afternoon_snack: Record<string, string>;
    afternoon_tea: Record<string, string>;
  };
}

export function MenuWorkspace({ menu }: MenuWorkspaceProps) {
  const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"] as const;
  const [activeDay, setActiveDay] = React.useState<(typeof days)[number]>("Monday");

  // Helper icons and styles mapping
  const mealsConfig = [
    {
      title: "Breakfast",
      time: "7:30 AM – 8:45 AM",
      desc: menu.breakfast,
      icon: Coffee,
      bgColor: "bg-primary/5 border-primary/20",
      iconColor: "text-primary bg-primary/10",
    },
    {
      title: "Morning Snack",
      time: "10:00 AM Rota",
      desc: menu.morning_snack,
      icon: Apple,
      bgColor: "bg-secondary/5 border-secondary/20",
      iconColor: "text-secondary-foreground bg-secondary/15",
    },
    {
      title: "Lunch Meal",
      time: "11:45 AM Service",
      desc: menu.lunch[activeDay] || "Medley of seasonal vegetables",
      icon: Utensils,
      bgColor: "bg-accent/5 border-accent/20",
      iconColor: "text-accent-foreground bg-accent/20",
    },
    {
      title: "Chef's Dessert",
      time: "Post-Lunch",
      desc: menu.desserts[activeDay] || "Fruit salad pots",
      icon: IceCream,
      bgColor: "bg-pink-50/50 dark:bg-pink-950/10 border-pink-200/50",
      iconColor: "text-pink-600 dark:text-pink-400 bg-pink-100 dark:bg-pink-900/30",
    },
    {
      title: "Afternoon Snack",
      time: "2:00 PM Rota",
      desc: menu.afternoon_snack[activeDay] || "Fresh fruit fingers",
      icon: Cookie,
      bgColor: "bg-amber-50/50 dark:bg-amber-950/10 border-amber-200/50",
      iconColor: "text-amber-600 dark:text-amber-400 bg-amber-100 dark:bg-amber-900/30",
    },
    {
      title: "Afternoon Tea",
      time: "4:15 PM Service",
      desc: menu.afternoon_tea[activeDay] || "Sandwich fingers and dips",
      icon: Soup,
      bgColor: "bg-destructive/5 border-destructive/20",
      iconColor: "text-destructive bg-destructive/10",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Day Selector Buttons */}
      <div className="flex bg-neutral-100 dark:bg-neutral-800 p-1.5 rounded-2xl gap-1 max-w-lg mx-auto overflow-x-auto">
        {days.map((day) => {
          const isSelected = day === activeDay;
          return (
            <button
              key={day}
              type="button"
              onClick={() => setActiveDay(day)}
              className={`flex-1 min-w-[75px] py-2.5 rounded-xl text-xs font-bold transition-all duration-200 ${
                isSelected ? "bg-background text-primary shadow-sm" : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {day}
            </button>
          );
        })}
      </div>

      {/* Meals Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {mealsConfig.map((meal) => (
          <Card
            key={meal.title}
            className={`rounded-3xl border shadow-sm transition-all duration-200 hover:shadow-md ${meal.bgColor}`}
          >
            <CardContent className="p-6 space-y-4">
              <div className="flex justify-between items-start gap-4">
                <div className={`h-11 w-11 shrink-0 flex items-center justify-center rounded-2xl ${meal.iconColor}`}>
                  <meal.icon className="h-5.5 w-5.5" />
                </div>
                <div className="flex items-center gap-1 text-[10px] font-semibold text-muted-foreground uppercase tracking-wider bg-white dark:bg-neutral-900 px-2 py-0.5 rounded-full border border-neutral-200/50">
                  <Clock className="h-3 w-3" />
                  {meal.time}
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-foreground mb-1">{meal.title}</h3>
                <p className="text-muted-foreground text-xs leading-relaxed min-h-[40px]">{meal.desc}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
