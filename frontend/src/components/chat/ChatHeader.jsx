import React from 'react';
import { Phone, Video, Search, MoreVertical, ArrowLeft, Hash, ShieldCheck } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const ChatHeader = ({ activeChat, isOnline, onBackClick }) => {
  const isPublic = activeChat?.isPublic;

  return (
    <div className="h-16 px-4 md:px-6 flex items-center justify-between border-b border-slate-200/80 dark:border-white/5 bg-white/80 dark:bg-dark-900/80 backdrop-blur-md z-10">
      <div className="flex items-center gap-3">
        {/* Mobile back button */}
        <button
          onClick={onBackClick}
          className="md:hidden p-2 -ml-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-dark-800 transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {isPublic ? (
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-sm ring-2 ring-brand-500/20">
            <Hash className="w-5 h-5" />
          </div>
        ) : (
          <Avatar
            name={activeChat?.username || 'User'}
            avatarUrl={activeChat?.avatarUrl}
            status={isOnline ? 'ONLINE' : 'OFFLINE'}
            showStatus={true}
            size="md"
          />
        )}

        <div>
          <div className="flex items-center gap-1.5">
            <h2 className="text-sm md:text-base font-bold text-slate-800 dark:text-slate-100 leading-tight">
              {isPublic ? 'General Lounge' : activeChat?.username}
            </h2>
            {!isPublic && <ShieldCheck className="w-3.5 h-3.5 text-brand-500" title="Verified Member" />}
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-tight">
            {isPublic ? (
              'Public broadcast channel • All members'
            ) : isOnline ? (
              <span className="text-emerald-500 font-medium flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> Active now
              </span>
            ) : (
              'Offline'
            )}
          </p>
        </div>
      </div>

      {/* Action icons */}
      <div className="flex items-center gap-1 text-slate-500 dark:text-slate-400">
        <button
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Start voice call (Demo)"
        >
          <Phone className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Start video call (Demo)"
        >
          <Video className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Search conversation"
        >
          <Search className="w-4 h-4" />
        </button>
        <button
          className="p-2 rounded-xl hover:bg-slate-100 dark:hover:bg-dark-800 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
          title="Conversation options"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
