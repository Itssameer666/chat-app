import React from 'react';

export const Avatar = ({ name = 'User', avatarUrl, size = 'md', status, showStatus = false }) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-10 h-10 text-sm',
    lg: 'w-12 h-12 text-base',
    xl: 'w-16 h-16 text-lg',
  };

  const statusSizeClasses = {
    sm: 'w-2.5 h-2.5 right-0 bottom-0',
    md: 'w-3 h-3 right-0 bottom-0',
    lg: 'w-3.5 h-3.5 right-0.5 bottom-0.5',
    xl: 'w-4 h-4 right-1 bottom-1',
  };

  const initials = name
    ? name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase()
    : 'U';

  const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(name || 'user')}`;
  const src = avatarUrl || defaultAvatar;

  const isOnline = status === 'ONLINE';

  return (
    <div className="relative inline-flex flex-shrink-0">
      <img
        src={src}
        alt={name}
        className={`${sizeClasses[size] || sizeClasses.md} rounded-2xl object-cover ring-2 ring-white/10 shadow-sm bg-gradient-to-tr from-brand-600 to-indigo-400`}
        onError={(e) => {
          e.target.onerror = null;
          e.target.src = defaultAvatar;
        }}
      />
      {showStatus && (
        <span
          className={`absolute rounded-full ring-2 ring-white dark:ring-dark-900 ${
            statusSizeClasses[size] || statusSizeClasses.md
          } ${isOnline ? 'bg-emerald-500 shadow-sm shadow-emerald-500/50 animate-pulse-subtle' : 'bg-slate-400'}`}
          title={isOnline ? 'Online' : 'Offline'}
        />
      )}
    </div>
  );
};
