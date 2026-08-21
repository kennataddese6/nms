"use server";

import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

export interface RegisterParentInput {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: string;
  relationshipStatus: string;
}

export async function registerParentAction(data: RegisterParentInput) {
  // 1. Verify caller has staff/admin authorization
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames = roleMappings?.map((rm: any) => rm.roles?.name) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    throw new Error("Forbidden: Only nursery staff can register parents.");
  }

  // 2. Perform admin database operations with admin client (bypasses RLS blocks)
  const adminClient = createAdminClient();

  // Check if profile already exists for this email
  let profileId: string | null = null;
  const { data: existingProfile } = await adminClient
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .maybeSingle();

  if (existingProfile) {
    profileId = existingProfile.id;
    await adminClient
      .from("profiles")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.phone,
      })
      .eq("id", profileId);
  } else {
    // Create new auth user via admin API
    const { data: authRes, error: authErr } = await adminClient.auth.admin.createUser({
      email: data.email,
      email_confirm: true,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
      },
    });

    if (authErr || !authRes.user) {
      throw new Error(authErr?.message || "Failed to create user identity profile.");
    }

    profileId = authRes.user.id;

    // Upsert profile record
    await adminClient.from("profiles").upsert({
      id: profileId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.phone,
    });
  }

  // Ensure PARENT role exists in user_roles
  const { data: parentRole } = await adminClient.from("roles").select("id").eq("name", "PARENT").maybeSingle();

  if (parentRole && profileId) {
    const { data: existingRole } = await adminClient
      .from("user_roles")
      .select("id")
      .eq("user_id", profileId)
      .eq("role_id", parentRole.id)
      .maybeSingle();

    if (!existingRole) {
      await adminClient.from("user_roles").insert({
        user_id: profileId,
        role_id: parentRole.id,
      });
    }
  }

  // Create Parent detail record
  const { error: parentError } = await adminClient.from("parents").insert({
    profile_id: profileId,
    address: data.address,
    emergency_contact: data.emergencyContact,
    relationship_status: data.relationshipStatus,
  });

  if (parentError) {
    throw new Error(parentError.message || "Failed to create parent detail record.");
  }

  return { success: true };
}
