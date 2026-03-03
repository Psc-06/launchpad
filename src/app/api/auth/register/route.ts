import { NextRequest, NextResponse } from 'next/server';
import bcryptjs from 'bcryptjs';
import { prisma } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, email, password, role, companyName } = body;

    // Validation
    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email },
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcryptjs.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role: role as 'SELLER' | 'BUYER',
      },
    });

    // Create profile based on role
    if (role === 'SELLER') {
      await prisma.sellerProfile.create({
        data: {
          userId: user.id,
          companyName: companyName || name,
        },
      });
    } else {
      await prisma.buyerProfile.create({
        data: {
          userId: user.id,
          displayName: name,
        },
      });
    }

    return NextResponse.json(
      {
        message: 'User created successfully',
        user: {
          id: user.id,
          email: user.email,
          role: user.role,
        },
      },
      { status: 201 }
    );
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('Registration error:', errorMessage);
    console.error('Full error:', error);
    return NextResponse.json(
      { error: `Failed to register user: ${errorMessage}` },
      { status: 500 }
    );
  }
}
