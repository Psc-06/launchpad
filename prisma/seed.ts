import { prisma } from '@/lib/db';
import bcryptjs from 'bcryptjs';

async function main() {
  try {
    // Create a test seller user
    const hashedPassword = await bcryptjs.hash('password123', 10);
    
    const seller = await prisma.user.upsert({
      where: { email: 'seller@launchpad.com' },
      update: {},
      create: {
        email: 'seller@launchpad.com',
        name: 'Demo Seller',
        password: hashedPassword,
        role: 'SELLER',
      },
    });

    // Create seller profile if it doesn't exist
    await prisma.sellerProfile.upsert({
      where: { userId: seller.id },
      update: {},
      create: {
        userId: seller.id,
        companyName: 'Tech Innovations Inc',
        description: 'Premium SaaS starter kits',
        verified: true,
        rating: 4.8,
      },
    });

    // Seed products
    const productsData = [
      {
        title: 'AI SaaS Starter Kit',
        slug: 'ai-saas-starter-kit',
        description: 'Complete AI-powered SaaS application with OpenAI integration, Stripe payments, and user authentication.',
        shortDescription: 'AI-powered SaaS template with OpenAI integration',
        price: 49,
        category: 'AI & Machine Learning',
        tags: JSON.stringify(['AI', 'Next.js', 'OpenAI', 'Full-stack']),
        features: JSON.stringify(['OpenAI API Integration', 'Stripe Payments', 'User Auth', 'Admin Dashboard', 'API Rate Limiting']),
        techStack: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'PostgreSQL', 'Stripe', 'OpenAI']),
        thumbnail: '🤖',
        images: JSON.stringify([]),
        status: 'PUBLISHED',
        downloads: 324,
        rating: 4.8,
        reviewCount: 32,
        featured: true,
        sellerId: seller.id,
      },
      {
        title: 'CRM Boilerplate',
        slug: 'crm-boilerplate',
        description: 'Professional CRM system with contact management, pipeline tracking, and team collaboration features.',
        shortDescription: 'Enterprise CRM solution with contact & pipeline management',
        price: 39,
        category: 'Enterprise',
        tags: JSON.stringify(['CRM', 'React', 'MongoDB', 'Real-time']),
        features: JSON.stringify(['Contact Management', 'Sales Pipeline', 'Team Collaboration', 'Analytics', 'Reporting']),
        techStack: JSON.stringify(['React', 'Node.js', 'MongoDB', 'Socket.io', 'Chart.js']),
        thumbnail: '📊',
        images: JSON.stringify([]),
        status: 'PUBLISHED',
        downloads: 156,
        rating: 4.6,
        reviewCount: 18,
        featured: true,
        sellerId: seller.id,
      },
      {
        title: 'E-Commerce Marketplace',
        slug: 'ecommerce-marketplace',
        description: 'Full-featured marketplace platform with vendor management, product listings, orders, and Stripe integration.',
        shortDescription: 'Multi-vendor marketplace with Stripe payments',
        price: 79,
        category: 'E-Commerce',
        tags: JSON.stringify(['Marketplace', 'Full-stack', 'Stripe', 'Multi-vendor']),
        features: JSON.stringify(['Product Listings', 'Shopping Cart', 'Vendor Management', 'Order Tracking', 'Payment Processing', 'Reviews']),
        techStack: JSON.stringify(['Next.js', 'Express', 'PostgreSQL', 'Stripe', 'Redis']),
        thumbnail: '🛒',
        images: JSON.stringify([]),
        status: 'PUBLISHED',
        downloads: 289,
        rating: 4.9,
        reviewCount: 42,
        featured: true,
        sellerId: seller.id,
      },
      {
        title: 'Analytics Dashboard',
        slug: 'analytics-dashboard',
        description: 'Real-time analytics and data visualization dashboard with customizable charts and reports.',
        shortDescription: 'Real-time analytics with data visualization',
        price: 59,
        category: 'Dashboard',
        tags: JSON.stringify(['Dashboard', 'Data Viz', 'Real-time', 'Analytics']),
        features: JSON.stringify(['Real-time Charts', 'Custom Reports', 'Data Export', 'User Roles', 'Integration APIs']),
        techStack: JSON.stringify(['React', 'Chart.js', 'Recharts', 'Node.js', 'PostgreSQL']),
        thumbnail: '📈',
        images: JSON.stringify([]),
        status: 'PUBLISHED',
        downloads: 201,
        rating: 4.7,
        reviewCount: 25,
        featured: false,
        sellerId: seller.id,
      },
      {
        title: 'SaaS Boilerplate Pro',
        slug: 'saas-boilerplate-pro',
        description: 'Production-ready SaaS boilerplate with authentication, billing, teams, and dashboard.',
        shortDescription: 'Complete SaaS solution with teams & billing',
        price: 99,
        category: 'SaaS',
        tags: JSON.stringify(['SaaS', 'Next.js', 'Stripe', 'Teams']),
        features: JSON.stringify(['User Auth', 'Team Management', 'Stripe Billing', 'Admin Panel', 'Email Templates']),
        techStack: JSON.stringify(['Next.js', 'TypeScript', 'Prisma', 'Stripe', 'SendGrid']),
        thumbnail: '💼',
        images: JSON.stringify([]),
        status: 'PUBLISHED',
        downloads: 145,
        rating: 4.9,
        reviewCount: 38,
        featured: true,
        sellerId: seller.id,
      },
      {
        title: 'Social Media App',
        slug: 'social-media-app',
        description: 'Modern social media platform with posts, likes, followers, messaging, and real-time notifications.',
        shortDescription: 'Feature-rich social media platform',
        price: 69,
        category: 'Social',
        tags: JSON.stringify(['Social', 'Real-time', 'Web', 'Mobile']),
        features: JSON.stringify(['Posts & Feed', 'Messaging', 'Notifications', 'User Profiles', 'Search']),
        techStack: JSON.stringify(['React Native', 'Firebase', 'Express', 'MongoDB']),
        thumbnail: '👥',
        images: JSON.stringify([]),
        status: 'PUBLISHED',
        downloads: 267,
        rating: 4.7,
        reviewCount: 29,
        featured: false,
        sellerId: seller.id,
      },
    ];

    for (const productData of productsData) {
      await prisma.product.upsert({
        where: { slug: productData.slug },
        update: {},
        create: productData,
      });
    }

    console.log('✅ Database seeded successfully!');
    console.log(`Created ${productsData.length} products`);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
