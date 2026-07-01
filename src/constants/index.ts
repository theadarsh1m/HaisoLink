export const ROLES = {
  ADMIN: "ADMIN",
  DELIVERY_AGENT: "DELIVERY_AGENT",
  CUSTOMER: "CUSTOMER",
} as const;

export type RoleType = keyof typeof ROLES;

export const ORDER_STATUS = {
  PENDING: "PENDING",
  ASSIGNED: "ASSIGNED",
  PICKED_UP: "PICKED_UP",
  IN_TRANSIT: "IN_TRANSIT",
  DELIVERED: "DELIVERED",
  CANCELLED: "CANCELLED",
  RESCHEDULED: "RESCHEDULED",
} as const;

export type OrderStatusType = keyof typeof ORDER_STATUS;

export const NOTIFICATION_TYPES = {
  ORDER_ASSIGNED: "ORDER_ASSIGNED",
  ORDER_STATUS_UPDATE: "ORDER_STATUS_UPDATE",
  SYSTEM_ALERT: "SYSTEM_ALERT",
  ZONE_WARNING: "ZONE_WARNING",
} as const;

export type NotificationType = keyof typeof NOTIFICATION_TYPES;

export const ROUTES = {
  HOME: "/",
  LOGIN: "/login",
  REGISTER: "/register",
  FORGOT_PASSWORD: "/forgot-password",
  RESET_PASSWORD: "/reset-password",
  UNAUTHORIZED: "/unauthorized",
  ADMIN: {
    DASHBOARD: "/admin/dashboard",
    ANALYTICS: "/admin/analytics",
    SECURITY: "/admin/security",
    SETTINGS: "/admin/settings",
  },
  CUSTOMER: {
    DASHBOARD: "/customer/dashboard",
    TRACKING: "/customer/tracking",
    PROFILE: "/customer/profile",
  },
  AGENT: {
    DASHBOARD: "/agent/dashboard",
    SCHEDULE: "/agent/schedule",
    MAP: "/agent/map",
  },
} as const;
