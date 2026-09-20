import React, { useState } from 'react';
import { useAuth, UserRole } from '../context/AuthContext';
import { ShieldCheck, User, Lock, Mail, Key, Sparkles, X, Check, Loader2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, signupWithEmail, loginAsDemoAdmin, loginAsDemoUser, isLoading } = useAuth();
  const [isSignup, setIsSignup] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<UserRole>('user');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    if (isSignup) {
      const res = await signupWithEmail(email, password, role);
      if (res.error) setErrorMsg(res.error);
      else onClose();
    } else {
      const res = await loginWithEmail(email, password);
      if (res.error) setErrorMsg(res.error);
      else onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fadeIn">
      <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-md p-6 shadow-2xl space-y-5 relative">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Modal Header */}
        <div className="text-center space-y-1">
          <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-sky-500 to-indigo-600 p-0.5 mx-auto mb-2 shadow-lg shadow-sky-500/20">
            <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center">
              <img src="/brand/icon.svg" alt="Execora" className="h-6 w-6" />
            </div>
          </div>
          <h3 className="text-lg font-bold text-white">
            {isSignup ? 'Create Execora Account' : 'Sign In to Execora AI'}
          </h3>
          <p className="text-xs text-slate-400">
            From information to execution.
          </p>
        </div>

        {/* Quick Demo Logins */}
        <div className="p-3 bg-slate-950 rounded-xl border border-slate-800 text-xs space-y-2">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider block text-center">
            Instant Demo Login:
          </span>
          <div className="grid grid-cols-2 gap-2">
            <button
              onClick={() => {
                loginAsDemoAdmin();
                onClose();
              }}
              className="px-3 py-2 rounded-lg bg-sky-950/80 hover:bg-sky-900 border border-sky-700/60 text-sky-200 font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-sky-400" />
              <span>Login as Admin</span>
            </button>
            <button
              onClick={() => {
                loginAsDemoUser();
                onClose();
              }}
              className="px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-slate-200 font-semibold text-[11px] transition-all flex items-center justify-center gap-1.5"
            >
              <User className="w-3.5 h-3.5 text-emerald-400" />
              <span>Login as User</span>
            </button>
          </div>
        </div>

        {/* Error Display */}
        {errorMsg && (
          <div className="p-3 bg-rose-950/80 border border-rose-800 text-rose-300 text-xs rounded-xl text-center font-medium">
            {errorMsg}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4 text-xs">
          <div>
            <label className="block text-slate-300 font-medium mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@company.com"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-slate-300 font-medium mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-2.5" />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-slate-100 placeholder-slate-600 focus:outline-none focus:border-sky-500"
              />
            </div>
          </div>

          {isSignup && (
            <div>
              <label className="block text-slate-300 font-medium mb-1">Account Role</label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole('user')}
                  className={`py-2 px-3 rounded-lg border font-semibold text-[11px] ${
                    role === 'user'
                      ? 'bg-sky-950 border-sky-600 text-sky-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Standard User
                </button>
                <button
                  type="button"
                  onClick={() => setRole('admin')}
                  className={`py-2 px-3 rounded-lg border font-semibold text-[11px] ${
                    role === 'admin'
                      ? 'bg-purple-950 border-purple-600 text-purple-300'
                      : 'bg-slate-950 border-slate-800 text-slate-400'
                  }`}
                >
                  Platform Admin
                </button>
              </div>
            </div>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 rounded-xl bg-gradient-to-r from-sky-600 to-indigo-600 hover:from-sky-500 hover:to-indigo-500 text-white font-bold text-xs transition-all shadow-lg shadow-sky-600/30 flex items-center justify-center gap-2"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin text-white" /> : (isSignup ? 'Create Account' : 'Sign In')}
          </button>
        </form>

        {/* Toggle Signup/Login */}
        <div className="text-center pt-2 border-t border-slate-800 text-xs text-slate-400">
          {isSignup ? 'Already have an account?' : "Don't have an account yet?"}{' '}
          <button
            onClick={() => setIsSignup(!isSignup)}
            className="text-sky-400 hover:underline font-semibold"
          >
            {isSignup ? 'Sign In' : 'Sign Up'}
          </button>
        </div>

      </div>
    </div>
  );
};
