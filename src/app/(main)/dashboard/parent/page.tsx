import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { Baby, Info, Calendar, Sparkles, BookOpen, Clock, Heart } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export const revalidate = 0;

export default async function ParentDashboardPage() {
  const supabase = await createClient();

  // 1. Get logged in Auth identity
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/v1/login");
  }

  // 2. Fetch Parent profile
  const { data: parent } = await supabase
    .from("parents")
    .select(`
      id,
      address,
      profiles!parents_profile_id_fkey (
        first_name,
        last_name
      )
    `)
    .eq("profile_id", user.id)
    .single();

  if (!parent) {
    // If auth user is not registered as a parent, redirect to admin home default
    redirect("/dashboard/default");
  }

  // 3. Fetch Linked children
  const { data: childLinks } = await supabase
    .from("child_parents")
    .select(`
      relationship,
      children (
        id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        allergies,
        status,
        room_id,
        rooms (
          name,
          age_group
        )
      )
    `)
    .eq("parent_id", parent.id);

  // 4. Fetch recent announcements
  const { data: announcements } = await supabase
    .from("news_events")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(3);

  const profiles = parent.profiles as any;
  const parentName = `${profiles?.first_name || ""} ${profiles?.last_name || ""}`;
  const childrenList = childLinks || [];

  return (
    <div className="py-6 px-4 md:px-8 space-y-6">
      {/* Welcome Banner */}
      <div className="p-6 rounded-3xl border bg-primary/10 relative overflow-hidden flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div className="absolute top-0 right-1/4 -z-10 h-32 w-32 rounded-full bg-accent/20 blur-2xl" />
        <div>
          <span className="text-xs font-bold text-primary uppercase tracking-wider block">Parent Portal</span>
          <h1 className="text-3xl font-black tracking-tight text-foreground mt-1">
            Hello, {profiles?.first_name || "Parent"}!
          </h1>
          <p className="text-muted-foreground text-sm mt-1 max-w-xl">
            Welcome to your Bubbly Nursery portal. Track your child's daily logs, check classroom routines, and read news notices.
          </p>
        </div>
        <div className="flex gap-2 shrink-0">
          <Link href="/contact">
            <Button size="sm" variant="outline" className="rounded-full">
              <Clock className="h-4 w-4 mr-1.5" /> Book physical tour
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Children list */}
        <div className="lg:col-span-8 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Baby className="h-6 w-6 text-primary" />
            My Children
          </h2>

          {childrenList.length === 0 ? (
            <Card className="rounded-3xl border border-dashed py-12 text-center">
              <CardContent className="flex flex-col items-center">
                <Heart className="h-10 w-10 text-muted-foreground/50 mb-3" />
                <h3 className="font-bold text-foreground text-sm">No linked children found</h3>
                <p className="text-xs text-muted-foreground mt-1 max-w-xs mx-auto">
                  If you registered recently, our office is mapping your profile card. Please contact admissions if details do not show.
                </p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {childrenList.map((link: any, idx: number) => {
                const child = link.children;
                if (!child) return null;
                return (
                  <Card key={idx} className="rounded-3xl overflow-hidden shadow-sm hover:shadow-md transition-all duration-200">
                    <CardHeader className="border-b bg-neutral-50/50 p-6 flex flex-row justify-between items-start">
                      <div>
                        <CardTitle className="text-lg font-bold">
                          {child.first_name} {child.last_name}
                        </CardTitle>
                        <CardDescription className="text-xs">
                          {link.relationship} • DOB: {child.date_of_birth}
                        </CardDescription>
                      </div>
                      <Badge
                        variant="outline"
                        className={
                          child.status === "ACTIVE"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                            : "bg-amber-50 text-amber-700 border-amber-200"
                        }
                      >
                        {child.status}
                      </Badge>
                    </CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="flex justify-between text-xs">
                        <span className="text-muted-foreground">Classroom:</span>
                        <span className="font-bold text-foreground">
                          {child.rooms?.name || "Waitlist Preferred"}
                        </span>
                      </div>
                      {child.allergies && (
                        <div className="flex justify-between text-xs">
                          <span className="text-muted-foreground">Allergies:</span>
                          <span className="font-bold text-destructive">
                            {child.allergies}
                          </span>
                        </div>
                      )}
                      
                      {/* Placeholder portal logs triggers */}
                      <div className="pt-2 border-t flex gap-2">
                        <Button variant="outline" size="xs" className="w-full rounded-full text-[10px] py-1.5 h-auto cursor-not-allowed" disabled>
                          Daily Logs (Soon)
                        </Button>
                        <Button variant="outline" size="xs" className="w-full rounded-full text-[10px] py-1.5 h-auto cursor-not-allowed" disabled>
                          Journal (Soon)
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Right Column: Notices & Info */}
        <div className="lg:col-span-4 space-y-6">
          <h2 className="text-2xl font-bold tracking-tight text-foreground flex items-center gap-2">
            <Info className="h-6 w-6 text-primary" />
            Nursery notices
          </h2>

          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">News & Notices Feed</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {announcements?.length === 0 ? (
                <p className="text-xs text-muted-foreground text-center py-4">No recent announcements.</p>
              ) : (
                announcements?.map((post) => (
                  <div key={post.id} className="p-3 border rounded-2xl space-y-1 bg-neutral-50/50">
                    <div className="flex items-center justify-between text-[9px] font-bold text-primary">
                      <span>{post.category.toUpperCase()}</span>
                      {post.event_date && <span>{post.event_date}</span>}
                    </div>
                    <h4 className="text-xs font-bold text-foreground">{post.title}</h4>
                    <p className="text-[10px] text-muted-foreground leading-relaxed line-clamp-2">
                      {post.content}
                    </p>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Quick Info links */}
          <Card className="rounded-3xl shadow-sm">
            <CardHeader>
              <CardTitle className="text-base font-bold">Quick resources</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Link href="/rooms" className="flex items-center justify-between p-3 rounded-2xl border hover:bg-neutral-50/50 transition-colors text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-primary" /> Class schedules
                </span>
                <span className="text-primary text-[10px]">View</span>
              </Link>
              <Link href="/curriculum" className="flex items-center justify-between p-3 rounded-2xl border hover:bg-neutral-50/50 transition-colors text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4 text-primary" /> Learning Framework
                </span>
                <span className="text-primary text-[10px]">View</span>
              </Link>
              <Link href="/parent-info" className="flex items-center justify-between p-3 rounded-2xl border hover:bg-neutral-50/50 transition-colors text-xs font-semibold">
                <span className="flex items-center gap-2">
                  <Sparkles className="h-4 w-4 text-primary" /> Funding & Fees
                </span>
                <span className="text-primary text-[10px]">View</span>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
