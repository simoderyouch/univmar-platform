export type WorkspaceRole = "ADMIN" | "MANAGER" | "SALES_AGENT" | "INVENTORY_MANAGER" | "PURCHASING_MANAGER";

const access: Record<string, WorkspaceRole[]> = {
  "/dashboard": ["ADMIN", "MANAGER", "SALES_AGENT", "INVENTORY_MANAGER", "PURCHASING_MANAGER"],
  "/catalog": ["ADMIN", "MANAGER"],
  "/inventory": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "/slabs": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "/remnants": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "/scan": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "/fabrication": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "/customers": ["ADMIN", "MANAGER", "SALES_AGENT"],
  "/projects": ["ADMIN", "MANAGER", "SALES_AGENT"],
  "/rfqs": ["ADMIN", "MANAGER", "SALES_AGENT"],
  "/quotations": ["ADMIN", "MANAGER", "SALES_AGENT"],
  "/orders": ["ADMIN", "MANAGER", "SALES_AGENT"],
  "/deliveries": ["ADMIN", "MANAGER", "INVENTORY_MANAGER"],
  "/suppliers": ["ADMIN", "MANAGER", "PURCHASING_MANAGER"],
  "/invoices": ["ADMIN", "MANAGER"],
  "/documents": ["ADMIN", "MANAGER", "SALES_AGENT", "INVENTORY_MANAGER", "PURCHASING_MANAGER"],
  "/users": ["ADMIN"],
  "/cms": ["ADMIN", "MANAGER"],
};

export function isWorkspaceRole(value: string): value is WorkspaceRole {
  return value in { ADMIN: true, MANAGER: true, SALES_AGENT: true, INVENTORY_MANAGER: true, PURCHASING_MANAGER: true };
}

export function canAccessRoute(role: string, path: string): boolean {
  const key = Object.keys(access).filter(route => path === route || path.startsWith(`${route}/`)).sort((a, b) => b.length - a.length)[0];
  return !!key && isWorkspaceRole(role) && access[key].includes(role);
}

export function canAccessFormInbox(role: string): boolean {
  return isWorkspaceRole(role) && ["ADMIN", "MANAGER", "SALES_AGENT"].includes(role);
}

export function roleLabel(role: string) { return role.replaceAll("_", " ").toLowerCase().replace(/\b\w/g, letter => letter.toUpperCase()); }
