import React, { useState } from 'react';
import { X, Mail, Lock, AlertCircle, Check } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const { signIn, signUp } = useAuth();

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccess(null);

    try {
      if (mode === 'signin') {
        const { error } = await signIn(email, password);
        if (error) throw error;
        onClose();
      } else {
        const { error } = await signUp(email, password);
        if (error) throw error;
        setSuccess('Registrasi berhasil! Silakan cek email untuk verifikasi.');
      }
    } catch (err: any) {
      setError(err.message || 'Terjadi kesalahan');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-md bg-bg-surface border border-accent-primary/30 rounded-md p-6">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-text-muted hover:text-text-primary"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-h2 text-text-primary">
            {mode === 'signin' ? 'Sign In' : 'Create Account'}
          </h2>
          <p className="text-small text-text-secondary mt-1">
            {mode === 'signin' 
              ? 'Masuk ke akun Kalsh Core Insight Anda'
              : 'Buat akun baru untuk personalisasi'
            }
          </p>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 bg-accent-danger/10 border border-accent-danger/30 rounded-sm flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-accent-danger flex-shrink-0" />
            <span className="text-small text-accent-danger">{error}</span>
          </div>
        )}

        {/* Success Message */}
        {success && (
          <div className="mb-4 p-3 bg-accent-primary/10 border border-accent-primary/30 rounded-sm flex items-center gap-2">
            <Check className="w-4 h-4 text-accent-primary flex-shrink-0" />
            <span className="text-small text-accent-primary">{success}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="email@example.com"
                className="w-full h-12 pl-10 pr-4 bg-bg-base border border-accent-primary/20 rounded-sm
                         text-text-primary placeholder:text-text-muted
                         focus:outline-none focus:border-accent-primary focus:shadow-glow-green
                         transition-all duration-fast"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-text-muted uppercase tracking-wider mb-2">
              Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min 6 karakter"
                className="w-full h-12 pl-10 pr-4 bg-bg-base border border-accent-primary/20 rounded-sm
                         text-text-primary placeholder:text-text-muted
                         focus:outline-none focus:border-accent-primary focus:shadow-glow-green
                         transition-all duration-fast"
                required
                minLength={6}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full h-12 bg-accent-primary text-black font-bold uppercase tracking-wider
                     rounded-sm transition-all duration-fast
                     hover:shadow-glow-green-lg disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Loading...' : mode === 'signin' ? 'Sign In' : 'Create Account'}
          </button>
        </form>

        {/* Toggle Mode */}
        <div className="mt-6 text-center">
          <span className="text-small text-text-secondary">
            {mode === 'signin' ? 'Belum punya akun?' : 'Sudah punya akun?'}
          </span>
          <button
            onClick={() => {
              setMode(mode === 'signin' ? 'signup' : 'signin');
              setError(null);
              setSuccess(null);
            }}
            className="ml-2 text-small text-accent-secondary hover:underline"
          >
            {mode === 'signin' ? 'Daftar' : 'Sign In'}
          </button>
        </div>
      </div>
    </div>
  );
}
