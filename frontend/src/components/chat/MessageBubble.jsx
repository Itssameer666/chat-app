import React from 'react';
import { Check, CheckCheck } from 'lucide-react';
import { Avatar } from '../common/Avatar';

export const MessageBubble = ({ message, isMe, showAvatar = false }) => {
  const isJoinOrLeave = message.messageType === 'JOIN' || message.messageType === 'LEAVE';

  if (isJoinOrLeave) {
    return (
      <div className="flex justify-center my-3 animate-fade-in">
        <span className="text-xs px-3 py-1 rounded-full bg-slate-200/70 dark:bg-dark-800/80 text-slate-600 dark:text-slate-400 border border-slate-300/40 dark:border-white/5">
          {message.content}
        </span>
      </div>
    );
  }

  // Format timestamp (e.g., 9:42 PM)
  const formatTime = (ts) => {
    if (!ts) return '';
    try {
      const date = new Date(ts);
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    } catch {
      return '';
    }
  };

  return (
    <div className={`flex items-end gap-2.5 my-1.5 ${isMe ? 'justify-end' : 'justify-start'} animate-fade-in group`}>
      {!isMe && showAvatar && (
        <Avatar name={message.sender} size="sm" />
      )}
      
      <div className={`flex flex-col max-w-[78%] md:max-w-[65%] ${isMe ? 'items-end' : 'items-start'}`}>
        {!isMe && (
          <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1 ml-1">
            {message.sender}
          </span>
        )}

        <div
          className={`relative px-4 py-2.5 rounded-2xl shadow-sm text-sm leading-relaxed break-words ${
            isMe
              ? 'bg-gradient-to-r from-brand-600 to-indigo-600 text-white rounded-br-xs shadow-brand-500/10'
              : 'bg-white dark:bg-dark-800 text-slate-800 dark:text-slate-100 rounded-bl-xs border border-slate-200/80 dark:border-white/5 shadow-slate-200/50 dark:shadow-none'
          }`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>

          <div
            className={`flex items-center justify-end gap-1 mt-1 text-[10px] select-none ${
              isMe ? 'text-white/80' : 'text-slate-400 dark:text-slate-500'
            }`}
          >
            <span>{formatTime(message.timestamp)}</span>
            {isMe && (
              <CheckCheck className="w-3.5 h-3.5 text-white/90" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
