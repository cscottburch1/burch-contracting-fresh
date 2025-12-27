'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function MigrationPage() {
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

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

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-xl shadow-lg p-10">
          <h1 className="text-4xl font-bold mb-4">Database Migration</h1>
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

          <div className="mt-8">
            <button
              onClick={() => router.push('/admin/dashboard')}
              className="text-gray-600 hover:text-gray-800 font-semibold"
            >
              ← Back to Dashboard
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
