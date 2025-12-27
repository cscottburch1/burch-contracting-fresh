'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminToolsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      router.push('/admin');
      return;
    }
    const data = await res.json();
    setCurrentUser(data.user);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const isOwner = currentUser?.role === 'owner';

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Admin Tools</h1>
              <p className="text-xl text-gray-600">System utilities and management tools</p>
            </div>
            <a
              href="/admin/dashboard"
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-bold"
            >
              ← Back to Dashboard
            </a>
          </div>
        </div>

        {/* Database & System Tools */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">🗄️</span>
            Database & System
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isOwner && (
              <a
                href="/admin/migrate"
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className="flex items-center mb-3">
                  <span className="text-4xl mr-3">⚡</span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                    Database Migrations
                  </h3>
                </div>
                <p className="text-gray-600">
                  Run database migrations to create or update tables
                </p>
                <div className="mt-4 text-sm font-semibold text-blue-600">
                  Owner Only →
                </div>
              </a>
            )}
            
            <div className="bg-gray-100 rounded-xl shadow p-6 opacity-60">
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📊</span>
                <h3 className="text-xl font-bold text-gray-700">Database Backup</h3>
              </div>
              <p className="text-gray-500">
                Backup and restore database (Coming Soon)
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl shadow p-6 opacity-60">
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🔧</span>
                <h3 className="text-xl font-bold text-gray-700">System Health</h3>
              </div>
              <p className="text-gray-500">
                Monitor system performance and errors (Coming Soon)
              </p>
            </div>
          </div>
        </section>

        {/* User Management */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">👥</span>
            User Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isOwner && (
              <a
                href="/admin/settings"
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
              >
                <div className="flex items-center mb-3">
                  <span className="text-4xl mr-3">⚙️</span>
                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                    Team Settings
                  </h3>
                </div>
                <p className="text-gray-600">
                  Manage admin users, roles, and permissions
                </p>
                <div className="mt-4 text-sm font-semibold text-blue-600">
                  Owner Only →
                </div>
              </a>
            )}

            <a
              href="/admin/customers"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">👤</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Customer Portal Users
                </h3>
              </div>
              <p className="text-gray-600">
                Manage customer accounts and portal access
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                View →
              </div>
            </a>

            <a
              href="/admin/tools/notifications"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📧</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Email & SMS Templates
                </h3>
              </div>
              <p className="text-gray-600">
                Create and manage email and SMS notification templates
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <a
              href="/admin/tools/projects"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🏠</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Recent Projects Gallery
                </h3>
              </div>
              <p className="text-gray-600">
                Showcase completed projects on homepage with photos
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>
          </div>
        </section>

        {/* Business Management */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">💼</span>
            Business Management
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/crm"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📋</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  CRM / Leads
                </h3>
              </div>
              <p className="text-gray-600">
                Manage leads, track follow-ups, and convert to customers
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Open →
              </div>
            </a>

            <a
              href="/admin/subcontractors/manage"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🔨</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Subcontractors
                </h3>
              </div>
              <p className="text-gray-600">
                Add, edit, delete, and manage contractor information
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <div className="bg-gray-100 rounded-xl shadow p-6 opacity-60">
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📈</span>
                <h3 className="text-xl font-bold text-gray-700">Analytics Dashboard</h3>
              </div>
              <p className="text-gray-500">
                Business metrics and reporting (Coming Soon)
              </p>
            </div>
          </div>
        </section>

        {/* Document Generation */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">📄</span>
            Document Generation
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/admin/proposals/create"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📝</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Create Proposal
                </h3>
              </div>
              <p className="text-gray-600">
                Generate professional project proposals for clients
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Create →
              </div>
            </a>

            <a
              href="/admin/invoices/create"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🧾</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Create Invoice
                </h3>
              </div>
              <p className="text-gray-600">
                Generate and send invoices to customers
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Create →
              </div>
            </a>

            <div className="bg-gray-100 rounded-xl shadow p-6 opacity-60">
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📋</span>
                <h3 className="text-xl font-bold text-gray-700">Contract Templates</h3>
              </div>
              <p className="text-gray-500">
                Manage contract templates (Coming Soon)
              </p>
            </div>
          </div>
        </section>

        {/* Website Content */}
        <section className="mb-10">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 flex items-center">
            <span className="text-3xl mr-3">🌐</span>
            Website Content
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <a
              href="/admin/tools/banners"
              className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition group"
            >
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📢</span>
                <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600">
                  Banner Management
                </h3>
              </div>
              <p className="text-gray-600">
                Create and manage promotional banners on homepage
              </p>
              <div className="mt-4 text-sm font-semibold text-blue-600">
                Manage →
              </div>
            </a>

            <div className="bg-gray-100 rounded-xl shadow p-6 opacity-60">
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">🎨</span>
                <h3 className="text-xl font-bold text-gray-700">Service Pages</h3>
              </div>
              <p className="text-gray-500">
                Edit service descriptions and pricing (Coming Soon)
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl shadow p-6 opacity-60">
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">📸</span>
                <h3 className="text-xl font-bold text-gray-700">Portfolio Manager</h3>
              </div>
              <p className="text-gray-500">
                Manage project photos and portfolio (Coming Soon)
              </p>
            </div>

            <div className="bg-gray-100 rounded-xl shadow p-6 opacity-60">
              <div className="flex items-center mb-3">
                <span className="text-4xl mr-3">⭐</span>
                <h3 className="text-xl font-bold text-gray-700">Testimonials</h3>
              </div>
              <p className="text-gray-500">
                Manage customer reviews (Coming Soon)
              </p>
            </div>
          </div>
        </section>

        {/* Back Button */}
        <div className="mt-12">
          <a
            href="/admin/dashboard"
            className="inline-block bg-gray-600 text-white px-8 py-3 rounded-lg hover:bg-gray-700 transition font-bold"
          >
            ← Back to Dashboard
          </a>
        </div>
      </div>
    </div>
  );
}
