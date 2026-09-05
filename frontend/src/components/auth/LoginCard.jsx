import React, { useState } from 'react';
import { LogIn, Eye, EyeOff, MessageSquare, ArrowRight, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

export const LoginCard = ({ onSwitchToRegister }) => {
  const [usernameOrEmail, setUsernameOrEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const { login, loading, error, setError } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!usernameOrEmail.trim() || !password) return;
    await login(usernameOrEmail.trim(), password);
  };

  const fillDemo = (username, pass) => {
    setUsernameOrEmail(username);
    setPassword(pass);
    setError(null);
  };

  return (
    <div className="w-full max-w-md p-8 rounded-3xl glass-panel shadow-2xl animate-fade-in relative overflow-hidden">
      {/* Glow effect */}
      <div className="absolute -top-24 -right-24 w-48 h-48 bg-brand-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-lg shadow-brand-500/30 ring-4 ring-brand-500/10">
          <MessageSquare className="w-6 h-6" />
        </div>
        <div>
          <h2 className="text-xl font-extrabold text-slate-800 dark:text-white tracking-tight">
            PulseChat
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Sign in to continue real-time messaging
          </p>
        </div>
      </div>

      {/* Error Banner */}
      {error && (
        <div className="mb-4 p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 text-rose-600 dark:text-rose-400 text-xs border border-rose-200 dark:border-rose-900/50 flex items-center gap-2">
          <span>{error}</span>
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-xs font-semibold text-slate-600 dark:text-slate-300 mb-1.5">
            Username or Email
          </label>
          <input
            type="text"
            required
            value={usernameOrEmail}
            onChange={(e) => setUsernameOrEmail(e.target.value)}
            placeholder="e.g. alex or alex@example.com"
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
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
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
              <span>Sign In</span>
              <ArrowRight className="w-4 h-4" />
            </>
          )}
        </button>
      </form>

      {/* Demo Credentials Quick Fill */}
      <div className="mt-6 pt-5 border-t border-slate-200/80 dark:border-white/5">
        <div className="flex items-center gap-1.5 text-xs text-slate-400 mb-2 font-medium">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>Quick Demo Testing (Auto-fill)</span>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={() => fillDemo('alice', 'Password123!')}
            className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-dark-800/80 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 font-medium transition-colors text-left"
          >
            👤 User: <strong>alice</strong>
          </button>
          <button
            type="button"
            onClick={() => fillDemo('bob', 'Password123!')}
            className="px-3 py-2 rounded-xl text-xs bg-slate-100 dark:bg-dark-800/80 hover:bg-slate-200 dark:hover:bg-dark-700 text-slate-700 dark:text-slate-300 font-medium transition-colors text-left"
          >
            👤 User: <strong>bob</strong>
          </button>
        </div>
      </div>

      {/* Switch to Register */}
      <div className="mt-6 text-center text-xs text-slate-500 dark:text-slate-400">
        Don't have an account yet?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-brand-600 dark:text-brand-400 font-semibold hover:underline"
        >
          Create one now
        </button>
      </div>
    </div>
  );
};
