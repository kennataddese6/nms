import { createClient } from "@/lib/supabase/server";
import { redirect } from "next/navigation";
import { ChatWorkspace } from "./_components/chat-workspace";

export const revalidate = 0;

export default async function MessagesPage() {
  const supabase = await createClient();

  // 1. Fetch authenticated user session
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/v1/login");
  }

  // 2. Fetch User Profile
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email")
    .eq("id", user.id)
    .single();

  // 3. Determine if user is staff/manager or parent
  const { data: roleMappings } = await supabase
    .from("user_roles")
    .select("roles(name)")
    .eq("user_id", user.id);

  const roleNames = roleMappings?.map((rm: any) => rm.roles?.name) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") ||
    roleNames.includes("STAFF") ||
    roleNames.includes("SUPER_ADMIN");

  let parentId: string | null = null;
  if (!isStaff) {
    // If not staff, fetch parent details
    const { data: parent } = await supabase
      .from("parents")
      .select("id")
      .eq("profile_id", user.id)
      .maybeSingle();

    if (parent) {
      parentId = parent.id;
    }
  }

  // 4. Query accessible threads
  let threadsQuery = supabase.from("chat_threads").select(`
    *,
    parents!chat_threads_parent_id_fkey (
      id,
      profiles (
        first_name,
        last_name,
        email
      )
    )
  `);

  if (!isStaff && parentId) {
    // Parents only see their own threads
    threadsQuery = threadsQuery.eq("parent_id", parentId);
  }

  const { data: threads, error: threadsError } = await threadsQuery.order("created_at", { ascending: false });

  if (threadsError) {
    console.error("Failed to query threads:", threadsError.message);
  }

  return (
    <ChatWorkspace 
      initialThreads={threads || []} 
      currentUserProfile={profile} 
      isStaff={isStaff}
      parentRecordId={parentId}
    />
  );
}
