import { Boxes, ClipboardList, FileText, FolderKanban, Handshake, LayoutDashboard, Package, Truck, Users, type LucideIcon } from "lucide-react";

export type NavigationEntry = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export const workspaceNavigation: NavigationEntry[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Catalog", to: "/catalog", icon: Package },
  { label: "Inventory", to: "/inventory", icon: Boxes },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "Suppliers", to: "/suppliers", icon: Handshake },
  { label: "Sales", to: "/sales", icon: FileText },
  { label: "Orders", to: "/orders", icon: ClipboardList },
  { label: "Deliveries", to: "/deliveries", icon: Truck },
];
