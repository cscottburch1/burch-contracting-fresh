'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
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

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800' },
};

export default function DashboardPage() {
  const router = useRouter();
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // Fetch customer info
      const customerResponse = await fetch('/api/portal/me');
      if (!customerResponse.ok) {
        router.push('/portal');
        return;
      }
      const customerData = await customerResponse.json();
      setCustomer(customerData.customer);

      // Fetch projects
      const projectsResponse = await fetch('/api/portal/projects');
      if (projectsResponse.ok) {
        const projectsData = await projectsResponse.json();
        setProjects(projectsData.projects || []);
      }
    } catch (error) {
      console.error('Failed to fetch data:', error);
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

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
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

  const activeProjects = projects.filter((p) => p.status === 'active');
  const pendingProjects = projects.filter((p) => p.status === 'pending');
  const completedProjects = projects.filter((p) => p.status === 'completed');

  return (
    <Section padding="xl">
      <div className="max-w-6xl mx-auto">
        {/* Welcome Header */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">
                Welcome back, {customer.name}!
              </h2>
              <p className="text-gray-600 mt-1">{customer.email}</p>
            </div>
            <Button variant="outline" onClick={handleLogout}>
              <Icon name="LogOut" size={16} className="mr-2" />
              Sign Out
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Projects</p>
                <p className="text-2xl font-bold text-gray-900">{activeProjects.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-lg">
                <Icon name="Briefcase" size={24} className="text-green-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Pending</p>
                <p className="text-2xl font-bold text-gray-900">{pendingProjects.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-lg">
                <Icon name="Clock" size={24} className="text-yellow-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completed</p>
                <p className="text-2xl font-bold text-gray-900">{completedProjects.length}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-lg">
                <Icon name="CheckCircle" size={24} className="text-blue-600" />
              </div>
            </div>
          </Card>

          <Card className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Projects</p>
                <p className="text-2xl font-bold text-gray-900">{projects.length}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-lg">
                <Icon name="BarChart" size={24} className="text-orange-600" />
              </div>
            </div>
          </Card>
        </div>

        {/* Projects Section */}
        <div className="mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-bold text-gray-900">Your Projects</h3>
            <Button variant="primary" size="sm">
              <Icon name="Plus" size={16} className="mr-2" />
              Request New Project
            </Button>
          </div>

          {projects.length === 0 ? (
            <Card className="p-12 text-center">
              <div className="flex flex-col items-center">
                <div className="bg-gray-100 p-4 rounded-full mb-4">
                  <Icon name="Briefcase" size={32} className="text-gray-400" />
                </div>
                <h4 className="text-lg font-semibold text-gray-900 mb-2">No Projects Yet</h4>
                <p className="text-gray-600 mb-6 max-w-md">
                  You don't have any projects yet. Contact us to get started on your next construction project.
                </p>
                <Link href="/contact">
                  <Button variant="primary">
                    <Icon name="MessageCircle" size={16} className="mr-2" />
                    Contact Us
                  </Button>
                </Link>
              </div>
            </Card>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {projects.map((project) => (
                <Card key={project.id} className="p-6 hover:shadow-lg transition">
                  <div className="flex justify-between items-start mb-4">
                    <h4 className="text-lg font-semibold text-gray-900">{project.title}</h4>
                    <span
                      className={`px-3 py-1 text-xs font-semibold rounded-full ${
                        statusConfig[project.status].color
                      }`}
                    >
                      {statusConfig[project.status].label}
                    </span>
                  </div>

                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{project.description}</p>

                  <div className="space-y-2 mb-4">
                    {project.budget && (
                      <div className="flex items-center text-sm">
                        <Icon name="DollarSign" size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-700">Budget: {formatCurrency(project.budget)}</span>
                      </div>
                    )}
                    {project.start_date && (
                      <div className="flex items-center text-sm">
                        <Icon name="Calendar" size={16} className="text-gray-400 mr-2" />
                        <span className="text-gray-700">
                          {formatDate(project.start_date)}
                          {project.end_date && ` - ${formatDate(project.end_date)}`}
                        </span>
                      </div>
                    )}
                  </div>

                  <Link href={`/portal/projects/${project.id}`}>
                    <Button variant="outline" size="sm" className="w-full">
                      View Details
                      <Icon name="ArrowRight" size={16} className="ml-2" />
                    </Button>
                  </Link>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <Card className="p-6">
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <Link href="/contact">
              <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition w-full">
                <Icon name="Phone" size={24} className="text-orange-600 mb-2" />
                <span className="text-sm font-medium">Contact Us</span>
              </button>
            </Link>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Icon name="FileText" size={24} className="text-orange-600 mb-2" />
              <span className="text-sm font-medium">Documents</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Icon name="MessageCircle" size={24} className="text-orange-600 mb-2" />
              <span className="text-sm font-medium">Messages</span>
            </button>
            <button className="flex flex-col items-center p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition">
              <Icon name="User" size={24} className="text-orange-600 mb-2" />
              <span className="text-sm font-medium">Profile</span>
            </button>
          </div>
        </Card>
      </div>
    </Section>
  );
}
