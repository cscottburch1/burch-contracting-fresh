import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { getAdminSessionFromRequestCookie } from '@/lib/adminAuth';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore.get('admin_session')?.value;
  const session = getAdminSessionFromRequestCookie(sessionCookie);
  return session !== null;
}

export default async function AdminDashboard() {
  const authenticated = await isAuthenticated();
  if (!authenticated) {
    redirect('/admin');
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto bg-white rounded-xl shadow-lg p-10">
        <h1 className="text-4xl font-bold mb-8">Admin Dashboard</h1>
        <p className="text-xl mb-8">Welcome! You are logged in.</p>
        
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Documents</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <a href="/admin/proposals/create" className="bg-blue-600 text-white p-6 rounded-lg text-center hover:bg-blue-700 transition text-xl font-bold flex items-center justify-center gap-3">
              <span>📄</span>
              Create Proposal
            </a>
            <a href="/admin/invoices/create" className="bg-green-600 text-white p-6 rounded-lg text-center hover:bg-green-700 transition text-xl font-bold flex items-center justify-center gap-3">
              <span>🧾</span>
              Create Invoice
            </a>
          </div>
        </div>

        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-4">Management</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <a href="/crm" className="bg-purple-600 text-white p-6 rounded-lg text-center hover:bg-purple-700 transition text-xl font-bold">
              Manage Leads / CRM
            </a>
            <a href="/admin/settings" className="bg-indigo-600 text-white p-6 rounded-lg text-center hover:bg-indigo-700 transition text-xl font-bold">
              Team Settings
            </a>
            <div className="bg-gray-200 p-6 rounded-lg text-center text-xl font-bold text-gray-500">
              Analytics (Coming Soon)
            </div>
          </div>
        </div>

        <form action="/api/admin/logout" method="post">
          <button className="bg-red-600 text-white px-8 py-3 rounded-lg hover:bg-red-700 transition font-bold">
            Logout
          </button>
        </form>
      </div>
    </div>
  );
}