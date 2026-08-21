import { Apple, Heart } from "lucide-react";

import { createClient } from "@/lib/supabase/server";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { MenuWorkspace } from "./_components/menu-workspace";

export const dynamic = "force-dynamic";
export const revalidate = 0;

const fallbackMenu = {
  name: "Autumn Menu 2025 - Week 1 (Sample)",
  breakfast: "Cereals, Fresh fruit, Porridge, Toast. Served on a rolling basis between 7.30-8.45",
  morning_snack: "Served on a rolling basis from 10am",
  lunch: {
    Monday: "Creamy Cheese & Broccoli Pasta",
    Tuesday: "Chicken Vermicelli Rice with Vegetables",
    Wednesday: "Asian Noodle stir fry with a medley of vegetables",
    Thursday: "Spaghetti with Meatballs in a rich Tomato & hidden vegetable sauce",
    Friday: "Toma's Special Chicken Stew & Rice",
  },
  desserts: {
    Monday: "Toma's famous, Vegan Chocolate Cake with yoghurt or custard",
    Tuesday: "Jelly with a fruit surprise",
    Wednesday: "Greek yoghurt & Bananas (& honey for our older children)",
    Thursday: "Jam and coconut sponge",
    Friday: "Rice Pudding",
  },
  afternoon_snack: {
    Monday: "Home-made Date Loaf",
    Tuesday: "Lemon mini muffins",
    Wednesday: "Apple cinnamon bread",
    Thursday: "Mini pinwheels",
    Friday: "cheese, cucumber & breadsticks",
  },
  afternoon_tea: {
    Monday: "White bean soup with homemade croutons",
    Tuesday: "Fish fingers with roasted vegetables",
    Wednesday: "Roasted Tomato soup",
    Thursday: "Mini Burritos",
    Friday: "Mac & Cheese",
  },
};

export default async function PublicMenuPage() {
  const supabase = await createClient();

  const { data: activeMenu } = await supabase.from("nursery_menus").select("*").eq("is_active", true).maybeSingle();

  const menu = activeMenu || fallbackMenu;

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-primary/10 py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute top-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-4 py-1.5 text-xs font-semibold mb-4">
              <Apple className="h-4 w-4" />
              Healthy & Balanced Nutrition
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Weekly Nursery Menu
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Explore our freshly prepared daily meals and snacks. Our menus are made sweet naturally with fresh fruits
              and cooked in-house by our chef.
            </p>
          </div>
        </section>

        {/* Menu Grid and Switcher */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-10">
              <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">
                Current Rotation
              </span>
              <h2 className="text-2xl font-bold text-foreground mt-1">{menu.name}</h2>
            </div>

            <MenuWorkspace menu={menu} />

            {/* Note on Allergies */}
            <div className="mt-12 p-6 rounded-3xl border bg-amber-50/50 dark:bg-amber-950/10 border-amber-200 flex gap-4 items-start max-w-3xl mx-auto text-sm leading-relaxed">
              <Heart className="h-5 w-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-amber-900 dark:text-amber-200 mb-1">Food Allergies & Intolerances</h4>
                <p className="text-amber-800 dark:text-amber-300 text-xs">
                  We cater to all individual dietary needs, religious choices, and food allergies. Please ensure your
                  child's medical preferences are fully recorded in the Parent Portal or reported to our admissions
                  coordinators.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
