'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface ProposalItem {
  service: string;
  quantity: number;
  price: number;
  total: number;
  notes?: string;
}

interface Proposal {
  id: number;
  proposal_number: string;
  customer_id: number | null;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  customer_address: string;
  proposal_type: string;
  labor_subtotal: number;
  service_charge: number;
  subtotal: number;
  tax_rate: number;
  tax: number;
  total: number;
  status: string;
  notes: string;
  items_json: string;
  created_at: string;
  proposal_date: string;
  expiration_date: string;
}

export default function ProposalDetailPage() {
  const router = useRouter();
  const params = useParams();
  const proposalId = params.id as string;

  const [proposal, setProposal] = useState<Proposal | null>(null);
  const [items, setItems] = useState<ProposalItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [statusUpdating, setStatusUpdating] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated && proposalId) {
      fetchProposalDetails();
    }
  }, [authenticated, proposalId]);

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

  const fetchProposalDetails = async () => {
    try {
      const response = await fetch(`/api/admin/proposals/${proposalId}`, {
        credentials: 'include'
      });
      
      if (!response.ok) throw new Error('Failed to fetch proposal');
      
      const data = await response.json();
      setProposal(data.proposal);
      
      // Parse items JSON
      try {
        const parsedItems = JSON.parse(data.proposal.items_json);
        setItems(parsedItems);
      } catch (e) {
        console.error('Error parsing items:', e);
        setItems([]);
      }
    } catch (error) {
      console.error('Error fetching proposal:', error);
      alert('Failed to load proposal details');
    } finally {
      setLoading(false);
    }
  };

  const updateStatus = async (newStatus: string) => {
    setStatusUpdating(true);
    try {
      const response = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ status: newStatus })
      });

      if (response.ok) {
        await fetchProposalDetails();
      } else {
        alert('Failed to update status');
      }
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update status');
    } finally {
      setStatusUpdating(false);
    }
  };

  const handleDeleteProposal = async () => {
    try {
      const response = await fetch(`/api/admin/proposals/${proposalId}`, {
        method: 'DELETE',
        credentials: 'include'
      });

      if (response.ok) {
        alert('Proposal deleted successfully');
        router.push('/admin/proposals');
      } else {
        const data = await response.json();
        alert(data.error || 'Failed to delete proposal');
      }
    } catch (error) {
      console.error('Error deleting proposal:', error);
      alert('Failed to delete proposal');
    }
    setShowDeleteConfirm(false);
  };

  const resendEmail = async () => {
    if (!proposal) return;
    
    try {
      const response = await fetch('/api/admin/proposals/email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          proposalNumber: proposal.proposal_number,
          customerName: proposal.customer_name,
          customerEmail: proposal.customer_email,
          customerPhone: proposal.customer_phone,
          customerAddress: proposal.customer_address,
          proposalDate: proposal.proposal_date,
          expirationDate: proposal.expiration_date,
          items: items,
          laborSubtotal: proposal.labor_subtotal,
          serviceCharge: proposal.service_charge,
          subtotal: proposal.subtotal,
          taxRate: proposal.tax_rate,
          tax: proposal.tax,
          total: proposal.total,
          notes: proposal.notes,
          proposalType: proposal.proposal_type
        })
      });

      if (response.ok) {
        alert('Proposal email sent successfully!');
        updateStatus('sent');
      } else {
        alert('Failed to send email');
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Failed to send email');
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'blue' | 'green' | 'gray' | 'orange'> = {
      draft: 'gray',
      sent: 'blue',
      viewed: 'orange',
      accepted: 'green',
      declined: 'gray',
    };
    return colors[status] || 'gray';
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'long',
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

  if (!authenticated || loading || !proposal) {
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
      {/* Breadcrumb */}
      <div className="mb-4 text-sm text-gray-600">
        <a href="/admin/dashboard" className="hover:text-blue-600">Dashboard</a>
        <span className="mx-2">/</span>
        <a href="/admin/proposals" className="hover:text-blue-600">Proposals</a>
        <span className="mx-2">/</span>
        <span className="text-gray-900 font-semibold">{proposal.proposal_number}</span>
      </div>

      <div className="max-w-5xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="outline" href="/admin/proposals" className="mb-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Proposals
            </Button>
            <div className="flex items-center gap-4">
              <h1 className="text-3xl font-bold text-gray-900">{proposal.proposal_number}</h1>
              <Badge variant={getStatusColor(proposal.status)}>{proposal.status}</Badge>
            </div>
            <p className="text-gray-600 mt-2">{proposal.proposal_type}</p>
          </div>
          <div className="flex gap-3">
            <Button 
              variant="outline" 
              onClick={() => setShowDeleteConfirm(true)}
              className="text-red-600 hover:text-red-700 hover:border-red-600"
            >
              <Icon name="Trash2" size={16} className="mr-2" />
              Delete
            </Button>
            <Button variant="outline" onClick={resendEmail}>
              <Icon name="Send" size={16} className="mr-2" />
              {proposal.status === 'draft' ? 'Send Email' : 'Resend Email'}
            </Button>
            {proposal.customer_id && (
              <Button variant="outline" href={`/admin/customers/${proposal.customer_id}`}>
                <Icon name="User" size={16} className="mr-2" />
                View Customer
              </Button>
            )}
          </div>
        </div>

        {/* Status Actions */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Update Status</h3>
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateStatus('draft')}
              disabled={statusUpdating || proposal.status === 'draft'}
            >
              Draft
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateStatus('sent')}
              disabled={statusUpdating || proposal.status === 'sent'}
            >
              Sent
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateStatus('viewed')}
              disabled={statusUpdating || proposal.status === 'viewed'}
            >
              Viewed
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateStatus('accepted')}
              disabled={statusUpdating || proposal.status === 'accepted'}
            >
              Accepted
            </Button>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => updateStatus('declined')}
              disabled={statusUpdating || proposal.status === 'declined'}
            >
              Declined
            </Button>
          </div>
          {proposal.status === 'accepted' && (
            <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
              <p className="text-green-800 font-semibold mb-2">✓ Proposal Accepted!</p>
              <Button variant="primary" size="sm" href={`/admin/projects/new?fromProposal=${proposal.id}`}>
                <Icon name="Plus" size={16} className="mr-2" />
                Convert to Project
              </Button>
            </div>
          )}
        </Card>

        {/* Customer Info */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Customer Information</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm text-gray-600">Name</p>
              <p className="text-gray-900 font-medium">{proposal.customer_name}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Email</p>
              <p className="text-gray-900">{proposal.customer_email}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Phone</p>
              <p className="text-gray-900">{proposal.customer_phone}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Address</p>
              <p className="text-gray-900">{proposal.customer_address}</p>
            </div>
          </div>
        </Card>

        {/* Dates */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Proposal Dates</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <p className="text-sm text-gray-600">Created</p>
              <p className="text-gray-900 font-medium">{formatDate(proposal.created_at)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Proposal Date</p>
              <p className="text-gray-900 font-medium">{formatDate(proposal.proposal_date)}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Expires</p>
              <p className="text-gray-900 font-medium">{formatDate(proposal.expiration_date)}</p>
            </div>
          </div>
        </Card>

        {/* Line Items */}
        <Card className="mb-6">
          <h3 className="font-semibold text-gray-900 mb-4">Services</h3>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="text-left py-3 px-4 font-semibold text-sm text-gray-700">Service Description</th>
                  <th className="text-center py-3 px-4 font-semibold text-sm text-gray-700">Qty</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Price</th>
                  <th className="text-right py-3 px-4 font-semibold text-sm text-gray-700">Total</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item, index) => (
                  <React.Fragment key={index}>
                    <tr className="border-b border-gray-100">
                      <td className="py-3 px-4 text-gray-900">{item.service}</td>
                      <td className="py-3 px-4 text-center text-gray-900">{item.quantity}</td>
                      <td className="py-3 px-4 text-right text-gray-900">{formatCurrency(item.price)}</td>
                      <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(item.total)}</td>
                    </tr>
                    {item.notes && (
                      <tr>
                        <td colSpan={4} className="py-2 px-4 text-sm text-gray-600 italic">
                          Note: {item.notes}
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))}
              </tbody>
            </table>
          </div>

          {/* Totals */}
          <div className="mt-6 border-t pt-4">
            <div className="max-w-md ml-auto space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Labor Subtotal:</span>
                <span className="font-semibold">{formatCurrency(proposal.labor_subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Service Charge:</span>
                <span className={`font-semibold ${proposal.service_charge === 0 ? 'text-green-600' : ''}`}>
                  {proposal.service_charge === 0 ? (
                    <span><del>$69.00</del> ✓ Waived</span>
                  ) : (
                    formatCurrency(proposal.service_charge)
                  )}
                </span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Subtotal:</span>
                <span className="font-semibold">{formatCurrency(proposal.subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Tax ({proposal.tax_rate}%):</span>
                <span className="font-semibold">{formatCurrency(proposal.tax)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-gray-900 pt-2 border-t">
                <span>Total:</span>
                <span className="text-blue-600">{formatCurrency(proposal.total)}</span>
              </div>
            </div>
          </div>
        </Card>

        {/* Notes */}
        {proposal.notes && (
          <Card>
            <h3 className="font-semibold text-gray-900 mb-4">Additional Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">{proposal.notes}</p>
          </Card>
        )}
      </div>
      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold text-gray-900">Delete Proposal</h2>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Icon name="X" size={24} />
                </button>
              </div>

              <p className="text-gray-600 mb-6">
                Are you sure you want to delete proposal <strong>{proposal.proposal_number}</strong>? This action cannot be undone.
                {proposal.status === 'accepted' && (
                  <span className="block mt-2 text-orange-600 font-medium">
                    This proposal has been accepted and cannot be deleted.
                  </span>
                )}
              </p>

              <div className="flex gap-3">
                <Button type="button" variant="outline" onClick={() => setShowDeleteConfirm(false)} className="flex-1">
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  onClick={handleDeleteProposal}
                  disabled={proposal.status === 'accepted'}
                  className="flex-1 bg-red-600 hover:bg-red-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed"
                >
                  Delete Proposal
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}    </Section>
  );
}
