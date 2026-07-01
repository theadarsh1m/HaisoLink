import { RoleType, OrderStatusType, NotificationType } from "@/constants";

export interface User {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string | null;
  role: RoleType;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Session {
  id: string;
  userId: string;
  expiresAt: Date | string;
  token: string;
  ipAddress?: string | null;
  userAgent?: string | null;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface PaginationMeta {
  currentPage: number;
  totalPages: number;
  pageSize: number;
  totalCount: number;
  hasPreviousPage: boolean;
  hasNextPage: boolean;
}

export interface QueryFilters {
  search?: string;
  status?: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  page?: number;
  limit?: number;
}

export interface DashboardStats {
  cardTitle: string;
  cardValue: string | number;
  cardDescription?: string;
  trendPercentage?: string;
  trendDirection?: "up" | "down" | "neutral";
}

export interface OrderPlaceholder {
  id: string;
  recipientName: string;
  recipientPhone: string;
  recipientEmail: string;
  pickupAddress: string;
  deliveryAddress: string;
  weight: number;
  dimensions?: string;
  status: OrderStatusType;
  price: number;
  agentId?: string | null;
  customerId: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface NotificationPlaceholder {
  id: string;
  userId: string;
  title: string;
  message: string;
  type: NotificationType;
  isRead: boolean;
  createdAt: Date | string;
}
