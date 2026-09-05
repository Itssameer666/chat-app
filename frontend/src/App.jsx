import React, { useState, useEffect } from 'react';
import { useAuth } from './context/AuthContext';
import { useChatSocket } from './hooks/useChatSocket';
import { LoginCard } from './components/auth/LoginCard';
import { RegisterCard } from './components/auth/RegisterCard';
import { Sidebar } from './components/chat/Sidebar';
import { ChatArea } from './components/chat/ChatArea';
import axiosClient from './api/axiosClient';

export function ChatApp() {
  const { currentUser, token, isAuthenticated, logout } = useAuth();
  const [authView, setAuthView] = useState('login'); // 'login' | 'register'
  
  // Active selected conversation (Default to Public General Lounge)
  const [activeChat, setActiveChat] = useState({ isPublic: true, username: 'General Lounge' });
  const [contacts, setContacts] = useState([]);
  const [mobileChatOpen, setMobileChatOpen] = useState(false);

  // Initialize real-time WebSocket connection hook
  const socket = useChatSocket(currentUser, token);

  // Fetch all registered users from backend to populate contact list
  const fetchContacts = async () => {
    if (!isAuthenticated) return;
    try {
      const res = await axiosClient.get('/api/users');
      // Filter out current user from contacts list
      const list = res.data.filter((u) => u.username !== currentUser?.username);
      setContacts(list);
    } catch (err) {
      console.error('Failed to fetch contacts:', err);
    }
  };

  useEffect(() => {
    if (isAuthenticated) {
      fetchContacts();
    }
  }, [isAuthenticated, currentUser?.username]);

  // Handle selecting a chat from the sidebar
  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    setMobileChatOpen(true);
  };

  // If not logged in, render Modern Glassmorphism Auth Screen
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center p-4 bg-gradient-to-br from-slate-100 via-indigo-50/50 to-slate-200 dark:from-[#090d16] dark:via-[#0f172a] dark:to-[#070a10] relative overflow-hidden transition-colors">
        {/* Abstract background glowing shapes */}
        <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-brand-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />
        <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-indigo-500/15 rounded-full blur-3xl pointer-events-none animate-pulse-subtle" />

        <div className="w-full max-w-md z-10">
          {authView === 'login' ? (
            <LoginCard onSwitchToRegister={() => setAuthView('register')} />
          ) : (
            <RegisterCard onSwitchToLogin={() => setAuthView('login')} />
          )}
        </div>
      </div>
    );
  }

  // Authenticated 2-Panel Layout
  return (
    <div className="h-screen w-screen flex overflow-hidden bg-slate-50 dark:bg-[#0b0f19]">
      {/* Left Sidebar: hidden on small screens if a chat is active */}
      <div
        className={`${
          mobileChatOpen ? 'hidden md:flex' : 'flex'
        } w-full md:w-auto h-full flex-shrink-0`}
      >
        <Sidebar
          currentUser={currentUser}
          contacts={contacts}
          activeChat={activeChat}
          onSelectChat={handleSelectChat}
          onLogout={logout}
          socket={socket}
        />
      </div>

      {/* Right Main Chat Area: hidden on small screens if no active chat selected */}
      <div
        className={`${
          !mobileChatOpen ? 'hidden md:flex' : 'flex'
        } flex-1 h-full overflow-hidden`}
      >
        <ChatArea
          activeChat={activeChat}
          currentUser={currentUser}
          socket={socket}
          onBackClick={() => setMobileChatOpen(false)}
        />
      </div>
    </div>
  );
}

export default function App() {
  return <ChatApp />;
}
