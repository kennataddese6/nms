"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface CreateRoomInput {
  name: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  capacity: number;
  description?: string;
  branch: string;
}

export async function createRoomAction(data: CreateRoomInput) {
  // 1. Verify user is staff/admin
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
    throw new Error("Forbidden: Only nursery staff can manage rooms.");
  }

  // 2. Perform insert using admin client
  const adminClient = createAdminClient();
  const { data: newRoom, error } = await adminClient
    .from("rooms")
    .insert({
      name: data.name,
      min_age_months: data.minAgeMonths,
      max_age_months: data.maxAgeMonths,
      capacity: data.capacity,
      description: data.description || null,
      branch: data.branch,
    })
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create classroom room.");
  }

  return { success: true, room: newRoom };
}

export interface UpdateRoomInput {
  id: string;
  name: string;
  minAgeMonths: number;
  maxAgeMonths: number;
  capacity: number;
  description?: string;
  branch: string;
}

export async function updateRoomAction(data: UpdateRoomInput) {
  // 1. Verify user is staff/admin
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
    throw new Error("Forbidden: Only nursery staff can manage rooms.");
  }

  // 2. Perform update using admin client
  const adminClient = createAdminClient();
  const { data: updatedRoom, error } = await adminClient
    .from("rooms")
    .update({
      name: data.name,
      min_age_months: data.minAgeMonths,
      max_age_months: data.maxAgeMonths,
      capacity: data.capacity,
      description: data.description || null,
      branch: data.branch,
    })
    .eq("id", data.id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update classroom room.");
  }

  return { success: true, room: updatedRoom };
}

export async function deleteRoomAction(roomId: string) {
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
    throw new Error("Forbidden: Only nursery staff can delete rooms.");
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.from("rooms").delete().eq("id", roomId);
  if (error) {
    throw new Error(error.message || "Failed to delete room.");
  }

  return { success: true };
}
