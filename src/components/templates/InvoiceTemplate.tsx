'use client';

import React from 'react';
import Image from 'next/image';
import { businessConfig } from '@/config/business';

export interface InvoiceItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface InvoiceData {
  invoiceNumber: string;
  invoiceDate: string;
  dueDate: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  items: InvoiceItem[];
  notes?: string;
  terms?: string;
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
}

interface InvoiceTemplateProps {
  data: InvoiceData;
  editable?: boolean;
  onUpdate?: (data: InvoiceData) => void;
}

export const InvoiceTemplate: React.FC<InvoiceTemplateProps> = ({ 
  data, 
  editable = false,
  onUpdate 
}) => {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  return (
    <div className="invoice-template bg-white shadow-lg max-w-4xl mx-auto">
      <div className="p-8 md:p-12">
        {/* Header */}
        <div className="flex justify-between items-start mb-8 pb-8 border-b-2 border-blue-600">
          <div>
            <Image 
              src="/logo-transparent.png" 
              alt={businessConfig.name}
              width={200}
              height={67}
              className="mb-4"
              priority
            />
            <div className="text-sm text-gray-600">
              {businessConfig.contact.address && <p>{businessConfig.contact.address}</p>}
              <p>{businessConfig.contact.city}, {businessConfig.contact.state} {businessConfig.contact.zip}</p>
              <p className="mt-2">{businessConfig.contact.phone}</p>
              <p>{businessConfig.contact.email}</p>
            </div>
          </div>
          <div className="text-right">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">INVOICE</h1>
            <div className="text-sm">
              <p className="text-gray-600">Invoice #</p>
              <p className="text-xl font-bold text-blue-600 mb-3">{data.invoiceNumber}</p>
              <p className="text-gray-600">Invoice Date</p>
              <p className="font-semibold mb-2">{formatDate(data.invoiceDate)}</p>
              <p className="text-gray-600">Due Date</p>
              <p className="font-semibold">{formatDate(data.dueDate)}</p>
            </div>
          </div>
        </div>

        {/* Bill To */}
        <div className="mb-8">
          <h3 className="text-sm font-bold text-gray-600 uppercase mb-3">Bill To</h3>
          <div className="text-gray-900">
            <p className="font-bold text-lg">{data.customerName}</p>
            <p>{data.customerAddress}</p>
            <p className="mt-2">{data.customerPhone}</p>
            <p>{data.customerEmail}</p>
          </div>
        </div>

        {/* Items Table */}
        <div className="mb-8">
          <table className="w-full">
            <thead>
              <tr className="bg-gray-900 text-white">
                <th className="text-left py-3 px-4">Description</th>
                <th className="text-center py-3 px-4 w-24">Qty</th>
                <th className="text-right py-3 px-4 w-32">Rate</th>
                <th className="text-right py-3 px-4 w-32">Amount</th>
              </tr>
            </thead>
            <tbody>
              {data.items.map((item, index) => (
                <tr key={item.id} className={index % 2 === 0 ? 'bg-gray-50' : 'bg-white'}>
                  <td className="py-3 px-4 text-gray-900">{item.description}</td>
                  <td className="py-3 px-4 text-center text-gray-700">{item.quantity}</td>
                  <td className="py-3 px-4 text-right text-gray-700">{formatCurrency(item.rate)}</td>
                  <td className="py-3 px-4 text-right font-semibold text-gray-900">{formatCurrency(item.amount)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Totals */}
        <div className="flex justify-end mb-8">
          <div className="w-80">
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">Subtotal</span>
              <span className="font-semibold text-gray-900">{formatCurrency(data.subtotal)}</span>
            </div>
            <div className="flex justify-between py-2 border-b border-gray-300">
              <span className="text-gray-700">Tax ({data.taxRate}%)</span>
              <span className="font-semibold text-gray-900">{formatCurrency(data.tax)}</span>
            </div>
            <div className="flex justify-between py-3 bg-gray-900 text-white px-4 mt-2">
              <span className="font-bold text-lg">Total Due</span>
              <span className="font-bold text-2xl">{formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>

        {/* Notes and Terms */}
        {data.notes && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">Notes</h3>
            <p className="text-gray-700 whitespace-pre-line">{data.notes}</p>
          </div>
        )}

        {data.terms && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-600 uppercase mb-2">Payment Terms</h3>
            <p className="text-gray-700 whitespace-pre-line">{data.terms}</p>
          </div>
        )}

        {/* Footer */}
        <div className="pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          <p>Thank you for your business!</p>
          <p className="mt-2">Questions? Contact us at {businessConfig.contact.phone} or {businessConfig.contact.email}</p>
        </div>
      </div>
    </div>
  );
};
