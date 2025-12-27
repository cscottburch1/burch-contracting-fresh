'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CreateProposalPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const res = await fetch('/api/admin/me');
      if (!res.ok) {
        router.push('/admin');
        return;
      }
      const data = await res.json();
      setCurrentUser(data.user);
    } catch (err) {
      router.push('/admin');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  const handleProposalTypeSelect = (type: string) => {
    // For now, just show an alert. We'll build the templates next
    alert(`${type} proposal template coming soon!`);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">Create New Proposal</h1>
              <p className="text-xl text-gray-600">Select the type of proposal you want to create</p>
            </div>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition font-bold"
            >
               Back to Dashboard
            </button>
          </div>
        </div>

        {/* Proposal Type Selection */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
          {/* Handyman Services */}
          <button
            onClick={() => handleProposalTypeSelect('Handyman Services')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition">
                <span className="text-5xl"></span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-blue-600 transition">
              Handyman Services
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Create proposals for general repairs, maintenance, and small projects
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div> General repairs</div>
              <div> Maintenance work</div>
              <div> Small installations</div>
              <div> Minor upgrades</div>
            </div>
            <div className="mt-6 text-center">
              <span className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-blue-700">
                Select Template
              </span>
            </div>
          </button>

          {/* Kitchen/Bath Remodeling */}
          <button
            onClick={() => handleProposalTypeSelect('Kitchen/Bath Remodeling')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center group-hover:bg-green-200 transition">
                <span className="text-5xl"></span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-green-600 transition">
              Kitchen/Bath Remodeling
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Create detailed proposals for kitchen and bathroom renovation projects
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div> Cabinet installation</div>
              <div> Countertop work</div>
              <div> Plumbing fixtures</div>
              <div> Tile & flooring</div>
            </div>
            <div className="mt-6 text-center">
              <span className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-green-700">
                Select Template
              </span>
            </div>
          </button>

          {/* Additions/Screened Porches/Decks */}
          <button
            onClick={() => handleProposalTypeSelect('Additions/Porches/Decks')}
            className="bg-white rounded-xl shadow-lg p-8 hover:shadow-2xl transition-all transform hover:scale-105 text-left group"
          >
            <div className="flex items-center justify-center mb-6">
              <div className="w-24 h-24 bg-orange-100 rounded-full flex items-center justify-center group-hover:bg-orange-200 transition">
                <span className="text-5xl"></span>
              </div>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 mb-3 text-center group-hover:text-orange-600 transition">
              Additions/Porches/Decks
            </h3>
            <p className="text-gray-600 text-center mb-4">
              Create comprehensive proposals for large construction projects
            </p>
            <div className="text-sm text-gray-500 space-y-1">
              <div> Room additions</div>
              <div> Screened porches</div>
              <div> Deck construction</div>
              <div> Major renovations</div>
            </div>
            <div className="mt-6 text-center">
              <span className="inline-block bg-orange-600 text-white px-6 py-3 rounded-lg font-semibold group-hover:bg-orange-700">
                Select Template
              </span>
            </div>
          </button>
        </div>

        {/* Info Section */}
        <div className="mt-12 bg-blue-50 border border-blue-200 rounded-lg p-6">
          <div className="flex items-start gap-4">
            <div className="text-3xl">ℹ</div>
            <div>
              <h4 className="font-bold text-gray-900 mb-2">What happens next?</h4>
              <p className="text-gray-700">
                After selecting a proposal type, you'll be guided through a template specific to that service category. 
                Each template includes pre-filled sections relevant to the work type, making it faster to create professional proposals.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
