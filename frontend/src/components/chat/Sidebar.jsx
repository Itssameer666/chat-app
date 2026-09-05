import React, { useState } from 'react';
import {
  Search,
  LogOut,
  Moon,
  Sun,
  Hash,
  Users,
  Wifi,
  WifiOff,
  UserCheck,
} from 'lucide-react';
import { Avatar } from '../common/Avatar';
import { useTheme } from '../../context/ThemeContext';

export const Sidebar = ({
  currentUser,
  contacts,
  activeChat,
  onSelectChat,
  onLogout,
  socket,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const { isDarkMode, toggleTheme } = useTheme();

  // Filter contacts by search query
  const filteredContacts = contacts.filter((c) =>
    c.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const isPublicActive = activeChat?.isPublic;

  return (
    <aside className="w-full md:w-80 lg:w-96 h-full flex flex-col bg-white dark:bg-dark-900 border-r border-slate-200/80 dark:border-white/5 transition-colors">
      {/* 1. Profile Header */}
      <div className="p-4 border-b border-slate-200/80 dark:border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Avatar
            name={currentUser?.username}
            avatarUrl={currentUser?.avatarUrl}
            status="ONLINE"
            showStatus={true}
            size="md"
          />
          <div className="min-w-0">
            <h1 className="text-sm font-bold text-slate-800 dark:text-slate-100 truncate">
              {currentUser?.username}
            </h1>
            <p className="text-xs text-emerald-500 font-medium flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Online
            </p>
          </div>
        </div>

        {/* Action icons */}
        <div className="flex items-center gap-1">
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
            title={isDarkMode ? 'Switch to Light mode' : 'Switch to Dark mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            onClick={onLogout}
            className="p-2 rounded-xl text-slate-500 dark:text-slate-400 hover:text-rose-600 dark:hover:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors"
            title="Log out"
          >
            <LogOut className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. Search Bar */}
      <div className="p-3">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search conversations..."
            className="w-full pl-9 pr-4 py-2 text-xs rounded-xl bg-slate-100 dark:bg-dark-800 text-slate-800 dark:text-slate-100 placeholder-slate-400 dark:placeholder-slate-500 border border-transparent focus:border-brand-500/50 focus:bg-white dark:focus:bg-dark-800 focus:outline-none transition-all shadow-inner"
          />
        </div>
      </div>

      {/* 3. Channels & Contacts List */}
      <div className="flex-1 overflow-y-auto px-2 space-y-1 pb-4">
        {/* Pinned Public Channel */}
        <div className="px-2 pt-2 pb-1">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Channels
          </span>
        </div>

        <button
          type="button"
          onClick={() => onSelectChat({ isPublic: true, username: 'General Lounge' })}
          className={`w-full p-2.5 rounded-2xl flex items-center gap-3 text-left transition-all ${
            isPublicActive
              ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-500/20 shadow-sm'
              : 'hover:bg-slate-100 dark:hover:bg-dark-800/60 text-slate-700 dark:text-slate-200'
          }`}
        >
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm flex-shrink-0">
            <Hash className="w-5 h-5" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold truncate">General Lounge</span>
              <span className="text-[10px] text-slate-400">Public</span>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
              Broadcast chat with all members
            </p>
          </div>
        </button>

        {/* Direct Contacts Section */}
        <div className="px-2 pt-4 pb-1 flex items-center justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 dark:text-slate-500">
            Direct Messages ({filteredContacts.length})
          </span>
          <Users className="w-3.5 h-3.5 text-slate-400" />
        </div>

        {filteredContacts.length === 0 ? (
          <div className="py-8 text-center text-xs text-slate-400 dark:text-slate-500">
            {searchQuery ? 'No contacts match your search.' : 'No other users registered yet.'}
          </div>
        ) : (
          filteredContacts.map((contact) => {
            const isSelected = !isPublicActive && activeChat?.username === contact.username;
            const isOnline = socket.onlineUsers.has(contact.username) || contact.status === 'ONLINE';

            return (
              <button
                key={contact.id || contact.username}
                type="button"
                onClick={() => onSelectChat(contact)}
                className={`w-full p-2.5 rounded-2xl flex items-center gap-3 text-left transition-all ${
                  isSelected
                    ? 'bg-brand-50 dark:bg-brand-950/50 text-brand-600 dark:text-brand-400 border border-brand-200/60 dark:border-brand-500/20 shadow-sm'
                    : 'hover:bg-slate-100 dark:hover:bg-dark-800/60 text-slate-700 dark:text-slate-200'
                }`}
              >
                <Avatar
                  name={contact.username}
                  avatarUrl={contact.avatarUrl}
                  status={isOnline ? 'ONLINE' : 'OFFLINE'}
                  showStatus={true}
                  size="md"
                />

                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-semibold truncate text-slate-800 dark:text-slate-100">
                      {contact.username}
                    </span>
                    {isOnline && (
                      <span className="text-[10px] font-semibold text-emerald-500 px-1.5 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/40">
                        Online
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                    {contact.email}
                  </p>
                </div>
              </button>
            );
          })
        )}
      </div>

      {/* 4. Real-time Broker Status Indicator */}
      <div className="p-3 border-t border-slate-200/80 dark:border-white/5 bg-slate-50/70 dark:bg-dark-950/40 flex items-center justify-between text-xs">
        <div className="flex items-center gap-2 text-slate-600 dark:text-slate-400">
          {socket.connected ? (
            <>
              <Wifi className="w-3.5 h-3.5 text-emerald-500" />
              <span>STOMP Connected</span>
            </>
          ) : (
            <>
              <WifiOff className="w-3.5 h-3.5 text-amber-500 animate-pulse" />
              <span>Connecting to broker...</span>
            </>
          )}
        </div>
        <span className="text-[10px] text-slate-400">Port 8080</span>
      </div>
    </aside>
  );
};
