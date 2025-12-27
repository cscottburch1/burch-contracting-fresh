// Admin user types and role definitions

export type AdminRole = 'owner' | 'manager' | 'sales' | 'support';

export interface AdminUser {
  id: number;
  email: string;
  name: string;
  role: AdminRole;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  last_login: Date | null;
}

export interface AdminSession {
  userId: number;
  email: string;
  name: string;
  role: AdminRole;
  timestamp: number;
}

// Permission definitions for each role
export const PERMISSIONS = {
  owner: {
    // Full access to everything
    viewLeads: true,
    manageLeads: true,
    viewCustomers: true,
    manageCustomers: true,
    viewProposals: true,
    createProposals: true,
    editProposals: true,
    viewInvoices: true,
    createInvoices: true,
    editInvoices: true,
    viewFinancials: true,
    viewAnalytics: true,
    manageUsers: true,
    manageSettings: true,
    viewProjects: true,
    manageProjects: true,
  },
  manager: {
    // Most access, no user management or critical settings
    viewLeads: true,
    manageLeads: true,
    viewCustomers: true,
    manageCustomers: true,
    viewProposals: true,
    createProposals: true,
    editProposals: true,
    viewInvoices: true,
    createInvoices: true,
    editInvoices: true,
    viewFinancials: true,
    viewAnalytics: true,
    manageUsers: false,
    manageSettings: false,
    viewProjects: true,
    manageProjects: true,
  },
  sales: {
    // Sales focused - leads, proposals, customer view only
    viewLeads: true,
    manageLeads: true,
    viewCustomers: true,
    manageCustomers: false,
    viewProposals: true,
    createProposals: true,
    editProposals: true,
    viewInvoices: false,
    createInvoices: false,
    editInvoices: false,
    viewFinancials: false,
    viewAnalytics: false,
    manageUsers: false,
    manageSettings: false,
    viewProjects: true,
    manageProjects: false,
  },
  support: {
    // View-only for most things
    viewLeads: true,
    manageLeads: false,
    viewCustomers: true,
    manageCustomers: false,
    viewProposals: true,
    createProposals: false,
    editProposals: false,
    viewInvoices: false,
    createInvoices: false,
    editInvoices: false,
    viewFinancials: false,
    viewAnalytics: false,
    manageUsers: false,
    manageSettings: false,
    viewProjects: true,
    manageProjects: false,
  },
} as const;

export type Permission = keyof typeof PERMISSIONS.owner;

// Helper to check if a role has a specific permission
export function hasPermission(role: AdminRole, permission: Permission): boolean {
  return PERMISSIONS[role][permission];
}

// Helper to check multiple permissions
export function hasAnyPermission(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.some(p => PERMISSIONS[role][p]);
}

export function hasAllPermissions(role: AdminRole, permissions: Permission[]): boolean {
  return permissions.every(p => PERMISSIONS[role][p]);
}
