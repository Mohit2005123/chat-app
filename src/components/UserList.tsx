'use client'

import React, { useState, useEffect } from 'react';
import { getUsers } from '../lib/firebase';
import { User } from 'firebase/auth';

interface UserListProps {
  currentUser: User | null;
  onSelectUser: (user: any) => void;
}

const UserList: React.FC<UserListProps> = ({ currentUser, onSelectUser }) => {
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const fetchedUsers = await getUsers();
      console.log(fetchedUsers);
      setUsers(fetchedUsers.filter(user => user.uid !== currentUser?.uid));
    };
    fetchUsers();
  }, [currentUser]);

  return (
    <div className="bg-gray-100 p-4 rounded-lg">
      <h2 className="text-xl font-bold mb-4">Users</h2>
      <ul className="space-y-2">
        {users.map(user => (
          <li key={user.uid} className="flex items-center space-x-2">
            <img src={user.photoURL} alt={user.displayName} className="w-8 h-8 rounded-full" />
            <span>{user.displayName}</span>
            <button
              onClick={() => onSelectUser(user)}
              className="bg-blue-500 text-white px-2 py-1 rounded text-sm"
            >
              Chat
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;