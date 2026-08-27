import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";

import { NurseryCrm } from "./_components/nursery-crm";

export const revalidate = 0;

export default async function NurseryCrmPage() {
  const adminClient = createAdminClient();

  // 1. Fetch parents with their user profile details (first_name, last_name, email, phone)
  const { data: parents } = await adminClient
    .from("parents")
    .select(`
      id,
      address,
      emergency_contact,
      relationship_status,
      profiles!parents_profile_id_fkey (
        id,
        email,
        first_name,
        last_name,
        phone
      )
    `)
    .order("created_at", { ascending: false });

  // 2. Fetch children with complete linked parent profile details (including email & phone) & child_staff links
  const { data: children } = await adminClient
    .from("children")
    .select(`
      id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      branch,
      medical_notes,
      allergies,
      photo_consent,
      emergency_medical_consent,
      status,
      room_id,
      child_parents (
        parent_id,
        relationship,
        parents (
          id,
          profiles!parents_profile_id_fkey (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        )
      ),
      child_staff (
        staff_id,
        staff (
          id,
          job_title,
          preferred_name,
          nursery_branch,
          room_department,
          profiles!staff_profile_id_fkey (
            id,
            first_name,
            last_name,
            email,
            phone
          )
        )
      )
    `)
    .order("created_at", { ascending: false });

  // 3. Fetch staff members with profile details and child_staff links
  const { data: staffList } = await adminClient
    .from("staff")
    .select(`
      id,
      job_title,
      start_date,
      status,
      preferred_name,
      mobile_number,
      ni_number,
      nursery_branch,
      room_department,
      employment_type,
      dbs_certificate_number,
      username,
      emergency_contact_name,
      emergency_contact_relationship,
      emergency_contact_number,
      confirm_correct,
      agree_policies,
      agree_terms,
      created_at,
      profiles!staff_profile_id_fkey (
        id,
        email,
        first_name,
        last_name,
        phone
      ),
      child_staff (
        child_id
      )
    `)
    .order("created_at", { ascending: false });

  // 4. Fetch rooms for classroom assignments
  const { data: rooms } = await adminClient.from("rooms").select("id, name, min_age_months, max_age_months");

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Nursery CRM</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Manage staff members, enrolled students, parent contact cards, and registrations.
        </p>
      </div>

      <NurseryCrm
        initialParents={parents || []}
        initialChildren={children || []}
        initialStaff={staffList || []}
        rooms={rooms || []}
      />
    </div>
  );
}
