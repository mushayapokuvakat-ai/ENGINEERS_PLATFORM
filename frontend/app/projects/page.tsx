'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Projects() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/projects', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setProjects(res.data.projects);
    } catch (error) {
      console.error('Error fetching projects', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <header className="flex justify-between items-center mb-8 max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-500">Active Projects</h1>
        <button className="btn-primary" onClick={() => window.location.href='/projects/create'}>
          Create Project
        </button>
      </header>

      <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
        {loading ? (
          <p>Loading projects...</p>
        ) : projects.length === 0 ? (
          <p className="text-gray-500">No projects available right now. Be the first to create one!</p>
        ) : (
          projects.map((project: any) => (
            <div key={project.id} className="card p-6 bg-white flex flex-col justify-between">
              <div>
                <h3 className="text-xl font-bold text-navy-600 mb-2">{project.title}</h3>
                <p className="text-gray-600 mb-4 line-clamp-3">{project.description}</p>
                
                <div className="flex flex-wrap gap-2 mb-4">
                  <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Status: {project.status}</span>
                  <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Members: {project._count.members}/5</span>
                </div>
              </div>
              
              <div className="mt-4 pt-4 border-t border-gray-100 flex justify-between items-center">
                <span className="text-sm text-gray-500">By {project.creator.username}</span>
                <a href={`/projects/${project.id}`} className="text-navy-500 font-medium hover:underline">
                  View Details
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
