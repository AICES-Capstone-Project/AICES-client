// src/components/Layout/system/systemRole.config.ts
import { APP_ROUTES } from "../../../services/config";

export type SystemRole = "system_admin" | "system_manager" | "system_staff";

export type SystemRoleConfig = {
  role: SystemRole;
  basePath: string;
  title: string;

  // menu visibility flags
  showUsers: boolean;
  showBanners: boolean;
  showFeedbacks: boolean;
};

export const SYSTEM_ROLE_CONFIG: Record<SystemRole, SystemRoleConfig> = {
  system_admin: {
    role: "system_admin",
    basePath: APP_ROUTES.SYSTEM, // "/system"
    title: "System Admin",
    showUsers: true,
    showBanners: true,
    showFeedbacks: true,
  },
  system_manager: {
    role: "system_manager",
    basePath: APP_ROUTES.SYSTEM_MANAGER, // "/system_manager"
    title: "System Manager",
    showUsers: false,
    showBanners: false, // ✅ only admin CRUD banner
    showFeedbacks: true,
  },
  system_staff: {
    role: "system_staff",
    basePath: APP_ROUTES.SYSTEM_STAFF, // "/system_staff"
    title: "System Staff",
    showUsers: false,
    showBanners: false, // ✅ only admin CRUD banner
    showFeedbacks: true, // ✅ staff can view feedbacks
  },
};
