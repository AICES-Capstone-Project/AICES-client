// permissions/systemPermissions.ts
export type SystemRoleName =
  | "System Admin"
  | "System Manager"
  | "System Staff";

export const canManageCompanies = (role?: string) => {
  if (!role) return false;
  return role === "System Admin" || role === "System Manager";
};

export const canViewCompaniesOnly = (role?: string) => {
  return role === "System Staff";
};
