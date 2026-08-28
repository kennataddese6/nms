"use client";

import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { CircleUser, LogOut, User } from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { createClient } from "@/lib/supabase/client";
import { getInitials } from "@/lib/utils";

export function HeaderUserMenu() {
  const supabase = createClient();
  const pathname = usePathname();

  const [loggingOut, setLoggingOut] = useState(false);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    email: string;
    role: string;
    avatar: string;
  }>({
    name: "User Profile",
    email: "user@bubblydnursery.co.uk",
    role: "STAFF",
    avatar: "",
  });

  useEffect(() => {
    async function loadUser() {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession();

        if (session?.user) {
          const { data: profile } = await supabase
            .from("profiles")
            .select("first_name, last_name, email")
            .eq("id", session.user.id)
            .maybeSingle();

          const name = profile
            ? `${profile.first_name || ""} ${profile.last_name || ""}`.trim() || "Nursery User"
            : session.user.email?.split("@")[0] || "Nursery User";

          const email = profile?.email || session.user.email || "";

          // Query role mappings
          const { data: roleMappings } = await supabase
            .from("user_roles")
            .select("roles(name)")
            .eq("user_id", session.user.id);

          const roleNames = (roleMappings?.map((rm: any) => rm.roles?.name) || []).map((r: string) =>
            (r || "").toUpperCase()
          );

          let role = "PARENT";
          if (
            roleNames.includes("ADMIN") ||
            roleNames.includes("SUPER_ADMIN") ||
            roleNames.includes("SUPER ADMIN") ||
            roleNames.includes("NURSERY_MANAGER") ||
            roleNames.includes("NURSERY MANAGER") ||
            roleNames.includes("MANAGER")
          ) {
            role = "NURSERY MANAGER";
          } else if (roleNames.length > 0) {
            role = roleNames[0];
          } else if (
            pathname.includes("/nursery-crm") ||
            pathname.includes("/rooms") ||
            pathname.includes("/content-manager")
          ) {
            role = "NURSERY MANAGER";
          }

          setUserInfo({
            name,
            email,
            role,
            avatar: `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name)}`,
          });
        } else if (
          pathname.includes("/nursery-crm") ||
          pathname.includes("/rooms") ||
          pathname.includes("/content-manager")
        ) {
          setUserInfo({
            name: "Admin Manager",
            email: "admin@bubblydnursery.co.uk",
            role: "NURSERY MANAGER",
            avatar: "https://api.dicebear.com/7.x/initials/svg?seed=Admin",
          });
        }
      } catch (err) {
        console.error("Error loading header user:", err);
      }
    }

    loadUser();
  }, [supabase, pathname]);

  const handleLogout = async () => {
    try {
      setLoggingOut(true);
      await supabase.auth.signOut();
    } catch (err) {
      console.error("Logout error:", err);
    } finally {
      if (typeof window !== "undefined") {
        window.localStorage.clear();
        window.location.href = "/auth/v1/login";
      }
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-9 w-9 rounded-full p-0 border hover:bg-accent focus-visible:ring-1">
          <Avatar className="h-9 w-9 rounded-full">
            <AvatarImage src={userInfo.avatar || undefined} alt={userInfo.name} />
            <AvatarFallback className="rounded-full bg-primary/10 text-primary font-bold text-xs">
              {getInitials(userInfo.name) || <User className="h-4 w-4" />}
            </AvatarFallback>
          </Avatar>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 rounded-2xl p-2 shadow-xl" align="end" sideOffset={8}>
        <DropdownMenuLabel className="font-normal p-2">
          <div className="flex flex-col space-y-1.5">
            <div className="flex items-center justify-between">
              <p className="text-sm font-bold leading-none">{userInfo.name}</p>
              <span className="inline-flex items-center rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold text-primary tracking-wide uppercase">
                {userInfo.role}
              </span>
            </div>
            <p className="text-xs text-muted-foreground truncate">{userInfo.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <DropdownMenuItem asChild className="rounded-xl cursor-pointer py-2">
            <a href="/dashboard/account" className="flex items-center gap-2 text-xs font-medium">
              <CircleUser className="h-4 w-4 text-muted-foreground" />
              <span>Account & Profile Settings</span>
            </a>
          </DropdownMenuItem>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          disabled={loggingOut}
          onClick={handleLogout}
          className="rounded-xl cursor-pointer py-2 text-destructive focus:text-destructive focus:bg-destructive/10 font-semibold text-xs flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          <span>{loggingOut ? "Signing Out..." : "Log Out"}</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
