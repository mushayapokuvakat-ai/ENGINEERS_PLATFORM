'use client';

export default function Dashboard() {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-navy-600 text-white flex flex-col">
        <div className="p-6">
          <h2 className="text-2xl font-bold font-serif">AU Engineers</h2>
        </div>
        <nav className="flex-1 px-4 space-y-2">
          <a href="#" className="block px-4 py-2 bg-navy-500 rounded">Dashboard</a>
          <a href="#" className="block px-4 py-2 hover:bg-navy-500 rounded transition">Projects</a>
          <a href="#" className="block px-4 py-2 hover:bg-navy-500 rounded transition">Teams</a>
          <a href="#" className="block px-4 py-2 hover:bg-navy-500 rounded transition">Messages</a>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <header className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Welcome back</h1>
          <button className="btn-primary" onClick={() => {
            localStorage.removeItem('token');
            window.location.href = '/';
          }}>Logout</button>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card p-6 bg-white">
            <h3 className="text-lg font-bold text-navy-500 mb-2">Active Projects</h3>
            <p className="text-4xl font-bold text-gray-800">0</p>
          </div>
          <div className="card p-6 bg-white">
            <h3 className="text-lg font-bold text-navy-500 mb-2">Pending Requests</h3>
            <p className="text-4xl font-bold text-gray-800">0</p>
          </div>
          <div className="card p-6 bg-white">
            <h3 className="text-lg font-bold text-navy-500 mb-2">Messages</h3>
            <p className="text-4xl font-bold text-gray-800">0</p>
          </div>
        </div>

        <div className="mt-8 card p-6 bg-white h-96 border border-gray-200">
          <h3 className="text-xl font-bold text-gray-800 mb-4">Social Feed (Coming Soon)</h3>
          <div className="h-full flex items-center justify-center text-gray-400">
            No activity to show yet.
          </div>
        </div>
      </main>
    </div>
  );
}
