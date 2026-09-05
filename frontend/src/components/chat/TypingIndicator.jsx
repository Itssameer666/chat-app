import React from 'react';

export const TypingIndicator = ({ username }) => {
  return (
    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400 py-1.5 px-3 rounded-xl bg-slate-100 dark:bg-dark-800/80 w-fit backdrop-blur-sm border border-slate-200 dark:border-white/5 animate-fade-in">
      <div className="flex items-center gap-1">
        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '0ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '150ms' }} />
        <span className="w-1.5 h-1.5 rounded-full bg-brand-500 animate-bounce" style={{ animationDelay: '300ms' }} />
      </div>
      <span className="font-medium text-slate-600 dark:text-slate-300">
        {username ? `${username} is typing...` : 'typing...'}
      </span>
    </div>
  );
};
