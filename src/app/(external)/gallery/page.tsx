import { createClient } from "@/lib/supabase/server";
import { NurseryHeader } from "../_components/nursery-header";
import { NurseryFooter } from "../_components/nursery-footer";
import { GalleryFilterList } from "./_components/gallery-filter-list";
import { Image as ImageIcon } from "lucide-react";

export const revalidate = 0;

export default async function GalleryPage() {
  const supabase = await createClient();

  const { data: media } = await supabase
    .from("gallery_media")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground">
      <NurseryHeader />
      <main className="flex-grow">
        {/* Banner */}
        <section className="bg-primary/10 py-16 sm:py-24 text-center relative overflow-hidden">
          <div className="absolute top-0 left-1/4 -z-10 h-64 w-64 rounded-full bg-accent/15 blur-3xl" />
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 relative">
            <span className="inline-flex items-center gap-2 rounded-full bg-primary/15 text-primary px-4 py-1.5 text-xs font-semibold mb-4">
              <ImageIcon className="h-4 w-4" />
              Nursery Life
            </span>
            <h1 className="font-heading text-4xl sm:text-5xl font-black text-foreground tracking-tight leading-[1.1]">
              Photo & Video Gallery
            </h1>
            <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
              Step inside our classrooms, explore our outdoor mud kitchen, and preview holiday celebrations.
            </p>
          </div>
        </section>

        {/* Gallery Grid */}
        <section className="py-16 sm:py-24">
          <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
            <GalleryFilterList initialMedia={media || []} />
          </div>
        </section>
      </main>
      <NurseryFooter />
    </div>
  );
}
