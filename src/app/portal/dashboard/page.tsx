'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface Customer {
  id: number;
  email: string;
  name: string;
  phone: string;
  address?: string;
}

export default function DashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCustomer();
  }, []);

  const fetchCustomer = async () => {
    try {
      const response = await fetch('/api/portal/me');
      if (!response.ok) {
        router.push('/portal');
        return;
      }
      const data = await response.json();
      setCustomer(data.customer);
    } catch (error) {
      console.error('Failed to fetch customer:', error);
      router.push('/portal');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/portal/logout', { method: 'POST' });
      router.push('/portal');
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  if (loading) {
    return (
      <Section padding="xl">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading...</p>
        </div>
      </Section>
    );
  }

  if (!customer) {
    return null;
  }

  return (
    <Section padding="xl">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {customer.name}!
              </h2>
              <p className="text-gray-600 mt-1">{customer.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              Sign Out
            </Button>
          </div>
        </div>

        {/* Account Information */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <div className="flex items-start gap-4">
              <div className="bg-orange-100 p-3 rounded-lg">
                <Icon name="User" size={24} className="text-orange-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Account Information</h3>
                <div className="space-y-2 text-sm">
                  <div>
                    <span className="text-gray-600">Name:</span>{' '}
                    <span className="font-medium">{customer.name}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>{' '}
                    <span className="font-medium">{customer.email}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Phone:</span>{' '}
                    <span className="font-medium">{customer.phone}</span>
                  </div>
                  {customer.address && (
                    <div>
                      <span className="text-gray-600">Address:</span>{' '}
                      <span className="font-medium">{customer.address}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="flex items-start gap-4">
              <div className="bg-blue-100 p-3 rounded-lg">
                <Icon name="Briefcase" size={24} className="text-blue-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold mb-2">Active Projects</h3>
                <p className="text-gray-600 mb-4">
                  You currently have no active projects.
                </p>
                <Button variant="primary" size="sm">
                  <Icon name="Plus" size={16} className="mr-2" />
                  Request New Project
                </Button>
              </div>
            </div>
          </Card>
        </div>

        {/* Coming Soon Features */}
        <div className="bg-gradient-to-r from-orange-50 to-orange-100 rounded-lg p-6 mb-8">
          <h3 className="text-xl font-bold mb-4 text-gray-900">Coming Soon</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="flex items-center gap-3">
              <Icon name="FileText" size={20} className="text-orange-600" />
              <span className="text-gray-700">Project Timeline</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="Upload" size={20} className="text-orange-600" />
              <span className="text-gray-700">Document Upload</span>
            </div>
            <div className="flex items-center gap-3">
              <Icon name="MessageCircle" size={20} className="text-orange-600" />
              <span className="text-gray-700">Direct Messaging</span>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <Card>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Icon name="Phone" size={24} className="text-orange-600 mb-2" />
              <span className="text-sm font-medium">Contact Us</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Icon name="Calendar" size={24} className="text-orange-600 mb-2" />
              <span className="text-sm font-medium">Schedule</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Icon name="DollarSign" size={24} className="text-orange-600 mb-2" />
              <span className="text-sm font-medium">Invoices</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Icon name="Settings" size={24} className="text-orange-600 mb-2" />
              <span className="text-sm font-medium">Settings</span>
            </button>
          </div>
        </Card>
      </div>
    </Section>
  );
}
