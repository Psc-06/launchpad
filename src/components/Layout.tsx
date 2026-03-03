'use client';

import { ReactNode } from 'react';
import Link from 'next/link';
import { useSession, signOut } from 'next-auth/react';
import Button from './ui/Button';

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  const { data: session } = useSession();

  return (
    <div className="min-h-screen bg-white dark:bg-gray-950">
      {/* Navigation */}
      <nav className="border-b border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="flex h-16 items-center justify-between">
            {/* Logo */}
            <Link href="/" className="font-bold text-2xl text-blue-600">
              LaunchPad
            </Link>

            {/* Navigation Links */}
            <div className="hidden md:flex items-center space-x-6">
              <Link href="/products" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                Marketplace
              </Link>
              <Link href="/ai-scope" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                AI Scope
              </Link>

              {session ? (
                <>
                  {session.user.role === 'SELLER' ? (
                    <Link href="/dashboard/seller" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                      Seller Dashboard
                    </Link>
                  ) : (
                    <Link href="/dashboard/buyer" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">
                      My Library
                    </Link>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => signOut({ redirect: true, callbackUrl: '/' })}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Link href="/auth/login">
                    <Button variant="outline" size="sm">
                      Sign In
                    </Button>
                  </Link>
                  <Link href="/auth/register">
                    <Button size="sm">
                      Get Started
                    </Button>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main>{children}</main>

      {/* Footer */}
      <footer className="border-t border-gray-200 bg-gray-50 dark:border-gray-800 dark:bg-gray-900">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div>
              <h3 className="font-semibold text-gray-900 dark:text-gray-100">LaunchPad</h3>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                A marketplace for buying and selling pre-built SaaS starter kits.
              </p>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Product</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/products" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Marketplace</Link></li>
                <li><Link href="/ai-scope" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">AI Scope</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">For Sellers</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="/auth/register?role=seller" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Start Selling</Link></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-gray-100 mb-4">Company</h4>
              <ul className="space-y-2 text-sm">
                <li><Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Privacy</Link></li>
                <li><Link href="#" className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-100">Terms</Link></li>
              </ul>
            </div>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 mt-8 pt-8 text-center text-sm text-gray-600 dark:text-gray-400">
            <p>&copy; 2026 LaunchPad. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
