import { createClient } from "@/lib/supabase/server";

import { NurseryCrm } from "./_components/nursery-crm";

export const revalidate = 0;

export default async function NurseryCrmPage() {
  const supabase = await createClient();

  // 1. Fetch parents with their user profile details
  const { data: parents } = await supabase
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

  // 2. Fetch children with their linked parents details
  const { data: children } = await supabase
    .from("children")
    .select(`
      id,
      first_name,
      last_name,
      date_of_birth,
      gender,
      medical_notes,
      allergies,
      photo_consent,
      emergency_medical_consent,
      status,
      room_id,
      child_parents (
        relationship,
        parents (
          id,
          profiles!parents_profile_id_fkey (
            first_name,
            last_name
          )
        )
      )
    `)
    .order("created_at", { ascending: false });

  // 3. Fetch rooms for room assignments
  const { data: rooms } = await supabase.from("rooms").select("id, name, age_group");

  return (
    <div className="py-6 px-4 md:px-8 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Nursery CRM</h1>
        <p className="text-muted-foreground text-sm mt-1">
          Manage enrolled students, parent contact cards, and registrations.
        </p>
      </div>

      <NurseryCrm initialParents={parents || []} initialChildren={children || []} rooms={rooms || []} />
    </div>
  );
}
