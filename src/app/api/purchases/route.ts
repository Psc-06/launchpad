import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { prisma } from '@/lib/db';
import { authOptions } from '@/lib/auth';
import { generateLicenseKey } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: 'Product ID is required' },
        { status: 400 }
      );
    }

    // Get product
    const product = await prisma.product.findUnique({
      where: { id: productId },
    });

    if (!product) {
      return NextResponse.json(
        { error: 'Product not found' },
        { status: 404 }
      );
    }

    // Check if already purchased
    const existingPurchase = await prisma.purchase.findFirst({
      where: {
        productId,
        buyerId: session.user.id,
        status: 'COMPLETED',
      },
    });

    if (existingPurchase) {
      return NextResponse.json(
        { error: 'You already own this product' },
        { status: 400 }
      );
    }

    // Create purchase (Mark as COMPLETED for demo - will require payment integration)
    const purchase = await prisma.purchase.create({
      data: {
        productId,
        buyerId: session.user.id,
        sellerId: product.sellerId,
        amount: product.price,
        currency: 'USD',
        status: 'COMPLETED', // Demo: auto-complete. TODO: require Stripe payment
      },
    });

    // Generate license key (ACTIVE since purchase is completed)
    const licenseKey = await prisma.licenseKey.create({
      data: {
        key: generateLicenseKey(),
        productId,
        userId: session.user.id,
        purchaseId: purchase.id,
        status: 'ACTIVE', // Active immediately for demo
      },
    });

    return NextResponse.json({
      purchase,
      licenseKey,
      message: 'Purchase initiated. Proceed to payment.',
    });
  } catch (error) {
    console.error('Error creating purchase:', error);
    return NextResponse.json(
      { error: 'Failed to create purchase' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const purchases = await prisma.purchase.findMany({
      where: {
        buyerId: session.user.id,
      },
      include: {
        product: true,
        licenseKey: true,
      },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(purchases);
  } catch (error) {
    console.error('Error fetching purchases:', error);
    return NextResponse.json(
      { error: 'Failed to fetch purchases' },
      { status: 500 }
    );
  }
}
