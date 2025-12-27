'use client';

import React, { useState, useEffect } from 'react';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lead, LeadStatistics } from '@/types/crm';

export default function CRMPage() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [stats, setStats] = useState<LeadStatistics[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);

  useEffect(() => {
    fetchLeads();
    fetchStatistics();
  }, []);

  const fetchLeads = async () => {
    try {
      const response = await fetch('/api/crm/leads');
      const data = await response.json();
      // API may return an object with a `leads` array or the array directly.
      const leadsPayload = Array.isArray(data) ? data : (data.leads ?? []);
      if (Array.isArray(leadsPayload)) {
        setLeads(leadsPayload as Lead[]);
      } else {
        setLeads([]);
      }
    } catch (error) {
      console.error('Error fetching leads:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStatistics = async () => {
    try {
      const response = await fetch('/api/crm/statistics');
      const data = await response.json();
      setStats(data.statistics || []);
    } catch (error) {
      console.error('Error fetching statistics:', error);
    }
  };

  const filteredLeads = leads.filter(lead => {
    const matchesStatus = filterStatus === 'all' || lead.status === filterStatus;
    const matchesSearch = !searchQuery ||
      lead.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lead.phone.includes(searchQuery);
    return matchesStatus && matchesSearch;
  });

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'bg-blue-100 text-blue-700',
      contacted: 'bg-purple-100 text-purple-700',
      qualified: 'bg-green-100 text-green-700',
      proposal: 'bg-yellow-100 text-yellow-700',
      negotiation: 'bg-orange-100 text-orange-700',
      won: 'bg-green-600 text-white',
      lost: 'bg-gray-300 text-gray-700'
    };
    return colors[status] || 'bg-gray-100 text-gray-700';
  };

  const getPriorityColor = (priority: string) => {
    const colors: Record<string, string> = {
      low: 'bg-gray-100 text-gray-600',
      medium: 'bg-blue-100 text-blue-600',
      high: 'bg-orange-100 text-orange-600',
      urgent: 'bg-red-100 text-red-600'
    };
    return colors[priority] || 'bg-gray-100 text-gray-600';
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const totalLeads = leads.length;
  const totalValue = leads.reduce((sum, lead) => sum + (lead.estimated_value || 0), 0);
  const newLeads = leads.filter(l => l.status === 'new').length;
  const wonLeads = leads.filter(l => l.status === 'won').length;

  if (loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading CRM data...</p>
        </div>
      </Section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold mb-2">CRM Dashboard</h1>
              <p className="text-gray-300">Manage leads and track your sales pipeline</p>
            </div>
            <Button variant="primary" size="md" href="/contact">
              <Icon name="User" size={20} />
              New Lead
            </Button>
          </div>
          <div className="flex gap-3 pt-4 border-t border-white/20">
            <Button variant="outline" size="sm" href="/admin/proposals/create" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900">
              <Icon name="FileText" size={16} />
              Create Proposal
            </Button>
            <Button variant="outline" size="sm" href="/admin/invoices/create" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900">
              <Icon name="Receipt" size={16} />
              Create Invoice
            </Button>
            <Button variant="outline" size="sm" href="/admin/dashboard" className="bg-white/10 border-white/30 text-white hover:bg-white hover:text-gray-900">
              <Icon name="LayoutDashboard" size={16} />
              Admin Dashboard
            </Button>
          </div>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-blue-100 text-sm mb-1">Total Leads</p>
                <p className="text-3xl font-bold">{totalLeads}</p>
              </div>
              <Icon name="User" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-green-100 text-sm mb-1">Total Value</p>
                <p className="text-3xl font-bold">{formatCurrency(totalValue)}</p>
              </div>
              <Icon name="Award" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-orange-500 to-orange-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-orange-100 text-sm mb-1">New Leads</p>
                <p className="text-3xl font-bold">{newLeads}</p>
              </div>
              <Icon name="Star" size={40} className="opacity-80" />
            </div>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-purple-100 text-sm mb-1">Won Deals</p>
                <p className="text-3xl font-bold">{wonLeads}</p>
              </div>
              <Icon name="Check" size={40} className="opacity-80" />
            </div>
          </Card>
        </div>

        <Card padding="lg">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1">
              <input
                type="text"
                placeholder="Search leads by name, email, or phone..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Statuses</option>
              <option value="new">New</option>
              <option value="contacted">Contacted</option>
              <option value="qualified">Qualified</option>
              <option value="proposal">Proposal</option>
              <option value="negotiation">Negotiation</option>
              <option value="won">Won</option>
              <option value="lost">Lost</option>
            </select>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b-2 border-gray-200">
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Contact</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Service</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Status</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Priority</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Value</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Created</th>
                  <th className="text-left py-3 px-4 font-semibold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredLeads.length === 0 ? (
                  <tr>
                    <td colSpan={8} className="text-center py-12 text-gray-500">
                      No leads found
                    </td>
                  </tr>
                ) : (
                  filteredLeads.map((lead) => (
                    <tr key={lead.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">{lead.name}</p>
                      </td>
                      <td className="py-4 px-4">
                        <p className="text-sm text-gray-600">{lead.email}</p>
                        <p className="text-sm text-gray-600">{lead.phone}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{lead.service_type || 'N/A'}</span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(lead.status)}`}>
                          {lead.status}
                        </span>
                      </td>
                      <td className="py-4 px-4">
                        <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getPriorityColor(lead.priority)}`}>
                          {lead.priority}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-700">
                        {formatCurrency(lead.estimated_value)}
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        {formatDate(lead.created_at)}
                      </td>
                      <td className="py-4 px-4">
                        <Button
                          variant="outline"
                          size="sm"
                          href={`/crm/leads/${lead.id}`}
                        >
                          View
                        </Button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </Card>
      </Section>
    </>
  );
}
