import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';

async function isAuthenticated() {
  const cookieStore = await cookies();
  const session = cookieStore.get('admin_session')?.value;
  return session === 'authenticated';
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
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          <a href="/crm" className="bg-blue-600 text-white p-8 rounded-lg text-center hover:bg-blue-700 transition text-2xl font-bold">
            Manage Leads / CRM
          </a>
          <div className="bg-gray-200 p-8 rounded-lg text-center text-2xl font-bold">
            Analytics (Coming Soon)
          </div>
          <div className="bg-gray-200 p-8 rounded-lg text-center text-2xl font-bold">
            Settings (Coming Soon)
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