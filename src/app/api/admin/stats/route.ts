import { NextRequest } from 'next/server';
import { requireAdmin } from '@/middleware/auth';
import { successResponse, errorResponse } from '@/utils/api-response';
import { prisma } from '@/lib/db';
import { logger } from '@/utils/logger';

export async function GET(request: NextRequest) {
  try {
    // Only admins can access
    const authResult = await requireAdmin(request);
    if (authResult instanceof Response) return authResult;

    // Gather statistics
    const [
      totalUsers,
      totalProducts,
      totalPurchases,
      completedPurchases,
    ] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.purchase.count(),
      prisma.purchase.findMany({
        where: { status: 'COMPLETED' },
        select: { amount: true },
      }),
    ]);

    const totalRevenue = completedPurchases.reduce((sum, p) => sum + p.amount, 0);

    // Get recent activity
    const recentActivity = await prisma.purchase.findMany({
      take: 10,
      orderBy: { createdAt: 'desc' },
      include: {
        buyer: { select: { name: true } },
        product: { select: { title: true } },
      },
    });

    const formattedActivity = recentActivity.map((purchase) => ({
      type: 'Purchase',
      description: `${purchase.buyer.name} purchased ${purchase.product.title}`,
      createdAt: purchase.createdAt,
    }));

    return successResponse({
      totalUsers,
      totalProducts,
      totalRevenue,
      totalPurchases,
      recentActivity: formattedActivity,
    });

  } catch (error) {
    logger.error('Failed to fetch admin stats', error);
    return errorResponse('Failed to fetch statistics', 500);
  }
}
