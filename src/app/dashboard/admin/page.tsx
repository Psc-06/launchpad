'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Layout from '@/components/Layout';
import { Card, CardBody, CardHeader, CardTitle } from '@/components/ui/Card';

interface AdminStats {
  totalUsers: number;
  totalProducts: number;
  totalRevenue: number;
  totalPurchases: number;
  recentActivity: any[];
}

export default function AdminDashboard() {
  const { data: session, status } = useSession();
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (session?.user.role === 'ADMIN') {
      fetchStats();
    }
  }, [session]);

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/admin/stats');
      const data = await response.json();
      if (data.success) {
        setStats(data.data);
      }
    } catch (error) {
      console.error('Failed to fetch admin stats:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading') {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="animate-spin">⏳</div>
        </div>
      </Layout>
    );
  }

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/auth/login');
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
            Admin Dashboard
          </h1>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Platform overview and management
          </p>
        </div>

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <>
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
              <Card>
                <CardBody>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Users
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats?.totalUsers || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Products
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats?.totalProducts || 0}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Revenue
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    ${stats?.totalRevenue?.toFixed(2) || '0.00'}
                  </p>
                </CardBody>
              </Card>

              <Card>
                <CardBody>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                    Total Purchases
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">
                    {stats?.totalPurchases || 0}
                  </p>
                </CardBody>
              </Card>
            </div>

            {/* Recent Activity */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardBody>
                <div className="space-y-4">
                  {stats?.recentActivity?.length === 0 ? (
                    <p className="text-gray-500 dark:text-gray-400 text-center py-8">
                      No recent activity
                    </p>
                  ) : (
                    stats?.recentActivity?.map((activity: any, index: number) => (
                      <div
                        key={index}
                        className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-700 rounded-lg"
                      >
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {activity.type}
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {activity.description}
                          </p>
                        </div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          {new Date(activity.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </CardBody>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center py-8">
                  <div className="text-4xl mb-4">👥</div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Manage Users
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    View, edit, and manage user accounts
                  </p>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center py-8">
                  <div className="text-4xl mb-4">📦</div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Manage Products
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    Review and approve product listings
                  </p>
                </CardBody>
              </Card>

              <Card className="hover:shadow-lg transition-shadow cursor-pointer">
                <CardBody className="text-center py-8">
                  <div className="text-4xl mb-4">💰</div>
                  <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                    Revenue Reports
                  </h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                    View detailed revenue analytics
                  </p>
                </CardBody>
              </Card>
            </div>
          </>
        )}
      </div>
    </Layout>
  );
}
