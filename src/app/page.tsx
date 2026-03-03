'use client';

import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import { Card, CardBody, CardDescription, CardTitle } from '@/components/ui/Card';

const fadeInUp = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.5 },
};

export default function Home() {
  const { data: session } = useSession();

  const features = [
    {
      icon: '🚀',
      title: 'Pre-built SaaS Kits',
      description: 'Access ready-to-deploy starter templates for any SaaS idea',
    },
    {
      icon: '💳',
      title: 'Seamless Payments',
      description: 'Stripe integration with instant seller payouts and licensing',
    },
    {
      icon: '🔗',
      title: 'One-Click Deployment',
      description: 'Deploy kits to Vercel with automatic GitHub integration',
    },
    {
      icon: '🤖',
      title: 'AI Project Scoping',
      description: 'Describe your idea and get AI-powered kit recommendations',
    },
    {
      icon: '📊',
      title: 'Seller Analytics',
      description: 'Track revenue, downloads, and top-performing products',
    },
    {
      icon: '🔐',
      title: 'License Management',
      description: 'Automatic license key generation and verification',
    },
  ];

  const examples = [
    {
      title: 'AI SaaS Starter',
      price: '$49',
      tags: ['AI', 'Next.js', 'OpenAI'],
    },
    {
      title: 'CRM Boilerplate',
      price: '$39',
      tags: ['CRM', 'React', 'MongoDB'],
    },
    {
      title: 'Marketplace Kit',
      price: '$79',
      tags: ['Marketplace', 'Full-stack', 'Payment Ready'],
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-950 dark:to-gray-900 py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <motion.div {...fadeInUp}>
              <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white leading-tight mb-6">
                Launch Your SaaS Idea in <span className="text-blue-600">Minutes</span>
              </h1>
              <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
                Buy pre-built SaaS starter kits from the community. Deploy instantly to Vercel. Start paying only when you make money.
              </p>
              <div className="flex gap-4">
                <Link href={session ? (session.user.role === 'SELLER' ? '/dashboard/seller' : '/dashboard/buyer') : '/auth/register'}>
                  <Button size="lg">
                    {session ? 'Go to Dashboard' : 'Get Started'}
                  </Button>
                </Link>
                <Link href="/products">
                  <Button variant="outline" size="lg">
                    Browse Marketplace
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="relative h-96 bg-gradient-to-br from-blue-400 to-indigo-600 rounded-2xl shadow-2xl"
            >
              {/* Placeholder for illustration */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-6xl">🚀</div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 md:py-32">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Everything You Need
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              From marketplace to deployment, LaunchPad handles it all
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow">
                  <CardBody>
                    <div className="text-4xl mb-4">{feature.icon}</div>
                    <CardTitle>{feature.title}</CardTitle>
                    <CardDescription className="mt-2">{feature.description}</CardDescription>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Example Kits */}
      <section className="py-20 md:py-32 bg-gray-50 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
              Popular Starter Kits
            </h2>
            <p className="text-xl text-gray-600 dark:text-gray-400">
              Browse hundreds of production-ready SaaS templates
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {examples.map((kit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full hover:shadow-lg transition-shadow hover:border-blue-200 dark:hover:border-blue-800">
                  <CardBody>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{kit.title}</h3>
                    <p className="text-3xl font-bold text-blue-600 mt-4">{kit.price}</p>
                    <div className="flex flex-wrap gap-2 mt-4">
                      {kit.tags.map((tag, i) => (
                        <span
                          key={i}
                          className="px-3 py-1 bg-blue-100 text-blue-700 dark:bg-blue-900 dark:text-blue-100 rounded-full text-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <Button className="w-full mt-6">View Kit</Button>
                  </CardBody>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link href="/products">
              <Button variant="outline" size="lg">
                View All Kits →
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 md:py-32 bg-gradient-to-r from-blue-600 to-indigo-600">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-4xl font-bold text-white mb-6">
              Ready to Launch?
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
              Join hundreds of developers building the next generation of SaaS products
            </p>
            <div className="flex gap-4 justify-center">
              {!session && (
                <>
                  <Link href="/auth/register?role=buyer">
                    <Button size="lg" className="bg-white text-blue-600 hover:bg-gray-100">
                      Buy a Kit
                    </Button>
                  </Link>
                  <Link href="/auth/register?role=seller">
                    <Button variant="outline" size="lg" className="border-white text-white hover:bg-blue-700">
                      Start Selling
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
