import { createAdminClient } from "@/lib/supabase/admin";

import { NurseryFooter } from "../_components/nursery-footer";
import { NurseryHeader } from "../_components/nursery-header";
import { AboutHero } from "./_components/about-hero";
import { Philosophy } from "./_components/philosophy";
import { Safeguarding } from "./_components/safeguarding";
import { Team } from "./_components/team";
import { Vision } from "./_components/vision";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AboutPage() {
  const adminClient = createAdminClient();

  const { data: leadershipMembers } = await adminClient
    .from("jobs")
    .select("*")
    .eq("type", "LEADERSHIP")
    .order("created_at", { ascending: true });

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground animate-fade-in">
      <NurseryHeader />
      <main className="flex-grow">
        <AboutHero />
        <Philosophy />
        <Vision />
        <Safeguarding />
        <Team leadershipMembers={leadershipMembers || []} />
      </main>
      <NurseryFooter />
    </div>
  );
}
