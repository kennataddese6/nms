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

  const roleNames =
    (roleMappings as unknown as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter(Boolean) || [];
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

// ==========================================
// STAFF ACTIONS & CAPACTIY CHECK
// ==========================================

export interface RegisterStaffInput {
  firstName: string;
  lastName: string;
  preferredName?: string;
  email: string;
  mobileNumber: string;
  niNumber: string;
  jobTitle: string;
  nurseryBranch: string;
  roomDepartment: string;
  employmentType: string;
  dbsCertificateNumber: string;
  username: string;
  password?: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactNumber: string;
  confirmCorrect: boolean;
  agreePolicies: boolean;
  agreeTerms: boolean;
}

export async function registerStaffAction(data: RegisterStaffInput) {
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
    throw new Error("Forbidden: Only nursery staff can register staff members.");
  }

  const adminClient = createAdminClient();

  // Create user auth profile
  let profileId: string | null = null;
  const { data: existingProfile } = await adminClient
    .from("profiles")
    .select("id")
    .eq("email", data.email)
    .maybeSingle();

  if (existingProfile) {
    profileId = existingProfile.id;
  } else {
    const { data: authRes, error: authErr } = await adminClient.auth.admin.createUser({
      email: data.email,
      password: data.password || "BubblyStaff2026!",
      email_confirm: true,
      user_metadata: {
        first_name: data.firstName,
        last_name: data.lastName,
        username: data.username,
      },
    });

    if (authErr || !authRes.user) {
      throw new Error(authErr?.message || "Failed to create staff user account.");
    }

    profileId = authRes.user.id;

    await adminClient.from("profiles").upsert({
      id: profileId,
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      phone: data.mobileNumber,
    });
  }

  // Assign STAFF role
  const { data: staffRole } = await adminClient.from("roles").select("id").eq("name", "STAFF").maybeSingle();

  if (staffRole && profileId) {
    const { data: existingRole } = await adminClient
      .from("user_roles")
      .select("id")
      .eq("user_id", profileId)
      .eq("role_id", staffRole.id)
      .maybeSingle();

    if (!existingRole) {
      await adminClient.from("user_roles").insert({
        user_id: profileId,
        role_id: staffRole.id,
      });
    }
  }

  // Create staff detail record
  const { error: staffError } = await adminClient.from("staff").insert({
    profile_id: profileId,
    job_title: data.jobTitle,
    start_date: new Date().toISOString().split("T")[0],
    preferred_name: data.preferredName || null,
    mobile_number: data.mobileNumber,
    ni_number: data.niNumber,
    nursery_branch: data.nurseryBranch,
    room_department: data.roomDepartment,
    employment_type: data.employmentType,
    dbs_certificate_number: data.dbsCertificateNumber,
    username: data.username,
    emergency_contact_name: data.emergencyContactName,
    emergency_contact_relationship: data.emergencyContactRelationship,
    emergency_contact_number: data.emergencyContactNumber,
    confirm_correct: data.confirmCorrect,
    agree_policies: data.agreePolicies,
    agree_terms: data.agreeTerms,
  });

  if (staffError) {
    throw new Error(staffError.message || "Failed to create staff record.");
  }

  return { success: true };
}

export interface UpdateStaffInput {
  staffId: string;
  firstName: string;
  lastName: string;
  jobTitle: string;
  nurseryBranch: string;
  roomDepartment: string;
  employmentType: string;
  dbsCertificateNumber: string;
  mobileNumber: string;
  niNumber: string;
  preferredName?: string;
  emergencyContactName: string;
  emergencyContactRelationship: string;
  emergencyContactNumber: string;
}

export async function updateStaffAction(data: UpdateStaffInput) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized: Log in required.");
  }

  const adminClient = createAdminClient();

  // 1. Fetch target staff record
  const { data: staffRecord, error: fetchErr } = await adminClient
    .from("staff")
    .select("profile_id")
    .eq("id", data.staffId)
    .single();

  if (fetchErr || !staffRecord) {
    throw new Error("Staff record not found.");
  }

  // 2. Update profile name & phone
  if (staffRecord.profile_id) {
    await adminClient
      .from("profiles")
      .update({
        first_name: data.firstName,
        last_name: data.lastName,
        phone: data.mobileNumber,
      })
      .eq("id", staffRecord.profile_id);
  }

  // 3. Update staff details
  const { error: updateErr } = await adminClient
    .from("staff")
    .update({
      job_title: data.jobTitle,
      nursery_branch: data.nurseryBranch,
      room_department: data.roomDepartment,
      employment_type: data.employmentType,
      dbs_certificate_number: data.dbsCertificateNumber,
      mobile_number: data.mobileNumber,
      ni_number: data.niNumber,
      preferred_name: data.preferredName || null,
      emergency_contact_name: data.emergencyContactName,
      emergency_contact_relationship: data.emergencyContactRelationship,
      emergency_contact_number: data.emergencyContactNumber,
    })
    .eq("id", data.staffId);

  if (updateErr) {
    throw new Error(updateErr.message || "Failed to update staff record.");
  }

  return { success: true };
}

export async function deleteStaffAction(staffId: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("Unauthorized.");
  }

  const adminClient = createAdminClient();

  // 1. Fetch staff record to get profile_id
  const { data: staffRecord } = await adminClient.from("staff").select("profile_id").eq("id", staffId).maybeSingle();

  // 2. Delete staff record
  const { error } = await adminClient.from("staff").delete().eq("id", staffId);

  if (error) {
    throw new Error(error.message || "Failed to delete staff record.");
  }

  // 3. Clean up associated profile & user role if present
  if (staffRecord?.profile_id) {
    await adminClient.from("user_roles").delete().eq("user_id", staffRecord.profile_id);
    await adminClient.from("profiles").delete().eq("id", staffRecord.profile_id);
    try {
      await adminClient.auth.admin.deleteUser(staffRecord.profile_id);
    } catch {
      // Ignore if user account was already deleted or doesn't exist
    }
  }

  return { success: true };
}

