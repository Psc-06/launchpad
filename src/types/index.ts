// Type definitions for LaunchPad

// String union types for statuses and roles (SQLite doesn't support native enums)
export type UserRole = "SELLER" | "BUYER" | "ADMIN";
export type ProductStatus = "DRAFT" | "PUBLISHED" | "ARCHIVED";
export type PurchaseStatus = "PENDING" | "COMPLETED" | "FAILED" | "REFUNDED";
export type LicenseStatus = "ACTIVE" | "INACTIVE" | "EXPIRED" | "REVOKED";
export type DeploymentStatus = "PENDING" | "IN_PROGRESS" | "DEPLOYED" | "FAILED";
export type NotificationType = "ORDER_PLACED" | "ORDER_COMPLETED" | "DEPLOYMENT_READY" | "PRODUCT_UPDATED" | "SALE_MADE" | "REFUND_ISSUED" | "LICENSE_EXPIRING" | "REVIEW_RECEIVED";

export interface User {
  id: string;
  email: string;
  name?: string;
  image?: string;
  role: UserRole;
  emailVerified?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface SellerProduct {
  id: string;
  title: string;
  slug: string;
  description: string;
  shortDescription?: string;
  thumbnail: string;
  images: string[];
  price: number;
  category: string;
  tags: string[];
  features: string[];
  techStack: string[];
  previewUrl?: string;
  demoVideoUrl?: string;
  sourceRepoUrl?: string;
  status: ProductStatus;
  downloads: number;
  rating: number;
  reviewCount: number;
  featured: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface BuyerPurchase {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  status: PurchaseStatus;
  createdAt: Date;
  updatedAt: Date;
  product: SellerProduct;
}

export interface LicenseKeyInfo {
  id: string;
  key: string;
  productId: string;
  status: LicenseStatus;
  activationCount: number;
  maxActivations: number;
  expiresAt?: Date;
  createdAt: Date;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  success: boolean;
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
