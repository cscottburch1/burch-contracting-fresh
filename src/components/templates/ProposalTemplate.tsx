'use client';

import React from 'react';
import Image from 'next/image';
import { businessConfig } from '@/config/business';

export interface ProposalSection {
  id: string;
  title: string;
  content: string;
}

export interface ProposalItem {
  id: string;
  description: string;
  quantity: number;
  rate: number;
  amount: number;
}

export interface ProposalData {
  proposalNumber: string;
  proposalDate: string;
  expirationDate: string;
  projectTitle: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  customerAddress: string;
  introduction: string;
  sections: ProposalSection[];
  items: ProposalItem[];
  subtotal: number;
  tax: number;
  taxRate: number;
  total: number;
  terms?: string;
  notes?: string;
}

interface ProposalTemplateProps {
  data: ProposalData;
}

export const ProposalTemplate: React.FC<ProposalTemplateProps> = ({ data }) => {
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
    <div className="proposal-template bg-white shadow-lg max-w-4xl mx-auto">
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
            <h1 className="text-4xl font-bold text-gray-900 mb-2">PROPOSAL</h1>
            <div className="text-sm">
              <p className="text-gray-600">Proposal #</p>
              <p className="text-xl font-bold text-blue-600 mb-3">{data.proposalNumber}</p>
              <p className="text-gray-600">Date</p>
              <p className="font-semibold mb-2">{formatDate(data.proposalDate)}</p>
              <p className="text-gray-600">Valid Until</p>
              <p className="font-semibold">{formatDate(data.expirationDate)}</p>
            </div>
          </div>
        </div>

        {/* Project Title */}
        <div className="mb-8 bg-gray-50 p-6 rounded-lg">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{data.projectTitle}</h2>
          <div className="text-gray-700">
            <p className="font-semibold text-lg">{data.customerName}</p>
            <p>{data.customerAddress}</p>
            <p className="mt-1">{data.customerPhone} • {data.customerEmail}</p>
          </div>
        </div>

        {/* Introduction */}
        {data.introduction && (
          <div className="mb-8">
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.introduction}</p>
          </div>
        )}

        {/* Proposal Sections */}
        {data.sections.map((section, index) => (
          <div key={section.id} className="mb-8">
            <h3 className="text-xl font-bold text-gray-900 mb-3 flex items-center">
              <span className="bg-blue-600 text-white w-8 h-8 rounded-full flex items-center justify-center mr-3 text-sm">
                {index + 1}
              </span>
              {section.title}
            </h3>
            <p className="text-gray-700 leading-relaxed ml-11 whitespace-pre-line">{section.content}</p>
          </div>
        ))}

        {/* Cost Breakdown */}
        <div className="mb-8 mt-12">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Investment</h3>
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
            <div className="flex justify-between py-3 bg-blue-600 text-white px-4 mt-2 rounded">
              <span className="font-bold text-lg">Total Investment</span>
              <span className="font-bold text-2xl">{formatCurrency(data.total)}</span>
            </div>
          </div>
        </div>

        {/* Terms and Conditions */}
        {data.terms && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Terms & Conditions</h3>
            <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">{data.terms}</p>
          </div>
        )}

        {/* Notes */}
        {data.notes && (
          <div className="mb-6">
            <h3 className="text-lg font-bold text-gray-900 mb-3">Additional Notes</h3>
            <p className="text-gray-700 leading-relaxed whitespace-pre-line">{data.notes}</p>
          </div>
        )}

        {/* Acceptance */}
        <div className="mt-12 pt-8 border-t-2 border-gray-300">
          <h3 className="text-lg font-bold text-gray-900 mb-6">Proposal Acceptance</h3>
          <p className="text-gray-700 mb-6">
            By signing below, you agree to the terms and conditions outlined in this proposal.
          </p>
          <div className="grid grid-cols-2 gap-8 mb-8">
            <div>
              <div className="border-b-2 border-gray-400 mb-2 h-12"></div>
              <p className="text-sm text-gray-600">Client Signature</p>
            </div>
            <div>
              <div className="border-b-2 border-gray-400 mb-2 h-12"></div>
              <p className="text-sm text-gray-600">Date</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-8 border-t border-gray-300 text-center text-sm text-gray-600">
          <p className="font-semibold">Thank you for considering {businessConfig.name}!</p>
          <p className="mt-2">Questions? Contact us at {businessConfig.contact.phone} or {businessConfig.contact.email}</p>
        </div>
      </div>
    </div>
  );
};
