export const PLATFORM_NAME = "LaunchPad";
export const PLATFORM_DESCRIPTION = "A marketplace for buying and selling pre-built SaaS starter kits";

export const PRODUCT_CATEGORIES = [
  "AI & Machine Learning",
  "E-Commerce",
  "CRM",
  "Project Management",
  "Analytics Dashboard",
  "Authentication",
  "Payment Processing",
  "Marketplace",
  "Subscription SaaS",
  "Social Network",
  "Real-time Communication",
  "Content Management",
  "Other",
];

export const TECH_STACKS = [
  "Next.js",
  "React",
  "Node.js",
  "Express",
  "MongoDB",
  "PostgreSQL",
  "Firebase",
  "AWS",
  "Stripe",
  "TypeScript",
  "TailwindCSS",
  "GraphQL",
  "REST API",
];

export const COMMISSION_PERCENTAGE = 15; // 15% platform commission
export const MIN_WITHDRAWAL = 100;
export const STRIPE_PLATFORM_FEE = 2.9; // 2.9% + $0.30

export const DEPLOYMENT_PROVIDERS = ["vercel", "netlify", "aws"];
export const PAYMENT_PROVIDERS = ["stripe", "razorpay"];

export const LICENSE_EXPIRY_DAYS = 365;
export const MAX_LICENSE_ACTIVATIONS = 5;

export const PAGINATION_LIMIT = 12;

export const FILE_UPLOAD_LIMITS = {
  image: 10 * 1024 * 1024, // 10MB
  pdf: 50 * 1024 * 1024, // 50MB
  video: 500 * 1024 * 1024, // 500MB
};

export const SUPPORTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];
export const SUPPORTED_VIDEO_TYPES = ["video/mp4", "video/webm"];

// Routes
export const ROUTES = {
  HOME: "/",
  LOGIN: "/auth/login",
  REGISTER: "/auth/register",
  DASHBOARD: "/dashboard",
  SELLER_DASHBOARD: "/dashboard/seller",
  BUYER_DASHBOARD: "/dashboard/buyer",
  PRODUCTS: "/products",
  PRODUCT_DETAIL: "/products/[slug]",
  SELLER_PRODUCTS: "/dashboard/seller/products",
  SELLER_ANALYTICS: "/dashboard/seller/analytics",
  BUYER_LIBRARY: "/dashboard/buyer/library",
  SETTINGS: "/dashboard/settings",
  AI_SCOPE: "/ai-scope",
};
