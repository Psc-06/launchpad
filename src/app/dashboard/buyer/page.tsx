'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';

interface Purchase {
  id: string;
  productId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  product: {
    title: string;
    slug: string;
    thumbnail: string;
    price: number;
    sourceRepoUrl: string | null;
    previewUrl: string | null;
    description: string;
  };
  licenseKey?: {
    id: string;
    key: string;
    status: string;
    activationCount: number;
    maxActivations: number;
    expiresAt: string | null;
  };
}

export default function BuyerDashboard() {
  const { data: session, status } = useSession();
  const [purchases, setPurchases] = useState<Purchase[]>([]);
  const [loading, setLoading] = useState(true);
  const [totalSpent, setTotalSpent] = useState(0);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  useEffect(() => {
    if (session?.user.id) {
      fetchPurchases();
    }
  }, [session]);

  const fetchPurchases = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/purchases');
      const data = await response.json();
      
      if (Array.isArray(data)) {
        setPurchases(data);
        const spent = data.reduce((sum: number, p: Purchase) => sum + p.amount, 0);
        setTotalSpent(spent);
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  const copyLicenseKey = (key: string, purchaseId: string) => {
    navigator.clipboard.writeText(key);
    setCopiedKey(purchaseId);
    setTimeout(() => setCopiedKey(null), 2000);
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

  if (!session || session.user.role !== 'BUYER') {
    redirect('/auth/login');
  }

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <div className="mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
            My Library
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Welcome, {session.user.name}! Here are your purchased kits.
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Kits Purchased</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">{purchases.length}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Total</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Total Spent</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">${totalSpent.toFixed(2)}</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">All purchases</p>
            </CardBody>
          </Card>

          <Card>
            <CardBody>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">Deployments</p>
              <p className="text-3xl font-bold text-gray-900 dark:text-white mt-2">0</p>
              <p className="text-xs text-gray-500 dark:text-gray-500 mt-2">Active</p>
            </CardBody>
          </Card>
        </div>

        {/* How to Get Started */}
        <Card className="border-2 border-dashed border-gray-300 dark:border-gray-700 mb-12">
          <CardBody className="text-center py-8">
            <div className="text-4xl mb-4">🚀</div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
              Ready to Launch Your SaaS?
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
              Browse our marketplace and find the perfect starter kit for your idea
            </p>
            <div className="flex gap-3 justify-center">
              <Link href="/products">
                <Button>Browse Marketplace</Button>
              </Link>
              <Link href="/ai-scope">
                <Button variant="outline">AI Project Scoping</Button>
              </Link>
            </div>
          </CardBody>
        </Card>

        {/* My Purchases */}
        <Card>
          <CardHeader>
            <CardTitle>My Purchases</CardTitle>
            <CardDescription>Your downloaded starter kits</CardDescription>
          </CardHeader>
          <CardBody>
            {loading ? (
              <div className="text-center py-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
                <p className="text-gray-500 dark:text-gray-400 mt-2">Loading purchases...</p>
              </div>
            ) : purchases.length === 0 ? (
              <p className="text-center text-gray-500 dark:text-gray-400 py-8">
                No purchases yet. Start exploring the marketplace!
              </p>
            ) : (
              <div className="space-y-4">
                {purchases.map((purchase) => (
                  <div
                    key={purchase.id}
                    className="p-6 rounded-lg border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900/50 transition-colors"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex items-center gap-4">
                        <div className="text-5xl">{purchase.product.thumbnail || '📦'}</div>
                        <div>
                          <h4 className="font-semibold text-lg text-gray-900 dark:text-white mb-1">
                            {purchase.product.title}
                          </h4>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Purchased on {new Date(purchase.createdAt).toLocaleDateString()}
                          </p>
                          <div className="flex items-center gap-2 mt-2">
                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                              purchase.status === 'COMPLETED'
                                ? 'bg-green-100 text-green-700 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {purchase.status}
                            </span>
                            {purchase.licenseKey && (
                              <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                                purchase.licenseKey.status === 'ACTIVE'
                                  ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/20 dark:text-blue-400'
                                  : 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
                              }`}>
                                License: {purchase.licenseKey.status}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-xl font-bold text-gray-900 dark:text-white">
                          ${purchase.amount.toFixed(2)}
                        </p>
                      </div>
                    </div>

                    {/* License Key Section */}
                    {purchase.licenseKey && (
                      <div className="bg-gray-50 dark:bg-gray-800/50 rounded-lg p-4 mb-4">
                        <div className="flex items-center justify-between mb-2">
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            🔑 License Key
                          </span>
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            Activations: {purchase.licenseKey.activationCount}/{purchase.licenseKey.maxActivations}
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <code className="flex-1 px-3 py-2 bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700 rounded text-sm font-mono text-gray-900 dark:text-white">
                            {purchase.licenseKey.key}
                          </code>
                          <button
                            onClick={() => copyLicenseKey(purchase.licenseKey!.key, purchase.id)}
                            className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-sm rounded-lg font-medium transition-colors"
                          >
                            {copiedKey === purchase.id ? '✓ Copied!' : '📋 Copy'}
                          </button>
                        </div>
                      </div>
                    )}

                    {/* Action Buttons */}
                    <div className="flex flex-wrap gap-3">
                      {purchase.product.sourceRepoUrl && (
                        <a
                          href={purchase.product.sourceRepoUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 bg-gray-900 hover:bg-gray-800 dark:bg-white dark:hover:bg-gray-100 text-white dark:text-gray-900 text-sm rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <span>📦</span>
                          Access Repository
                        </a>
                      )}
                      {purchase.product.previewUrl && (
                        <a
                          href={purchase.product.previewUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg font-medium transition-colors flex items-center gap-2"
                        >
                          <span>👁️</span>
                          Live Preview
                        </a>
                      )}
                      <button
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <span>📖</span>
                        Documentation
                      </button>
                      <button
                        className="px-4 py-2 border border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-lg font-medium transition-colors flex items-center gap-2"
                      >
                        <span>💬</span>
                        Support
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardBody>
        </Card>
      </div>
    </Layout>
  );
}
