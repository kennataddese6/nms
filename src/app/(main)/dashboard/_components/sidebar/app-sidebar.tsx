"use client";

import * as React from "react";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";

import { CircleHelp, ClipboardList, Database, File, Search, Settings } from "lucide-react";
import { useShallow } from "zustand/react/shallow";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "@/components/ui/sidebar";
import { APP_CONFIG } from "@/config/app-config";
import { createClient } from "@/lib/supabase/client";
import { sidebarItems } from "@/navigation/sidebar/sidebar-items";
import { usePreferencesStore } from "@/stores/preferences/preferences-provider";

import { NavMain } from "./nav-main";
import { NavUser } from "./nav-user";

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient();
  const pathname = usePathname();

  // If directly navigating to admin routes (nursery-crm, rooms, content-manager), default role to NURSERY_MANAGER
  const isAdminRoute =
    pathname.includes("/nursery-crm") ||
    pathname.includes("/rooms") ||
    pathname.includes("/content-manager");

  const [userRole, setUserRole] = React.useState<string>(isAdminRoute ? "NURSERY_MANAGER" : "PARENT");
  const [currentUser, setCurrentUser] = React.useState({
    name: "Staff / Parent",
    email: "user@bubblydnursery.co.uk",
    avatar: "https://api.dicebear.com/7.x/initials/svg?seed=U",
  });

  React.useEffect(() => {
    async function getRole() {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (session?.user) {
        // Query user profile info
        const { data: profile } = await supabase
          .from("profiles")
          .select("first_name, last_name, email")
          .eq("id", session.user.id)
          .maybeSingle();

        const name = profile
          ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Nursery User"
          : session.user.email?.split("@")[0] || "Nursery User";
        const email = profile?.email || session.user.email || "user@bubblydnursery.co.uk";
        const avatarSeed = profile?.first_name || name[0] || "U";

        setCurrentUser({
          name,
          email,
          avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(avatarSeed)}`,
        });

        // 1. Query user_roles table
        const { data: roleMappings } = await supabase
          .from("user_roles")
          .select("roles(name)")
          .eq("user_id", session.user.id);

        const roleNames = (roleMappings?.map((rm: any) => rm.roles?.name) || []).map((r: string) =>
          (r || "").toUpperCase()
        );

        // 2. Query staff table
        const { data: staffMember } = await supabase
          .from("staff")
          .select("id")
          .or(`profile_id.eq.${session.user.id},email.eq.${session.user.email}`)
          .maybeSingle();

        // 3. Query metadata role
        const metadataRole = (
          session.user.app_metadata?.role ||
          session.user.user_metadata?.role ||
          ""
        ).toUpperCase();

        const adminRoles = ["NURSERY_MANAGER", "STAFF", "SUPER_ADMIN", "ADMIN", "MANAGER"];
        const isAdminUser =
          !!staffMember ||
          adminRoles.some((r) => roleNames.includes(r)) ||
          adminRoles.includes(metadataRole) ||
          isAdminRoute;

        if (isAdminUser) {
          setUserRole("NURSERY_MANAGER");
        } else {
          setUserRole("PARENT");
        }
      }
    }
    getRole();
  }, [supabase, isAdminRoute]);

  const { sidebarVariant, sidebarCollapsible, isSynced } = usePreferencesStore(
    useShallow((s) => ({
      sidebarVariant: s.values.sidebar_variant,
      sidebarCollapsible: s.values.sidebar_collapsible,
      isSynced: s.isSynced,
    })),
  );

  const variant = isSynced ? sidebarVariant : props.variant;
  const collapsible = isSynced ? sidebarCollapsible : props.collapsible;

  const filteredItems = sidebarItems.filter((group) => {
    if (!group.roles) return true;
    return group.roles.includes(userRole);
  });

  return (
    <Sidebar {...props} variant={variant} collapsible={collapsible}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild className="h-12 py-2">
              <Link
                prefetch={false}
                href={userRole === "PARENT" ? "/dashboard/parent" : "/dashboard/nursery-crm"}
                className="flex items-center gap-2"
              >
                <div className="relative h-7 w-7 overflow-hidden shrink-0">
                  <Image
                    src="/images/newlogo.png"
                    alt="Bubbly Day Nursery logo"
                    fill
                    className="object-contain"
                    sizes="28px"
                  />
                </div>
                <span className="font-semibold text-sm leading-none">{APP_CONFIG.name}</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={filteredItems} />
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
