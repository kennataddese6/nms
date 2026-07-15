import { createClient } from "@/lib/supabase/server";
import { ContentManager } from "./_components/content-manager";

export const revalidate = 0;

export default async function ContentManagerPage() {
  const supabase = await createClient();

  // 1. Fetch job openings
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .order("created_at", { ascending: false });

  // 2. Fetch news & events posts
  const { data: newsEvents } = await supabase
    .from("news_events")
    .select("*")
    .order("created_at", { ascending: false });

  // 3. Fetch gallery items
  const { data: galleryItems } = await supabase
    .from("gallery_media")
    .select("*")
    .order("created_at", { ascending: false });

  return (
    <div className="py-6 px-4 md:px-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Content Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Publish active career postings, list nursery news / events, and update the public photo gallery.
        </p>
      </div>

      <ContentManager 
        initialJobs={jobs || []} 
        initialNewsEvents={newsEvents || []} 
        initialGalleryItems={galleryItems || []} 
      />
    </div>
  );
}
