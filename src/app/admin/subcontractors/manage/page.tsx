'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Subcontractor {
  id: number;
  company_name: string;
  contact_name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zip_code: string;
  specialties: string[];
  years_experience: number;
  insurance_info: string;
  license_number: string;
  status: string;
  admin_notes: string;
  created_at: string;
}

const SPECIALTIES = ['Plumbing', 'Electrical', 'HVAC', 'Carpentry', 'Painting', 'Roofing', 'Flooring', 'Drywall', 'Concrete', 'Landscaping'];
const STATUSES = ['pending', 'approved', 'active', 'suspended', 'rejected'];

export default function SubcontractorsCRUD() {
  const router = useRouter();
  const [subs, setSubs] = useState<Subcontractor[]>([]);
  const [filteredSubs, setFilteredSubs] = useState<Subcontractor[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  const [formData, setFormData] = useState({
    company_name: '',
    contact_name: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: 'SC',
    zip_code: '',
    specialties: [] as string[],
    years_experience: 0,
    insurance_info: '',
    license_number: '',
    status: 'pending',
    admin_notes: ''
  });

  useEffect(() => {
    checkAuth();
    loadSubs();
  }, []);

  useEffect(() => {
    filterSubs();
  }, [subs, statusFilter, searchQuery]);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/me');
    if (!res.ok) router.push('/admin');
  };

  const loadSubs = async () => {
    try {
      const res = await fetch('/api/admin/subcontractors');
      if (res.ok) {
        const data = await res.json();
        setSubs(data.subcontractors || []);
      }
    } catch (err) {
      setError('Failed to load subcontractors');
    } finally {
      setLoading(false);
    }
  };

  const filterSubs = () => {
    let filtered = [...subs];
    if (statusFilter !== 'all') {
      filtered = filtered.filter(s => s.status === statusFilter);
    }
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      filtered = filtered.filter(s =>
        s.company_name.toLowerCase().includes(q) ||
        s.contact_name.toLowerCase().includes(q) ||
        s.email.toLowerCase().includes(q) ||
        s.phone.includes(q)
      );
    }
    setFilteredSubs(filtered);
  };

  const resetForm = () => {
    setFormData({
      company_name: '',
      contact_name: '',
      email: '',
      phone: '',
      address: '',
      city: '',
      state: 'SC',
      zip_code: '',
      specialties: [],
      years_experience: 0,
      insurance_info: '',
      license_number: '',
      status: 'pending',
      admin_notes: ''
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId ? `/api/admin/subcontractors/${editingId}` : '/api/admin/subcontractors';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(editingId ? 'Subcontractor updated!' : 'Subcontractor created!');
        resetForm();
        loadSubs();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save subcontractor');
      }
    } catch (err) {
      setError('Failed to save subcontractor');
    }
  };

  const handleEdit = (sub: Subcontractor) => {
    setFormData({
      company_name: sub.company_name,
      contact_name: sub.contact_name,
      email: sub.email,
      phone: sub.phone,
      address: sub.address,
      city: sub.city,
      state: sub.state,
      zip_code: sub.zip_code,
      specialties: sub.specialties || [],
      years_experience: sub.years_experience || 0,
      insurance_info: sub.insurance_info || '',
      license_number: sub.license_number || '',
      status: sub.status,
      admin_notes: sub.admin_notes || ''
    });
    setEditingId(sub.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number, name: string) => {
    if (!confirm(`Delete ${name}? This cannot be undone.`)) return;

    try {
      const res = await fetch(`/api/admin/subcontractors/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Subcontractor deleted!');
        loadSubs();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete subcontractor');
      }
    } catch (err) {
      setError('Failed to delete subcontractor');
    }
  };

  const toggleSpecialty = (specialty: string) => {
    setFormData(prev => ({
      ...prev,
      specialties: prev.specialties.includes(specialty)
        ? prev.specialties.filter(s => s !== specialty)
        : [...prev.specialties, specialty]
    }));
  };

  const getStatusColor = (status: string) => {
    const colors: any = {
      pending: 'bg-yellow-100 text-yellow-800',
      approved: 'bg-blue-100 text-blue-800',
      active: 'bg-green-100 text-green-800',
      suspended: 'bg-red-100 text-red-800',
      rejected: 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <p className="text-xl">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Subcontractor Management</h1>
              <p className="text-gray-600 mt-2">Add, edit, and manage subcontractors</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                {showForm ? 'Cancel' : '+ Add Subcontractor'}
              </button>
              <a href="/admin/dashboard" className="text-blue-600 hover:underline self-center">
                ← Back to Dashboard
              </a>
            </div>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
              {success}
            </div>
          )}

          {showForm && (
            <form onSubmit={handleSubmit} className="bg-gray-50 p-6 rounded-lg mb-8">
              <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Subcontractor' : 'New Subcontractor'}</h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Company Name *</label>
                  <input
                    type="text"
                    value={formData.company_name}
                    onChange={(e) => setFormData({ ...formData, company_name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Contact Name *</label>
                  <input
                    type="text"
                    value={formData.contact_name}
                    onChange={(e) => setFormData({ ...formData, contact_name: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Email *</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Phone *</label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Address</label>
                <input
                  type="text"
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">City</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">State</label>
                  <input
                    type="text"
                    value={formData.state}
                    onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    maxLength={2}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Zip Code</label>
                  <input
                    type="text"
                    value={formData.zip_code}
                    onChange={(e) => setFormData({ ...formData, zip_code: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Specialties</label>
                <div className="flex flex-wrap gap-2">
                  {SPECIALTIES.map(spec => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => toggleSpecialty(spec)}
                      className={`px-4 py-2 rounded-lg border transition ${
                        formData.specialties.includes(spec)
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:border-blue-600'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Years Experience</label>
                  <input
                    type="number"
                    value={formData.years_experience}
                    onChange={(e) => setFormData({ ...formData, years_experience: parseInt(e.target.value) || 0 })}
                    className="w-full border rounded-lg px-4 py-2"
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">License Number</label>
                  <input
                    type="text"
                    value={formData.license_number}
                    onChange={(e) => setFormData({ ...formData, license_number: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Insurance Info</label>
                <textarea
                  value={formData.insurance_info}
                  onChange={(e) => setFormData({ ...formData, insurance_info: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={2}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    {STATUSES.map(status => (
                      <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Admin Notes</label>
                <textarea
                  value={formData.admin_notes}
                  onChange={(e) => setFormData({ ...formData, admin_notes: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={3}
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  {editingId ? 'Update' : 'Create'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="bg-gray-300 text-gray-700 px-8 py-3 rounded-lg font-bold hover:bg-gray-400 transition"
                >
                  Cancel
                </button>
              </div>
            </form>
          )}

          {/* Filters */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <label className="block text-sm font-medium mb-2">Search</label>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by name, email, or phone..."
                className="w-full border rounded-lg px-4 py-2"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Filter by Status</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-full border rounded-lg px-4 py-2"
              >
                <option value="all">All Statuses</option>
                {STATUSES.map(status => (
                  <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                ))}
              </select>
            </div>
          </div>

          {/* List */}
          <div className="space-y-4">
            {filteredSubs.map((sub) => (
              <div key={sub.id} className="border rounded-lg p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{sub.company_name}</h3>
                      <span className={`px-3 py-1 rounded-full text-sm font-semibold ${getStatusColor(sub.status)}`}>
                        {sub.status.charAt(0).toUpperCase() + sub.status.slice(1)}
                      </span>
                    </div>
                    <p className="text-gray-700 font-medium">{sub.contact_name}</p>
                    <div className="flex gap-4 text-sm text-gray-600 mt-2">
                      <span>📧 {sub.email}</span>
                      <span>📞 {sub.phone}</span>
                      {sub.years_experience > 0 && <span>⏱️ {sub.years_experience} years exp</span>}
                    </div>
                    {sub.specialties && sub.specialties.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-2">
                        {sub.specialties.map(spec => (
                          <span key={spec} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold">
                            {spec}
                          </span>
                        ))}
                      </div>
                    )}
                    {sub.admin_notes && (
                      <div className="mt-2 bg-yellow-50 border border-yellow-200 p-2 rounded text-sm">
                        <strong>Notes:</strong> {sub.admin_notes}
                      </div>
                    )}
                  </div>

                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => handleEdit(sub)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(sub.id, sub.company_name)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}

            {filteredSubs.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl mb-4">No subcontractors found</p>
                {!showForm && (
                  <button
                    onClick={() => setShowForm(true)}
                    className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                  >
                    Add Your First Subcontractor
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
