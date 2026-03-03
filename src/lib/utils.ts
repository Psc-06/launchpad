import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function generateLicenseKey(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  const segments = [];
  
  for (let i = 0; i < 4; i++) {
    let segment = "";
    for (let j = 0; j < 5; j++) {
      segment += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    segments.push(segment);
  }
  
  return segments.join("-");
}

export function formatCurrency(amount: number, currency: string = "USD"): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currency,
  }).format(amount);
}

export function calculateCommission(amount: number, commissionPercentage: number): number {
  return (amount * commissionPercentage) / 100;
}

export function calculateSellerEarnings(amount: number, commissionPercentage: number): number {
  return amount - calculateCommission(amount, commissionPercentage);
}

export async function generateProjectRoadmapPDF(
  businessIdea: string,
  features: string[],
  techStack: string[],
  timeline: string
): Promise<Buffer> {
  // This will use a PDF generation library like jsPDF or similar
  // For now, returning placeholder
  const pdfContent = `
    Project Roadmap
    
    Business Idea: ${businessIdea}
    
    Features:
    ${features.map((f) => `- ${f}`).join("\n")}
    
    Tech Stack:
    ${techStack.map((t) => `- ${t}`).join("\n")}
    
    Timeline: ${timeline}
  `;
  
  return Buffer.from(pdfContent);
}
