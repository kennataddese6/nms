import { createClient } from "@/lib/supabase/server";

import { ContentManager } from "./_components/content-manager";

export const revalidate = 0;

export default async function ContentManagerPage() {
  const supabase = await createClient();

  // 1. Fetch job openings (excluding leadership)
  const { data: jobs } = await supabase
    .from("jobs")
    .select("*")
    .neq("type", "LEADERSHIP")
    .order("created_at", { ascending: false });

  // 1b. Fetch leadership members
  const { data: leadership } = await supabase
    .from("jobs")
    .select("*")
    .eq("type", "LEADERSHIP")
    .order("created_at", { ascending: true });

  // 2. Fetch news & events posts
  const { data: newsEvents } = await supabase.from("news_events").select("*").order("created_at", { ascending: false });

  // 3. Fetch gallery items
  const { data: galleryItems } = await supabase
    .from("gallery_media")
    .select("*")
    .order("created_at", { ascending: false });

  // 4. Fetch nutrition menus
  const { data: menus } = await supabase.from("nursery_menus").select("*").order("created_at", { ascending: false });

  return (
    <div className="py-6 px-4 md:px-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Website Content Manager</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage leadership team profiles, publish career vacancies, post nursery news, update photo gallery, and manage
          nutrition menus.
        </p>
      </div>

      <ContentManager
        initialJobs={jobs || []}
        initialLeadership={leadership || []}
        initialNewsEvents={newsEvents || []}
        initialGalleryItems={galleryItems || []}
        initialMenus={menus || []}
      />
    </div>
  );
}
