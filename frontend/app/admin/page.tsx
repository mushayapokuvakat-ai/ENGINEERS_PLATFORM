'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [stats, setStats] = useState({ totalUsers: 0, activeProjects: 0, pendingUsers: 0 });
  const [pendingUsers, setPendingUsers] = useState([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const token = localStorage.getItem('token');
      const authOptions = { headers: { Authorization: `Bearer ${token}` } };
      
      const statsRes = await axios.get('http://localhost:5000/api/admin/stats', authOptions);
      setStats(statsRes.data.stats);

      const usersRes = await axios.get('http://localhost:5000/api/admin/pending-users', authOptions);
      setPendingUsers(usersRes.data.users);
    } catch (error) {
      console.error(error);
    }
  };

  const handleStatusUpdate = async (userId: string, status: string) => {
    try {
      const token = localStorage.getItem('token');
      await axios.put(`http://localhost:5000/api/admin/users/${userId}/status`, { status }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchData(); // Refresh the list
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-500 mb-8">System Administration</h1>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="card p-6 bg-white border-l-4 border-navy-500">
            <h3 className="text-gray-500 font-bold mb-1">Total Users</h3>
            <p className="text-3xl font-bold text-navy-600">{stats.totalUsers}</p>
          </div>
          <div className="card p-6 bg-white border-l-4 border-blue-500">
            <h3 className="text-gray-500 font-bold mb-1">Active Projects</h3>
            <p className="text-3xl font-bold text-navy-600">{stats.activeProjects}</p>
          </div>
          <div className="card p-6 bg-white border-l-4 border-red-500">
            <h3 className="text-gray-500 font-bold mb-1">Pending Approvals</h3>
            <p className="text-3xl font-bold text-navy-600">{stats.pendingUsers}</p>
          </div>
        </div>

        <div className="card p-6 bg-white">
          <h2 className="text-xl font-bold text-navy-500 mb-4">Pending User Approvals</h2>
          
          {pendingUsers.length === 0 ? (
            <p className="text-gray-500">No pending approvals at this time.</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-gray-100 border-b border-gray-200">
                    <th className="p-3 font-bold text-gray-700">Username</th>
                    <th className="p-3 font-bold text-gray-700">Email</th>
                    <th className="p-3 font-bold text-gray-700">Registered</th>
                    <th className="p-3 font-bold text-gray-700">Resume</th>
                    <th className="p-3 font-bold text-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {pendingUsers.map((user: any) => (
                    <tr key={user.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="p-3">{user.username}</td>
                      <td className="p-3">{user.email}</td>
                      <td className="p-3">{new Date(user.created_at).toLocaleDateString()}</td>
                      <td className="p-3">
                        {user.resume_url ? (
                          <a href={user.resume_url} target="_blank" className="text-blue-500 hover:underline">View Document</a>
                        ) : (
                          <span className="text-gray-400">None provided</span>
                        )}
                      </td>
                      <td className="p-3 flex gap-2">
                        <button 
                          onClick={() => handleStatusUpdate(user.id, 'APPROVED')}
                          className="bg-green-600 hover:bg-green-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Approve
                        </button>
                        <button 
                          onClick={() => handleStatusUpdate(user.id, 'REJECTED')}
                          className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm transition"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
