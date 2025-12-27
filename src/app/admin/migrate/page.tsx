'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MigrationPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [passwordResetRunning, setPasswordResetRunning] = useState(false);
  const [projectTrackerRunning, setProjectTrackerRunning] = useState(false);
  const [messagingRunning, setMessagingRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [passwordResetResult, setPasswordResetResult] = useState<any>(null);
  const [projectTrackerResult, setProjectTrackerResult] = useState<any>(null);
  const [messagingResult, setMessagingResult] = useState<any>(null);
  const [error, setError] = useState('');
  const [passwordResetError, setPasswordResetError] = useState('');
  const [projectTrackerError, setProjectTrackerError] = useState('');
  const [messagingError, setMessagingError] = useState('');

  const runMigration = async () => {
    setRunning(true);
    setError('');
    setResult(null);

    try {
      const res = await fetch('/api/admin/migrate-subcontractors', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setResult(data);
      } else {
        setError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setError(err.message || 'Failed to run migration');
    } finally {
      setRunning(false);
    }
  };

  const runPasswordResetMigration = async () => {
    setPasswordResetRunning(true);
    setPasswordResetError('');
    setPasswordResetResult(null);

    try {
      const res = await fetch('/api/admin/migrate-password-reset', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setPasswordResetResult(data);
      } else {
        setPasswordResetError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setPasswordResetError(err.message || 'Failed to run migration');
    } finally {
      setPasswordResetRunning(false);
    }
  };

  const runProjectTrackerMigration = async () => {
    setProjectTrackerRunning(true);
    setProjectTrackerError('');
    setProjectTrackerResult(null);

    try {
      const res = await fetch('/api/admin/migrate-project-tracker', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setProjectTrackerResult(data);
      } else {
        setProjectTrackerError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setProjectTrackerError(err.message || 'Failed to run migration');
    } finally {
      setProjectTrackerRunning(false);
    }
  };

  const runMessagingMigration = async () => {
    setMessagingRunning(true);
    setMessagingError('');
    setMessagingResult(null);

    try {
      const res = await fetch('/api/admin/migrate-messaging', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
      });

      const data = await res.json();

      if (res.ok) {
        setMessagingResult(data);
      } else {
        setMessagingError(data.error || 'Migration failed');
      }
    } catch (err: any) {
      setMessagingError(err.message || 'Failed to run migration');
    } finally {
      setMessagingRunning(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Subcontractor Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Subcontractor Migration</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to create the subcontractor database tables.
          </p>

          {!result && !error && (
            <button
              onClick={runMigration}
              disabled={running}
              className="bg-blue-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 text-xl"
            >
              {running ? 'Running Migration...' : 'Run Subcontractor Migration'}
            </button>
          )}

          {result && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2">
                {result.results?.map((line: string, idx: number) => (
                  <div key={idx} className="text-sm">{line}</div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/admin/subcontractors')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Subcontractor Management
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{error}</p>
              <button
                onClick={() => {
                  setError('');
                  runMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Password Reset Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Password Reset Migration</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to create the password reset tokens table for customer portal.
          </p>

          {!passwordResetResult && !passwordResetError && (
            <button
              onClick={runPasswordResetMigration}
              disabled={passwordResetRunning}
              className="bg-green-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-green-700 transition disabled:opacity-50 text-xl"
            >
              {passwordResetRunning ? 'Running Migration...' : 'Run Password Reset Migration'}
            </button>
          )}

          {passwordResetResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2">
                {passwordResetResult.results?.map((line: string, idx: number) => (
                  <div key={idx} className="text-sm">{line}</div>
                ))}
              </div>
              <div className="mt-6">
                <button
                  onClick={() => router.push('/portal')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Customer Portal
                </button>
              </div>
            </div>
          )}

          {passwordResetError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{passwordResetError}</p>
              <button
                onClick={() => {
                  setPasswordResetError('');
                  runPasswordResetMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Project Tracker Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Project Tracker Migration</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to create the project tracking database tables (projects, milestones, updates, photos, etc.).
          </p>

          {!projectTrackerResult && !projectTrackerError && (
            <button
              onClick={runProjectTrackerMigration}
              disabled={projectTrackerRunning}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-purple-700 transition disabled:opacity-50 text-xl"
            >
              {projectTrackerRunning ? 'Running Migration...' : 'Run Project Tracker Migration'}
            </button>
          )}

          {projectTrackerResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{projectTrackerResult.message}</p>
                <p className="text-sm">Tables created:</p>
                <ul className="list-disc list-inside text-sm">
                  {projectTrackerResult.tables?.map((table: string, idx: number) => (
                    <li key={idx}>{table}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => router.push('/admin/projects')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Project Management
                </button>
                <button
                  onClick={() => router.push('/portal')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  View Customer Portal
                </button>
              </div>
            </div>
          )}

          {projectTrackerError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{projectTrackerError}</p>
              <button
                onClick={() => {
                  setProjectTrackerError('');
                  runProjectTrackerMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        {/* Customer Messaging Migration */}
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Customer Messaging Migration</h1>
          <p className="text-gray-600 mb-8">
            Click the button below to create the customer messaging system tables for two-way communication in the portal.
          </p>

          {!messagingResult && !messagingError && (
            <button
              onClick={runMessagingMigration}
              disabled={messagingRunning}
              className="bg-indigo-600 text-white px-8 py-4 rounded-lg font-bold hover:bg-indigo-700 transition disabled:opacity-50 text-xl"
            >
              {messagingRunning ? 'Running Migration...' : 'Run Messaging Migration'}
            </button>
          )}

          {messagingResult && (
            <div className="bg-green-100 border border-green-400 text-green-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✓ Migration Successful!</h2>
              <div className="space-y-2 mb-4">
                <p className="font-semibold">{messagingResult.message}</p>
                <p className="text-sm">Tables created:</p>
                <ul className="list-disc list-inside text-sm">
                  {messagingResult.tables?.map((table: string, idx: number) => (
                    <li key={idx}>{table}</li>
                  ))}
                </ul>
              </div>
              <div className="mt-6 space-x-4">
                <button
                  onClick={() => router.push('/portal/messages')}
                  className="bg-green-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-green-700 transition"
                >
                  Go to Customer Messages
                </button>
                <button
                  onClick={() => router.push('/admin/customers')}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition"
                >
                  View Admin Messages
                </button>
              </div>
            </div>
          )}

          {messagingError && (
            <div className="bg-red-100 border border-red-400 text-red-800 p-6 rounded-lg mb-6">
              <h2 className="text-2xl font-bold mb-4">✗ Migration Failed</h2>
              <p className="mb-4">{messagingError}</p>
              <button
                onClick={() => {
                  setMessagingError('');
                  runMessagingMigration();
                }}
                className="bg-red-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-red-700 transition"
              >
                Try Again
              </button>
            </div>
          )}
        </div>

        <div className="text-center">
          <button
            onClick={() => router.push('/admin/dashboard')}
            className="text-gray-600 hover:text-gray-800 font-semibold"
          >
            ← Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}
