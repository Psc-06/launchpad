import { prisma } from '@/lib/db';
import { CreateProductInput, UpdateProductInput } from '@/validators/product.validator';
import { logger } from '@/utils/logger';

export class ProductService {
  async createProduct(data: CreateProductInput, sellerId: string) {
    try {
      const product = await prisma.product.create({
        data: {
          ...data,
          sellerId,
          tags: JSON.stringify(data.tags),
          features: data.features ? JSON.stringify(data.features) : '[]',
          techStack: data.techStack ? JSON.stringify(data.techStack) : '[]',
          images: '[]',
        },
      });

      logger.product('created', sellerId, { productId: product.id, title: product.title });
      return product;
    } catch (error) {
      logger.error('Failed to create product', error, { sellerId });
      throw error;
    }
  }

  async updateProduct(productId: string, data: UpdateProductInput, userId: string) {
    try {
      // Verify ownership
      const existing = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!existing) {
        throw new Error('Product not found');
      }

      if (existing.sellerId !== userId) {
        throw new Error('Unauthorized');
      }

      const updateData: any = { ...data };
      if (data.tags) updateData.tags = JSON.stringify(data.tags);
      if (data.features) updateData.features = JSON.stringify(data.features);
      if (data.techStack) updateData.techStack = JSON.stringify(data.techStack);

      const product = await prisma.product.update({
        where: { id: productId },
        data: updateData,
      });

      logger.product('updated', userId, { productId, title: product.title });
      return product;
    } catch (error) {
      logger.error('Failed to update product', error, { productId, userId });
      throw error;
    }
  }

  async deleteProduct(productId: string, userId: string) {
    try {
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        throw new Error('Product not found');
      }

      if (product.sellerId !== userId) {
        throw new Error('Unauthorized');
      }

      await prisma.product.delete({
        where: { id: productId },
      });

      logger.product('deleted', userId, { productId, title: product.title });
    } catch (error) {
      logger.error('Failed to delete product', error, { productId, userId });
      throw error;
    }
  }

  async getProducts(filters?: {
    category?: string;
    status?: string;
    sellerId?: string;
    featured?: boolean;
  }) {
    const where: any = {};

    if (filters?.category) where.category = filters.category;
    if (filters?.status) where.status = filters.status;
    if (filters?.sellerId) where.sellerId = filters.sellerId;
    if (filters?.featured !== undefined) where.featured = filters.featured;

    return prisma.product.findMany({
      where,
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: [
        { featured: 'desc' },
        { createdAt: 'desc' },
      ],
    });
  }

  async getProductById(productId: string) {
    return prisma.product.findUnique({
      where: { id: productId },
      include: {
        seller: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
        reviews: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
          take: 10,
        },
      },
    });
  }

  async incrementDownloads(productId: string) {
    return prisma.product.update({
      where: { id: productId },
      data: { downloads: { increment: 1 } },
    });
  }
}

export const productService = new ProductService();
