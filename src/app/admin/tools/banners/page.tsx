'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';

interface Banner {
  id: number;
  title: string;
  message: string;
  button_text: string | null;
  button_link: string | null;
  bg_color: string;
  text_color: string;
  icon: string | null;
  is_active: boolean;
  display_order: number;
  start_date: string | null;
  end_date: string | null;
}

export default function BannersManagement() {
  const router = useRouter();
  const [banners, setBanners] = useState<Banner[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [formData, setFormData] = useState({
    title: '',
    message: '',
    button_text: '',
    button_link: '',
    bg_color: 'from-blue-600 to-blue-800',
    text_color: 'white',
    icon: 'Info',
    is_active: false,
    display_order: 0,
    start_date: '',
    end_date: '',
  });

  const bgColorOptions = [
    { label: 'Red/Orange (Emergency)', value: 'from-orange-600 via-red-600 to-orange-600' },
    { label: 'Blue', value: 'from-blue-600 to-blue-800' },
    { label: 'Green', value: 'from-green-600 to-green-800' },
    { label: 'Purple', value: 'from-purple-600 to-purple-800' },
    { label: 'Yellow/Orange (Warning)', value: 'from-yellow-500 to-orange-600' },
    { label: 'Teal', value: 'from-teal-600 to-cyan-800' },
    { label: 'Gray', value: 'from-gray-600 to-gray-800' },
  ];

  const iconOptions = ['AlertCircle', 'Info', 'Bell', 'Star', 'Gift', 'Zap', 'TrendingUp', 'Calendar'];

  useEffect(() => {
    checkAuth();
    loadBanners();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      router.push('/admin');
    }
  };

  const loadBanners = async () => {
    try {
      const res = await fetch('/api/admin/banners');
      if (res.ok) {
        const data = await res.json();
        setBanners(data.banners);
      }
    } catch (err) {
      setError('Failed to load banners');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      title: '',
      message: '',
      button_text: '',
      button_link: '',
      bg_color: 'from-blue-600 to-blue-800',
      text_color: 'white',
      icon: 'Info',
      is_active: false,
      display_order: 0,
      start_date: '',
      end_date: '',
    });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    try {
      const url = editingId ? `/api/admin/banners/${editingId}` : '/api/admin/banners';
      const method = editingId ? 'PATCH' : 'POST';

      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      if (res.ok) {
        setSuccess(editingId ? 'Banner updated!' : 'Banner created!');
        resetForm();
        loadBanners();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to save banner');
      }
    } catch (err) {
      setError('Failed to save banner');
    }
  };

  const handleEdit = (banner: Banner) => {
    setFormData({
      title: banner.title,
      message: banner.message,
      button_text: banner.button_text || '',
      button_link: banner.button_link || '',
      bg_color: banner.bg_color,
      text_color: banner.text_color,
      icon: banner.icon || 'Info',
      is_active: banner.is_active,
      display_order: banner.display_order,
      start_date: banner.start_date ? banner.start_date.slice(0, 16) : '',
      end_date: banner.end_date ? banner.end_date.slice(0, 16) : '',
    });
    setEditingId(banner.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this banner?')) return;

    try {
      const res = await fetch(`/api/admin/banners/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setSuccess('Banner deleted!');
        loadBanners();
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to delete banner');
      }
    } catch (err) {
      setError('Failed to delete banner');
    }
  };

  const toggleActive = async (banner: Banner) => {
    try {
      const res = await fetch(`/api/admin/banners/${banner.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !banner.is_active }),
      });

      if (res.ok) {
        loadBanners();
      }
    } catch (err) {
      setError('Failed to toggle banner');
    }
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
              <h1 className="text-4xl font-bold">Website Banners</h1>
              <p className="text-gray-600 mt-2">Manage promotional and notification banners</p>
            </div>
            <div className="flex gap-4">
              <button
                onClick={() => setShowForm(!showForm)}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
              >
                {showForm ? 'Cancel' : '+ Add Banner'}
              </button>
              <a href="/admin/tools" className="text-blue-600 hover:underline self-center">
                ← Back to Tools
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
              <h2 className="text-2xl font-bold mb-4">{editingId ? 'Edit Banner' : 'New Banner'}</h2>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Title *</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Background Color</label>
                  <select
                    value={formData.bg_color}
                    onChange={(e) => setFormData({ ...formData, bg_color: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    {bgColorOptions.map(opt => (
                      <option key={opt.value} value={opt.value}>{opt.label}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="mb-4">
                <label className="block text-sm font-medium mb-2">Message *</label>
                <textarea
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full border rounded-lg px-4 py-2"
                  rows={2}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Button Text</label>
                  <input
                    type="text"
                    value={formData.button_text}
                    onChange={(e) => setFormData({ ...formData, button_text: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Button Link</label>
                  <input
                    type="text"
                    value={formData.button_link}
                    onChange={(e) => setFormData({ ...formData, button_link: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                    placeholder="/contact"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Icon</label>
                  <select
                    value={formData.icon}
                    onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  >
                    {iconOptions.map(icon => (
                      <option key={icon} value={icon}>{icon}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Display Order</label>
                  <input
                    type="number"
                    value={formData.display_order}
                    onChange={(e) => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div className="flex items-end">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.is_active}
                      onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                      className="w-5 h-5"
                    />
                    <span className="font-medium">Active</span>
                  </label>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Start Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.start_date}
                    onChange={(e) => setFormData({ ...formData, start_date: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">End Date (Optional)</label>
                  <input
                    type="datetime-local"
                    value={formData.end_date}
                    onChange={(e) => setFormData({ ...formData, end_date: e.target.value })}
                    className="w-full border rounded-lg px-4 py-2"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  {editingId ? 'Update Banner' : 'Create Banner'}
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

          <div className="space-y-4">
            {banners.map((banner) => (
              <div key={banner.id} className="border rounded-lg p-6 hover:shadow-md transition">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold">{banner.title}</h3>
                      {banner.is_active ? (
                        <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
                          Active
                        </span>
                      ) : (
                        <span className="bg-gray-100 text-gray-600 px-3 py-1 rounded-full text-sm font-semibold">
                          Inactive
                        </span>
                      )}
                      <span className="text-sm text-gray-500">Order: {banner.display_order}</span>
                    </div>
                    <p className="text-gray-600 mb-2">{banner.message}</p>
                    {banner.button_text && (
                      <p className="text-sm text-blue-600">Button: {banner.button_text} → {banner.button_link}</p>
                    )}
                    {(banner.start_date || banner.end_date) && (
                      <p className="text-xs text-gray-500 mt-2">
                        {banner.start_date && `From: ${new Date(banner.start_date).toLocaleString()}`}
                        {banner.start_date && banner.end_date && ' | '}
                        {banner.end_date && `To: ${new Date(banner.end_date).toLocaleString()}`}
                      </p>
                    )}
                  </div>
                  
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => toggleActive(banner)}
                      className={`px-4 py-2 rounded-lg font-semibold transition ${
                        banner.is_active
                          ? 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                          : 'bg-green-600 text-white hover:bg-green-700'
                      }`}
                    >
                      {banner.is_active ? 'Deactivate' : 'Activate'}
                    </button>
                    <button
                      onClick={() => handleEdit(banner)}
                      className="bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-blue-700 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(banner.id)}
                      className="bg-red-600 text-white px-4 py-2 rounded-lg font-semibold hover:bg-red-700 transition"
                    >
                      Delete
                    </button>
                  </div>
                </div>

                {/* Preview */}
                <div className="mt-4">
                  <p className="text-sm font-semibold text-gray-600 mb-2">Preview:</p>
                  <div className={`bg-gradient-to-r ${banner.bg_color} text-${banner.text_color} p-4 rounded-lg`}>
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        {banner.icon && (
                          <div className="bg-white/20 rounded-full p-2">
                            <Icon name={banner.icon as any} size={20} />
                          </div>
                        )}
                        <div>
                          <p className="font-bold">{banner.title}</p>
                          <p className="text-sm opacity-90">{banner.message}</p>
                        </div>
                      </div>
                      {banner.button_text && (
                        <div className="bg-white text-gray-800 px-4 py-2 rounded-lg font-semibold text-sm">
                          {banner.button_text}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            ))}

            {banners.length === 0 && !showForm && (
              <div className="text-center py-12 text-gray-500">
                <p className="text-xl mb-4">No banners yet</p>
                <button
                  onClick={() => setShowForm(true)}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  Create Your First Banner
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
