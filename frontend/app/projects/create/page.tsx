'use client';

import { useState } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

const projectSchema = z.object({
  title: z.string().min(5, 'Title must be at least 5 characters'),
  description: z.string().min(20, 'Description must be at least 20 characters'),
  github_link: z.string().url().optional().or(z.literal('')),
});

type ProjectForm = z.infer<typeof projectSchema>;

export default function CreateProject() {
  const [error, setError] = useState('');
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ProjectForm>({
    resolver: zodResolver(projectSchema)
  });

  const onSubmit = async (data: ProjectForm) => {
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/projects', data, {
        headers: { Authorization: `Bearer ${token}` }
      });
      window.location.href = '/projects';
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to create project');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="card w-full max-w-2xl p-8 bg-white">
        <h1 className="text-3xl font-bold text-navy-500 mb-6">Start a New Project</h1>
        
        {error && <div className="bg-red-100 text-red-700 p-3 rounded mb-4">{error}</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Project Title</label>
            <input 
              {...register('title')} 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-navy-500"
              placeholder="e.g. Smart Water Management System"
            />
            {errors.title && <p className="text-red-500 text-xs mt-1">{errors.title.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Description & Requirements</label>
            <textarea 
              {...register('description')} 
              rows={5}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-navy-500"
              placeholder="Describe the project, goals, and what technical skills you are looking for in teammates..."
            />
            {errors.description && <p className="text-red-500 text-xs mt-1">{errors.description.message}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Repository (Optional)</label>
            <input 
              {...register('github_link')} 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-navy-500"
              placeholder="https://github.com/..."
            />
            {errors.github_link && <p className="text-red-500 text-xs mt-1">{errors.github_link.message}</p>}
          </div>

          <div className="flex justify-end gap-4 mt-8">
            <button type="button" className="px-4 py-2 text-gray-600 hover:text-gray-800" onClick={() => window.history.back()}>
              Cancel
            </button>
            <button type="submit" disabled={isSubmitting} className="btn-primary">
              {isSubmitting ? 'Creating...' : 'Create Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
