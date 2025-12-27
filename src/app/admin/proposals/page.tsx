'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Proposal {
  id: number;
  proposal_number: string;
  customer_id: number | null;
  customer_name: string;
  customer_email: string;
  proposal_type: string;
  labor_subtotal: number;
  service_charge: number;
  total: number;
  status: string;
  created_at: string;
  proposal_date: string;
  expiration_date: string;
}

export default function AdminProposalsPage() {
  const router = useRouter();
  const [proposals, setProposals] = useState<Proposal[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchProposals();
    }
  }, [authenticated]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        setAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const fetchProposals = async () => {
    try {
      const response = await fetch('/api/admin/proposals', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch proposals');
      
      const data = await response.json();
      setProposals(data.proposals || []);
    } catch (error) {
      console.error('Error fetching proposals:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'blue' | 'green' | 'gray' | 'orange' | 'red'> = {
      draft: 'gray',
      sent: 'blue',
      viewed: 'orange',
      accepted: 'green',
      declined: 'red',
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

  const formatCurrency = (value?: number) => {
    if (!value) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const filteredProposals = proposals
    .filter(p => filterStatus === 'all' || p.status === filterStatus)
    .filter(p => 
      searchQuery === '' ||
      p.proposal_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
    );

  if (!authenticated || loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Section>
    );
  }

  const stats = {
    total: proposals.length,
    draft: proposals.filter(p => p.status === 'draft').length,
    sent: proposals.filter(p => p.status === 'sent').length,
    accepted: proposals.filter(p => p.status === 'accepted').length,
    totalValue: proposals.reduce((sum, p) => sum + (p.total || 0), 0),
  };

  return (
    <Section padding="lg" background="white">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-semibold">Proposals</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Proposals</h1>
          <p className="text-gray-600 mt-2">Manage all customer proposals and quotes</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" href="/admin/dashboard">
            <Icon name="LayoutDashboard" size={16} className="mr-2" />
            Dashboard
          </Button>
          <Button variant="primary" href="/admin/proposals/create">
            <Icon name="Plus" size={16} className="mr-2" />
            New Proposal
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total</p>
              <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Icon name="FileText" size={24} className="text-gray-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Draft</p>
              <p className="text-3xl font-bold text-gray-600">{stats.draft}</p>
            </div>
            <div className="p-3 bg-gray-100 rounded-lg">
              <Icon name="Edit" size={24} className="text-gray-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Sent</p>
              <p className="text-3xl font-bold text-blue-600">{stats.sent}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-lg">
              <Icon name="Send" size={24} className="text-blue-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Accepted</p>
              <p className="text-3xl font-bold text-green-600">{stats.accepted}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Value</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalValue)}</p>
            </div>
            <div className="p-3 bg-purple-100 rounded-lg">
              <Icon name="DollarSign" size={24} className="text-purple-600" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters */}
      <Card className="mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex-1">
            <input
              type="text"
              placeholder="Search by proposal #, customer name, or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => setFilterStatus('all')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'all'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilterStatus('draft')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'draft'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Draft
            </button>
            <button
              onClick={() => setFilterStatus('sent')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'sent'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Sent
            </button>
            <button
              onClick={() => setFilterStatus('accepted')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'accepted'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Accepted
            </button>
          </div>
        </div>
      </Card>

      {/* Proposals Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Proposal #</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Customer</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Type</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Date</th>
                <th className="text-right py-4 px-4 font-semibold text-sm text-gray-700">Total</th>
                <th className="text-center py-4 px-4 font-semibold text-sm text-gray-700">Status</th>
                <th className="text-center py-4 px-4 font-semibold text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredProposals.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-gray-500">
                    <Icon name="FileText" size={48} className="mx-auto text-gray-300 mb-3" />
                    <p>No proposals found</p>
                    <Button variant="outline" size="sm" href="/admin/proposals/create" className="mt-4">
                      Create First Proposal
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredProposals.map((proposal) => (
                  <tr key={proposal.id} className="border-b border-gray-100 hover:bg-gray-50">
                    <td className="py-4 px-4">
                      <a href={`/admin/proposals/${proposal.id}`} className="font-semibold text-blue-600 hover:text-blue-800">
                        {proposal.proposal_number}
                      </a>
                    </td>
                    <td className="py-4 px-4">
                      <p className="font-semibold text-gray-900">{proposal.customer_name}</p>
                      <p className="text-sm text-gray-600">{proposal.customer_email}</p>
                    </td>
                    <td className="py-4 px-4">
                      <span className="text-sm text-gray-700">{proposal.proposal_type}</span>
                    </td>
                    <td className="py-4 px-4 text-sm text-gray-600">
                      {formatDate(proposal.proposal_date)}
                    </td>
                    <td className="py-4 px-4 text-right font-semibold text-gray-900">
                      {formatCurrency(proposal.total)}
                    </td>
                    <td className="py-4 px-4 text-center">
                      <Badge variant={getStatusColor(proposal.status)}>
                        {proposal.status}
                      </Badge>
                    </td>
                    <td className="py-4 px-4">
                      <div className="flex items-center justify-center gap-2">
                        <Button variant="outline" size="sm" href={`/admin/proposals/${proposal.id}`}>
                          View
                        </Button>
                        {proposal.customer_id && (
                          <Button variant="outline" size="sm" href={`/admin/customers/${proposal.customer_id}`}>
                            Customer
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}
