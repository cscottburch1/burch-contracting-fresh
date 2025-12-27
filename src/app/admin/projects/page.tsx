'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Icon from '@/components/ui/Icon';

interface Project {
  id: number;
  customer_id: number;
  customer_name: string;
  customer_email: string;
  project_name: string;
  project_type: string;
  status: 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  completion_percentage: number;
  start_date: string;
  estimated_completion_date: string;
  city: string;
  state: string;
}

export default function AdminProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/admin/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else if (res.status === 401) {
        router.push('/admin');
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800 border-green-300';
      case 'in_progress': return 'bg-blue-100 text-blue-800 border-blue-300';
      case 'scheduled': return 'bg-gray-100 text-gray-800 border-gray-300';
      case 'on_hold': return 'bg-yellow-100 text-yellow-800 border-yellow-300';
      case 'cancelled': return 'bg-red-100 text-red-800 border-red-300';
      default: return 'bg-gray-100 text-gray-800 border-gray-300';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return 'CheckCircle';
      case 'in_progress': return 'Clock';
      case 'scheduled': return 'Calendar';
      case 'on_hold': return 'Pause';
      case 'cancelled': return 'XCircle';
      default: return 'Circle';
    }
  };

  const formatDate = (dateString: string | null) => {
    if (!dateString) return 'TBD';
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const filteredProjects = projects
    .filter(p => filter === 'all' || p.status === filter)
    .filter(p => 
      searchTerm === '' ||
      p.project_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.city.toLowerCase().includes(searchTerm.toLowerCase())
    );

  const stats = {
    total: projects.length,
    scheduled: projects.filter(p => p.status === 'scheduled').length,
    in_progress: projects.filter(p => p.status === 'in_progress').length,
    on_hold: projects.filter(p => p.status === 'on_hold').length,
    completed: projects.filter(p => p.status === 'completed').length,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Project Management</h1>
              <p className="text-gray-600">Manage and track all customer projects</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => router.push('/admin/projects/new')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition flex items-center gap-2"
              >
                <Icon name="Plus" size={20} />
                New Project
              </button>
              <button
                onClick={() => router.push('/admin/dashboard')}
                className="text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-2 px-4"
              >
                <Icon name="ArrowLeft" size={20} />
                Dashboard
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
              <p className="text-sm text-gray-600">Total</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-gray-700">{stats.scheduled}</p>
              <p className="text-sm text-gray-600">Scheduled</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-blue-600">{stats.in_progress}</p>
              <p className="text-sm text-blue-600">In Progress</p>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-yellow-600">{stats.on_hold}</p>
              <p className="text-sm text-yellow-600">On Hold</p>
            </div>
            <div className="bg-green-50 p-4 rounded-lg text-center">
              <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
              <p className="text-sm text-green-600">Completed</p>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Icon name="Search" size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search projects, customers, or locations..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-600 focus:border-transparent"
                />
              </div>
            </div>
            <div className="flex gap-2 flex-wrap">
              {['all', 'scheduled', 'in_progress', 'on_hold', 'completed', 'cancelled'].map((status) => (
                <button
                  key={status}
                  onClick={() => setFilter(status)}
                  className={`px-4 py-2 rounded-lg font-medium transition ${
                    filter === status
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  {status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Projects List */}
        {filteredProjects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Icon name="Briefcase" size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              {projects.length === 0 ? 'No Projects Yet' : 'No Matches Found'}
            </h2>
            <p className="text-gray-600 mb-6">
              {projects.length === 0 
                ? 'Create your first project to get started.' 
                : 'Try adjusting your search or filter criteria.'
              }
            </p>
            {projects.length === 0 && (
              <button
                onClick={() => router.push('/admin/projects/new')}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
              >
                Create First Project
              </button>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredProjects.map((project) => (
              <div
                key={project.id}
                className="bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition cursor-pointer"
                onClick={() => router.push(`/admin/projects/${project.id}`)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <h3 className="text-xl font-bold text-gray-900">{project.project_name}</h3>
                      <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border ${getStatusColor(project.status)}`}>
                        <Icon name={getStatusIcon(project.status)} size={16} />
                        {project.status.replace('_', ' ').toUpperCase()}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-4 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Icon name="User" size={16} className="text-gray-400" />
                        {project.customer_name}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Mail" size={16} className="text-gray-400" />
                        {project.customer_email}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="Tag" size={16} className="text-gray-400" />
                        {project.project_type}
                      </div>
                      <div className="flex items-center gap-2">
                        <Icon name="MapPin" size={16} className="text-gray-400" />
                        {project.city}, {project.state}
                      </div>
                    </div>
                  </div>
                  <button className="text-blue-600 hover:text-blue-700 font-semibold flex items-center gap-2">
                    Manage
                    <Icon name="ArrowRight" size={20} />
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="text-sm">
                    <span className="text-gray-500">Start Date:</span>
                    <p className="font-semibold text-gray-900">{formatDate(project.start_date)}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Est. Completion:</span>
                    <p className="font-semibold text-gray-900">{formatDate(project.estimated_completion_date)}</p>
                  </div>
                  <div className="text-sm">
                    <span className="text-gray-500">Progress:</span>
                    <p className="font-semibold text-blue-600">{project.completion_percentage}%</p>
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${project.completion_percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
