'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';
import { useForm } from 'react-hook-form';

export default function Profile() {
  const [loading, setLoading] = useState(true);
  const [success, setSuccess] = useState(false);
  const { register, handleSubmit, setValue } = useForm();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/profiles/me', {
        headers: { Authorization: `Bearer ${token}` }
      });
      const data = res.data.user.profile || {};
      setValue('bio', data.bio || '');
      setValue('education', data.education || '');
      setValue('experience', data.experience || '');
      setValue('github', data.github || '');
      setValue('skills', data.skills?.join(', ') || '');
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const onSubmit = async (data: any) => {
    try {
      setSuccess(false);
      const token = localStorage.getItem('token');
      // convert skills string to array
      const payload = {
        ...data,
        skills: data.skills.split(',').map((s: string) => s.trim()).filter(Boolean)
      };
      await axios.put('http://localhost:5000/api/profiles', payload, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSuccess(true);
    } catch (error) {
      console.error(error);
    }
  };

  if (loading) return <div className="p-8">Loading profile...</div>;

  return (
    <div className="min-h-screen bg-gray-50 p-8 flex justify-center">
      <div className="card w-full max-w-2xl p-8 bg-white">
        <h1 className="text-3xl font-bold text-navy-500 mb-6">Edit Profile</h1>
        
        {success && <div className="bg-green-100 text-green-700 p-3 rounded mb-4">Profile updated successfully!</div>}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Bio / About Me</label>
            <textarea 
              {...register('bio')} 
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-navy-500"
              placeholder="Tell others about your engineering interests..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Skills (comma separated)</label>
            <input 
              {...register('skills')} 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-navy-500"
              placeholder="React, Python, CAD, Robotics..."
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Education / Major</label>
            <input 
              {...register('education')} 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-navy-500"
              placeholder="BSc Software Engineering"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">GitHub Profile Link</label>
            <input 
              {...register('github')} 
              className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-navy-500"
              placeholder="https://github.com/..."
            />
          </div>

          <div className="flex justify-end pt-4">
            <button type="submit" className="btn-primary px-8">Save Profile</button>
          </div>
        </form>
      </div>
    </div>
  );
}
