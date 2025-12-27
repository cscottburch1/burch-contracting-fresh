'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface Project {
  id: number;
  title: string;
  category: 'handyman' | 'remodeling' | 'additions';
  description: string;
  short_description: string;
  image_url: string;
  before_image?: string;
  after_image?: string;
  completion_date?: string;
  project_duration?: string;
  location?: string;
  budget_range?: string;
  featured: boolean;
  display_order: number;
  is_active: boolean;
  created_at: string;
  creator_name?: string;
}

export default function ProjectsManagement() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [categoryFilter, setCategoryFilter] = useState<string>('all');
  const [message, setMessage] = useState('');
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  const [form, setForm] = useState({
    title: '',
    category: 'handyman' as 'handyman' | 'remodeling' | 'additions',
    description: '',
    short_description: '',
    image_url: '',
    before_image: '',
    after_image: '',
    completion_date: '',
    project_duration: '',
    location: '',
    budget_range: '',
    featured: false,
    display_order: 0,
    is_active: true
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadProjects();
    }
  }, [currentUser]);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      router.push('/admin');
      return;
    }
    const data = await res.json();
    setCurrentUser(data.user);
    setAuthLoading(false);
  };

  const loadProjects = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/admin/recent-projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data);
      }
    } catch (error) {
      console.error('Error loading projects:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/admin/recent-projects/${editingId}`
        : '/api/admin/recent-projects';
      
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });

      if (res.ok) {
        setMessage(editingId ? 'Project updated!' : 'Project created!');
        resetForm();
        loadProjects();
      } else {
        const error = await res.json();
        setMessage(error.error || 'Failed to save project');
      }
    } catch (error) {
      setMessage('Error saving project');
    }
  };

  const handleEdit = (project: Project) => {
    setForm({
      title: project.title,
      category: project.category,
      description: project.description || '',
      short_description: project.short_description || '',
      image_url: project.image_url || '',
      before_image: project.before_image || '',
      after_image: project.after_image || '',
      completion_date: project.completion_date || '',
      project_duration: project.project_duration || '',
      location: project.location || '',
      budget_range: project.budget_range || '',
      featured: project.featured,
      display_order: project.display_order,
      is_active: project.is_active
    });
    setEditingId(project.id);
    setShowForm(true);
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this project?')) return;

    try {
      const res = await fetch(`/api/admin/recent-projects/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMessage('Project deleted');
        loadProjects();
      }
    } catch (error) {
      setMessage('Error deleting project');
    }
  };

  const resetForm = () => {
    setForm({
      title: '',
      category: 'handyman',
      description: '',
      short_description: '',
      image_url: '',
      before_image: '',
      after_image: '',
      completion_date: '',
      project_duration: '',
      location: '',
      budget_range: '',
      featured: false,
      display_order: 0,
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const filteredProjects = projects.filter(project => 
    categoryFilter === 'all' || project.category === categoryFilter
  );

  const getCategoryColor = (category: string) => {
    switch(category) {
      case 'handyman': return 'bg-blue-100 text-blue-800';
      case 'remodeling': return 'bg-green-100 text-green-800';
      case 'additions': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Recent Projects Showcase</h1>
            <p className="text-gray-600 mt-2">Manage portfolio projects displayed on homepage</p>
          </div>
          <button
            onClick={() => router.push('/admin/tools')}
            className="px-4 py-2 text-gray-600 hover:text-gray-900"
          >
            ← Back to Tools
          </button>
        </div>

        {message && (
          <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-800">
            {message}
          </div>
        )}

        {/* Category Filter */}
        <div className="mb-6 flex gap-3">
          <button
            onClick={() => setCategoryFilter('all')}
            className={`px-4 py-2 rounded-lg font-medium ${
              categoryFilter === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            All Projects ({projects.length})
          </button>
          <button
            onClick={() => setCategoryFilter('handyman')}
            className={`px-4 py-2 rounded-lg font-medium ${
              categoryFilter === 'handyman'
                ? 'bg-blue-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🔧 Handyman ({projects.filter(p => p.category === 'handyman').length})
          </button>
          <button
            onClick={() => setCategoryFilter('remodeling')}
            className={`px-4 py-2 rounded-lg font-medium ${
              categoryFilter === 'remodeling'
                ? 'bg-green-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            🏗️ Remodeling ({projects.filter(p => p.category === 'remodeling').length})
          </button>
          <button
            onClick={() => setCategoryFilter('additions')}
            className={`px-4 py-2 rounded-lg font-medium ${
              categoryFilter === 'additions'
                ? 'bg-purple-600 text-white'
                : 'bg-white text-gray-700 hover:bg-gray-100'
            }`}
          >
            ➕ Additions ({projects.filter(p => p.category === 'additions').length})
          </button>
        </div>

        {/* Form */}
        {showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Project' : 'Create New Project'}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Project Title *</label>
                  <input
                    type="text"
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Category *</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value as any })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  >
                    <option value="handyman">🔧 Handyman Services</option>
                    <option value="remodeling">🏗️ Remodeling</option>
                    <option value="additions">➕ Additions</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Short Description</label>
                <input
                  type="text"
                  value={form.short_description}
                  onChange={(e) => setForm({ ...form, short_description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  placeholder="Brief one-line description for cards"
                  maxLength={500}
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Full Description</label>
                <textarea
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={4}
                  placeholder="Detailed project description"
                />
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Main Image URL</label>
                  <input
                    type="url"
                    value={form.image_url}
                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="https://images.unsplash.com/..."
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Before Image URL</label>
                  <input
                    type="url"
                    value={form.before_image}
                    onChange={(e) => setForm({ ...form, before_image: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Optional before photo"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">After Image URL</label>
                  <input
                    type="url"
                    value={form.after_image}
                    onChange={(e) => setForm({ ...form, after_image: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="Optional after photo"
                  />
                </div>
              </div>

              <div className="grid grid-cols-4 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Completion Date</label>
                  <input
                    type="date"
                    value={form.completion_date}
                    onChange={(e) => setForm({ ...form, completion_date: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Duration</label>
                  <input
                    type="text"
                    value={form.project_duration}
                    onChange={(e) => setForm({ ...form, project_duration: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g., 2 weeks"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Location</label>
                  <input
                    type="text"
                    value={form.location}
                    onChange={(e) => setForm({ ...form, location: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g., Greenville, SC"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Budget Range</label>
                  <input
                    type="text"
                    value={form.budget_range}
                    onChange={(e) => setForm({ ...form, budget_range: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    placeholder="e.g., $10k-$15k"
                  />
                </div>
              </div>

              <div className="flex items-center gap-6">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="featured"
                    checked={form.featured}
                    onChange={(e) => setForm({ ...form, featured: e.target.checked })}
                  />
                  <label htmlFor="featured" className="text-sm font-medium">Featured Project</label>
                </div>
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="active"
                    checked={form.is_active}
                    onChange={(e) => setForm({ ...form, is_active: e.target.checked })}
                  />
                  <label htmlFor="active" className="text-sm font-medium">Active</label>
                </div>
                <div className="flex items-center gap-2">
                  <label htmlFor="order" className="text-sm font-medium">Display Order:</label>
                  <input
                    type="number"
                    id="order"
                    value={form.display_order}
                    onChange={(e) => setForm({ ...form, display_order: parseInt(e.target.value) })}
                    className="w-20 px-3 py-1 border rounded"
                    min="0"
                  />
                </div>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update Project' : 'Create Project'}
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* Create Button */}
        {!showForm && (
          <button
            onClick={() => setShowForm(true)}
            className="mb-6 px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            + Create New Project
          </button>
        )}

        {/* Projects List */}
        <div className="space-y-4">
          {isLoading ? (
            <p className="text-center py-8">Loading projects...</p>
          ) : filteredProjects.length === 0 ? (
            <p className="text-center py-8 text-gray-500">No projects found</p>
          ) : (
            filteredProjects.map((project) => (
              <div key={project.id} className="bg-white rounded-lg shadow-md p-6">
                <div className="flex gap-6">
                  {/* Image Preview */}
                  {project.image_url && (
                    <div className="w-48 h-32 flex-shrink-0">
                      <img
                        src={project.image_url}
                        alt={project.title}
                        className="w-full h-full object-cover rounded-lg"
                      />
                    </div>
                  )}
                  
                  {/* Content */}
                  <div className="flex-1">
                    <div className="flex justify-between items-start mb-2">
                      <div>
                        <h3 className="text-xl font-bold">{project.title}</h3>
                        <div className="flex gap-2 mt-2">
                          <span className={`px-3 py-1 rounded-full text-sm ${getCategoryColor(project.category)}`}>
                            {project.category === 'handyman' && '🔧 Handyman'}
                            {project.category === 'remodeling' && '🏗️ Remodeling'}
                            {project.category === 'additions' && '➕ Additions'}
                          </span>
                          {project.featured && (
                            <span className="px-3 py-1 rounded-full text-sm bg-yellow-100 text-yellow-800">
                              ⭐ Featured
                            </span>
                          )}
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            project.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                          }`}>
                            {project.is_active ? 'Active' : 'Inactive'}
                          </span>
                          <span className="px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
                            Order: {project.display_order}
                          </span>
                        </div>
                      </div>
                    </div>
                    
                    {project.short_description && (
                      <p className="text-gray-700 mb-2">{project.short_description}</p>
                    )}
                    
                    <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mt-3">
                      {project.completion_date && (
                        <div><strong>Completed:</strong> {new Date(project.completion_date).toLocaleDateString()}</div>
                      )}
                      {project.project_duration && (
                        <div><strong>Duration:</strong> {project.project_duration}</div>
                      )}
                      {project.location && (
                        <div><strong>Location:</strong> {project.location}</div>
                      )}
                      {project.budget_range && (
                        <div><strong>Budget:</strong> {project.budget_range}</div>
                      )}
                    </div>
                    
                    <div className="flex gap-2 mt-4">
                      <button
                        onClick={() => handleEdit(project)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(project.id)}
                        className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
