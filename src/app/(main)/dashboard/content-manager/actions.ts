"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function setActiveMenuAction(menuId: string) {
  // 1. Verify caller has staff/admin authorization
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames =
    ((roleMappings as unknown) as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter(Boolean) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    throw new Error("Forbidden: Only nursery staff can manage content.");
  }

  // 2. Execute database update using admin client
  const adminClient = createAdminClient();

  // Set all menus active to false
  const { error: err1 } = await adminClient
    .from("nursery_menus")
    .update({ is_active: false })
    .neq("id", "00000000-0000-0000-0000-000000000000");

  if (err1) throw new Error(err1.message);

  // Set selected menu active to true
  const { error: err2 } = await adminClient
    .from("nursery_menus")
    .update({ is_active: true })
    .eq("id", menuId);

  if (err2) throw new Error(err2.message);

  return { success: true };
}

export async function deleteContentItemAction(tableName: string, id: string) {
  const allowedTables = ["jobs", "news_events", "gallery_media", "nursery_menus"];
  if (!allowedTables.includes(tableName)) {
    throw new Error("Invalid table specified.");
  }

  // 1. Verify caller has staff/admin authorization
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames =
    ((roleMappings as unknown) as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter(Boolean) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    throw new Error("Forbidden: Only nursery staff can manage content.");
  }

  // 2. Perform deletion with admin client
  const adminClient = createAdminClient();
  const { error } = await adminClient.from(tableName).delete().eq("id", id);
  if (error) throw new Error(error.message);

  return { success: true };
}
