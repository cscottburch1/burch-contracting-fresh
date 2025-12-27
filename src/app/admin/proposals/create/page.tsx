'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { ProposalTemplate, ProposalData, ProposalItem, ProposalSection } from '@/components/templates/ProposalTemplate';

export default function CreateProposalPage() {
  const [showPreview, setShowPreview] = useState(false);
  const [proposalData, setProposalData] = useState<ProposalData>({
    proposalNumber: `PROP-${Date.now().toString().slice(-6)}`,
    proposalDate: new Date().toISOString().split('T')[0],
    expirationDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    projectTitle: '',
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    introduction: 'Thank you for the opportunity to present this proposal. We are excited to work with you on this project and are committed to delivering exceptional quality and service.',
    sections: [
      { id: '1', title: 'Project Overview', content: '' },
      { id: '2', title: 'Scope of Work', content: '' },
      { id: '3', title: 'Timeline', content: '' }
    ],
    items: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    subtotal: 0,
    tax: 0,
    taxRate: 7,
    total: 0,
    terms: 'Payment Schedule:\n• 50% deposit upon signing\n• 25% at project midpoint\n• 25% upon completion\n\nAll work is guaranteed for one year from completion date.\nChanges to scope may affect timeline and cost.',
    notes: '',
  });

  const calculateTotals = (items: ProposalItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const updateProposalData = (updates: Partial<ProposalData>) => {
    setProposalData(prev => {
      const newData = { ...prev, ...updates };
      if (updates.items || updates.taxRate !== undefined) {
        const totals = calculateTotals(
          updates.items || prev.items,
          updates.taxRate !== undefined ? updates.taxRate : prev.taxRate
        );
        return { ...newData, ...totals };
      }
      return newData;
    });
  };

  const addSection = () => {
    const newSection: ProposalSection = {
      id: Date.now().toString(),
      title: '',
      content: '',
    };
    updateProposalData({ sections: [...proposalData.sections, newSection] });
  };

  const removeSection = (id: string) => {
    updateProposalData({ sections: proposalData.sections.filter(section => section.id !== id) });
  };

  const updateSection = (id: string, field: keyof ProposalSection, value: string) => {
    const updatedSections = proposalData.sections.map(section =>
      section.id === id ? { ...section, [field]: value } : section
    );
    updateProposalData({ sections: updatedSections });
  };

  const addItem = () => {
    const newItem: ProposalItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    updateProposalData({ items: [...proposalData.items, newItem] });
  };

  const removeItem = (id: string) => {
    updateProposalData({ items: proposalData.items.filter(item => item.id !== id) });
  };

  const updateItem = (id: string, field: keyof ProposalItem, value: string | number) => {
    const updatedItems = proposalData.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    updateProposalData({ items: updatedItems });
  };

  const handlePrint = () => {
    window.print();
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="no-print bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Proposal Preview</h2>
            <div className="flex gap-3">
              <Button variant="outline" onClick={() => setShowPreview(false)}>
                <Icon name="Edit" size={18} />
                Edit
              </Button>
              <Button variant="primary" onClick={handlePrint}>
                <Icon name="Printer" size={18} />
                Print / Save PDF
              </Button>
            </div>
          </div>
        </div>
        <div className="py-8">
          <ProposalTemplate data={proposalData} />
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Create Proposal</h1>
          <p className="text-gray-300 mt-2">Create professional project proposals for potential clients</p>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="max-w-5xl mx-auto">
          <Card>
            <form className="space-y-8">
              {/* Proposal Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Proposal Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Proposal Number
                    </label>
                    <input
                      type="text"
                      value={proposalData.proposalNumber}
                      onChange={(e) => updateProposalData({ proposalNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Date
                    </label>
                    <input
                      type="date"
                      value={proposalData.proposalDate}
                      onChange={(e) => updateProposalData({ proposalDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Valid Until
                    </label>
                    <input
                      type="date"
                      value={proposalData.expirationDate}
                      onChange={(e) => updateProposalData({ expirationDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
                <div className="mt-4">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Project Title *
                  </label>
                  <input
                    type="text"
                    value={proposalData.projectTitle}
                    onChange={(e) => updateProposalData({ projectTitle: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="e.g., Kitchen Remodel, Deck Construction..."
                    required
                  />
                </div>
              </div>

              {/* Customer Information */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Customer Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Customer Name *
                    </label>
                    <input
                      type="text"
                      value={proposalData.customerName}
                      onChange={(e) => updateProposalData({ customerName: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Email
                    </label>
                    <input
                      type="email"
                      value={proposalData.customerEmail}
                      onChange={(e) => updateProposalData({ customerEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={proposalData.customerPhone}
                      onChange={(e) => updateProposalData({ customerPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={proposalData.customerAddress}
                      onChange={(e) => updateProposalData({ customerAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Introduction */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Introduction
                </label>
                <textarea
                  value={proposalData.introduction}
                  onChange={(e) => updateProposalData({ introduction: e.target.value })}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  placeholder="Opening statement for the proposal..."
                />
              </div>

              {/* Proposal Sections */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Proposal Sections</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addSection}>
                    <Icon name="Plus" size={16} />
                    Add Section
                  </Button>
                </div>
                <div className="space-y-4">
                  {proposalData.sections.map((section, index) => (
                    <Card key={section.id} className="p-4 bg-gray-50">
                      <div className="flex justify-between items-start mb-3">
                        <span className="bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                          Section {index + 1}
                        </span>
                        {proposalData.sections.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeSection(section.id)}
                            className="text-red-600 hover:bg-red-50 p-1 rounded"
                          >
                            <Icon name="X" size={20} />
                          </button>
                        )}
                      </div>
                      <div className="space-y-3">
                        <input
                          type="text"
                          placeholder="Section Title"
                          value={section.title}
                          onChange={(e) => updateSection(section.id, 'title', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                        <textarea
                          placeholder="Section Content"
                          value={section.content}
                          onChange={(e) => updateSection(section.id, 'content', e.target.value)}
                          rows={4}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Investment Breakdown</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Icon name="Plus" size={16} />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {proposalData.items.map((item) => (
                    <div key={item.id} className="flex gap-3 items-start">
                      <div className="flex-1">
                        <input
                          type="text"
                          placeholder="Description"
                          value={item.description}
                          onChange={(e) => updateItem(item.id, 'description', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                      <div className="w-24">
                        <input
                          type="number"
                          placeholder="Qty"
                          value={item.quantity}
                          onChange={(e) => updateItem(item.id, 'quantity', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.1"
                        />
                      </div>
                      <div className="w-32">
                        <input
                          type="number"
                          placeholder="Rate"
                          value={item.rate}
                          onChange={(e) => updateItem(item.id, 'rate', parseFloat(e.target.value) || 0)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                          min="0"
                          step="0.01"
                        />
                      </div>
                      <div className="w-32 px-3 py-2 bg-gray-50 border border-gray-300 rounded-lg text-right font-semibold">
                        ${item.amount.toFixed(2)}
                      </div>
                      {proposalData.items.length > 1 && (
                        <button
                          type="button"
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg"
                        >
                          <Icon name="X" size={20} />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Totals */}
              <div className="flex justify-end">
                <div className="w-80 space-y-2">
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Subtotal</span>
                    <span className="font-semibold">${proposalData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="text-gray-700">Tax Rate (%)</span>
                    <input
                      type="number"
                      value={proposalData.taxRate}
                      onChange={(e) => updateProposalData({ taxRate: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Tax</span>
                    <span className="font-semibold">${proposalData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-blue-600 text-white px-4 rounded">
                    <span className="font-bold">Total Investment</span>
                    <span className="font-bold text-xl">${proposalData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Terms and Notes */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Terms & Conditions
                  </label>
                  <textarea
                    value={proposalData.terms}
                    onChange={(e) => updateProposalData({ terms: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Payment terms, warranties, etc..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Additional Notes
                  </label>
                  <textarea
                    value={proposalData.notes}
                    onChange={(e) => updateProposalData({ notes: e.target.value })}
                    rows={6}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Any additional information..."
                  />
                </div>
              </div>

              {/* Actions */}
              <div className="flex justify-end gap-3 pt-4 border-t">
                <Button type="button" variant="outline" href="/admin/dashboard">
                  Cancel
                </Button>
                <Button 
                  type="button" 
                  variant="primary" 
                  onClick={() => setShowPreview(true)}
                  disabled={!proposalData.customerName || !proposalData.projectTitle}
                >
                  <Icon name="Eye" size={18} />
                  Preview Proposal
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
