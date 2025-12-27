'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { AdminUser, AdminRole, PERMISSIONS } from '@/types/admin';

export default function SettingsPage() {
  const [currentUser, setCurrentUser] = useState<any>(null);
  const [users, setUsers] = useState<AdminUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState<number | null>(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [emergencyServicesEnabled, setEmergencyServicesEnabled] = useState(false);
  const [savingEmergency, setSavingEmergency] = useState(false);
  const router = useRouter();

  // Form states
  const [newUser, setNewUser] = useState({
    email: '',
    password: '',
    name: '',
    role: 'support' as AdminRole,
  });

  useEffect(() => {
    checkAuth();
    loadUsers();
    loadEmergencySettings();
  }, []);

  const checkAuth = async () => {
    const res = await fetch('/api/admin/me');
    if (!res.ok) {
      router.push('/admin');
      return;
    }
    const data = await res.json();
    setCurrentUser(data.user);

    // Only owners can access settings
    if (data.user.role !== 'owner') {
      router.push('/admin/dashboard');
    }
  };

  const loadUsers = async () => {
    try {
      const res = await fetch('/api/admin/users');
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users);
      }
    } catch (err) {
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };
  const loadEmergencySettings = async () => {
    try {
      const res = await fetch('/api/admin/emergency-settings');
      if (res.ok) {
        const data = await res.json();
        setEmergencyServicesEnabled(data.enabled);
      }
    } catch (err) {
      console.error('Error loading emergency settings:', err);
    }
  };

  const toggleEmergencyServices = async () => {
    setSavingEmergency(true);
    try {
      const res = await fetch('/api/admin/emergency-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !emergencyServicesEnabled }),
      });

      if (res.ok) {
        setEmergencyServicesEnabled(!emergencyServicesEnabled);
        setSuccess('Emergency services banner updated');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError('Failed to update emergency services setting');
      }
    } catch (err) {
      setError('Failed to update emergency services setting');
    } finally {
      setSavingEmergency(false);
    }
  };
  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newUser),
      });

      if (res.ok) {
        setSuccess('User added successfully!');
        setShowAddUser(false);
        setNewUser({ email: '', password: '', name: '', role: 'support' });
        loadUsers();
      } else {
        const data = await res.json();
        setError(data.error || 'Failed to add user');
      }
    } catch (err) {
      setError('Failed to add user');
    }
  };

  const handleToggleActive = async (userId: number, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ is_active: !currentStatus }),
      });

      if (res.ok) {
        setSuccess(`User ${!currentStatus ? 'enabled' : 'disabled'} successfully`);
        loadUsers();
      } else {
        setError('Failed to update user');
      }
    } catch (err) {
      setError('Failed to update user');
    }
  };

  const handleUpdateRole = async (userId: number, newRole: AdminRole) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: newRole }),
      });

      if (res.ok) {
        setSuccess('Role updated successfully');
        setShowEditUser(null);
        loadUsers();
      } else {
        setError('Failed to update role');
      }
    } catch (err) {
      setError('Failed to update role');
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
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold">Settings</h1>
              <p className="text-gray-600 mt-2">Manage team members and permissions</p>
            </div>
            <a href="/admin/dashboard" className="text-blue-600 hover:underline">
              ← Back to Dashboard
            </a>
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
          {/* Emergency Services Banner Toggle */}
          <div className="mb-8 p-6 bg-gradient-to-r from-red-50 to-orange-50 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-xl font-bold text-gray-900 mb-2">🚨 Emergency Services Banner</h3>
                <p className="text-gray-700 mb-1">
                  Show the emergency services banner on the homepage with 4-hour response messaging.
                </p>
                <p className="text-sm text-gray-600">
                  Turn this off when you're unable to provide emergency services.
                </p>
              </div>
              <div className="ml-6">
                <button
                  onClick={toggleEmergencyServices}
                  disabled={savingEmergency}
                  className={`relative inline-flex h-12 w-24 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 ${
                    emergencyServicesEnabled
                      ? 'bg-green-600 focus:ring-green-500'
                      : 'bg-gray-300 focus:ring-gray-400'
                  } ${savingEmergency ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  <span
                    className={`inline-block h-10 w-10 transform rounded-full bg-white shadow-lg transition-transform ${
                      emergencyServicesEnabled ? 'translate-x-12' : 'translate-x-1'
                    }`}
                  />
                </button>
                <p className={`text-center mt-2 font-semibold ${
                  emergencyServicesEnabled ? 'text-green-700' : 'text-gray-500'
                }`}>
                  {emergencyServicesEnabled ? 'ON' : 'OFF'}
                </p>
              </div>
            </div>
          </div>
          {/* Add User Section */}
          <div className="mb-8">
            <button
              onClick={() => setShowAddUser(!showAddUser)}
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 font-bold"
            >
              {showAddUser ? 'Cancel' : '+ Add Team Member'}
            </button>

            {showAddUser && (
              <form onSubmit={handleAddUser} className="mt-4 p-6 bg-gray-50 rounded-lg">
                <h3 className="text-xl font-bold mb-4">Add New User</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Name</label>
                    <input
                      type="text"
                      value={newUser.name}
                      onChange={(e) => setNewUser({ ...newUser, name: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Email</label>
                    <input
                      type="email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Password</label>
                    <input
                      type="password"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                      className="w-full px-4 py-2 border rounded-lg"
                      required
                      minLength={8}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-2">Role</label>
                    <select
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value as AdminRole })}
                      className="w-full px-4 py-2 border rounded-lg"
                    >
                      <option value="support">Support (View Only)</option>
                      <option value="sales">Sales (Leads & Proposals)</option>
                      <option value="manager">Manager (Full Access)</option>
                    </select>
                  </div>
                </div>
                <button
                  type="submit"
                  className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 font-bold"
                >
                  Create User
                </button>
              </form>
            )}
          </div>

          {/* Users List */}
          <div>
            <h2 className="text-2xl font-bold mb-4">Team Members ({users.length})</h2>
            <div className="space-y-4">
              {users.map((user) => (
                <div key={user.id} className="border rounded-lg p-4 hover:bg-gray-50">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3">
                        <h3 className="text-xl font-bold">{user.name}</h3>
                        {user.role === 'owner' && (
                          <span className="bg-purple-100 text-purple-800 px-3 py-1 rounded-full text-sm font-bold">
                            👑 Owner
                          </span>
                        )}
                        {user.role === 'manager' && (
                          <span className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-bold">
                            Manager
                          </span>
                        )}
                        {user.role === 'sales' && (
                          <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-bold">
                            Sales
                          </span>
                        )}
                        {user.role === 'support' && (
                          <span className="bg-gray-100 text-gray-800 px-3 py-1 rounded-full text-sm font-bold">
                            Support
                          </span>
                        )}
                        {!user.is_active && (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-bold">
                            Disabled
                          </span>
                        )}
                      </div>
                      <p className="text-gray-600 mt-1">{user.email}</p>
                      {user.last_login && (
                        <p className="text-sm text-gray-500 mt-1">
                          Last login: {new Date(user.last_login).toLocaleString()}
                        </p>
                      )}

                      {/* Role Editor */}
                      {showEditUser === user.id && user.role !== 'owner' && (
                        <div className="mt-3 p-3 bg-blue-50 rounded">
                          <label className="block text-sm font-medium mb-2">Change Role:</label>
                          <div className="flex gap-2">
                            <select
                              defaultValue={user.role}
                              onChange={(e) => handleUpdateRole(user.id, e.target.value as AdminRole)}
                              className="px-3 py-1 border rounded"
                            >
                              <option value="support">Support</option>
                              <option value="sales">Sales</option>
                              <option value="manager">Manager</option>
                            </select>
                            <button
                              onClick={() => setShowEditUser(null)}
                              className="px-3 py-1 text-gray-600 hover:text-gray-800"
                            >
                              Cancel
                            </button>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Actions */}
                    {user.role !== 'owner' && (
                      <div className="flex gap-2">
                        <button
                          onClick={() => setShowEditUser(showEditUser === user.id ? null : user.id)}
                          className="px-4 py-2 text-blue-600 hover:bg-blue-50 rounded font-medium"
                        >
                          {showEditUser === user.id ? 'Cancel' : 'Edit Role'}
                        </button>
                        <button
                          onClick={() => handleToggleActive(user.id, user.is_active)}
                          className={`px-4 py-2 rounded font-medium ${
                            user.is_active
                              ? 'text-red-600 hover:bg-red-50'
                              : 'text-green-600 hover:bg-green-50'
                          }`}
                        >
                          {user.is_active ? 'Disable' : 'Enable'}
                        </button>
                      </div>
                    )}
                  </div>

                  {/* Permissions Display */}
                  <div className="mt-3 pt-3 border-t">
                    <p className="text-sm font-medium text-gray-700 mb-2">Permissions:</p>
                    <div className="flex flex-wrap gap-2">
                      {user.role && Object.entries(PERMISSIONS[user.role])
                        .filter(([_, hasPermission]) => hasPermission)
                        .slice(0, 6)
                        .map(([permission]) => (
                          <span key={permission} className="text-xs bg-gray-100 px-2 py-1 rounded">
                            {permission.replace(/([A-Z])/g, ' $1').trim()}
                          </span>
                        ))}
                      {user.role && Object.values(PERMISSIONS[user.role]).filter(Boolean).length > 6 && (
                        <span className="text-xs text-gray-500">
                          +{Object.values(PERMISSIONS[user.role]).filter(Boolean).length - 6} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-xl font-bold mb-4">Role Descriptions</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-green-50 rounded-lg">
                <h4 className="font-bold text-green-900 mb-2">📊 Sales</h4>
                <p className="text-sm text-green-800">
                  Manage leads, create proposals, view customers. No financial access.
                </p>
              </div>
              <div className="p-4 bg-blue-50 rounded-lg">
                <h4 className="font-bold text-blue-900 mb-2">⚙️ Manager</h4>
                <p className="text-sm text-blue-800">
                  Full operational access including invoices and financials. Cannot manage users.
                </p>
              </div>
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-bold text-gray-900 mb-2">👁️ Support</h4>
                <p className="text-sm text-gray-800">
                  View-only access to leads and customer projects. No editing.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
