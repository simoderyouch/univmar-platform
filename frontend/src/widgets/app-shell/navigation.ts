import { Boxes, ClipboardList, Factory, FileText, FolderKanban, Grid3X3, Handshake, LayoutDashboard, Package, Paperclip, QrCode, ReceiptText, Scissors, ScrollText, ShieldCheck, Truck, Users, Globe2, type LucideIcon } from "lucide-react";

export type NavigationEntry = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export type NavigationGroup = {
  label: string;
  items: NavigationEntry[];
};

export const workspaceNavigationGroups: NavigationGroup[] = [
  {
    label: "Overview",
    items: [{ label: "Dashboard", to: "/dashboard", icon: LayoutDashboard }],
  },
  {
    label: "Stone & workshop",
    items: [
      { label: "Catalog", to: "/catalog", icon: Package },
      { label: "Inventory", to: "/inventory", icon: Boxes },
      { label: "Slabs", to: "/slabs", icon: Grid3X3 },
      { label: "Offcuts", to: "/remnants", icon: Scissors },
      { label: "Scan labels", to: "/scan", icon: QrCode },
      { label: "Fabrication", to: "/fabrication", icon: Factory },
    ],
  },
  {
    label: "Sales & delivery",
    items: [
      { label: "Customers", to: "/customers", icon: Users },
      { label: "Website CMS", to: "/cms", icon: Globe2 },
      { label: "Projects", to: "/projects", icon: FolderKanban },
      { label: "RFQs", to: "/rfqs", icon: ScrollText },
      { label: "Quotations", to: "/quotations", icon: FileText },
      { label: "Orders", to: "/orders", icon: ClipboardList },
      { label: "Deliveries", to: "/deliveries", icon: Truck },
    ],
  },
  {
    label: "Finance & records",
    items: [
      { label: "Suppliers", to: "/suppliers", icon: Handshake },
      { label: "Invoices", to: "/invoices", icon: ReceiptText },
      { label: "Documents", to: "/documents", icon: Paperclip },
      { label: "People & access", to: "/users", icon: ShieldCheck },
    ],
  },
];

export const workspaceNavigation = workspaceNavigationGroups.flatMap((group) => group.items);
