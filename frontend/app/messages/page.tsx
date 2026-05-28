'use client';

import { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { io, Socket } from 'socket.io-client';

export default function Messages() {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [currentMessage, setCurrentMessage] = useState('');
  // In a full implementation, we would have a sidebar with contacts.
  // For MVP, we are establishing the connection and UI skeleton.
  const [activeContact, setActiveContact] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return window.location.assign('/login');

    const newSocket = io('http://localhost:5000', {
      auth: { token }
    });

    newSocket.on('connect', () => {
      console.log('Connected to chat server');
    });

    newSocket.on('receive_message', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    newSocket.on('message_sent', (message) => {
      setMessages((prev) => [...prev, message]);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentMessage.trim() || !socket || !activeContact) return;

    socket.emit('send_message', {
      receiverId: activeContact,
      content: currentMessage
    });
    
    setCurrentMessage('');
  };

  return (
    <div className="h-screen bg-gray-50 flex p-8">
      <div className="card bg-white flex w-full max-w-6xl mx-auto overflow-hidden">
        
        {/* Contacts Sidebar */}
        <div className="w-1/3 border-r border-gray-200 bg-gray-50 flex flex-col">
          <div className="p-4 border-b border-gray-200 bg-white">
            <h2 className="text-xl font-bold text-navy-500">Conversations</h2>
          </div>
          <div className="flex-1 overflow-y-auto p-4">
            <p className="text-gray-500 text-sm text-center mt-10">Select a contact to start messaging (Requires User Discovery Implementation)</p>
            {/* Example static contact for UI demonstration */}
            <div 
              onClick={() => setActiveContact('example-id')}
              className={`p-3 rounded cursor-pointer mt-4 ${activeContact === 'example-id' ? 'bg-blue-100' : 'bg-white border border-gray-200 hover:bg-gray-100'}`}
            >
              <h4 className="font-bold text-gray-800">Engineering Team Alpha</h4>
              <p className="text-xs text-gray-500 truncate">Project discussion group</p>
            </div>
          </div>
        </div>

        {/* Chat Area */}
        <div className="w-2/3 flex flex-col">
          {activeContact ? (
            <>
              <div className="p-4 border-b border-gray-200 bg-white shadow-sm z-10">
                <h3 className="font-bold text-navy-600">Active Chat</h3>
              </div>
              
              <div className="flex-1 overflow-y-auto p-6 bg-gray-50 flex flex-col gap-3">
                {messages.length === 0 ? (
                  <p className="text-center text-gray-400 mt-20">No messages yet. Say hello!</p>
                ) : (
                  messages.map((msg, idx) => (
                    <div key={idx} className={`max-w-[70%] p-3 rounded-lg ${msg.sender_id === activeContact ? 'bg-white border border-gray-200 self-start' : 'bg-navy-500 text-white self-end'}`}>
                      {msg.content}
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="p-4 bg-white border-t border-gray-200">
                <form onSubmit={sendMessage} className="flex gap-2">
                  <input 
                    type="text" 
                    value={currentMessage}
                    onChange={(e) => setCurrentMessage(e.target.value)}
                    className="flex-1 border border-gray-300 rounded px-4 py-2 focus:outline-none focus:ring-2 focus:ring-navy-500"
                    placeholder="Type a message..."
                  />
                  <button type="submit" className="btn-primary px-6">Send</button>
                </form>
              </div>
            </>
          ) : (
            <div className="flex-1 flex items-center justify-center bg-gray-50">
              <div className="text-center">
                <h3 className="text-2xl font-bold text-navy-500 mb-2">Welcome to Realtime Chat</h3>
                <p className="text-gray-500">Select a conversation from the sidebar to begin.</p>
              </div>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}
