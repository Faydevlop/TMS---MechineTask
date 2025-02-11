import withAuth from '@/components/hoc/withAuth';
import Sidebar from '@/components/sidebar_user';
import React, { useState } from 'react';

const Profile = () => {
  const [isEditing, setIsEditing] = useState(false);
  const [user, setUser] = useState({
    name: 'John Doe',
    email: 'john@example.com',
    avatar: 'https://img.freepik.com/premium-vector/default-avatar-profile-icon-social-media-user-image-gray-avatar-icon-blank-profile-silhouette-vector-illustration_561158-3383.jpg?semt=ais_hybrid',
  });

  const handleUpdate = (e) => {
    e.preventDefault();
    alert(' Feature Coming soon ;)')
    setIsEditing(false);
  };

  return (
    <div className="flex min-h-screen w-full bg-white text-black">
      <Sidebar />
      <div className="w-full max-w-md mx-auto py-12 px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center">
          <span className="relative flex shrink-0 overflow-hidden rounded-full mb-4 h-24 w-24">
            <img className="aspect-square h-full w-full" alt="User Avatar" src={user.avatar} />
          </span>
          <div className="space-y-2 text-center">
            <h2 className="text-2xl font-bold">{user.name}</h2>
            <p className="text-gray-500">{user.email}</p>
          </div>
        </div>
        
        {!isEditing ? (
          <div className="mt-8 space-y-4 text-center">
            <button 
              onClick={() => setIsEditing(true)}
              className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
            >
              Update Profile
            </button>
          </div>
        ) : (
          <form onSubmit={handleUpdate} className="mt-8 space-y-4">
            <input 
              type="text" 
              placeholder="Full Name" 
              value={user.name} 
              onChange={(e) => setUser({ ...user, name: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input 
              type="email" 
              placeholder="Email" 
              value={user.email} 
              onChange={(e) => setUser({ ...user, email: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md"
              required
            />
            <input 
              type="url" 
              placeholder="Profile Image URL" 
              value={user.avatar} 
              onChange={(e) => setUser({ ...user, avatar: e.target.value })} 
              className="w-full p-2 border border-gray-300 rounded-md"
            />
            <div className="flex justify-between">
              <button 
                type="submit" 
                className="bg-black text-white rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-800 transition"
              >
                Save Changes
              </button>
              <button 
                type="button" 
                onClick={() => setIsEditing(false)}
                className="bg-gray-300 text-black rounded-md px-4 py-2 text-sm font-medium hover:bg-gray-400 transition"
              >
                Cancel
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};

export default withAuth(Profile);
