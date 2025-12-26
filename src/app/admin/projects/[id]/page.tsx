'use client';

import React, { useState, useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Section } from '@/components/ui/Section';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';

interface Project {
  id: number;
  customer_id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
}

interface ProjectUpdate {
  id: number;
  title: string;
  content: string;
  created_by: string;
  created_at: string;
}

interface Document {
  id: number;
  name: string;
  url: string;
  file_type: string;
  file_size: number;
  uploaded_by: string;
  created_at: string;
}

export default function ProjectManagementPage() {
  const router = useRouter();
  const params = useParams();
  const projectId = params.id as string;

  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [authenticated, setAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'updates' | 'documents'>('overview');
  
  // Forms
  const [showUpdateForm, setShowUpdateForm] = useState(false);
  const [showDocumentForm, setShowDocumentForm] = useState(false);
  const [updateForm, setUpdateForm] = useState({ title: '', content: '' });
  const [documentForm, setDocumentForm] = useState({ name: '', url: '', file_type: '', file_size: '' });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploading, setUploading] = useState(false);
  
  // Edit mode
  const [editMode, setEditMode] = useState(false);
  const [projectForm, setProjectForm] = useState({
    title: '',
    description: '',
    budget: '',
    start_date: '',
    end_date: '',
    status: 'pending'
  });

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (authenticated && projectId) {
      fetchProjectDetails();
    }
  }, [authenticated, projectId]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/me');
      if (response.ok) {
        setAuthenticated(true);
      } else {
        router.push('/admin');
      }
    } catch (error) {
      router.push('/admin');
    }
  };

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`);
      if (!response.ok) throw new Error('Failed to fetch project');
      
      const data = await response.json();
      setProject(data.project);
      setUpdates(data.updates || []);
      setDocuments(data.documents || []);
      
      // Initialize edit form
      setProjectForm({
        title: data.project.title,
        description: data.project.description,
        budget: data.project.budget?.toString() || '',
        start_date: data.project.start_date?.split('T')[0] || '',
        end_date: data.project.end_date?.split('T')[0] || '',
        status: data.project.status
      });
    } catch (error) {
      console.error('Error fetching project:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProject = async () => {
    try {
      const response = await fetch(`/api/admin/projects/${projectId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...projectForm,
          budget: projectForm.budget ? parseFloat(projectForm.budget) : null
        })
      });

      if (!response.ok) throw new Error('Failed to update project');

      setEditMode(false);
      fetchProjectDetails();
    } catch (error) {
      console.error('Error updating project:', error);
      alert('Failed to update project');
    }
  };

  const handleAddUpdate = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await fetch(`/api/admin/projects/${projectId}/updates`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updateForm)
      });

      if (!response.ok) throw new Error('Failed to add update');

      setShowUpdateForm(false);
      setUpdateForm({ title: '', content: '' });
      fetchProjectDetails();
    } catch (error) {
      console.error('Error adding update:', error);
      alert('Failed to add update');
    }
  };

  const handleAddDocument = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedFile) {
      alert('Please select a file to upload');
      return;
    }

    try {
      setUploading(true);

      // Upload file first
      const uploadFormData = new FormData();
      uploadFormData.append('file', selectedFile);

      const uploadResponse = await fetch('/api/admin/upload', {
        method: 'POST',
        body: uploadFormData
      });

      if (!uploadResponse.ok) {
        const error = await uploadResponse.json();
        throw new Error(error.error || 'Failed to upload file');
      }

      const uploadData = await uploadResponse.json();

      // Add document to project
      const response = await fetch(`/api/admin/projects/${projectId}/documents`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: documentForm.name || uploadData.filename,
          url: uploadData.url,
          file_type: uploadData.type,
          file_size: uploadData.size
        })
      });

      if (!response.ok) throw new Error('Failed to add document');

      setShowDocumentForm(false);
      setDocumentForm({ name: '', url: '', file_type: '', file_size: '' });
      setSelectedFile(null);
      fetchProjectDetails();
    } catch (error: any) {
      console.error('Error adding document:', error);
      alert(error.message || 'Failed to add document');
    } finally {
      setUploading(false);
    }
  };

  const getStatusColor = (status: string) => {
    const colors: Record<string, 'blue' | 'green' | 'gray' | 'orange'> = {
      pending: 'orange',
      active: 'green',
      completed: 'blue',
      cancelled: 'gray',
    };
    return colors[status] || 'gray';
  };

  const formatDate = (date?: string) => {
    if (!date) return 'N/A';
    return new Date(date).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const formatCurrency = (amount?: number) => {
    if (!amount) return 'N/A';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (!authenticated || loading || !project) {
    return (
      <Section padding="lg">
        <div className="text-center py-12">
          <div className="animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </Section>
    );
  }

  return (
    <Section padding="lg" background="white">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <Button variant="outline" href={`/admin/customers/${project.customer_id}`} className="mb-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Customer
            </Button>
            <h1 className="text-3xl font-bold text-gray-900">{project.title}</h1>
            <div className="flex items-center gap-3 mt-2">
              <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
              <span className="text-gray-600">Budget: {formatCurrency(project.budget)}</span>
            </div>
          </div>
          <div className="flex gap-3">
            {!editMode ? (
              <Button variant="outline" onClick={() => setEditMode(true)}>
                <Icon name="Edit" size={16} className="mr-2" />
                Edit Project
              </Button>
            ) : (
              <>
                <Button variant="outline" onClick={() => {
                  setEditMode(false);
                  setProjectForm({
                    title: project.title,
                    description: project.description,
                    budget: project.budget?.toString() || '',
                    start_date: project.start_date?.split('T')[0] || '',
                    end_date: project.end_date?.split('T')[0] || '',
                    status: project.status
                  });
                }}>
                  Cancel
                </Button>
                <Button variant="primary" onClick={handleUpdateProject}>
                  Save Changes
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex gap-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 font-medium transition-colors ${
                activeTab === 'overview'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`pb-4 font-medium transition-colors ${
                activeTab === 'updates'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Updates ({updates.length})
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-4 font-medium transition-colors ${
                activeTab === 'documents'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Documents ({documents.length})
            </button>
          </div>
        </div>

        {/* Overview Tab */}
        {activeTab === 'overview' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Project Details</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={projectForm.title}
                        onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-900">{project.title}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    {editMode ? (
                      <textarea
                        value={projectForm.description}
                        onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                        rows={4}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                      />
                    ) : (
                      <p className="text-gray-900 whitespace-pre-wrap">{project.description}</p>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                      {editMode ? (
                        <input
                          type="number"
                          value={projectForm.budget}
                          onChange={(e) => setProjectForm({ ...projectForm, budget: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      ) : (
                        <p className="text-gray-900">{formatCurrency(project.budget)}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Status</label>
                      {editMode ? (
                        <select
                          value={projectForm.status}
                          onChange={(e) => setProjectForm({ ...projectForm, status: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        >
                          <option value="pending">Pending</option>
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      ) : (
                        <Badge variant={getStatusColor(project.status)}>{project.status}</Badge>
                      )}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                      {editMode ? (
                        <input
                          type="date"
                          value={projectForm.start_date}
                          onChange={(e) => setProjectForm({ ...projectForm, start_date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      ) : (
                        <p className="text-gray-900">{formatDate(project.start_date)}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                      {editMode ? (
                        <input
                          type="date"
                          value={projectForm.end_date}
                          onChange={(e) => setProjectForm({ ...projectForm, end_date: e.target.value })}
                          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
                        />
                      ) : (
                        <p className="text-gray-900">{formatDate(project.end_date)}</p>
                      )}
                    </div>
                  </div>
                </div>
              </Card>
            </div>

            <div>
              <Card>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
                <div className="space-y-3">
                  <Button variant="outline" onClick={() => setActiveTab('updates')} className="w-full justify-start">
                    <Icon name="FileText" size={16} className="mr-2" />
                    View Updates ({updates.length})
                  </Button>
                  <Button variant="outline" onClick={() => setActiveTab('documents')} className="w-full justify-start">
                    <Icon name="Paperclip" size={16} className="mr-2" />
                    View Documents ({documents.length})
                  </Button>
                </div>
              </Card>
            </div>
          </div>
        )}

        {/* Updates Tab */}
        {activeTab === 'updates' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Project Updates</h3>
              <Button variant="primary" onClick={() => setShowUpdateForm(true)}>
                <Icon name="Plus" size={16} className="mr-2" />
                Add Update
              </Button>
            </div>

            {updates.length === 0 ? (
              <Card>
                <div className="text-center py-12">
                  <Icon name="FileText" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No updates yet</p>
                  <Button variant="outline" size="sm" onClick={() => setShowUpdateForm(true)} className="mt-4">
                    Add First Update
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="space-y-4">
                {updates.map((update) => (
                  <Card key={update.id}>
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-semibold text-gray-900">{update.title}</h4>
                      <span className="text-sm text-gray-500">{formatDate(update.created_at)}</span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap mb-3">{update.content}</p>
                    <p className="text-sm text-gray-500">Posted by: {update.created_by}</p>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Documents Tab */}
        {activeTab === 'documents' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900">Project Documents</h3>
              <Button variant="primary" onClick={() => setShowDocumentForm(true)}>
                <Icon name="Upload" size={16} className="mr-2" />
                Add Document
              </Button>
            </div>

            {documents.length === 0 ? (
              <Card className="mt-4">
                <div className="text-center py-12">
                  <Icon name="Paperclip" size={48} className="mx-auto text-gray-300 mb-3" />
                  <p className="text-gray-500">No documents yet</p>
                  <Button variant="outline" size="sm" onClick={() => setShowDocumentForm(true)} className="mt-4">
                    Add First Document
                  </Button>
                </div>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                {documents.map((doc) => (
                  <Card key={doc.id}>
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-100 rounded-lg">
                        <Icon name="FileText" size={24} className="text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-semibold text-gray-900 mb-1">{doc.name}</h4>
                        <p className="text-sm text-gray-600 mb-2">
                          {doc.file_type} • {formatFileSize(doc.file_size)}
                        </p>
                        <p className="text-xs text-gray-500 mb-3">
                          Uploaded by {doc.uploaded_by} on {formatDate(doc.created_at)}
                        </p>
                        <a
                          href={doc.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-sm text-blue-600 hover:text-blue-700 font-medium"
                        >
                          View/Download →
                        </a>
                      </div>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Add Update Modal */}
      {showUpdateForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Project Update</h2>
                <button onClick={() => setShowUpdateForm(false)} className="text-gray-400 hover:text-gray-600">
                  <Icon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleAddUpdate} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Update Title *</label>
                  <input
                    type="text"
                    value={updateForm.title}
                    onChange={(e) => setUpdateForm({ ...updateForm, title: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Content *</label>
                  <textarea
                    value={updateForm.content}
                    onChange={(e) => setUpdateForm({ ...updateForm, content: e.target.value })}
                    rows={6}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => setShowUpdateForm(false)} className="flex-1">
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1">
                    Add Update
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}

      {/* Add Document Modal */}
      {showDocumentForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl shadow-2xl max-w-2xl w-full">
            <div className="p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Add Document</h2>
                <button onClick={() => setShowDocumentForm(false)} className="text-gray-400 hover:text-gray-600">
                  <Icon name="X" size={24} />
                </button>
              </div>

              <form onSubmit={handleAddDocument} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Select File *</label>
                  <input
                    type="file"
                    onChange={(e) => setSelectedFile(e.target.files?.[0] || null)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    required
                  />
                  <p className="text-xs text-gray-500 mt-1">Maximum file size: 10MB. Supported formats: PDF, images, documents</p>
                  {selectedFile && (
                    <p className="text-sm text-green-600 mt-2">
                      Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Document Name (Optional)</label>
                  <input
                    type="text"
                    value={documentForm.name}
                    onChange={(e) => setDocumentForm({ ...documentForm, name: e.target.value })}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                    placeholder="Leave blank to use filename"
                  />
                </div>

                <div className="flex gap-3">
                  <Button type="button" variant="outline" onClick={() => {
                    setShowDocumentForm(false);
                    setSelectedFile(null);
                  }} className="flex-1" disabled={uploading}>
                    Cancel
                  </Button>
                  <Button type="submit" variant="primary" className="flex-1" disabled={uploading}>
                    {uploading ? 'Uploading...' : 'Upload & Add Document'}
                  </Button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </Section>
  );
}
