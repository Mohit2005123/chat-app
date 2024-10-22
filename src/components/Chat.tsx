'use client'

import React, { useState, useEffect, useRef } from 'react';
import { database, auth, getConversationId } from '../lib/firebase';
import { ref, push, onChildAdded, DataSnapshot } from 'firebase/database';
import { useAuthState } from 'react-firebase-hooks/auth';

interface Message {
  id: string;
  text: string;
  senderId: string;
  timestamp: number;
}

interface ChatProps {
  recipient: any | null;
}

const Chat: React.FC<ChatProps> = ({ recipient }) => {
  const [user] = useAuthState(auth);
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user && recipient) {
      const conversationId = getConversationId(user.uid, recipient.uid);
      const messagesRef = ref(database, `privateMessages/${conversationId}`);
      setMessages([]);
      const unsubscribe = onChildAdded(messagesRef, (snapshot: DataSnapshot) => {
        const data = snapshot.val();
        const newMessage: Message = {
          id: snapshot.key as string,
          text: data.text,
          senderId: data.senderId,
          timestamp: data.timestamp,
        };
        setMessages((prevMessages) => [...prevMessages, newMessage]);
      });

      return () => {
        unsubscribe();
      };
    }
  }, [user, recipient]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && user && recipient) {
      const conversationId = getConversationId(user.uid, recipient.uid);
      const messagesRef = ref(database, `privateMessages/${conversationId}`);
      push(messagesRef, {
        text: message,
        senderId: user.uid,
        timestamp: Date.now(),
      });
      setMessage('');
    }
  };

  if (!user || !recipient) {
    return <div>Please sign in and select a user to chat with.</div>;
  }

  return (
    <div className="flex flex-col h-[calc(100vh-64px)]">
      <div className="bg-gray-200 p-4">
        <h2 className="text-xl font-bold">Chat with {recipient.displayName}</h2>
      </div>
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`p-2 rounded-lg ${
              msg.senderId === user.uid ? 'bg-blue-100 ml-auto' : 'bg-gray-100'
            } max-w-[70%]`}
          >
            <p>{msg.text}</p>
            <p className="text-xs text-gray-500">
              {new Date(msg.timestamp).toLocaleString()}
            </p>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={handleSubmit} className="p-4 bg-gray-200">
        <div className="flex">
          <input
            type="text"
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder="Type a message"
            className="flex-1 p-2 border rounded-l"
            required
          />
          <button type="submit" className="bg-blue-500 text-white p-2 rounded-r">
            Send
          </button>
        </div>
      </form>
    </div>
  );
};

export default Chat;