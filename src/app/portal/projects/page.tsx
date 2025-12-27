'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Icon from '@/components/ui/Icon';

interface Project {
  id: number;
  project_name: string;
  project_type: string;
  description: string;
  start_date: string;
  estimated_completion_date: string;
  actual_completion_date: string | null;
  status: 'scheduled' | 'in_progress' | 'on_hold' | 'completed' | 'cancelled';
  completion_percentage: number;
  address_line1: string;
  city: string;
  state: string;
}

interface Milestone {
  id: number;
  milestone_name: string;
  description: string;
  order_num: number;
  status: 'pending' | 'in_progress' | 'completed' | 'skipped';
  scheduled_date: string | null;
  completed_date: string | null;
}

interface Update {
  id: number;
  update_type: string;
  title: string;
  message: string;
  created_by: string;
  created_at: string;
}

interface Photo {
  id: number;
  photo_url: string;
  caption: string;
  photo_type: string;
  taken_at: string;
}

export default function ProjectsPage() {
  const router = useRouter();
  const [projects, setProjects] = useState<Project[]>([]);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [updates, setUpdates] = useState<Update[]>([]);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingDetails, setLoadingDetails] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await fetch('/api/portal/projects');
      if (res.ok) {
        const data = await res.json();
        setProjects(data.projects || []);
      } else if (res.status === 401) {
        router.push('/portal');
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProjectDetails = async (projectId: number) => {
    setLoadingDetails(true);
    try {
      const [milestonesRes, updatesRes, photosRes] = await Promise.all([
        fetch(`/api/portal/projects/${projectId}/milestones`),
        fetch(`/api/portal/projects/${projectId}/updates`),
        fetch(`/api/portal/projects/${projectId}/photos`)
      ]);

      if (milestonesRes.ok) {
        const data = await milestonesRes.json();
        setMilestones(data.milestones || []);
      }
      if (updatesRes.ok) {
        const data = await updatesRes.json();
        setUpdates(data.updates || []);
      }
      if (photosRes.ok) {
        const data = await photosRes.json();
        setPhotos(data.photos || []);
      }
    } catch (error) {
      console.error('Failed to fetch project details:', error);
    } finally {
      setLoadingDetails(false);
    }
  };

  const selectProject = (project: Project) => {
    setSelectedProject(project);
    fetchProjectDetails(project.id);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your projects...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 py-8 px-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">My Projects</h1>
              <p className="text-gray-600">Track your projects in real-time</p>
            </div>
            <button
              onClick={() => router.push('/portal')}
              className="text-gray-600 hover:text-gray-800 font-semibold flex items-center gap-2"
            >
              <Icon name="ArrowLeft" size={20} />
              Back to Portal
            </button>
          </div>
        </div>

        {projects.length === 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-12 text-center">
            <Icon name="Briefcase" size={64} className="mx-auto text-gray-400 mb-4" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">No Projects Yet</h2>
            <p className="text-gray-600 mb-6">
              You don't have any active projects at the moment. Once work begins, you'll be able to track progress here.
            </p>
            <button
              onClick={() => router.push('/contact')}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
            >
              Request a Quote
            </button>
          </div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            {/* Projects List */}
            <div className="lg:col-span-1 space-y-4">
              {projects.map((project) => (
                <div
                  key={project.id}
                  onClick={() => selectProject(project)}
                  className={`bg-white rounded-xl shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                    selectedProject?.id === project.id ? 'ring-2 ring-blue-600' : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2">
                      {project.project_name}
                    </h3>
                  </div>
                  
                  <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-semibold border mb-3 ${getStatusColor(project.status)}`}>
                    <Icon name={getStatusIcon(project.status)} size={16} />
                    {project.status.replace('_', ' ').toUpperCase()}
                  </div>

                  <div className="space-y-2 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Icon name="Tag" size={16} className="text-gray-400" />
                      {project.project_type}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="MapPin" size={16} className="text-gray-400" />
                      {project.city}, {project.state}
                    </div>
                    <div className="flex items-center gap-2">
                      <Icon name="Calendar" size={16} className="text-gray-400" />
                      Est. Complete: {formatDate(project.estimated_completion_date)}
                    </div>
                  </div>

                  {/* Progress Bar */}
                  <div className="mt-4">
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Progress</span>
                      <span className="font-semibold text-blue-600">{project.completion_percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full transition-all duration-500"
                        style={{ width: `${project.completion_percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Project Details */}
            <div className="lg:col-span-2">
              {!selectedProject ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <Icon name="MousePointer" size={48} className="mx-auto text-gray-400 mb-4" />
                  <p className="text-gray-600">Select a project to view details</p>
                </div>
              ) : loadingDetails ? (
                <div className="bg-white rounded-xl shadow-lg p-12 text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading project details...</p>
                </div>
              ) : (
                <div className="space-y-6">
                  {/* Project Header */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedProject.project_name}</h2>
                    <p className="text-gray-600 mb-4">{selectedProject.description}</p>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Start Date:</span>
                        <p className="font-semibold">{formatDate(selectedProject.start_date)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Est. Completion:</span>
                        <p className="font-semibold">{formatDate(selectedProject.estimated_completion_date)}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Location:</span>
                        <p className="font-semibold">{selectedProject.address_line1}, {selectedProject.city}, {selectedProject.state}</p>
                      </div>
                      <div>
                        <span className="text-gray-500">Type:</span>
                        <p className="font-semibold">{selectedProject.project_type}</p>
                      </div>
                    </div>
                  </div>

                  {/* Milestones */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="List" size={24} />
                      Project Milestones
                    </h3>
                    {milestones.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No milestones defined yet</p>
                    ) : (
                      <div className="space-y-3">
                        {milestones.map((milestone, index) => (
                          <div key={milestone.id} className="flex items-start gap-4 p-4 rounded-lg border border-gray-200">
                            <div className="flex-shrink-0 mt-1">
                              {milestone.status === 'completed' ? (
                                <Icon name="CheckCircle" size={24} className="text-green-600" />
                              ) : milestone.status === 'in_progress' ? (
                                <Icon name="Clock" size={24} className="text-blue-600" />
                              ) : (
                                <div className="w-6 h-6 rounded-full border-2 border-gray-300"></div>
                              )}
                            </div>
                            <div className="flex-1">
                              <h4 className="font-semibold text-gray-900">{milestone.milestone_name}</h4>
                              {milestone.description && (
                                <p className="text-sm text-gray-600 mt-1">{milestone.description}</p>
                              )}
                              <div className="flex gap-4 mt-2 text-xs text-gray-500">
                                {milestone.scheduled_date && (
                                  <span>Scheduled: {formatDate(milestone.scheduled_date)}</span>
                                )}
                                {milestone.completed_date && (
                                  <span className="text-green-600">Completed: {formatDate(milestone.completed_date)}</span>
                                )}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Recent Updates */}
                  <div className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                      <Icon name="MessageSquare" size={24} />
                      Recent Updates
                    </h3>
                    {updates.length === 0 ? (
                      <p className="text-gray-500 text-center py-4">No updates yet</p>
                    ) : (
                      <div className="space-y-4">
                        {updates.slice(0, 5).map((update) => (
                          <div key={update.id} className="border-l-4 border-blue-600 pl-4 py-2">
                            <div className="flex items-start justify-between mb-1">
                              <h4 className="font-semibold text-gray-900">{update.title}</h4>
                              <span className="text-xs text-gray-500">{formatDate(update.created_at)}</span>
                            </div>
                            {update.message && (
                              <p className="text-sm text-gray-600">{update.message}</p>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Posted by {update.created_by}</p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Photos */}
                  {photos.length > 0 && (
                    <div className="bg-white rounded-xl shadow-lg p-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4 flex items-center gap-2">
                        <Icon name="Camera" size={24} />
                        Project Photos
                      </h3>
                      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {photos.map((photo) => (
                          <div key={photo.id} className="relative group cursor-pointer rounded-lg overflow-hidden shadow-md hover:shadow-xl transition">
                            <img
                              src={photo.photo_url}
                              alt={photo.caption}
                              className="w-full h-48 object-cover"
                            />
                            <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-60 transition flex items-end p-3">
                              <p className="text-white text-sm opacity-0 group-hover:opacity-100 transition">
                                {photo.caption}
                              </p>
                            </div>
                            <div className="absolute top-2 right-2">
                              <span className="bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
                                {photo.photo_type}
                              </span>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
