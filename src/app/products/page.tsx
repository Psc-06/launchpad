'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Layout from '@/components/Layout';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion } from 'framer-motion';

interface Product {
  id: string;
  title: string;
  slug: string;
  price: number;
  rating: number;
  reviewCount: number;
  downloads: number;
  tags: string;
  thumbnail: string;
  featured: boolean;
}

export default function Products() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All Products');
  const [purchasing, setPurchasing] = useState<string | null>(null);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const { data: session } = useSession();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/products');
      const data = await response.json();
      
      if (data.products) {
        setProducts(data.products);
      }
    } catch (error) {
      console.error('Error fetching products:', error);
    } finally {
      setLoading(false);
    }
  };

  const handlePurchase = async (productId: string) => {
    if (!session) {
      window.location.href = '/auth/login';
      return;
    }

    const product = products.find(p => p.id === productId);
    if (product) {
      setSelectedProduct(product);
      setShowPaymentModal(true);
    }
  };

  const confirmPurchase = async () => {
    if (!selectedProduct) return;

    try {
      setPurchasing(selectedProduct.id);
      const response = await fetch('/api/purchases', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: selectedProduct.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to purchase product');
        return;
      }

      alert('✅ Purchase successful! Check your library.');
      setShowPaymentModal(false);
      setSelectedProduct(null);
      // Refresh products to show updated state
      fetchProducts();
    } catch (error) {
      console.error('Error purchasing:', error);
      alert('Failed to process purchase');
    } finally {
      setPurchasing(null);
    }
  };

  const parseTags = (tagsStr: string) => {
    try {
      return typeof tagsStr === 'string' ? JSON.parse(tagsStr) : tagsStr;
    } catch {
      return [];
    }
  };

  // Filter products based on selected category
  const filteredProducts = products.filter(product => {
    if (selectedCategory === 'All Products') return true;
    
    const tags = parseTags(product.tags);
    return tags.some((tag: string) => 
      tag.toLowerCase().includes(selectedCategory.toLowerCase()) ||
      selectedCategory.toLowerCase().includes(tag.toLowerCase())
    );
  });

  return (
    <Layout>
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Marketplace
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl">
            Discover and purchase pre-built SaaS starter kits from talented creators
          </p>
        </motion.div>

        {/* Filters */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-8 flex flex-wrap gap-4"
        >
          <button
            onClick={() => setSelectedCategory('All Products')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'All Products'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            All Products
          </button>
          <button
            onClick={() => setSelectedCategory('AI & Machine Learning')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'AI & Machine Learning'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            AI & Machine Learning
          </button>
          <button
            onClick={() => setSelectedCategory('E-Commerce')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'E-Commerce'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            E-Commerce
          </button>
          <button
            onClick={() => setSelectedCategory('SaaS')}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              selectedCategory === 'SaaS'
                ? 'bg-blue-600 text-white'
                : 'border border-gray-300 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-900'
            }`}
          >
            SaaS
          </button>
        </motion.div>

        {/* Loading State */}
        {loading ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-gray-600 dark:text-gray-400">Loading products...</p>
            </div>
          </div>
        ) : products.length === 0 ? (
          <div className="flex items-center justify-center py-12">
            <div className="text-center">
              <p className="text-gray-600 dark:text-gray-400 text-lg">No products available</p>
            </div>
          </div>
        ) : (
          /* Products Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredProducts.length === 0 ? (
              <div className="col-span-full text-center py-12">
                <p className="text-gray-600 dark:text-gray-400 text-lg">
                  No products found in this category
                </p>
              </div>
            ) : (
              filteredProducts.map((product, index) => {
              const tags = parseTags(product.tags);
              return (
                <motion.div
                  key={product.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full flex flex-col hover:shadow-lg transition-shadow hover:border-blue-200 dark:hover:border-blue-800">
                    <div className="bg-gradient-to-br from-blue-400 to-indigo-600 h-40 flex items-center justify-center mb-4">
                      <div className="text-6xl">{product.thumbnail || '📦'}</div>
                    </div>

                    <CardBody className="flex-1 flex flex-col">
                      <h3 className="font-semibold text-lg text-gray-900 dark:text-white mb-2">
                        {product.title}
                      </h3>

                      <div className="flex items-center mb-3">
                        <div className="flex text-yellow-400">
                          {'⭐'.repeat(Math.floor(product.rating))}
                        </div>
                        <span className="text-sm text-gray-600 dark:text-gray-400 ml-2">
                          {product.rating} ({product.downloads} downloads)
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-4">
                        {tags.slice(0, 3).map((tag: string, i: number) => (
                          <span
                            key={i}
                            className="px-2 py-1 bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-200 rounded-full text-xs"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-gray-200 dark:border-gray-800 flex items-center justify-between">
                        <span className="text-2xl font-bold text-gray-900 dark:text-white">
                          ${product.price}
                        </span>
                        <button
                          onClick={() => handlePurchase(product.id)}
                          disabled={purchasing === product.id}
                          className="px-3 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed text-white text-sm rounded-lg font-medium transition-colors"
                        >
                          {purchasing === product.id ? '⏳ Purchasing...' : 'Buy'}
                        </button>
                      </div>
                    </CardBody>
                  </Card>
                </motion.div>
              );
            })
            )}
          </div>
        )}

        {/* Payment Modal */}
        {showPaymentModal && selectedProduct && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-gray-900 rounded-lg p-6 max-w-md w-full shadow-xl"
            >
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                Complete Purchase
              </h2>
              
              <div className="mb-6">
                <div className="flex items-start mb-4">
                  <div className="text-4xl mr-4">{selectedProduct.thumbnail || '📦'}</div>
                  <div>
                    <h3 className="font-semibold text-lg text-gray-900 dark:text-white">
                      {selectedProduct.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {parseTags(selectedProduct.tags).slice(0, 2).join(', ')}
                    </p>
                  </div>
                </div>

                <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600 dark:text-gray-400">Product Price</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      ${selectedProduct.price}
                    </span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t border-gray-200 dark:border-gray-700">
                    <span className="font-semibold text-gray-900 dark:text-white">Total</span>
                    <span className="text-2xl font-bold text-blue-600">
                      ${selectedProduct.price}
                    </span>
                  </div>
                </div>

                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4 mb-4">
                  <h4 className="font-semibold text-blue-900 dark:text-blue-100 mb-2">
                    💳 Payment Method
                  </h4>
                  <p className="text-sm text-blue-800 dark:text-blue-200">
                    Demo Mode: Click confirm to complete purchase. In production, this would integrate with Stripe.
                  </p>
                </div>

                <p className="text-xs text-gray-500 dark:text-gray-400">
                  By confirming, you agree to the terms of service and will receive a license key to access this product.
                </p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowPaymentModal(false);
                    setSelectedProduct(null);
                  }}
                  disabled={purchasing !== null}
                  className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 rounded-lg font-medium hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmPurchase}
                  disabled={purchasing !== null}
                  className="flex-1 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  {purchasing ? '⏳ Processing...' : 'Confirm Purchase'}
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </div>
    </Layout>
  );
}