// ==========================================
// STUDENT ACTIONS WITH STAFF LINKING
// ==========================================

export interface RegisterStudentInput {
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  branch: string;
  roomId?: string;
  medicalNotes?: string;
  allergies?: string;
  medicalConsent: boolean;
  photoConsent: boolean;
  parentId: string;
  relationship: string;
  staffId?: string;
}

export async function registerStudentAction(data: RegisterStudentInput) {
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
    throw new Error("Forbidden: Only nursery staff can register students.");
  }

  const adminClient = createAdminClient();

  const validRoomId = data.roomId && data.roomId.trim() !== "" ? data.roomId : null;
  const validParentId = data.parentId && data.parentId.trim() !== "" ? data.parentId : null;
  const validStaffId = data.staffId && data.staffId.trim() !== "" ? data.staffId : null;

  // 1. Check max 3 students capacity rule if staffId is provided
  if (validStaffId) {
    const { count, error: countErr } = await adminClient
      .from("child_staff")
      .select("id", { count: "exact", head: true })
      .eq("staff_id", validStaffId);

    if (!countErr && count !== null && count >= 3) {
      throw new Error("Selected staff member has reached the maximum capacity of 3 assigned students. Please select another staff member.");
    }
  }

  // Insert child record
  const { data: newChild, error: childError } = await adminClient
    .from("children")
    .insert({
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dob,
      gender: data.gender,
      branch: data.branch,
      medical_notes: data.medicalNotes && data.medicalNotes.trim() !== "" ? data.medicalNotes : null,
      allergies: data.allergies && data.allergies.trim() !== "" ? data.allergies : null,
      photo_consent: data.photoConsent,
      emergency_medical_consent: data.medicalConsent,
      status: "WAITING_LIST",
      room_id: validRoomId,
    })
    .select("id")
    .single();

  if (childError || !newChild) {
    throw new Error(childError?.message || "Failed to create child record.");
  }

  // Insert child-parent link
  if (validParentId) {
    const { error: linkError } = await adminClient.from("child_parents").insert({
      child_id: newChild.id,
      parent_id: validParentId,
      relationship: data.relationship,
    });

    if (linkError) {
      throw new Error(linkError.message || "Failed to link parent to child record.");
    }
  }

  // Insert child-staff link
  if (validStaffId) {
    await adminClient.from("child_staff").insert({
      child_id: newChild.id,
      staff_id: validStaffId,
    });
  }

  return { success: true };
}

export interface UpdateStudentInput {
  id: string;
  firstName: string;
  lastName: string;
  dob: string;
  gender: string;
  branch: string;
  status: string;
  roomId?: string;
  medicalNotes?: string;
  allergies?: string;
  parentId?: string;
  relationship?: string;
  staffId?: string;
}

export async function updateStudentAction(data: UpdateStudentInput) {
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
    throw new Error("Forbidden: Only nursery staff can update students.");
  }

  const adminClient = createAdminClient();

  const validRoomId = data.roomId && data.roomId.trim() !== "" ? data.roomId : null;
  const validParentId = data.parentId && data.parentId.trim() !== "" ? data.parentId : null;
  const validStaffId = data.staffId && data.staffId.trim() !== "" ? data.staffId : null;

  if (validStaffId) {
    // Check if staff has reached 3 capacity excluding this child
    const { data: currentLinks } = await adminClient
      .from("child_staff")
      .select("child_id")
      .eq("staff_id", validStaffId);

    const existingOtherChildren = (currentLinks || []).filter((l) => l.child_id !== data.id);
    if (existingOtherChildren.length >= 3) {
      throw new Error("Selected staff member has reached the maximum capacity of 3 assigned students. Please select another staff member.");
    }
  }

  // 1. Update children table
  const { error: childError } = await adminClient
    .from("children")
    .update({
      first_name: data.firstName,
      last_name: data.lastName,
      date_of_birth: data.dob,
      gender: data.gender,
      branch: data.branch,
      status: data.status,
      room_id: validRoomId,
      medical_notes: data.medicalNotes || null,
      allergies: data.allergies || null,
    })
    .eq("id", data.id);

  if (childError) {
    throw new Error(childError.message || "Failed to update child record.");
  }

  // 2. Update parent link if specified
  if (validParentId) {
    await adminClient.from("child_parents").delete().eq("child_id", data.id);
    await adminClient.from("child_parents").insert({
      child_id: data.id,
      parent_id: validParentId,
      relationship: data.relationship || "Parent / Guardian",
    });
  }

  // 3. Update staff link if specified
  if (validStaffId) {
    await adminClient.from("child_staff").delete().eq("child_id", data.id);
    await adminClient.from("child_staff").insert({
      child_id: data.id,
      staff_id: validStaffId,
    });
  }

  return { success: true };
}

export async function deleteStudentAction(studentId: string) {
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
    throw new Error("Forbidden: Only nursery staff can delete students.");
  }

  const adminClient = createAdminClient();

  const { error } = await adminClient.from("children").delete().eq("id", studentId);

  if (error) {
    throw new Error(error.message || "Failed to delete student record.");
  }

  return { success: true };
}
