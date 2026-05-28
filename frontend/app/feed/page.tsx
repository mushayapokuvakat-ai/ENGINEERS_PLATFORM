'use client';

import { useState, useEffect } from 'react';
import axios from 'axios';

export default function Feed() {
  const [posts, setPosts] = useState([]);
  const [content, setContent] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const token = localStorage.getItem('token');
      const res = await axios.get('http://localhost:5000/api/posts', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setPosts(res.data.posts);
    } catch (error) {
      console.error(error);
    }
  };

  const submitPost = async (e: any) => {
    e.preventDefault();
    if (!content.trim()) return;
    try {
      const token = localStorage.getItem('token');
      await axios.post('http://localhost:5000/api/posts', { content }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setContent('');
      fetchPosts();
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-2xl mx-auto">
        <h1 className="text-3xl font-bold text-navy-500 mb-6">Engineering Feed</h1>
        
        <div className="card p-4 bg-white mb-8">
          <form onSubmit={submitPost}>
            <textarea 
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="w-full border border-gray-200 rounded p-3 mb-3 focus:ring-navy-500" 
              placeholder="Share a technical update, ask a question, or find teammates..."
              rows={3}
            />
            <div className="flex justify-end">
              <button type="submit" className="btn-primary">Post Update</button>
            </div>
          </form>
        </div>

        <div className="space-y-6">
          {posts.map((post: any) => (
            <div key={post.id} className="card p-6 bg-white">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-navy-500 rounded-full flex justify-center items-center text-white font-bold">
                  {post.author.username[0].toUpperCase()}
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{post.author.username}</h4>
                  <p className="text-xs text-gray-500">{new Date(post.created_at).toLocaleDateString()}</p>
                </div>
              </div>
              <p className="text-gray-700 whitespace-pre-wrap mb-4">{post.content}</p>
              
              <div className="border-t border-gray-100 pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-2">{post.comments.length} Comments</p>
                {post.comments.map((comment: any) => (
                  <div key={comment.id} className="bg-gray-50 p-3 rounded mb-2 text-sm">
                    <span className="font-bold mr-2">{comment.author.username}:</span>
                    {comment.content}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
