'use client'

import { useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../lib/firebase';
import Auth from '../components/Auth';
import UserList from '../components/UserList';
import Chat from '../components/Chat';

export default function Home() {
  const [user] = useAuthState(auth);
  const [selectedUser, setSelectedUser] = useState<any | null>(null);

  return (
    <main className="flex flex-col min-h-screen">
      <header className="bg-gray-800 text-white p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold">Private Chat App</h1>
          <Auth />
        </div>
      </header>
      {user && (
        <div className="flex flex-1">
          <div className="w-1/4 p-4">
            <UserList currentUser={user} onSelectUser={setSelectedUser} />
          </div>
          <div className="w-3/4">
            <Chat recipient={selectedUser} />
          </div>
        </div>
      )}
    </main>
  );
}