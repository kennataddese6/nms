import { Apple, Heart } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { MenuWorkspace } from "./_components/menu-workspace";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function PublicMenuPage() {
  const adminClient = createAdminClient();

  const { data: activeMenu } = await adminClient
    .from("nursery_menus")
    .select("*")
    .eq("is_active", true)
    .maybeSingle();

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

        {/* Menu Grid or Empty State */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
            {activeMenu ? (
              <>
                <div className="text-center mb-10">
                  <span className="text-xs uppercase font-bold text-muted-foreground tracking-widest">
                    Current Rotation
                  </span>
                  <h2 className="text-2xl font-bold text-foreground mt-1">{activeMenu.name}</h2>
                </div>

                <MenuWorkspace menu={activeMenu} />
              </>
            ) : (
              <div className="text-center py-16 px-6 rounded-3xl border border-dashed bg-card max-w-2xl mx-auto space-y-3 shadow-sm">
                <Apple className="h-12 w-12 text-muted-foreground/40 mx-auto" />
                <h3 className="text-lg font-bold text-foreground">No Active Menu Published</h3>
                <p className="text-sm text-muted-foreground max-w-md mx-auto">
                  Our chef updates the weekly nursery menu rotation regularly. Please check back soon or contact admissions for current dietary schedules.
                </p>
              </div>
            )}

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
