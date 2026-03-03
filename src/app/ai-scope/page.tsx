'use client';

import { useState } from 'react';
import Layout from '@/components/Layout';
import Button from '@/components/ui/Button';
import Textarea from '@/components/ui/Textarea';
import { Label } from '@/components/ui/Label';
import { Card, CardBody, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card';
import { motion } from 'framer-motion';

interface RecommendedKit {
  title: string;
  reason: string;
  price: number;
}

interface ScopeResult {
  businessIdea: string;
  recommendedKits: RecommendedKit[];
  features: string[];
  techStack: string[];
  timeline: string;
}

export default function AIScope() {
  const [businessIdea, setBusinessIdea] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<ScopeResult | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate AI analysis (in production, this would call OpenAI API)
    setTimeout(() => {
      const mockResult: ScopeResult = {
        businessIdea,
        recommendedKits: [
          {
            title: 'AI SaaS Starter',
            reason: 'Perfect foundation for AI-powered applications with LLM integration',
            price: 49,
          },
          {
            title: 'Subscription SaaS Kit',
            reason: 'Includes subscription management and billing',
            price: 59,
          },
        ],
        features: [
          'User authentication & multi-tenancy',
          'AI model integration',
          'Subscription billing system',
          'Admin dashboard',
          'API for integrations',
          'Email notifications',
        ],
        techStack: ['Next.js 14', 'TypeScript', 'OpenAI API', 'Stripe', 'PostgreSQL', 'Prisma ORM'],
        timeline: '2-3 weeks for MVP, 6-8 weeks for full product',
      };

      setResult(mockResult);
      setIsLoading(false);
    }, 2000);
  };

  return (
    <Layout>
      <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 py-12">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-12 text-center"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            🤖 AI Project Scoping
          </h1>
          <p className="text-xl text-gray-600 dark:text-gray-400">
            Describe your business idea and get AI-powered recommendations for the perfect starter kit
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Input Form */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Idea</CardTitle>
                <CardDescription>Tell us about your SaaS concept</CardDescription>
              </CardHeader>
              <CardBody>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="idea">Business Idea</Label>
                    <Textarea
                      id="idea"
                      placeholder="e.g., I want to build an AI-powered appointment scheduling system for salons. It should handle customer bookings, send reminders, and provide analytics to salon owners."
                      value={businessIdea}
                      onChange={(e) => setBusinessIdea(e.target.value)}
                      required
                      className="mt-2 h-32"
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    isLoading={isLoading}
                    disabled={!businessIdea.trim()}
                  >
                    {isLoading ? 'Analyzing...' : 'Analyze & Get Recommendations'}
                  </Button>
                </form>
              </CardBody>
            </Card>
          </motion.div>

          {/* Results */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            {result ? (
              <div className="space-y-4">
                {/* Recommended Kits */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Kits</CardTitle>
                  </CardHeader>
                  <CardBody className="space-y-3">
                    {result.recommendedKits.map((kit, index) => (
                      <div
                        key={index}
                        className="p-3 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <h4 className="font-semibold text-gray-900 dark:text-white">
                              {kit.title}
                            </h4>
                            <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
                              {kit.reason}
                            </p>
                          </div>
                          <span className="font-bold text-blue-600">${kit.price}</span>
                        </div>
                      </div>
                    ))}
                  </CardBody>
                </Card>

                {/* Features */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Suggested Features</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <ul className="space-y-2">
                      {result.features.map((feature, index) => (
                        <li
                          key={index}
                          className="flex items-start text-sm text-gray-700 dark:text-gray-300"
                        >
                          <span className="mr-2">✓</span>
                          {feature}
                        </li>
                      ))}
                    </ul>
                  </CardBody>
                </Card>

                {/* Tech Stack */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Recommended Tech Stack</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <div className="flex flex-wrap gap-2">
                      {result.techStack.map((tech, index) => (
                        <span
                          key={index}
                          className="px-3 py-1 bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-200 rounded-full text-sm font-medium"
                        >
                          {tech}
                        </span>
                      ))}
                    </div>
                  </CardBody>
                </Card>

                {/* Timeline */}
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg">Timeline Estimate</CardTitle>
                  </CardHeader>
                  <CardBody>
                    <p className="text-gray-700 dark:text-gray-300">{result.timeline}</p>
                  </CardBody>
                </Card>

                <Button className="w-full">Download Roadmap PDF</Button>
              </div>
            ) : (
              <Card>
                <CardBody className="text-center py-12">
                  <div className="text-4xl mb-4">📋</div>
                  <p className="text-gray-600 dark:text-gray-400">
                    Enter your idea to see AI-powered recommendations
                  </p>
                </CardBody>
              </Card>
            )}
          </motion.div>
        </div>
      </div>
    </Layout>
  );
}
