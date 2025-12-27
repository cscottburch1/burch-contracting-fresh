'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface EmailTemplate {
  id: number;
  name: string;
  subject: string;
  body: string;
  template_type: string;
  variables: string;
  is_active: boolean;
  created_at: string;
  creator_name?: string;
}

interface SMSTemplate {
  id: number;
  name: string;
  message: string;
  template_type: string;
  variables: string;
  is_active: boolean;
  created_at: string;
  creator_name?: string;
}

export default function NotificationsManagement() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<'email' | 'sms'>('email');
  const [emailTemplates, setEmailTemplates] = useState<EmailTemplate[]>([]);
  const [smsTemplates, setSMSTemplates] = useState<SMSTemplate[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  // Email form state
  const [emailForm, setEmailForm] = useState({
    name: '',
    subject: '',
    body: '',
    template_type: 'customer' as 'customer' | 'admin' | 'subcontractor' | 'general',
    variables: [] as string[],
    is_active: true
  });

  // SMS form state
  const [smsForm, setSmsForm] = useState({
    name: '',
    message: '',
    template_type: 'customer' as 'customer' | 'admin' | 'subcontractor' | 'general',
    variables: [] as string[],
    is_active: true
  });

  const [variableInput, setVariableInput] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    checkAuth();
  }, []);

  useEffect(() => {
    if (currentUser) {
      loadTemplates();
    }
  }, [activeTab, currentUser]);

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

  const loadTemplates = async () => {
    setIsLoading(true);
    try {
      if (activeTab === 'email') {
        const res = await fetch('/api/admin/email-templates');
        if (res.ok) {
          const data = await res.json();
          setEmailTemplates(data);
        }
      } else {
        const res = await fetch('/api/admin/sms-templates');
        if (res.ok) {
          const data = await res.json();
          setSMSTemplates(data);
        }
      }
    } catch (error) {
      console.error('Error loading templates:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = editingId 
        ? `/api/admin/email-templates/${editingId}`
        : '/api/admin/email-templates';
      
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(emailForm)
      });

      if (res.ok) {
        setMessage(editingId ? 'Template updated!' : 'Template created!');
        resetEmailForm();
        loadTemplates();
      } else {
        const error = await res.json();
        setMessage(error.error || 'Failed to save template');
      }
    } catch (error) {
      setMessage('Error saving template');
    }
  };

  const handleCreateSMS = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (smsForm.message.length > 160) {
      setMessage('SMS message must be 160 characters or less');
      return;
    }

    try {
      const url = editingId 
        ? `/api/admin/sms-templates/${editingId}`
        : '/api/admin/sms-templates';
      
      const res = await fetch(url, {
        method: editingId ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(smsForm)
      });

      if (res.ok) {
        setMessage(editingId ? 'Template updated!' : 'Template created!');
        resetSMSForm();
        loadTemplates();
      } else {
        const error = await res.json();
        setMessage(error.error || 'Failed to save template');
      }
    } catch (error) {
      setMessage('Error saving template');
    }
  };

  const handleEditEmail = (template: EmailTemplate) => {
    setEmailForm({
      name: template.name,
      subject: template.subject,
      body: template.body,
      template_type: template.template_type as any,
      variables: template.variables ? JSON.parse(template.variables) : [],
      is_active: template.is_active
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleEditSMS = (template: SMSTemplate) => {
    setSmsForm({
      name: template.name,
      message: template.message,
      template_type: template.template_type as any,
      variables: template.variables ? JSON.parse(template.variables) : [],
      is_active: template.is_active
    });
    setEditingId(template.id);
    setShowForm(true);
  };

  const handleDeleteEmail = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const res = await fetch(`/api/admin/email-templates/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMessage('Template deleted');
        loadTemplates();
      }
    } catch (error) {
      setMessage('Error deleting template');
    }
  };

  const handleDeleteSMS = async (id: number) => {
    if (!confirm('Are you sure you want to delete this template?')) return;

    try {
      const res = await fetch(`/api/admin/sms-templates/${id}`, {
        method: 'DELETE'
      });

      if (res.ok) {
        setMessage('Template deleted');
        loadTemplates();
      }
    } catch (error) {
      setMessage('Error deleting template');
    }
  };

  const resetEmailForm = () => {
    setEmailForm({
      name: '',
      subject: '',
      body: '',
      template_type: 'customer',
      variables: [],
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const resetSMSForm = () => {
    setSmsForm({
      name: '',
      message: '',
      template_type: 'customer',
      variables: [],
      is_active: true
    });
    setEditingId(null);
    setShowForm(false);
  };

  const addVariable = () => {
    if (!variableInput.trim()) return;
    
    if (activeTab === 'email') {
      if (!emailForm.variables.includes(variableInput.trim())) {
        setEmailForm({
          ...emailForm,
          variables: [...emailForm.variables, variableInput.trim()]
        });
      }
    } else {
      if (!smsForm.variables.includes(variableInput.trim())) {
        setSmsForm({
          ...smsForm,
          variables: [...smsForm.variables, variableInput.trim()]
        });
      }
    }
    setVariableInput('');
  };

  const removeVariable = (variable: string) => {
    if (activeTab === 'email') {
      setEmailForm({
        ...emailForm,
        variables: emailForm.variables.filter(v => v !== variable)
      });
    } else {
      setSmsForm({
        ...smsForm,
        variables: smsForm.variables.filter(v => v !== variable)
      });
    }
  };

  const insertVariable = (variable: string) => {
    if (activeTab === 'email') {
      setEmailForm({
        ...emailForm,
        body: emailForm.body + `{{${variable}}}`
      });
    } else {
      setSmsForm({
        ...smsForm,
        message: smsForm.message + `{{${variable}}}`
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Notification Templates</h1>
            <p className="text-gray-600 mt-2">Manage email and SMS templates for automated communications</p>
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

        {/* Tabs */}
        <div className="flex gap-4 mb-6 border-b">
          <button
            onClick={() => {
              setActiveTab('email');
              resetEmailForm();
              resetSMSForm();
            }}
            className={`px-6 py-3 font-medium ${
              activeTab === 'email'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📧 Email Templates
          </button>
          <button
            onClick={() => {
              setActiveTab('sms');
              resetEmailForm();
              resetSMSForm();
            }}
            className={`px-6 py-3 font-medium ${
              activeTab === 'sms'
                ? 'border-b-2 border-blue-600 text-blue-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📱 SMS Templates
          </button>
        </div>

        {/* Email Template Form */}
        {activeTab === 'email' && showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit Email Template' : 'Create Email Template'}
            </h2>
            <form onSubmit={handleCreateEmail} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={emailForm.name}
                    onChange={(e) => setEmailForm({ ...emailForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Template Type</label>
                  <select
                    value={emailForm.template_type}
                    onChange={(e) => setEmailForm({ ...emailForm, template_type: e.target.value as any })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="subcontractor">Subcontractor</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Subject *</label>
                <input
                  type="text"
                  value={emailForm.subject}
                  onChange={(e) => setEmailForm({ ...emailForm, subject: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Email Body *</label>
                <textarea
                  value={emailForm.body}
                  onChange={(e) => setEmailForm({ ...emailForm, body: e.target.value })}
                  className="w-full px-4 py-2 border rounded-lg"
                  rows={10}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use variables like {`{{customer_name}}`} or {`{{project_name}}`}
                </p>
              </div>

              {/* Variables Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Template Variables</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={variableInput}
                    onChange={(e) => setVariableInput(e.target.value)}
                    placeholder="e.g., customer_name"
                    className="flex-1 px-4 py-2 border rounded-lg"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                  />
                  <button
                    type="button"
                    onClick={addVariable}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add Variable
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {emailForm.variables.map((variable) => (
                    <div key={variable} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-sm">{variable}</span>
                      <button
                        type="button"
                        onClick={() => insertVariable(variable)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                        title="Insert into body"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeVariable(variable)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="email_active"
                  checked={emailForm.is_active}
                  onChange={(e) => setEmailForm({ ...emailForm, is_active: e.target.checked })}
                />
                <label htmlFor="email_active" className="text-sm font-medium">Active</label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  type="button"
                  onClick={resetEmailForm}
                  className="px-6 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* SMS Template Form */}
        {activeTab === 'sms' && showForm && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-xl font-bold mb-4">
              {editingId ? 'Edit SMS Template' : 'Create SMS Template'}
            </h2>
            <form onSubmit={handleCreateSMS} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Template Name *</label>
                  <input
                    type="text"
                    value={smsForm.name}
                    onChange={(e) => setSmsForm({ ...smsForm, name: e.target.value })}
                    className="w-full px-4 py-2 border rounded-lg"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Template Type</label>
                  <select
                    value={smsForm.template_type}
                    onChange={(e) => setSmsForm({ ...smsForm, template_type: e.target.value as any })}
                    className="w-full px-4 py-2 border rounded-lg"
                  >
                    <option value="customer">Customer</option>
                    <option value="admin">Admin</option>
                    <option value="subcontractor">Subcontractor</option>
                    <option value="general">General</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">
                  SMS Message * ({smsForm.message.length}/160 characters)
                </label>
                <textarea
                  value={smsForm.message}
                  onChange={(e) => setSmsForm({ ...smsForm, message: e.target.value })}
                  className={`w-full px-4 py-2 border rounded-lg ${
                    smsForm.message.length > 160 ? 'border-red-500' : ''
                  }`}
                  rows={4}
                  maxLength={160}
                  required
                />
                <p className="text-sm text-gray-500 mt-1">
                  Use variables like {`{{customer_name}}`} or {`{{date}}`}
                </p>
                {smsForm.message.length > 160 && (
                  <p className="text-sm text-red-600 mt-1">SMS messages must be 160 characters or less</p>
                )}
              </div>

              {/* Variables Section */}
              <div>
                <label className="block text-sm font-medium mb-2">Template Variables</label>
                <div className="flex gap-2 mb-2">
                  <input
                    type="text"
                    value={variableInput}
                    onChange={(e) => setVariableInput(e.target.value)}
                    placeholder="e.g., customer_name"
                    className="flex-1 px-4 py-2 border rounded-lg"
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addVariable())}
                  />
                  <button
                    type="button"
                    onClick={addVariable}
                    className="px-4 py-2 bg-gray-200 rounded-lg hover:bg-gray-300"
                  >
                    Add Variable
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {smsForm.variables.map((variable) => (
                    <div key={variable} className="flex items-center gap-2 bg-blue-100 px-3 py-1 rounded-full">
                      <span className="text-sm">{variable}</span>
                      <button
                        type="button"
                        onClick={() => insertVariable(variable)}
                        className="text-blue-600 hover:text-blue-800 text-xs"
                        title="Insert into message"
                      >
                        ↓
                      </button>
                      <button
                        type="button"
                        onClick={() => removeVariable(variable)}
                        className="text-red-600 hover:text-red-800"
                      >
                        ×
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="sms_active"
                  checked={smsForm.is_active}
                  onChange={(e) => setSmsForm({ ...smsForm, is_active: e.target.checked })}
                />
                <label htmlFor="sms_active" className="text-sm font-medium">Active</label>
              </div>

              <div className="flex gap-4">
                <button
                  type="submit"
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  {editingId ? 'Update Template' : 'Create Template'}
                </button>
                <button
                  type="button"
                  onClick={resetSMSForm}
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
            + Create {activeTab === 'email' ? 'Email' : 'SMS'} Template
          </button>
        )}

        {/* Email Templates List */}
        {activeTab === 'email' && (
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center py-8">Loading templates...</p>
            ) : emailTemplates.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No email templates yet</p>
            ) : (
              emailTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{template.name}</h3>
                      <p className="text-sm text-gray-600">Type: {template.template_type}</p>
                      {template.creator_name && (
                        <p className="text-sm text-gray-500">Created by: {template.creator_name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        template.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Subject:</p>
                    <p className="text-gray-900">{template.subject}</p>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Body:</p>
                    <p className="text-gray-700 whitespace-pre-wrap text-sm">{template.body.substring(0, 200)}...</p>
                  </div>
                  {template.variables && JSON.parse(template.variables).length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(template.variables).map((variable: string) => (
                          <span key={variable} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditEmail(template)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteEmail(template.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* SMS Templates List */}
        {activeTab === 'sms' && (
          <div className="space-y-4">
            {isLoading ? (
              <p className="text-center py-8">Loading templates...</p>
            ) : smsTemplates.length === 0 ? (
              <p className="text-center py-8 text-gray-500">No SMS templates yet</p>
            ) : (
              smsTemplates.map((template) => (
                <div key={template.id} className="bg-white rounded-lg shadow-md p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold">{template.name}</h3>
                      <p className="text-sm text-gray-600">Type: {template.template_type}</p>
                      {template.creator_name && (
                        <p className="text-sm text-gray-500">Created by: {template.creator_name}</p>
                      )}
                    </div>
                    <div className="flex gap-2">
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        template.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-gray-100 text-gray-800'
                      }`}>
                        {template.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-1">Message ({template.message.length}/160 characters):</p>
                    <p className="text-gray-900">{template.message}</p>
                  </div>
                  {template.variables && JSON.parse(template.variables).length > 0 && (
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-1">Variables:</p>
                      <div className="flex flex-wrap gap-2">
                        {JSON.parse(template.variables).map((variable: string) => (
                          <span key={variable} className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs">
                            {`{{${variable}}}`}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleEditSMS(template)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteSMS(template.id)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}
