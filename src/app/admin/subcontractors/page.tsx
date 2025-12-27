'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Subcontractor } from '@/types/subcontractor';

export default function SubcontractorsManagementPage() {
  const router = useRouter();
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [subcontractors, setSubcontractors] = useState<Subcontractor[]>([]);
  const [filteredSubcontractors, setFilteredSubcontractors] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Filters
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [specialtyFilter, setSpecialtyFilter] = useState<string>('all');
  
  // Modal states
  const [selectedSubcontractor, setSelectedSubcontractor] = useState<Subcontractor | null>(null);
  const [showDetailsModal, setShowDetailsModal] = useState(false);
  const [showNotesModal, setShowNotesModal] = useState(false);
  const [adminNotes, setAdminNotes] = useState('');

  useEffect(() => {
    checkAuth();
    loadSubcontractors();
  }, []);

  useEffect(() => {
    filterSubcontractors();
  }, [subcontractors, statusFilter, searchQuery, specialtyFilter]);

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
    }
  };

  const loadSubcontractors = async () => {
    try {
      const res = await fetch('/api/admin/subcontractors');
      if (!res.ok) throw new Error('Failed to load');
      const data = await res.json();
      setSubcontractors(data.subcontractors || []);
    } catch (err) {
      setError('Failed to load subcontractors');
    } finally {
      setLoading(false);
    }
  };

  const filterSubcontractors = () => {
    let filtered = [...subcontractors];

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }

    // Search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(s => 
        s.company_name.toLowerCase().includes(query) ||
        s.contact_name.toLowerCase().includes(query) ||
        s.email.toLowerCase().includes(query) ||
        s.phone.includes(query)
      );
    }

    // Specialty filter
    if (specialtyFilter !== 'all') {
      filtered = filtered.filter(s => 
        s.specialties && s.specialties.includes(specialtyFilter)
      );
    }

    setFilteredSubcontractors(filtered);
  };

  const updateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/admin/subcontractors/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!res.ok) throw new Error('Failed to update');
      
      setSuccess(`Status updated to ${newStatus}`);
      setTimeout(() => setSuccess(''), 3000);
      loadSubcontractors();
    } catch (err) {
      setError('Failed to update status');
      setTimeout(() => setError(''), 3000);
    }
  };

  const saveNotes = async () => {
    if (!selectedSubcontractor) return;

    try {
      const res = await fetch(`/api/admin/subcontractors/${selectedSubcontractor.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ admin_notes: adminNotes }),
      });

      if (!res.ok) throw new Error('Failed to save');
      
      setSuccess('Notes saved successfully');
      setTimeout(() => setSuccess(''), 3000);
      setShowNotesModal(false);
      loadSubcontractors();
    } catch (err) {
      setError('Failed to save notes');
      setTimeout(() => setError(''), 3000);
    }
  };

  const getStatusBadge = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800',
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getRatingStars = (rating: number) => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      stars.push(
        <span key={i} className={i <= rating ? 'text-yellow-500' : 'text-gray-300'}>
          ★
        </span>
      );
    }
    return stars;
  };

  const allSpecialties = Array.from(
    new Set(subcontractors.flatMap(s => s.specialties || []))
  ).sort();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-900">Subcontractor Management</h1>
            <p className="text-gray-600 mt-2">Manage your subcontractor network</p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={() => router.push('/admin/subcontractors/manage')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold"
            >
              + Add New Subcontractor
            </button>
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>

        {/* Success/Error Messages */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-6">
            {success}
          </div>
        )}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-6">
            {error}
          </div>
        )}

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-8">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">
              {subcontractors.length}
            </div>
            <div className="text-gray-600">Total</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-yellow-600">
              {subcontractors.filter(s => s.status === 'pending').length}
            </div>
            <div className="text-gray-600">Pending</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-green-600">
              {subcontractors.filter(s => s.status === 'active').length}
            </div>
            <div className="text-gray-600">Active</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-blue-600">
              {subcontractors.filter(s => s.status === 'approved').length}
            </div>
            <div className="text-gray-600">Approved</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="text-3xl font-bold text-red-600">
              {subcontractors.filter(s => s.status === 'suspended').length}
            </div>
            <div className="text-gray-600">Suspended</div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white p-6 rounded-lg shadow mb-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-semibold mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Company, name, email..."
                className="w-full border border-gray-300 rounded-lg p-2"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-semibold mb-2">Specialty</label>
              <select
                value={specialtyFilter}
                onChange={(e) => setSpecialtyFilter(e.target.value)}
                className="w-full border border-gray-300 rounded-lg p-2"
              >
                <option value="all">All Specialties</option>
                {allSpecialties.map(specialty => (
                  <option key={specialty} value={specialty}>{specialty}</option>
                ))}
              </select>
            </div>
            <div className="flex items-end">
              <button
                onClick={() => {
                  setSearchQuery('');
                  setStatusFilter('all');
                  setSpecialtyFilter('all');
                }}
                className="w-full bg-gray-200 text-gray-700 py-2 rounded-lg hover:bg-gray-300 transition"
              >
                Clear Filters
              </button>
            </div>
          </div>
        </div>

        {/* Subcontractors Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-100 border-b">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Contact</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Specialties</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Rating</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Projects</th>
                  <th className="px-6 py-4 text-left text-sm font-bold text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredSubcontractors.length === 0 ? (
                  <tr>
                    <td colSpan={7} className="px-6 py-8 text-center text-gray-500">
                      No subcontractors found
                    </td>
                  </tr>
                ) : (
                  filteredSubcontractors.map((sub) => (
                    <tr key={sub.id} className="border-b hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-semibold text-gray-900">{sub.company_name}</div>
                        <div className="text-sm text-gray-600">{sub.license_number}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-gray-900">{sub.contact_name}</div>
                        <div className="text-sm text-gray-600">{sub.email}</div>
                        <div className="text-sm text-gray-600">{sub.phone}</div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-wrap gap-1">
                          {sub.specialties.slice(0, 3).map((spec, idx) => (
                            <span key={idx} className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                              {spec}
                            </span>
                          ))}
                          {sub.specialties.length > 3 && (
                            <span className="text-xs text-gray-600">
                              +{sub.specialties.length - 3}
                            </span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusBadge(sub.status)}`}>
                          {sub.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center">
                          {getRatingStars(Math.round(sub.rating))}
                          <span className="ml-2 text-sm text-gray-600">
                            ({sub.rating.toFixed(1)})
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 text-gray-900">
                        {sub.total_projects}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col gap-2">
                          <button
                            onClick={() => {
                              setSelectedSubcontractor(sub);
                              setShowDetailsModal(true);
                            }}
                            className="text-blue-600 hover:text-blue-800 text-sm font-semibold"
                          >
                            View Details
                          </button>
                          
                          {sub.status === 'pending' && (
                            <div className="flex gap-2">
                              <button
                                onClick={() => updateStatus(sub.id, 'approved')}
                                className="text-green-600 hover:text-green-800 text-sm font-semibold"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => updateStatus(sub.id, 'rejected')}
                                className="text-red-600 hover:text-red-800 text-sm font-semibold"
                              >
                                Reject
                              </button>
                            </div>
                          )}
                          
                          {(sub.status === 'approved' || sub.status === 'active') && (
                            <button
                              onClick={() => updateStatus(sub.id, sub.status === 'active' ? 'suspended' : 'active')}
                              className={sub.status === 'active' ? 'text-red-600 hover:text-red-800 text-sm font-semibold' : 'text-green-600 hover:text-green-800 text-sm font-semibold'}
                            >
                              {sub.status === 'active' ? 'Suspend' : 'Activate'}
                            </button>
                          )}
                          
                          <button
                            onClick={() => {
                              setSelectedSubcontractor(sub);
                              setAdminNotes(sub.admin_notes || '');
                              setShowNotesModal(true);
                            }}
                            className="text-gray-600 hover:text-gray-800 text-sm font-semibold"
                          >
                            {sub.admin_notes ? 'Edit Notes' : 'Add Notes'}
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Details Modal */}
        {showDetailsModal && selectedSubcontractor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
            <div className="bg-white rounded-xl shadow-2xl max-w-4xl w-full my-8">
              <div className="p-8">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-3xl font-bold text-gray-900">{selectedSubcontractor.company_name}</h2>
                  <button 
                    onClick={() => setShowDetailsModal(false)}
                    className="text-gray-500 hover:text-gray-700 text-3xl"
                  >
                    ×
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Contact Information</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Contact:</strong> {selectedSubcontractor.contact_name}</p>
                      <p><strong>Email:</strong> {selectedSubcontractor.email}</p>
                      <p><strong>Phone:</strong> {selectedSubcontractor.phone}</p>
                      <p><strong>Address:</strong> {selectedSubcontractor.address || 'N/A'}</p>
                      {selectedSubcontractor.city && (
                        <p><strong>City:</strong> {selectedSubcontractor.city}, {selectedSubcontractor.state} {selectedSubcontractor.zip}</p>
                      )}
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Business Details</h3>
                    <div className="space-y-2 text-gray-700">
                      <p><strong>Business Type:</strong> {selectedSubcontractor.business_type.replace('_', ' ')}</p>
                      <p><strong>Years in Business:</strong> {selectedSubcontractor.years_in_business || 'N/A'}</p>
                      <p><strong>License #:</strong> {selectedSubcontractor.license_number}</p>
                      <p><strong>Insurance:</strong> {selectedSubcontractor.insurance_provider}</p>
                      <p><strong>Insurance Expires:</strong> {selectedSubcontractor.insurance_expiry ? new Date(selectedSubcontractor.insurance_expiry).toLocaleDateString() : 'N/A'}</p>
                      <p><strong>W9 Submitted:</strong> {selectedSubcontractor.w9_submitted ? 'Yes' : 'No'}</p>
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Specialties</h3>
                    <div className="flex flex-wrap gap-2">
                      {selectedSubcontractor.specialties.map((spec, idx) => (
                        <span key={idx} className="bg-blue-100 text-blue-800 px-3 py-1 rounded-lg font-semibold">
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="md:col-span-2">
                    <h3 className="text-lg font-bold mb-3 text-gray-900">Performance</h3>
                    <div className="grid grid-cols-3 gap-4">
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedSubcontractor.rating.toFixed(1)}</div>
                        <div className="text-sm text-gray-600">Average Rating</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">{selectedSubcontractor.total_projects}</div>
                        <div className="text-sm text-gray-600">Total Projects</div>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <div className="text-2xl font-bold text-gray-900">
                          {selectedSubcontractor.created_at ? new Date(selectedSubcontractor.created_at).toLocaleDateString() : 'N/A'}
                        </div>
                        <div className="text-sm text-gray-600">Member Since</div>
                      </div>
                    </div>
                  </div>

                  {selectedSubcontractor.admin_notes && (
                    <div className="md:col-span-2">
                      <h3 className="text-lg font-bold mb-3 text-gray-900">Admin Notes</h3>
                      <div className="bg-yellow-50 p-4 rounded-lg text-gray-700">
                        {selectedSubcontractor.admin_notes}
                      </div>
                    </div>
                  )}
                </div>

                <div className="mt-6 flex justify-end">
                  <button
                    onClick={() => setShowDetailsModal(false)}
                    className="bg-gray-600 text-white px-6 py-2 rounded-lg hover:bg-gray-700 transition"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Notes Modal */}
        {showNotesModal && selectedSubcontractor && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
              <div className="p-8">
                <h2 className="text-2xl font-bold mb-4 text-gray-900">
                  Admin Notes - {selectedSubcontractor.company_name}
                </h2>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  rows={6}
                  className="w-full border border-gray-300 rounded-lg p-3 mb-4"
                  placeholder="Add internal notes about this subcontractor..."
                />
                <div className="flex gap-4">
                  <button
                    onClick={() => setShowNotesModal(false)}
                    className="flex-1 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveNotes}
                    className="flex-1 bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    Save Notes
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
