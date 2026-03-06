import { Link } from 'react-router-dom';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black text-gray-900 dark:text-white p-8">
      <div className="max-w-6xl mx-auto">
        <header className="mb-8 flex items-center justify-between">
          <h1 className="text-3xl font-bold">Admin Dashboard</h1>
          <nav className="flex gap-4">
            <Link to="/admin/issues" className="px-4 py-2 bg-white dark:bg-[#121212] rounded-lg shadow">Issues</Link>
            <Link to="/admin/reviews" className="px-4 py-2 bg-white dark:bg-[#121212] rounded-lg shadow">Reviews</Link>
          </nav>
        </header>

        <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="p-6 bg-white dark:bg-[#0b1220] rounded-2xl shadow">
            <h3 className="text-lg font-semibold">Quick Actions</h3>
            <ul className="mt-4 text-sm text-gray-500 dark:text-gray-300 space-y-2">
              <li>View issues reported by users</li>
              <li>Inspect user reviews and keywords</li>
              <li>Manage platform content</li>
            </ul>
          </div>

          <div className="p-6 bg-white dark:bg-[#0b1220] rounded-2xl shadow col-span-2">
            <h3 className="text-lg font-semibold">Overview</h3>
            <p className="text-sm text-gray-500 dark:text-gray-300 mt-2">Select a view from the top-right to manage content and see review analytics.</p>
          </div>
        </section>
      </div>
    </div>
  );
}
