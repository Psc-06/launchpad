import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth';
import { redirect } from 'next/navigation';

export async function getSession() {
  const session = await getServerSession(authOptions);
  return session;
}

export async function requireAuth() {
  const session = await getSession();
  if (!session) {
    redirect('/auth/login');
  }
  return session;
}

export async function requireSeller() {
  const session = await requireAuth();
  if (session.user.role !== 'SELLER') {
    redirect('/dashboard/buyer');
  }
  return session;
}

export async function requireBuyer() {
  const session = await requireAuth();
  if (session.user.role !== 'BUYER') {
    redirect('/dashboard/seller');
  }
  return session;
}

export async function requireAdmin() {
  const session = await requireAuth();
  if (session.user.role !== 'ADMIN') {
    redirect('/');
  }
  return session;
}
