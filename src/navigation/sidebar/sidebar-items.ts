import {
  Banknote,
  Calendar,
  ChartBar,
  CheckSquare,
  Fingerprint,
  Forklift,
  Gauge,
  GraduationCap,
  Kanban,
  LayoutDashboard,
  ListTodo,
  Lock,
  type LucideIcon,
  Mail,
  MessageSquare,
  ReceiptText,
  Server,
  ShoppingBag,
  SquareArrowUpRight,
  Users,
  Layers,
} from "lucide-react";

export type NavBadge = "new" | "soon";

export interface NavSubItem {
  id: string;
  title: string;
  url: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

interface NavItemBase {
  id: string;
  title: string;
  icon?: LucideIcon;
  badge?: NavBadge;
  disabled?: boolean;
  newTab?: boolean;
}

export interface NavMainLinkItem extends NavItemBase {
  url: string;
  subItems?: never;
}

export interface NavMainParentItem extends NavItemBase {
  subItems: NavSubItem[];
}

export type NavMainItem = NavMainLinkItem | NavMainParentItem;

export interface NavGroup {
  id: number;
  label?: string;
  items: NavMainItem[];
  roles?: string[];
}

export const sidebarItems: NavGroup[] = [
  {
    id: 1,
    label: "Overview",
    roles: ["NURSERY_MANAGER", "STAFF", "SUPER_ADMIN"],
    items: [
      {
        id: "default",
        title: "Overview",
        url: "/dashboard/default",
        icon: LayoutDashboard,
      },
    ],
  },
  {
    id: 2,
    label: "Nursery Operations",
    roles: ["NURSERY_MANAGER", "STAFF", "SUPER_ADMIN"],
    items: [
      {
        id: "nursery-crm",
        title: "Nursery CRM",
        url: "/dashboard/nursery-crm",
        icon: Users,
      },
      {
        id: "content-manager",
        title: "Website Content",
        url: "/dashboard/content-manager",
        icon: Server,
      },
      {
        id: "rooms-manager",
        title: "Rooms Manager",
        url: "/dashboard/rooms",
        icon: Layers,
      },
    ],
  },
  {
    id: 3,
    label: "Parent Zone",
    roles: ["PARENT"],
    items: [
      {
        id: "parent-portal",
        title: "My Portal",
        url: "/dashboard/parent",
        icon: LayoutDashboard,
      },
    ],
  },
];
