'use client';

import React, { useState } from 'react';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import Icon from '@/components/ui/Icon';
import { InvoiceTemplate, InvoiceData, InvoiceItem } from '@/components/templates/InvoiceTemplate';

export default function CreateInvoicePage() {
  const [showPreview, setShowPreview] = useState(false);
  const [invoiceData, setInvoiceData] = useState<InvoiceData>({
    invoiceNumber: `INV-${Date.now().toString().slice(-6)}`,
    invoiceDate: new Date().toISOString().split('T')[0],
    dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    customerName: '',
    customerEmail: '',
    customerPhone: '',
    customerAddress: '',
    items: [
      { id: '1', description: '', quantity: 1, rate: 0, amount: 0 }
    ],
    notes: '',
    terms: 'Payment is due within 30 days.\nPlease make checks payable to Burch Contracting.\nThank you for your business!',
    subtotal: 0,
    tax: 0,
    taxRate: 7,
    total: 0,
  });

  const calculateTotals = (items: InvoiceItem[], taxRate: number) => {
    const subtotal = items.reduce((sum, item) => sum + item.amount, 0);
    const tax = subtotal * (taxRate / 100);
    const total = subtotal + tax;
    return { subtotal, tax, total };
  };

  const updateInvoiceData = (updates: Partial<InvoiceData>) => {
    setInvoiceData(prev => {
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

  const addItem = () => {
    const newItem: InvoiceItem = {
      id: Date.now().toString(),
      description: '',
      quantity: 1,
      rate: 0,
      amount: 0,
    };
    updateInvoiceData({ items: [...invoiceData.items, newItem] });
  };

  const removeItem = (id: string) => {
    updateInvoiceData({ items: invoiceData.items.filter(item => item.id !== id) });
  };

  const updateItem = (id: string, field: keyof InvoiceItem, value: string | number) => {
    const updatedItems = invoiceData.items.map(item => {
      if (item.id === id) {
        const updated = { ...item, [field]: value };
        if (field === 'quantity' || field === 'rate') {
          updated.amount = updated.quantity * updated.rate;
        }
        return updated;
      }
      return item;
    });
    updateInvoiceData({ items: updatedItems });
  };

  const handlePrint = () => {
    window.print();
  };

  if (showPreview) {
    return (
      <div className="min-h-screen bg-gray-100">
        <div className="no-print bg-white border-b border-gray-200 p-4 sticky top-0 z-10 shadow-sm">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <h2 className="text-xl font-bold text-gray-900">Invoice Preview</h2>
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
          <InvoiceTemplate data={invoiceData} />
        </div>
      </div>
    );
  }

  return (
    <>
      <section className="bg-gradient-to-br from-gray-900 via-blue-900 to-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h1 className="text-3xl md:text-4xl font-bold">Create Invoice</h1>
          <p className="text-gray-300 mt-2">Generate professional invoices for your customers</p>
        </div>
      </section>

      <Section background="gray" padding="lg">
        <div className="max-w-5xl mx-auto">
          <Card>
            <form className="space-y-8">
              {/* Invoice Details */}
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Invoice Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Number
                    </label>
                    <input
                      type="text"
                      value={invoiceData.invoiceNumber}
                      onChange={(e) => updateInvoiceData({ invoiceNumber: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Invoice Date
                    </label>
                    <input
                      type="date"
                      value={invoiceData.invoiceDate}
                      onChange={(e) => updateInvoiceData({ invoiceDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Due Date
                    </label>
                    <input
                      type="date"
                      value={invoiceData.dueDate}
                      onChange={(e) => updateInvoiceData({ dueDate: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
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
                      value={invoiceData.customerName}
                      onChange={(e) => updateInvoiceData({ customerName: e.target.value })}
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
                      value={invoiceData.customerEmail}
                      onChange={(e) => updateInvoiceData({ customerEmail: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Phone
                    </label>
                    <input
                      type="tel"
                      value={invoiceData.customerPhone}
                      onChange={(e) => updateInvoiceData({ customerPhone: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Address
                    </label>
                    <input
                      type="text"
                      value={invoiceData.customerAddress}
                      onChange={(e) => updateInvoiceData({ customerAddress: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Line Items */}
              <div>
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-lg font-bold text-gray-900">Line Items</h3>
                  <Button type="button" variant="outline" size="sm" onClick={addItem}>
                    <Icon name="Plus" size={16} />
                    Add Item
                  </Button>
                </div>
                <div className="space-y-3">
                  {invoiceData.items.map((item, index) => (
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
                      {invoiceData.items.length > 1 && (
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
                    <span className="font-semibold">${invoiceData.subtotal.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-2 items-center">
                    <span className="text-gray-700">Tax Rate (%)</span>
                    <input
                      type="number"
                      value={invoiceData.taxRate}
                      onChange={(e) => updateInvoiceData({ taxRate: parseFloat(e.target.value) || 0 })}
                      className="w-20 px-2 py-1 border border-gray-300 rounded text-right"
                      min="0"
                      step="0.1"
                    />
                  </div>
                  <div className="flex justify-between py-2">
                    <span className="text-gray-700">Tax</span>
                    <span className="font-semibold">${invoiceData.tax.toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between py-3 bg-gray-900 text-white px-4 rounded">
                    <span className="font-bold">Total</span>
                    <span className="font-bold text-xl">${invoiceData.total.toFixed(2)}</span>
                  </div>
                </div>
              </div>

              {/* Notes and Terms */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Notes
                  </label>
                  <textarea
                    value={invoiceData.notes}
                    onChange={(e) => updateInvoiceData({ notes: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Additional notes or comments..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Payment Terms
                  </label>
                  <textarea
                    value={invoiceData.terms}
                    onChange={(e) => updateInvoiceData({ terms: e.target.value })}
                    rows={4}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Payment terms and conditions..."
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
                  disabled={!invoiceData.customerName}
                >
                  <Icon name="Eye" size={18} />
                  Preview Invoice
                </Button>
              </div>
            </form>
          </Card>
        </div>
      </Section>
    </>
  );
}
