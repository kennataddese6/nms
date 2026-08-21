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

  // 2. Fetch children with complete linked parent profile details (including email & phone)
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
      )
    `)
    .order("created_at", { ascending: false });

  // 3. Fetch rooms for classroom assignments
  const { data: rooms } = await adminClient.from("rooms").select("id, name, min_age_months, max_age_months");

  return (
    <div className="space-y-6 px-4 py-6 md:px-8">
      <div>
        <h1 className="font-bold text-3xl tracking-tight">Nursery CRM</h1>
        <p className="mt-1 text-muted-foreground text-sm">
          Manage enrolled students, parent contact cards, and registrations.
        </p>
      </div>

      <NurseryCrm initialParents={parents || []} initialChildren={children || []} rooms={rooms || []} />
    </div>
  );
}
