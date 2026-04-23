'use client';

import { useState } from 'react';

interface LoginModalProps {
  onClose: () => void;
  onSuccess: () => void;
}

export default function LoginModal({ onClose, onSuccess }: LoginModalProps) {
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await fetch('/api/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
      });

      if (res.ok) {
        onSuccess();
      } else {
        const data = await res.json();
        setError(data.error || 'Login failed');
      }
    } catch {
      setError('Connection error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/10 backdrop-blur-xl" onClick={(e) => e.target === e.currentTarget && onClose()}>
      <div className="w-full max-w-sm overflow-hidden glass shadow-[0_20px_50px_rgba(0,0,0,0.15)] rounded-[32px] border border-black/[0.03]">
        <div className="px-8 py-8 text-center">
          <div className="flex items-center justify-center w-20 h-20 mx-auto mb-8 bg-accent/10 rounded-[28px] shadow-inner">
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" className="text-accent" strokeWidth="2.5">
              <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
              <path d="M7 11V7a5 5 0 0110 0v4"/>
            </svg>
          </div>
          <h2 className="text-3xl font-black tracking-tight text-gray-900">Admin Login</h2>
          <p className="mt-3 text-sm font-semibold text-gray-400">Enter the master password to access calendar management.</p>
          
          <form onSubmit={handleSubmit} className="mt-8 space-y-4">
            <input
              type="password"
              placeholder="••••••••"
              className="w-full px-6 py-5 text-center text-2xl font-black tracking-[0.3em] text-gray-800 transition-all border border-black/[0.03] bg-white/40 rounded-2xl focus:bg-white focus:ring-8 focus:ring-accent/5 focus:border-accent outline-none backdrop-blur-md"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
            />
            {error && <p className="text-xs font-bold text-red-500">{error}</p>}
            
            <div className="flex gap-3 pt-2">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-6 py-3.5 text-sm font-bold text-gray-400 transition-colors hover:text-gray-600"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-3 px-8 py-4 text-sm font-black text-white bg-accent rounded-2xl hover:bg-accent-hover shadow-xl shadow-accent/20 transition-all flex items-center justify-center gap-3 grow"
              >
                {loading ? <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : null}
                Sign In
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
