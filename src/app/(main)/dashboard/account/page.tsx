import { redirect } from "next/navigation";

import { createClient } from "@/lib/supabase/server";

import { AccountWorkspace } from "./_components/account-workspace";

export const revalidate = 0;

export default async function AccountPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    redirect("/auth/v1/login");
  }

  // Fetch Profile Details
  const { data: profile } = await supabase
    .from("profiles")
    .select("id, first_name, last_name, email")
    .eq("id", user.id)
    .single();

  // Fetch User Roles
  const { data: roleMappings } = await supabase.from("user_roles").select("roles(name)").eq("user_id", user.id);

  const roleNames =
    ((roleMappings as unknown) as Array<{ roles: { name: string } | null }>)
      ?.map((rm) => rm.roles?.name)
      .filter((n): n is string => Boolean(n)) || [];

  return (
    <div className="py-6 px-4 md:px-8">
      <AccountWorkspace
        userProfile={
          profile || {
            id: user.id,
            email: user.email,
          }
        }
        roles={roleNames}
      />
    </div>
  );
}
