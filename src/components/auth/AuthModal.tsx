import React, { useState } from 'react';
import {
  X,
  LogIn,
  Mail,
  Lock,
  Shield,
  CheckCircle2,
  AlertCircle,
  Sparkles
} from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../types';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose }) => {
  const { loginWithEmail, loginWithGoogle, switchDemoRole } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithEmail(email, password);
      onClose();
    } catch (err: any) {
      setErrorMsg('Login failed: ' + (err.message || 'Check your credentials.'));
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setErrorMsg('');
    try {
      await loginWithGoogle();
      onClose();
    } catch (err: any) {
      setErrorMsg('Google authentication error: ' + (err.message || err));
    } finally {
      setLoading(false);
    }
  };

  const quickRoles: { role: UserRole; title: string; email: string }[] = [
    { role: 'super_admin', title: 'Systems Admin', email: 'julius.manio@depedqc.ph' },
    { role: 'school_head', title: 'Principal', email: 'lourdes.sese@depedqc.ph' },
    { role: 'sbm_coordinator', title: 'SBM Coordinator', email: 'jonathan.santos@depedqc.ph' },
    { role: 'dimension_leader', title: 'Dimension Leader', email: 'elena.roces@depedqc.ph' },
    { role: 'contributor', title: 'Contributor', email: 'ricardo.torres@depedqc.ph' },
    { role: 'validator', title: 'SDO QC Validator', email: 'sdo.validator@depedqc.ph' }
  ];

  return (
    <div
      id="auth-modal-overlay"
      className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
    >
      <div
        id="auth-modal-container"
        className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden"
      >
        <div className="px-6 py-4 bg-[#141414] text-white flex items-center justify-between border-b border-zinc-800">
          <div className="flex items-center space-x-2">
            <div className="w-7 h-7 rounded-lg bg-[#1A1A1A] border border-[#C5A059]/40 flex items-center justify-center font-bold text-xs text-[#DFC07D]">
              QHS
            </div>
            <div>
              <h3 className="text-sm font-bold text-white">QHS SBM PORTAL</h3>
              <p className="text-[11px] text-zinc-400">DepEd SDO Quezon City Sign In</p>
            </div>
          </div>
          <button onClick={onClose} className="text-zinc-400 hover:text-white p-1">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-6 space-y-4">
          {errorMsg && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-800 flex items-center space-x-2">
              <AlertCircle className="w-4 h-4 text-rose-600 flex-shrink-0" />
              <span>{errorMsg}</span>
            </div>
          )}

          {/* Google Sign In Button */}
          <button
            id="google-signin-btn"
            type="button"
            onClick={handleGoogleSignIn}
            disabled={loading}
            className="w-full py-2.5 px-4 border border-slate-300 rounded-xl hover:bg-slate-50 text-slate-800 font-semibold text-xs flex items-center justify-center space-x-2 transition-colors shadow-2xs"
          >
            <svg className="w-4 h-4" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M23.745 12.27c0-.7-.06-1.4-.19-2.07H12v4.51h6.6c-.29 1.52-1.14 2.82-2.4 3.68v3.05h3.88c2.27-2.09 3.665-5.17 3.665-9.17z"
              />
              <path
                fill="#34A853"
                d="M12 24c3.24 0 5.95-1.08 7.93-2.91l-3.88-3.05c-1.08.72-2.45 1.16-4.05 1.16-3.12 0-5.77-2.1-6.72-4.93H1.25v3.15C3.26 21.36 7.33 24 12 24z"
              />
              <path
                fill="#FBBC05"
                d="M5.28 14.27c-.25-.72-.38-1.49-.38-2.27s.13-1.55.38-2.27V6.58H1.25C.45 8.18 0 10.02 0 12s.45 3.82 1.25 5.42l4.03-3.15z"
              />
              <path
                fill="#EA4335"
                d="M12 4.75c1.77 0 3.35.61 4.6 1.8l3.42-3.42C17.95 1.19 15.24 0 12 0 7.33 0 3.26 2.64 1.25 6.58l4.03 3.15c.95-2.83 3.6-4.98 6.72-4.98z"
              />
            </svg>
            <span>Sign in with DepEd Google Workspace</span>
          </button>

          <div className="flex items-center space-x-2">
            <div className="flex-1 border-t border-slate-200"></div>
            <span className="text-[10px] text-slate-400 font-bold uppercase">or email</span>
            <div className="flex-1 border-t border-slate-200"></div>
          </div>

          {/* Email / Password Form */}
          <form onSubmit={handleEmailSubmit} className="space-y-3 text-xs">
            <div>
              <label className="font-bold text-slate-700 block mb-1">DepEd Email Address:</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name.surname@deped.gov.ph"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div>
              <label className="font-bold text-slate-700 block mb-1">Password:</label>
              <div className="relative">
                <Lock className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full pl-9 pr-3 py-2 border border-slate-300 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-xs transition-colors"
            >
              {loading ? 'Authenticating...' : 'Sign In'}
            </button>
          </form>

          {/* Instant Quick Persona Switcher (For Evaluation) */}
          <div className="pt-3 border-t border-slate-100 space-y-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">
              Quick Role Sign-in (Preview & QA):
            </span>
            <div className="grid grid-cols-2 gap-1.5">
              {quickRoles.map((r) => (
                <button
                  key={r.role}
                  type="button"
                  onClick={() => {
                    switchDemoRole(r.role);
                    onClose();
                  }}
                  className="p-2 text-left bg-slate-50 hover:bg-blue-50 border border-slate-200 rounded-lg text-xs transition-colors"
                >
                  <div className="font-bold text-slate-900 text-[11px] truncate">{r.title}</div>
                  <div className="text-[10px] text-slate-500 truncate">{r.email}</div>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
