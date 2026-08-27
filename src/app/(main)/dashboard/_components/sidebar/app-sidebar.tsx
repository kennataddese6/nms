"use client";

import * as React from "react";

import Image from "next/image";
import Link from "next/link";

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

const _data = {
  navSecondary: [
    {
      title: "Settings",
      url: "#",
      icon: Settings,
    },
    {
      title: "Get Help",
      url: "#",
      icon: CircleHelp,
    },
    {
      title: "Search",
      url: "#",
      icon: Search,
    },
  ],
  documents: [
    {
      name: "Data Library",
      url: "#",
      icon: Database,
    },
    {
      name: "Reports",
      url: "#",
      icon: ClipboardList,
    },
    {
      name: "Word Assistant",
      url: "#",
      icon: File,
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const supabase = createClient();
  const [userRole, setUserRole] = React.useState<string>("PARENT");
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

        const { data: roleMappings } = await supabase
          .from("user_roles")
          .select("roles(name)")
          .eq("user_id", session.user.id);

        const roleNames = roleMappings?.map((rm: any) => rm.roles?.name) || [];
        if (roleNames.includes("NURSERY_MANAGER") || roleNames.includes("STAFF") || roleNames.includes("SUPER_ADMIN")) {
          setUserRole("NURSERY_MANAGER");
        } else {
          setUserRole("PARENT");
        }
      }
    }
    getRole();
  }, [supabase]);

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
                <div className="relative h-7 w-7 overflow-hidden rounded-full shrink-0 border bg-background">
                  <Image
                    src="/images/newlogo.png"
                    alt="Bubbly Day Nursery logo"
                    fill
                    className="object-cover"
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
        {/* <NavDocuments items={data.documents} /> */}
        {/* <NavSecondary items={data.navSecondary} className="mt-auto" /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={currentUser} />
      </SidebarFooter>
    </Sidebar>
  );
}
