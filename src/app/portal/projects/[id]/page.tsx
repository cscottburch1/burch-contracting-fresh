'use client';

import React, { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import Link from 'next/link';
import { Section } from '@/components/ui/Section';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Icon } from '@/components/ui/Icon';

interface Project {
  id: number;
  title: string;
  description: string;
  status: 'pending' | 'active' | 'completed' | 'cancelled';
  budget: number;
  start_date: string;
  end_date: string;
  created_at: string;
}

interface ProjectUpdate {
  id: number;
  title: string;
  description: string;
  created_at: string;
}

interface Document {
  id: number;
  filename: string;
  filepath: string;
  filetype: string;
  filesize: number;
  uploaded_by: 'customer' | 'admin';
  created_at: string;
}

const statusConfig = {
  pending: { label: 'Pending', color: 'bg-yellow-100 text-yellow-800', icon: 'Clock' },
  active: { label: 'Active', color: 'bg-green-100 text-green-800', icon: 'PlayCircle' },
  completed: { label: 'Completed', color: 'bg-blue-100 text-blue-800', icon: 'CheckCircle' },
  cancelled: { label: 'Cancelled', color: 'bg-red-100 text-red-800', icon: 'XCircle' },
};

export default function ProjectDetailsPage() {
  const router = useRouter();
  const params = useParams();
  const [project, setProject] = useState<Project | null>(null);
  const [updates, setUpdates] = useState<ProjectUpdate[]>([]);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'overview' | 'updates' | 'documents'>('overview');

  useEffect(() => {
    fetchProjectDetails();
  }, [params.id]);

  const fetchProjectDetails = async () => {
    try {
      const response = await fetch(`/api/portal/projects/${params.id}`);
      
      if (!response.ok) {
        if (response.status === 401) {
          router.push('/portal');
        } else if (response.status === 404) {
          router.push('/portal/dashboard');
        }
        return;
      }

      const data = await response.json();
      setProject(data.project);
      setUpdates(data.updates || []);
      setDocuments(data.documents || []);
    } catch (error) {
      console.error('Failed to fetch project details:', error);
      router.push('/portal/dashboard');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
    });
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  if (loading) {
    return (
      <Section padding="xl">
        <div className="text-center py-12">
          <p className="text-gray-600">Loading project details...</p>
        </div>
      </Section>
    );
  }

  if (!project) {
    return null;
  }

  const statusInfo = statusConfig[project.status];

  return (
    <Section padding="xl">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <Link href="/portal/dashboard">
            <Button variant="outline" size="sm" className="mb-4">
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Back to Dashboard
            </Button>
          </Link>

          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">{project.title}</h1>
              <span className={`inline-flex items-center px-3 py-1 text-sm font-semibold rounded-full ${statusInfo.color}`}>
                <Icon name={statusInfo.icon as any} size={16} className="mr-1" />
                {statusInfo.label}
              </span>
            </div>
            <Button variant="primary">
              <Icon name="MessageCircle" size={16} className="mr-2" />
              Contact Support
            </Button>
          </div>
        </div>

        {/* Project Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {project.budget && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-3 rounded-lg">
                  <Icon name="DollarSign" size={24} className="text-green-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="text-xl font-bold text-gray-900">{formatCurrency(project.budget)}</p>
                </div>
              </div>
            </Card>
          )}

          {project.start_date && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <Icon name="Calendar" size={24} className="text-blue-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Start Date</p>
                  <p className="text-xl font-bold text-gray-900">{formatDate(project.start_date)}</p>
                </div>
              </div>
            </Card>
          )}

          {project.end_date && (
            <Card className="p-6">
              <div className="flex items-center gap-3">
                <div className="bg-orange-100 p-3 rounded-lg">
                  <Icon name="Calendar" size={24} className="text-orange-600" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">End Date</p>
                  <p className="text-xl font-bold text-gray-900">{formatDate(project.end_date)}</p>
                </div>
              </div>
            </Card>
          )}
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab('overview')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === 'overview'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => setActiveTab('updates')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === 'updates'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Updates ({updates.length})
            </button>
            <button
              onClick={() => setActiveTab('documents')}
              className={`pb-4 px-1 font-medium text-sm border-b-2 transition ${
                activeTab === 'documents'
                  ? 'border-orange-600 text-orange-600'
                  : 'border-transparent text-gray-600 hover:text-gray-900'
              }`}
            >
              Documents ({documents.length})
            </button>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <Card className="p-6">
            <h3 className="text-lg font-semibold mb-4">Project Description</h3>
            <p className="text-gray-700 whitespace-pre-wrap">{project.description}</p>
            
            <div className="mt-6 pt-6 border-t border-gray-200">
              <h4 className="text-md font-semibold mb-3">Project Timeline</h4>
              <div className="space-y-3">
                <div className="flex items-center">
                  <Icon name="CheckCircle" size={20} className="text-green-600 mr-3" />
                  <div>
                    <p className="font-medium">Project Created</p>
                    <p className="text-sm text-gray-600">{formatDateTime(project.created_at)}</p>
                  </div>
                </div>
                {project.start_date && (
                  <div className="flex items-center">
                    <Icon name="PlayCircle" size={20} className="text-blue-600 mr-3" />
                    <div>
                      <p className="font-medium">Start Date</p>
                      <p className="text-sm text-gray-600">{formatDate(project.start_date)}</p>
                    </div>
                  </div>
                )}
                {project.end_date && (
                  <div className="flex items-center">
                    <Icon name="Flag" size={20} className="text-orange-600 mr-3" />
                    <div>
                      <p className="font-medium">Target Completion</p>
                      <p className="text-sm text-gray-600">{formatDate(project.end_date)}</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </Card>
        )}

        {activeTab === 'updates' && (
          <div className="space-y-4">
            {updates.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="Bell" size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No updates yet</p>
              </Card>
            ) : (
              updates.map((update) => (
                <Card key={update.id} className="p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-orange-100 p-2 rounded-lg">
                      <Icon name="Bell" size={20} className="text-orange-600" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <h4 className="font-semibold text-gray-900">{update.title}</h4>
                        <span className="text-sm text-gray-500">{formatDateTime(update.created_at)}</span>
                      </div>
                      <p className="text-gray-700">{update.description}</p>
                    </div>
                  </div>
                </Card>
              ))
            )}
          </div>
        )}

        {activeTab === 'documents' && (
          <div>
            {documents.length === 0 ? (
              <Card className="p-12 text-center">
                <Icon name="FileText" size={32} className="text-gray-400 mx-auto mb-3" />
                <p className="text-gray-600">No documents yet</p>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {documents.map((doc) => (
                  <Card key={doc.id} className="p-4 hover:shadow-md transition">
                    <div className="flex items-center gap-3">
                      <div className="bg-gray-100 p-3 rounded-lg">
                        <Icon name="FileText" size={24} className="text-gray-600" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-gray-900 truncate">{doc.filename}</p>
                        <div className="flex items-center gap-2 text-sm text-gray-500">
                          <span>{formatFileSize(doc.filesize)}</span>
                          <span>•</span>
                          <span>{formatDate(doc.created_at)}</span>
                          <span>•</span>
                          <span className="capitalize">{doc.uploaded_by}</span>
                        </div>
                      </div>
                      <a
                        href={doc.filepath}
                        target="_blank"
                        rel="noopener noreferrer"
                        download
                      >
                        <Button variant="outline" size="sm">
                          <Icon name="Download" size={16} />
                        </Button>
                      </a>
                    </div>
                  </Card>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </Section>
  );
}
