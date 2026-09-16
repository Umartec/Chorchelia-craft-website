import React, { useState, useEffect } from 'react';
import { X, Lock, KeyRound, ArrowRight, ShieldCheck, Eye, EyeOff, AlertCircle, Clock, ShieldAlert } from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { checkRateLimit } from '../../utils/cryptoSecurity';

interface AdminLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { loginAdmin } = useStore();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [lockoutRemaining, setLockoutRemaining] = useState<number>(0);

  // Check rate limit on open and run timer
  useEffect(() => {
    if (!isOpen) return;
    const check = checkRateLimit();
    if (check.isLocked) {
      setLockoutRemaining(check.remainingSeconds);
    } else {
      setLockoutRemaining(0);
    }
  }, [isOpen]);

  // Lockout countdown interval
  useEffect(() => {
    if (lockoutRemaining <= 0) return;
    const timer = setInterval(() => {
      setLockoutRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setError(null);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [lockoutRemaining]);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutRemaining > 0) return;

    setError(null);
    setIsLoading(true);

    try {
      const result = await loginAdmin(password, email);
      setIsLoading(false);

      if (result.success) {
        setPassword('');
        setError(null);
        if (onSuccess) {
          onSuccess();
        }
        onClose();
      } else {
        if (result.remainingSeconds && result.remainingSeconds > 0) {
          setLockoutRemaining(result.remainingSeconds);
        }
        setError(result.error || 'Authentication failed. Please verify your credentials.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setError(err.message || 'An unexpected cryptographic verification error occurred.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-200">
      <div
        className="relative bg-white w-full max-w-md rounded-3xl shadow-2xl border border-[#DFCFF0] overflow-hidden my-auto p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
        id="admin-login-modal"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-[#F5F2EC] text-[#6B5B52] hover:text-[#2C2420] hover:bg-[#EAE3DA] flex items-center justify-center transition-colors"
          aria-label="Close"
        >
          <X className="w-4 h-4" />
        </button>

        {/* Header */}
        <div className="text-center mb-6">
          <div className="w-14 h-14 rounded-2xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center mx-auto mb-3 border border-[#DFCFF0] shadow-sm relative">
            <Lock className="w-7 h-7" />
            <div className="absolute -bottom-1 -right-1 w-5 h-5 bg-[#25D366] text-white rounded-full flex items-center justify-center text-[10px] shadow-xs">
              ✓
            </div>
          </div>
          <h2 className="font-serif text-2xl font-bold text-[#2C2420]">
            Encrypted Admin Portal
          </h2>
          <p className="text-xs text-[#7C6C63] mt-1.5 leading-relaxed">
            Zero-plaintext SHA-256 cryptographic verification with salt protection.
          </p>
        </div>

        {/* Lockout Warning Banner if rate limited */}
        {lockoutRemaining > 0 && (
          <div className="mb-4 p-3.5 rounded-2xl bg-amber-50 border border-amber-300 text-amber-900 text-xs flex items-start gap-2.5 animate-pulse">
            <Clock className="w-5 h-5 flex-shrink-0 text-amber-600 mt-0.5" />
            <div>
              <span className="font-bold block">Brute-Force Rate Limiting Active</span>
              <span className="text-[11px] block mt-0.5">
                Too many failed attempts. Login unlocked in <strong>{lockoutRemaining}s</strong>.
              </span>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && lockoutRemaining <= 0 && (
          <div className="mb-4 p-3 rounded-xl bg-red-50 border border-red-200 text-red-700 text-xs flex items-start gap-2 animate-in shake">
            <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
            <span>{error}</span>
          </div>
        )}

        {/* Login Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1">
              Admin Registered Email
            </label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your admin email"
              className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-semibold text-[#2C2420] mb-1">
              Encrypted Master Password
            </label>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                value={password}
                disabled={lockoutRemaining > 0}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter master password"
                className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420] disabled:bg-gray-100 disabled:cursor-not-allowed"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#2C2420]"
                tabIndex={-1}
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={isLoading || lockoutRemaining > 0}
            id="admin-login-submit-btn"
            className="w-full mt-2 py-3 px-4 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-sm transition-all active:scale-98 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {isLoading ? (
              <span className="flex items-center gap-2">
                <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                <span>Running SHA-256 Verification...</span>
              </span>
            ) : lockoutRemaining > 0 ? (
              <span>Locked ({lockoutRemaining}s)</span>
            ) : (
              <>
                <KeyRound className="w-4 h-4" />
                <span>Authenticate & Open Dashboard</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Security badge & info */}
        <div className="mt-6 pt-4 border-t border-[#F0EBE3] space-y-2">
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[#8C7A70]">
            <ShieldCheck className="w-3.5 h-3.5 text-[#9B86BD]" />
            <span>SHA-256 + 16-byte Salt Cryptographic Key Store</span>
          </div>
          <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#A8988E]">
            <ShieldAlert className="w-3 h-3 text-[#9B86BD]" />
            <span>Protected against dictionary attacks & brute-force lockouts</span>
          </div>
        </div>
      </div>
    </div>
  );
};
