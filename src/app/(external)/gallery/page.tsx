import { Image as ImageIcon, Sparkles } from "lucide-react";

import { createAdminClient } from "@/lib/supabase/admin";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { GalleryFilterList } from "./_components/gallery-filter-list";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function GalleryPage() {
  const adminClient = createAdminClient();

  const { data: media } = await adminClient.from("gallery_media").select("*").order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-gradient-to-b from-sky-50 via-emerald-50 to-amber-50 text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Hero Banner */}
        <section className="bg-gradient-to-br from-sky-200 via-cyan-100 to-emerald-100 py-16 sm:py-20 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/3 -z-10 h-64 w-64 rounded-full bg-yellow-300/30 blur-3xl" />
          <div className="absolute bottom-0 right-1/4 -z-10 h-64 w-64 rounded-full bg-pink-300/20 blur-3xl" />

          {/* Floating decorations */}
          <span
            aria-hidden="true"
            className="absolute top-6 left-10 text-3xl pointer-events-none select-none nursery-twinkle opacity-60 hidden sm:block"
          >
            ⭐
          </span>
          <span
            aria-hidden="true"
            className="absolute top-10 right-12 text-3xl pointer-events-none select-none nursery-float opacity-60 hidden sm:block"
            style={{ animationDelay: "0.8s" }}
          >
            🎨
          </span>
          <span
            aria-hidden="true"
            className="absolute bottom-6 left-1/4 text-2xl pointer-events-none select-none nursery-wiggle opacity-50 hidden md:block"
          >
            🎈
          </span>

          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative z-10">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/70 backdrop-blur-sm border border-white/80 text-sky-800 px-4 py-1.5 text-xs font-bold shadow-sm mb-4">
              <ImageIcon className="h-4 w-4 text-orange-500" />
              Nursery Life & Moments
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-sky-950 tracking-tight leading-[1.1]">
              Photo & Activity Gallery 🖼️
            </h1>
            <p className="mt-4 text-lg text-sky-900/80 max-w-2xl mx-auto leading-relaxed">
              Step inside our classrooms, explore our outdoor garden exploration areas, and preview daily learning
              activities.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-12 sm:py-20">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GalleryFilterList initialMedia={media || []} />
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
