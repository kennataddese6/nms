import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { RoomsWorkspace } from "./_components/rooms-workspace";

export const revalidate = 0;

export default async function RoomsPage() {
  const supabase = await createClient();

  // 1. Get logged in Auth identity
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) {
    redirect("/auth/v1/login");
  }

  // 2. Verify User has staff/admin permissions
  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames = roleMappings?.map((rm: any) => rm.roles?.name) || [];
  const isStaff =
    roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN");

  if (!isStaff) {
    redirect("/dashboard/parent");
  }

  // 3. Fetch Rooms with enrolled children
  const { data: rooms, error: roomsError } = await supabase
    .from("rooms")
    .select(`
      id,
      name,
      age_group,
      capacity,
      description,
      branch,
      children (
        id,
        first_name,
        last_name,
        date_of_birth,
        gender,
        status,
        allergies
      )
    `)
    .order("name", { ascending: true });

  if (roomsError) {
    console.error("Failed to load rooms:", roomsError.message);
  }

  // 4. Fetch Staff assignments
  const { data: staff, error: staffError } = await supabase.from("staff").select(`
      id,
      room_id,
      profiles!staff_profile_id_fkey (
        first_name,
        last_name,
        email
      )
    `);

  if (staffError) {
    console.error("Failed to load staff:", staffError.message);
  }

  return <RoomsWorkspace initialRooms={rooms || []} initialStaff={staff || []} />;
}
