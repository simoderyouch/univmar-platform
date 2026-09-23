import { Boxes, ClipboardList, Factory, FileText, FolderKanban, Grid3X3, Handshake, LayoutDashboard, Package, Paperclip, QrCode, ReceiptText, Scissors, ScrollText, Truck, Users, type LucideIcon } from "lucide-react";

export type NavigationEntry = {
  label: string;
  to: string;
  icon: LucideIcon;
};

export const workspaceNavigation: NavigationEntry[] = [
  { label: "Dashboard", to: "/dashboard", icon: LayoutDashboard },
  { label: "Catalog", to: "/catalog", icon: Package },
  { label: "Inventory", to: "/inventory", icon: Boxes },
  { label: "Slabs", to: "/slabs", icon: Grid3X3 },
  { label: "Offcuts", to: "/remnants", icon: Scissors },
  { label: "Fabrication", to: "/fabrication", icon: Factory },
  { label: "Scan labels", to: "/scan", icon: QrCode },
  { label: "Customers", to: "/customers", icon: Users },
  { label: "Projects", to: "/projects", icon: FolderKanban },
  { label: "RFQs", to: "/rfqs", icon: ScrollText },
  { label: "Quotations", to: "/quotations", icon: FileText },
  { label: "Suppliers", to: "/suppliers", icon: Handshake },
  { label: "Invoices", to: "/invoices", icon: ReceiptText },
  { label: "Documents", to: "/documents", icon: Paperclip },
  { label: "Orders", to: "/orders", icon: ClipboardList },
  { label: "Deliveries", to: "/deliveries", icon: Truck },
];
