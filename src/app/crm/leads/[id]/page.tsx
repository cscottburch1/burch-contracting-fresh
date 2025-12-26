'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Lead, LeadNote, LeadActivity } from '@/types/crm';

export default function LeadDetailPage() {
  const params = useParams();
  const router = useRouter();
  const leadId = params.id as string;

  const [lead, setLead] = useState<Lead | null>(null);
  const [notes, setNotes] = useState<LeadNote[]>([]);
  const [activities, setActivities] = useState<LeadActivity[]>([]);
  const [loading, setLoading] = useState(true);
  const [newNote, setNewNote] = useState('');
  const [isImportant, setIsImportant] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [formData, setFormData] = useState<Partial<Lead>>({});

  useEffect(() => {
    if (leadId) {
      fetchLeadDetails();
    }
  }, [leadId]);

  const fetchLeadDetails = async () => {
    try {
      const [leadRes, notesRes, activitiesRes] = await Promise.all([
        fetch(`/api/crm/leads/${leadId}`),
        fetch(`/api/crm/leads/${leadId}/notes`),
        fetch(`/api/crm/leads/${leadId}/activities`)
      ]);

      const leadData = await leadRes.json();
      const notesData = await notesRes.json();
      const activitiesData = await activitiesRes.json();

      setLead(leadData.lead);
      setFormData(leadData.lead);
      setNotes(notesData.notes || []);
      setActivities(activitiesData.activities || []);
    } catch (error) {
      console.error('Error fetching lead details:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateLead = async () => {
    try {
      const response = await fetch(`/api/crm/leads/${leadId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        await fetchLeadDetails();
        setEditMode(false);
      }
    } catch (error) {
      console.error('Error updating lead:', error);
    }
  };

  const handleAddNote = async () => {
    if (!newNote.trim()) return;

    try {
      const response = await fetch(`/api/crm/leads/${leadId}/notes`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          content: newNote,
          is_important: isImportant
        })
      });

      if (response.ok) {
        setNewNote('');
        setIsImportant(false);
        await fetchLeadDetails();
      }
    } catch (error) {
      console.error('Error adding note:', error);
    }
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit'
    });
  };

  const formatCurrency = (value?: number) => {
    if (!value) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(value);
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, string> = {
      new: 'blue',
      contacted: 'purple',
      qualified: 'green',
      proposal: 'yellow',
      negotiation: 'orange',
      won: 'green',
      lost: 'gray'
    };
    return colors[status] || 'gray';
  };

  if (loading) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading lead details...</p>
        </div>
      </Section>
    );
  }

  if (!lead) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <p className="text-gray-600">Lead not found</p>
          <Button variant="primary" size="md" href="/crm" className="mt-4">
            Back to CRM
          </Button>
        </div>
      </Section>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-blue-900 to-gray-900 text-white py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="outline" size="sm" href="/crm" className="border-white text-white hover:bg-white hover:text-gray-900">
              <Icon name="ArrowRight" size={16} className="rotate-180" />
              Back
            </Button>
          </div>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{lead.name}</h1>
              <div className="flex items-center gap-3">
                <Badge variant={getStatusColor(lead.status) as any}>
                  {lead.status}
                </Badge>
                <span className="text-gray-300">{lead.service_type || 'General'}</span>
              </div>
            </div>
            <Button
              variant="primary"
              size="md"
              onClick={() => setEditMode(!editMode)}
            >
              <Icon name="User" size={20} />
              {editMode ? 'Cancel Edit' : 'Edit Lead'}
            </Button>
          </div>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">
            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Lead Information</h2>

              {editMode ? (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Status</label>
                      <select
                        value={formData.status}
                        onChange={(e) => setFormData({ ...formData, status: e.target.value as any })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="qualified">Qualified</option>
                        <option value="proposal">Proposal</option>
                        <option value="negotiation">Negotiation</option>
                        <option value="won">Won</option>
                        <option value="lost">Lost</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">Priority</label>
                      <select
                        value={formData.priority}
                        onChange={(e) => setFormData({ ...formData, priority: e.target.value as any })}
                        className="w-full px-4 py-2 border rounded-lg"
                      >
                        <option value="low">Low</option>
                        <option value="medium">Medium</option>
                        <option value="high">High</option>
                        <option value="urgent">Urgent</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Estimated Value</label>
                    <input
                      type="number"
                      value={formData.estimated_value || ''}
                      onChange={(e) => setFormData({ ...formData, estimated_value: parseFloat(e.target.value) })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="0"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Assigned To</label>
                    <input
                      type="text"
                      value={formData.assigned_to || ''}
                      onChange={(e) => setFormData({ ...formData, assigned_to: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      placeholder="Team member name"
                    />
                  </div>

                  <Button variant="primary" size="md" onClick={handleUpdateLead} fullWidth>
                    Save Changes
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Email</p>
                    <p className="font-medium text-gray-900">{lead.email}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Phone</p>
                    <p className="font-medium text-gray-900">{lead.phone}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Address</p>
                    <p className="font-medium text-gray-900">{lead.address || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Budget Range</p>
                    <p className="font-medium text-gray-900">{lead.budget_range || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Timeframe</p>
                    <p className="font-medium text-gray-900">{lead.timeframe || 'N/A'}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Estimated Value</p>
                    <p className="font-medium text-gray-900">{formatCurrency(lead.estimated_value)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Priority</p>
                    <p className="font-medium text-gray-900 capitalize">{lead.priority}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Assigned To</p>
                    <p className="font-medium text-gray-900">{lead.assigned_to || 'Unassigned'}</p>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm text-gray-500 mb-1">Project Description</p>
                    <p className="font-medium text-gray-900">{lead.description}</p>
                  </div>
                </div>
              )}
            </Card>

            <Card padding="lg">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Notes</h2>

              <div className="mb-6">
                <textarea
                  value={newNote}
                  onChange={(e) => setNewNote(e.target.value)}
                  rows={4}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Add a note about this lead..."
                />
                <div className="flex items-center justify-between mt-3">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isImportant}
                      onChange={(e) => setIsImportant(e.target.checked)}
                      className="w-4 h-4"
                    />
                    <span className="text-sm text-gray-700">Mark as important</span>
                  </label>
                  <Button variant="primary" size="sm" onClick={handleAddNote}>
                    Add Note
                  </Button>
                </div>
              </div>

              <div className="space-y-4">
                {notes.length === 0 ? (
                  <p className="text-gray-500 text-center py-8">No notes yet</p>
                ) : (
                  notes.map((note) => (
                    <div key={note.id} className={`p-4 rounded-lg ${note.is_important ? 'bg-yellow-50 border-2 border-yellow-200' : 'bg-gray-50'}`}>
                      {note.is_important && (
                        <Badge variant="orange" className="mb-2">Important</Badge>
                      )}
                      <p className="text-gray-900 mb-2">{note.content}</p>
                      <p className="text-xs text-gray-500">{formatDate(note.created_at)}</p>
                    </div>
                  ))
                )}
              </div>
            </Card>
          </div>

          <div className="space-y-6">
            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Quick Actions</h3>
              <div className="space-y-3">
                <Button variant="outline" size="md" href={`mailto:${lead.email}`} fullWidth>
                  <Icon name="Mail" size={20} />
                  Send Email
                </Button>
                <Button variant="outline" size="md" href={`tel:${lead.phone}`} fullWidth>
                  <Icon name="Phone" size={20} />
                  Call Lead
                </Button>
              </div>
            </Card>

            <Card padding="lg">
              <h3 className="text-xl font-bold text-gray-900 mb-4">Activity Timeline</h3>
              <div className="space-y-4">
                {activities.length === 0 ? (
                  <p className="text-gray-500 text-sm">No activities yet</p>
                ) : (
                  activities.map((activity) => (
                    <div key={activity.id} className="flex gap-3">
                      <div className="flex-shrink-0 w-2 h-2 bg-blue-600 rounded-full mt-2"></div>
                      <div className="flex-1">
                        <p className="text-sm text-gray-900">{activity.description}</p>
                        <p className="text-xs text-gray-500 mt-1">{formatDate(activity.created_at)}</p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </Card>

            <Card padding="lg" className="bg-blue-50">
              <h3 className="text-lg font-bold text-gray-900 mb-2">Lead Created</h3>
              <p className="text-sm text-gray-600">{formatDate(lead.created_at)}</p>
              {lead.referral_source && (
                <>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 mt-4">Source</h3>
                  <p className="text-sm text-gray-600 capitalize">{lead.referral_source}</p>
                </>
              )}
            </Card>
          </div>
        </div>
      </Section>
    </>
  );
}
