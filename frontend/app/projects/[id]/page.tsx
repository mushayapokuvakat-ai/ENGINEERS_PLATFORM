'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams } from 'next/navigation';

export default function ProjectDetails() {
  const { id } = useParams();
  const [project, setProject] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProject();
  }, [id]);

  const fetchProject = async () => {
    try {
      const token = localStorage.getItem('token');
      // For MVP we just fetch all and filter since we don't have a getProjectById route yet
      // Alternatively, we can just use the projects endpoint and find it
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const found = res.data.projects.find((p: any) => p.id === id);
      setProject(found);
    } catch (error) {
      console.error('Error fetching project', error);
    } finally {
      setLoading(false);
    }
  };

  const handleJoin = async () => {
    try {
      const token = localStorage.getItem('token');
      await axios.post(`http://localhost:5000/api/projects/${id}/join`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Join request sent successfully!');
      fetchProject();
    } catch (error: any) {
      alert(error.response?.data?.message || 'Failed to send request');
    }
  };

  if (loading) return <div className="p-8">Loading...</div>;
  if (!project) return <div className="p-8 text-red-500">Project not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-4xl mx-auto">
        <button onClick={() => window.history.back()} className="text-navy-500 mb-6 hover:underline">
          &larr; Back to Projects
        </button>

        <div className="card p-8 bg-white mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-navy-600 mb-2">{project.title}</h1>
              <p className="text-sm text-gray-500 mb-6">Created by {project.creator.username}</p>
            </div>
            <button onClick={handleJoin} className="btn-primary">Request to Join Team</button>
          </div>

          <div className="prose max-w-none text-gray-700 mb-8">
            <h3 className="text-xl font-bold text-navy-500 mb-2">Description</h3>
            <p className="whitespace-pre-wrap">{project.description}</p>
          </div>

          <div className="flex gap-4 border-t border-gray-100 pt-6">
            <div className="bg-gray-100 px-4 py-2 rounded">
              <span className="block text-xs text-gray-500">Status</span>
              <span className="font-bold">{project.status}</span>
            </div>
            <div className="bg-gray-100 px-4 py-2 rounded">
              <span className="block text-xs text-gray-500">Team Size</span>
              <span className="font-bold">{project._count.members} / 5</span>
            </div>
            {project.github_link && (
              <div className="bg-gray-100 px-4 py-2 rounded">
                <span className="block text-xs text-gray-500">Repository</span>
                <a href={project.github_link} target="_blank" className="font-bold text-navy-500 hover:underline">View Code</a>
              </div>
            )}
          </div>
        </div>

        <div className="card p-8 bg-white">
          <h2 className="text-2xl font-bold text-navy-500 mb-4">Team Members</h2>
          <div className="space-y-4">
            {project.members.map((member: any, idx: number) => (
              <div key={idx} className="flex justify-between items-center p-3 bg-gray-50 rounded border border-gray-100">
                <span className="font-medium">{member.user.username}</span>
                <span className={`text-xs px-2 py-1 rounded ${member.role === 'PENDING' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}`}>
                  {member.role}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
