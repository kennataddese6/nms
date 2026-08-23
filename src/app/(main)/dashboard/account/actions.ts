"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export async function updateMyPasswordAction(newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Please log in to update password.");
  }

  // Update authenticated user's password using Supabase Auth
  const { error } = await supabase.auth.updateUser({
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message || "Failed to update password.");
  }

  return { success: true };
}

export async function resetUserPasswordAction(targetUserId: string, newPassword: string) {
  if (!newPassword || newPassword.length < 6) {
    throw new Error("Password must be at least 6 characters long.");
  }

  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  // Verify requester is staff/admin
  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);
  const roleNames =
    ((roleMappings as unknown) as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter(Boolean) || [];

  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    throw new Error("Forbidden: Only staff and admins can reset user passwords.");
  }

  const adminClient = createAdminClient();
  const { error } = await adminClient.auth.admin.updateUserById(targetUserId, {
    password: newPassword,
  });

  if (error) {
    throw new Error(error.message || "Failed to reset target user password.");
  }

  return { success: true };
}
