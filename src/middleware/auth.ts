import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { forbiddenResponse, unauthorizedResponse } from '@/utils/api-response';

export type UserRole = 'BUYER' | 'SELLER' | 'ADMIN';

export async function requireAuth(request: NextRequest) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return unauthorizedResponse('Authentication required');
  }
  
  return session;
}

export async function requireRole(request: NextRequest, allowedRoles: UserRole[]) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return unauthorizedResponse('Authentication required');
  }
  
  if (!allowedRoles.includes(session.user.role as UserRole)) {
    return forbiddenResponse('Insufficient permissions');
  }
  
  return session;
}

export const requireBuyer = (request: NextRequest) => 
  requireRole(request, ['BUYER', 'ADMIN']);

export const requireSeller = (request: NextRequest) => 
  requireRole(request, ['SELLER', 'ADMIN']);

export const requireAdmin = (request: NextRequest) => 
  requireRole(request, ['ADMIN']);

export const requireSellerOrAdmin = (request: NextRequest) => 
  requireRole(request, ['SELLER', 'ADMIN']);

// Middleware to check resource ownership
export async function requireOwnership(
  request: NextRequest,
  resourceUserId: string
) {
  const session = await getServerSession(authOptions);
  
  if (!session || !session.user) {
    return unauthorizedResponse('Authentication required');
  }
  
  // Admins can access everything
  if (session.user.role === 'ADMIN') {
    return session;
  }
  
  // Check ownership
  if (session.user.id !== resourceUserId) {
    return forbiddenResponse('You do not have access to this resource');
  }
  
  return session;
}
