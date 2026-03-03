'use client';

import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

export default function SellerDashboard() {
  const { data: session, status } = useSession();

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin">⏳</div>
        </div>
      </Layout>
    );
  }

  if (!session || session.user.role !== 'SELLER') {
    redirect('/auth/login');
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            Seller Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome back, {session.user.name}! Manage your products and track your earnings.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-12">
          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Revenue</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">$0.00</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">This month</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Downloads</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">All products</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Products Published</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Active listings</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Average Rating</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0.0</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Based on reviews</p>
            </CardBody>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
            <CardBody className="text-center py-8">
              <div className="text-4xl mb-4">📦</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                Upload Your First Kit
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Share your SaaS starter template with the community
              </p>
              <Link href="/dashboard/seller/products/new">
                <Button>Create Product</Button>
              </Link>
            </CardBody>
          </Card>

          <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700">
            <CardBody className="text-center py-8">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                View Analytics
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
                Track your sales, downloads, and customer feedback
              </p>
              <Link href="/dashboard/seller/analytics">
                <Button variant="outline">View Analytics</Button>
              </Link>
            </CardBody>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Your sales and activity updates</CardDescription>
          </CardHeader>
          <CardBody>
            <p className="text-center text-gray-500 dark:text-gray-400 py-8">
              No activity yet. Start by uploading your first product!
            </p>
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}
