"use server";

import { revalidatePath } from "next/cache";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function revalidatePublicPages() {
  revalidatePath("/");
  revalidatePath("/about");
  revalidatePath("/menu");
  revalidatePath("/news");
  revalidatePath("/rooms");
  revalidatePath("/careers");
  revalidatePath("/gallery");
}

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
    (roleMappings as unknown as Array<{ roles: { name: string } | null }>)
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
  const { error: err2 } = await adminClient.from("nursery_menus").update({ is_active: true }).eq("id", menuId);

  if (err2) throw new Error(err2.message);

  revalidatePublicPages();
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
    (roleMappings as unknown as Array<{ roles: { name: string } | null }>)
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

  revalidatePublicPages();
  return { success: true };
}

export interface SaveMenuInput {
  id?: string;
  name: string;
  breakfast: string;
  morning_snack: string;
  lunch: Record<string, string>;
  desserts: Record<string, string>;
  afternoon_snack: Record<string, string>;
  afternoon_tea: Record<string, string>;
  branch: string;
}

export async function saveMenuAction(data: SaveMenuInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames =
    (roleMappings as unknown as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter(Boolean) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    throw new Error("Forbidden: Only nursery staff can manage content.");
  }

  const adminClient = createAdminClient();

  const payload = {
    name: data.name,
    breakfast: data.breakfast,
    morning_snack: data.morning_snack,
    lunch: data.lunch,
    desserts: data.desserts,
    afternoon_snack: data.afternoon_snack,
    afternoon_tea: data.afternoon_tea,
    branch: data.branch,
  };

  if (data.id) {
    const { data: updated, error } = await adminClient
      .from("nursery_menus")
      .update(payload)
      .eq("id", data.id)
      .select()
      .single();

    if (error) throw new Error(error.message);
    revalidatePublicPages();
    return { success: true, menu: updated };
  }

  const { data: inserted, error } = await adminClient
    .from("nursery_menus")
    .insert({
      ...payload,
      is_active: false,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePublicPages();
  return { success: true, menu: inserted };
}

export interface SaveLeadershipInput {
  id?: string;
  name: string;
  role: string;
  bio: string;
  email?: string;
  branch: string;
}

export async function saveLeadershipMemberAction(data: SaveLeadershipInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames =
    (roleMappings as unknown as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter(Boolean) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    throw new Error("Forbidden: Only nursery staff can manage content.");
  }

  const adminClient = createAdminClient();

  const payload = {
    title: data.name,
    room: data.role,
    description: data.bio,
    salary: data.email || "",
    type: "LEADERSHIP",
    requirements: [],
    branch: data.branch,
  };

  if (data.id) {
    const { data: updated, error } = await adminClient.from("jobs").update(payload).eq("id", data.id).select().single();

    if (error) throw new Error(error.message);
    revalidatePublicPages();
    return { success: true, member: updated };
  }

  const { data: inserted, error } = await adminClient.from("jobs").insert(payload).select().single();

  if (error) throw new Error(error.message);
  revalidatePublicPages();
  return { success: true, member: inserted };
}

export interface SaveJobInput {
  id?: string;
  title: string;
  room: string;
  description: string;
  salary: string;
  requirements: string[];
  branch: string;
}

export async function saveJobAction(data: SaveJobInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized: Log in required.");

  const adminClient = createAdminClient();
  const payload = {
    title: data.title,
    room: data.room,
    description: data.description,
    salary: data.salary,
    type: "CAREERS",
    requirements: data.requirements,
    branch: data.branch,
  };

  if (data.id) {
    const { data: updated, error } = await adminClient.from("jobs").update(payload).eq("id", data.id).select().single();

    if (error) throw new Error(error.message);
    revalidatePublicPages();
    return { success: true, job: updated };
  }

  const { data: inserted, error } = await adminClient.from("jobs").insert(payload).select().single();

  if (error) throw new Error(error.message);
  revalidatePublicPages();
  return { success: true, job: inserted };
}

export interface SaveNewsInput {
  title: string;
  description: string;
  category: string;
  imageUrl?: string;
  eventDate?: string;
}

export async function saveNewsEventAction(data: SaveNewsInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized: Log in required.");

  const adminClient = createAdminClient();
  const { data: inserted, error } = await adminClient
    .from("news_events")
    .insert({
      title: data.title,
      description: data.description,
      category: data.category,
      image_url: data.imageUrl || null,
      event_date: data.eventDate || null,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePublicPages();
  return { success: true, news: inserted };
}

export interface SaveGalleryMediaInput {
  title: string;
  category: string;
  mediaUrl: string;
  mediaType: string;
}

export async function saveGalleryMediaAction(data: SaveGalleryMediaInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error("Unauthorized: Log in required.");

  const adminClient = createAdminClient();
  const { data: inserted, error } = await adminClient
    .from("gallery_media")
    .insert({
      title: data.title,
      category: data.category,
      media_url: data.mediaUrl,
      media_type: data.mediaType,
    })
    .select()
    .single();

  if (error) throw new Error(error.message);
  revalidatePublicPages();
  return { success: true, media: inserted };
}
