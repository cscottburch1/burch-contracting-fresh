'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Customer {
  id: number;
  email: string;
  name: string;
  phone: string;
  address?: string;
  created_at: string;
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

export default function CustomerDetailPage() {
  const router = useRouter();
  const params = useParams();
  const customerId = params.id as string;

  const [customer, setCustomer] = useState<Customer | null>(null);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [showProjectForm, setShowProjectForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [editForm, setEditForm] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'pending'
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated && customerId) {
      fetchCustomerDetails();
    }
  }, [authenticated, customerId]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        setAuthenticated(true);
      } else {
        console.error('Auth failed, redirecting to login');
        router.push('/admin');
      }
    } catch (error) {
      console.error('Auth error:', error);
      router.push('/admin');
    }
  };

  const fetchCustomerDetails = async () => {
    setLoading(true);
    try {
      console.log('Fetching customer details for ID:', customerId);
      const response = await fetch(`/api/admin/customers/${customerId}`);
      
      if (!response.ok) {
        const errorData = await response.json();
        console.error('API error:', response.status, errorData);
        throw new Error(errorData.error || 'Failed to fetch customer');
      }
      
      const data = await response.json();
      console.log('Customer data received:', data);
      setCustomer(data.customer);
      setProjects(data.projects || []);
      setEditForm({
        name: data.customer.name,
        email: data.customer.email,
        phone: data.customer.phone || '',
        address: data.customer.address || ''
      });
    } catch (error) {
      console.error('Error fetching customer:', error);
      alert('Failed to load customer details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateCustomer = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editForm)
      });

      if (!response.ok) throw new Error('Failed to update customer');

      setShowEditForm(false);
      fetchCustomerDetails();
      alert('Customer updated successfully!');
    } catch (error) {
      console.error('Error updating customer:', error);
      alert('Failed to update customer');
    }
  };

  const handleDeleteCustomer = async () => {
    try {
      const response = await fetch(`/api/admin/customers/${customerId}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        alert(data.error || 'Failed to delete customer');
        return;
      }

      alert('Customer deleted successfully!');
      router.push('/admin/customers');
    } catch (error) {
      console.error('Error deleting customer:', error);
      alert('Failed to delete customer');
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  const handleCreateProject = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admin/customers/${customerId}/projects`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectForm,
          budget: projectForm.budget ? parseFloat(projectForm.budget) : null
        })
      });

      if (!response.ok) throw new Error('Failed to create project');

      setShowProjectForm(false);
      setProjectForm({
        title: '',
        description: '',
        budget: '',
        start_date: '',
        end_date: '',
        status: 'pending'
      });
      fetchCustomerDetails();
    } catch (error) {
      console.error('Error creating project:', error);
      alert('Failed to create project');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'blue' | 'green' | 'gray' | 'orange'> = {
      pending: 'orange',
      active: 'green',
      completed: 'blue',
      cancelled: 'gray',
    };
    return colors[status] || 'gray';
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  if (!authenticated || loading || !customer) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section padding="lg" background="white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="outline" href="/admin/customers" className="mb-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Customers
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{customer.name}</h1>
            <p className="text-gray-600 mt-2">{customer.email} • {customer.phone}</p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline" onClick={() => setShowEditForm(true)}>
              <Icon name="Edit" size={16} className="mr-2" />
              Edit Customer
            </Button>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(true)} className="text-red-600 hover:text-red-700 hover:border-red-600">
              <Icon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
            <Button variant="primary" onClick={() => setShowProjectForm(true)}>
              <Icon name="Plus" size={16} className="mr-2" />
              New Project
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Projects List */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Projects ({projects.length})</h3>
              
              {projects.length === 0 ? (
                <div className="text-center py-8">
                  <Icon name="FolderOpen" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No projects yet</p>
                  <Button variant="outline" size="sm" onClick={() => setShowProjectForm(true)} className="mt-4">
                    Create First Project
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {projects.map((project) => (
                    <div key={project.id} className="p-4 border border-gray-200 rounded-lg hover:shadow-md transition-shadow">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex-1">
                          <h4 className="font-semibold text-gray-900">{project.title}</h4>
                          <p className="text-sm text-gray-600 mt-1">{project.description}</p>
                        </div>
                        <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                      </div>
                      <div className="flex items-center justify-between mt-4">
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>Budget: {formatCurrency(project.budget)}</span>
                          <span>•</span>
                          <span>{formatDate(project.start_date)} - {formatDate(project.end_date)}</span>
                        </div>
                        <Button variant="outline" size="sm" href={`/admin/projects/${project.id}`}>
                          Manage
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Customer Info */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Customer Information</h3>
              <div className="space-y-3">
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="text-gray-900">{customer.email}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="text-gray-900">{customer.phone}</p>
                </div>
                {customer.address && (
                  <div>
                    <p className="text-sm text-gray-600">Address</p>
                    <p className="text-gray-900">{customer.address}</p>
                  </div>
                )}
                <div>
                  <p className="text-sm text-gray-600">Member Since</p>
                  <p className="text-gray-900">{formatDate(customer.created_at)}</p>
                </div>
              </div>
            </Card>

            {/* Quick Stats */}
            <Card>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Projects</span>
                  <span className="font-semibold text-gray-900">{projects.length}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Active</span>
                  <span className="font-semibold text-green-600">
                    {projects.filter(p => p.status === 'active').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Completed</span>
                  <span className="font-semibold text-blue-600">
                    {projects.filter(p => p.status === 'completed').length}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Value</span>
                  <span className="font-semibold text-gray-900">
                    {formatCurrency(projects.reduce((sum, p) => sum + (p.budget || 0), 0))}
                  </span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      {/* Create Project Modal */}
      {showProjectForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Create New Project</h2>
                <button
                  onClick={() => setShowProjectForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleCreateProject} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Project Title *</label>
                  <input
                    type="text"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Description *</label>
                  <textarea
                    value={projectForm.description}
                    onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                    rows={4}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                    <input
                      type="number"
                      value={projectForm.budget}
                      onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      placeholder="0.00"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select
                      value={projectForm.status}
                      onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="pending">Pending</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      value={projectForm.start_date}
                      onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      value={projectForm.end_date}
                      onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowProjectForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Create Project
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Edit Customer Modal */}
      {showEditForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Edit Customer</h2>
                <button
                  onClick={() => setShowEditForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleUpdateCustomer} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Name *</label>
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm({ ...editForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Email *</label>
                  <input
                    type="email"
                    value={editForm.email}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Phone</label>
                  <input
                    type="tel"
                    value={editForm.phone}
                    onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                  <textarea
                    value={editForm.address}
                    onChange={(e) => setEditForm({ ...editForm, address: e.target.value })}
                    rows={3}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="flex gap-3 mt-6">
                  <Button type="button" variant="outline" onClick={() => setShowEditForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Save Changes
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Delete Customer</h2>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete <strong>{customer.name}</strong>? This action cannot be undone.
                {projects.length > 0 && (
                  <span className="block mt-2 text-orange-600 font-medium">
                    This customer has {projects.length} project(s). Deletion may be prevented.
                  </span>
                )}
              </p>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleDeleteCustomer} 
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                >
                  Delete Customer
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
