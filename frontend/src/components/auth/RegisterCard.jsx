import React, { useState } from 'react';
import { UserPlus, Eye, EyeOff, MessageSquare, ArrowRight } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { Avatar } from '../common/Avatar';

const AVATAR_SEEDS = ['Felix', 'Aneka', 'Mittens', 'Coco', 'Shadow', 'Oliver'];

export const RegisterCard = ({ onSwitchToLogin }) => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [selectedSeed, setSelectedSeed] = useState(AVATAR_SEEDS[0]);
  const [showPassword, setShowPassword] = useState(false);
  const { register, loading, error } = useAuth();

  const avatarUrl = `https://api.dicebear.com/7.x/bottts/svg?seed=${selectedSeed}`;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !email.trim() || !password) return;
    await register(username.trim().toLowerCase(), email.trim().toLowerCase(), password, avatarUrl);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl glass-panel shadow-2xl animate-fade-in relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-24 -left-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/10">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            Create Account
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Join PulseChat for real-time discussions
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-900/50 flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Avatar Picker */}
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-2">
            Choose Your Avatar
          </label>
          <div className="flex items-center gap-2.5 overflow-x-auto pb-1">
            {AVATAR_SEEDS.map((seed) => {
              const url = `https://api.dicebear.com/7.x/bottts/svg?seed=${seed}`;
              const isSelected = selectedSeed === seed;
              return (
                <button
                  type="button"
                  key={seed}
                  onClick={() => setSelectedSeed(seed)}
                  className={`p-1 rounded-2xl transition-all ${
                    isSelected
                      ? 'ring-2 ring-brand-500 scale-110 shadow-md shadow-brand-500/30'
                      : 'opacity-60 hover:opacity-100'
                  }`}
                >
                  <Avatar name={seed} avatarUrl={url} size="sm" />
                </button>
              );
            })}
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Username
          </label>
          <input
            type="text"
            required
            minLength={3}
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            placeholder="e.g. john_doe"
            className="w-full py-2.5 px-4 text-sm rounded-xl glass-input text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Email Address
          </label>
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="e.g. john@example.com"
            className="w-full py-2.5 px-4 text-sm rounded-xl glass-input text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
              className="w-full py-2.5 pl-4 pr-10 text-sm rounded-xl glass-input text-slate-800 dark:text-slate-100 placeholder-slate-400 focus:outline-none transition-all"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-500 hover:to-indigo-500 text-white font-semibold text-sm shadow-lg shadow-brand-500/25 flex items-center justify-center gap-2 transition-all active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
        >
          {loading ? (
            <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Sign Up</span>
            </>
          )}
        </button>
      </form>

      {/* Switch to Login */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Already have an account?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
        >
          Sign in
        </button>
      </div>
    </div>
  );
};
