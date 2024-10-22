'use client'

import React from 'react';
import { auth, createUserInDatabase } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useAuthState } from 'react-firebase-hooks/auth';

const Auth: React.FC = () => {
  const [user] = useAuthState(auth);

  const signIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      if (result.user) {
        await createUserInDatabase(result.user);
      }
    } catch (error) {
      console.error('Error signing in:', error);
    }
  };

  const signOut = () => {
    auth.signOut();
  };

  if (user) {
    return (
      <div className="flex items-center space-x-4">
        <img src={user.photoURL || undefined} alt="Profile" className="w-8 h-8 rounded-full" />
        <span>{user.displayName}</span>
        <button onClick={signOut} className="bg-red-500 text-white px-4 py-2 rounded">Sign Out</button>
      </div>
    );
  }

  return (
    <button onClick={signIn} className="bg-blue-500 text-white px-4 py-2 rounded">
      Sign In with Google
    </button>
  );
};

export default Auth;