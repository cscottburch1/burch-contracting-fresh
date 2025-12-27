'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Invoice {
  id: number;
  invoice_number: string;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  invoice_date: string;
  due_date: string;
  subtotal: number;
  tax: number;
  total: number;
  amount_paid: number;
  status: string;
  invoice_type: string;
  created_at: string;
}

export default function AdminInvoicesPage() {
  const router = useRouter();
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [authenticated, setAuthenticated] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated) {
      fetchInvoices();
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

  const fetchInvoices = async () => {
    try {
      const response = await fetch('/api/admin/invoices', {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch invoices');
      
      const data = await response.json();
      setInvoices(data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'blue' | 'green' | 'gray' | 'orange'> = {
      draft: 'gray',
      sent: 'blue',
      viewed: 'orange',
      paid: 'green',
      overdue: 'orange',
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

  const formatCurrency = (value?: number) => {
    if (value === undefined || value === null) return '$0.00';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(value);
  };

  const filteredInvoices = invoices
    .filter(inv => filterStatus === 'all' || inv.status === filterStatus)
    .filter(inv => 
      searchQuery === '' ||
      inv.invoice_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      inv.customer_email.toLowerCase().includes(searchQuery.toLowerCase())
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
    total: invoices.length,
    draft: invoices.filter(inv => inv.status === 'draft').length,
    sent: invoices.filter(inv => inv.status === 'sent').length,
    paid: invoices.filter(inv => inv.status === 'paid').length,
    overdue: invoices.filter(inv => inv.status === 'overdue').length,
    totalRevenue: invoices.filter(inv => inv.status === 'paid').reduce((sum, inv) => sum + (inv.total || 0), 0),
    unpaidAmount: invoices.filter(inv => inv.status !== 'paid' && inv.status !== 'cancelled').reduce((sum, inv) => sum + (inv.total - (inv.amount_paid || 0)), 0),
  };

  return (
    <Section padding="lg" background="white">
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-semibold">Invoices</span>
      </div>

      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Invoices</h1>
          <p className="text-gray-600 mt-2">Manage and track all customer invoices</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" href="/admin/dashboard">
            <Icon name="LayoutDashboard" size={16} className="mr-2" />
            Dashboard
          </Button>
          <Button variant="primary" href="/admin/invoices/create">
            <Icon name="Plus" size={16} className="mr-2" />
            New Invoice
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
              <p className="text-sm text-gray-600 mb-1">Paid</p>
              <p className="text-3xl font-bold text-green-600">{stats.paid}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Icon name="CheckCircle" size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Overdue</p>
              <p className="text-3xl font-bold text-red-600">{stats.overdue}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-lg">
              <Icon name="AlertCircle" size={24} className="text-red-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Revenue</p>
              <p className="text-2xl font-bold text-gray-900">{formatCurrency(stats.totalRevenue)}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-lg">
              <Icon name="DollarSign" size={24} className="text-green-600" />
            </div>
          </div>
        </Card>

        <Card>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Unpaid</p>
              <p className="text-2xl font-bold text-orange-600">{formatCurrency(stats.unpaidAmount)}</p>
            </div>
            <div className="p-3 bg-orange-100 rounded-lg">
              <Icon name="Clock" size={24} className="text-orange-600" />
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
              placeholder="Search by invoice #, customer name, or email..."
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
              onClick={() => setFilterStatus('overdue')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'overdue'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Overdue
            </button>
            <button
              onClick={() => setFilterStatus('paid')}
              className={`px-4 py-2 rounded-lg font-medium transition ${
                filterStatus === 'paid'
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              Paid
            </button>
          </div>
        </div>
      </Card>

      {/* Invoices Table */}
      <Card>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Invoice #</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Customer</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Type</th>
                <th className="text-left py-4 px-4 font-semibold text-sm text-gray-700">Date / Due</th>
                <th className="text-right py-4 px-4 font-semibold text-sm text-gray-700">Amount</th>
                <th className="text-right py-4 px-4 font-semibold text-sm text-gray-700">Balance</th>
                <th className="text-center py-4 px-4 font-semibold text-sm text-gray-700">Status</th>
                <th className="text-center py-4 px-4 font-semibold text-sm text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-gray-500">
                    <Icon name="FileText" size={48} className="mx-auto text-gray-300 mb-3" />
                    <p>No invoices found</p>
                    <Button variant="outline" size="sm" href="/admin/invoices/create" className="mt-4">
                      Create First Invoice
                    </Button>
                  </td>
                </tr>
              ) : (
                filteredInvoices.map((invoice) => {
                  const balance = invoice.total - (invoice.amount_paid || 0);
                  return (
                    <tr key={invoice.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-4 px-4">
                        <a href={`/admin/invoices/${invoice.id}`} className="font-semibold text-blue-600 hover:text-blue-800">
                          {invoice.invoice_number}
                        </a>
                      </td>
                      <td className="py-4 px-4">
                        <p className="font-semibold text-gray-900">{invoice.customer_name}</p>
                        <p className="text-sm text-gray-600">{invoice.customer_email}</p>
                      </td>
                      <td className="py-4 px-4">
                        <span className="text-sm text-gray-700">{invoice.invoice_type || 'Standard'}</span>
                      </td>
                      <td className="py-4 px-4 text-sm text-gray-600">
                        <div>{formatDate(invoice.invoice_date)}</div>
                        <div className="text-xs text-gray-500">Due: {formatDate(invoice.due_date)}</div>
                      </td>
                      <td className="py-4 px-4 text-right font-semibold text-gray-900">
                        {formatCurrency(invoice.total)}
                      </td>
                      <td className="py-4 px-4 text-right">
                        <span className={`font-semibold ${balance > 0 ? 'text-orange-600' : 'text-green-600'}`}>
                          {formatCurrency(balance)}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-center">
                        <Badge variant={getStatusColor(invoice.status)}>
                          {invoice.status}
                        </Badge>
                      </td>
                      <td className="py-4 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <Button variant="outline" size="sm" href={`/admin/invoices/${invoice.id}`}>
                            View
                          </Button>
                          {invoice.customer_id && (
                            <Button variant="outline" size="sm" href={`/admin/customers/${invoice.customer_id}`}>
                              Customer
                            </Button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </Section>
  );
}
