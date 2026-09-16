import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  KeyRound, 
  Eye, 
  EyeOff, 
  CheckCircle2, 
  AlertCircle, 
  RefreshCw, 
  History, 
  UserCheck, 
  Fingerprint,
  ShieldAlert
} from 'lucide-react';
import { useStore } from '../../context/StoreContext';
import { evaluatePasswordStrength, resetFailedLoginAttempts } from '../../utils/cryptoSecurity';

export const SecurityManagerView: React.FC = () => {
  const { 
    adminUser, 
    securityCredentials, 
    securityLogs, 
    refreshSecurityLogs, 
    changeAdminPassword, 
    updateAdminProfile 
  } = useStore();

  // Password change form state
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  // Profile form state
  const [adminName, setAdminName] = useState(securityCredentials?.name || adminUser?.name || 'Umar Rasheed (Store Owner)');
  const [adminEmail, setAdminEmail] = useState(securityCredentials?.email || adminUser?.email || 'dev.umarrasheed@gmail.com');
  const [securityQuestion, setSecurityQuestion] = useState(securityCredentials?.securityQuestion || 'What is your handmade craft brand name?');
  const [securityAnswer, setSecurityAnswer] = useState('');
  const [profileStatus, setProfileStatus] = useState<{ type: 'success' | 'error' | null; message: string }>({ type: null, message: '' });
  const [isUpdatingProfile, setIsUpdatingProfile] = useState(false);

  // Rate limit reset state
  const [rateLimitMessage, setRateLimitMessage] = useState<string | null>(null);

  const strength = evaluatePasswordStrength(newPassword);

  const handlePasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPasswordStatus({ type: null, message: '' });

    if (newPassword !== confirmPassword) {
      setPasswordStatus({ type: 'error', message: 'New password and confirmation password do not match.' });
      return;
    }

    if (newPassword.length < 8) {
      setPasswordStatus({ type: 'error', message: 'New password must be at least 8 characters long.' });
      return;
    }

    setIsChangingPassword(true);
    try {
      const result = await changeAdminPassword(oldPassword, newPassword);
      setIsChangingPassword(false);
      if (result.success) {
        setPasswordStatus({ type: 'success', message: 'Password successfully re-encrypted with fresh cryptographic salt and SHA-256 hash!' });
        setOldPassword('');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        setPasswordStatus({ type: 'error', message: result.error || 'Failed to update password.' });
      }
    } catch (err: any) {
      setIsChangingPassword(false);
      setPasswordStatus({ type: 'error', message: err.message || 'Cryptographic hashing error.' });
    }
  };

  const handleProfileSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setProfileStatus({ type: null, message: '' });
    setIsUpdatingProfile(true);

    try {
      const result = await updateAdminProfile(adminName, adminEmail, securityQuestion, securityAnswer);
      setIsUpdatingProfile(false);
      if (result.success) {
        setProfileStatus({ type: 'success', message: 'Admin security profile & recovery credentials updated successfully.' });
        setSecurityAnswer('');
      } else {
        setProfileStatus({ type: 'error', message: result.error || 'Failed to update profile.' });
      }
    } catch (err: any) {
      setIsUpdatingProfile(false);
      setProfileStatus({ type: 'error', message: err.message || 'Profile update error.' });
    }
  };

  const handleClearRateLimit = () => {
    resetFailedLoginAttempts();
    setRateLimitMessage('Brute-force lockout counters have been successfully reset.');
    setTimeout(() => setRateLimitMessage(null), 3000);
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300" id="admin-security-manager">
      {/* Top Security Header Card */}
      <div className="bg-gradient-to-r from-[#2C2420] via-[#3E3029] to-[#2C2420] rounded-3xl p-6 sm:p-8 text-white border border-[#4E3E34] shadow-md relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#9B86BD]/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#EBE1F5]/20 text-[#DFCFF0] text-xs font-semibold border border-[#DFCFF0]/30">
              <ShieldCheck className="w-4 h-4 text-[#DFCFF0]" />
              <span>Cryptographic Hardware / WebCrypto SHA-256 Engine</span>
            </div>
            <h2 className="font-serif text-2xl sm:text-3xl font-bold text-white">
              Military-Grade Admin Credential Security
            </h2>
            <p className="text-xs sm:text-sm text-[#D8CDC4] max-w-2xl leading-relaxed">
              Your credentials are never stored in plaintext. Passwords are protected using a 16-byte random salt combined with double-pass SHA-256 cryptographic hashing and constant-time verification to prevent timing attacks.
            </p>
          </div>

          <div className="bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/15 text-xs space-y-2 flex-shrink-0 min-w-[240px]">
            <div className="flex items-center justify-between text-[#DFCFF0]">
              <span>Current Admin:</span>
              <span className="font-bold text-white">{adminUser?.name || 'Master Admin'}</span>
            </div>
            <div className="flex items-center justify-between text-[#DFCFF0]">
              <span>Registered Email:</span>
              <span className="font-mono text-white text-[11px]">{adminUser?.email || 'meet.umar.gamer.0@gmail.com'}</span>
            </div>
            <div className="flex items-center justify-between text-[#DFCFF0]">
              <span>Salt Status:</span>
              <span className="inline-flex items-center gap-1 text-emerald-400 font-semibold">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Active (16-Byte Hex)
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Change Password & Security Profile (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          
          {/* Change Password Form */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3DA] shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center">
                <KeyRound className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  Update Encrypted Master Password
                </h3>
                <p className="text-xs text-[#7C6C63]">
                  Generate a fresh cryptographic salt and SHA-256 hash for your store
                </p>
              </div>
            </div>

            {passwordStatus.type && (
              <div
                className={`mt-4 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                  passwordStatus.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                {passwordStatus.type === 'success' ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                ) : (
                  <AlertCircle className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
                )}
                <span>{passwordStatus.message}</span>
              </div>
            )}

            <form onSubmit={handlePasswordSubmit} className="mt-5 space-y-4">
              {/* Current Password */}
              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Current Master Password
                </label>
                <div className="relative">
                  <input
                    type={showOldPassword ? 'text' : 'password'}
                    required
                    value={oldPassword}
                    onChange={(e) => setOldPassword(e.target.value)}
                    placeholder="Enter existing password (e.g. admin123)"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowOldPassword(!showOldPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#2C2420]"
                  >
                    {showOldPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* New Password */}
              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  New Secure Password (Min. 8 characters)
                </label>
                <div className="relative">
                  <input
                    type={showNewPassword ? 'text' : 'password'}
                    required
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Create a strong new password"
                    className="w-full pl-3.5 pr-10 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                  <button
                    type="button"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[#8C7A70] hover:text-[#2C2420]"
                  >
                    {showNewPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>

                {/* Password Strength Meter */}
                {newPassword && (
                  <div className="mt-2 p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] space-y-1.5">
                    <div className="flex items-center justify-between text-xs">
                      <span className="text-[#6B5B52]">Cryptographic Strength:</span>
                      <span className={`font-bold text-xs ${strength.score >= 3 ? 'text-emerald-700' : 'text-amber-700'}`}>
                        {strength.label}
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-gray-200 rounded-full overflow-hidden flex gap-1">
                      {[1, 2, 3, 4].map((step) => (
                        <div
                          key={step}
                          className={`h-full flex-1 transition-all ${
                            step <= strength.score ? strength.color : 'bg-gray-200'
                          }`}
                        />
                      ))}
                    </div>
                    <div className="grid grid-cols-2 gap-1 text-[10px] text-[#7C6C63] pt-1">
                      <span className={strength.hasLength ? 'text-emerald-600 font-medium' : ''}>✓ 8+ Characters</span>
                      <span className={strength.hasNumbers ? 'text-emerald-600 font-medium' : ''}>✓ Numbers (0-9)</span>
                      <span className={strength.hasMixedCase ? 'text-emerald-600 font-medium' : ''}>✓ Upper & Lowercase</span>
                      <span className={strength.hasSpecial ? 'text-emerald-600 font-medium' : ''}>✓ Special symbols (!@#)</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Confirm New Password
                </label>
                <input
                  type="password"
                  required
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Re-enter new password to verify"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <button
                type="submit"
                disabled={isChangingPassword}
                className="w-full py-3 px-4 rounded-xl bg-[#9B86BD] hover:bg-[#8063A4] text-white text-xs font-semibold flex items-center justify-center gap-2 shadow-xs transition-all active:scale-98 disabled:opacity-60"
              >
                {isChangingPassword ? (
                  <span className="flex items-center gap-2">
                    <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    <span>Computing Salt & SHA-256 Digest...</span>
                  </span>
                ) : (
                  <>
                    <Lock className="w-4 h-4" />
                    <span>Encrypt & Save New Master Password</span>
                  </>
                )}
              </button>
            </form>
          </div>

          {/* Admin Security Profile */}
          <div className="bg-white rounded-3xl p-6 sm:p-7 border border-[#EAE3DA] shadow-xs">
            <div className="flex items-center gap-2.5 mb-2">
              <div className="w-9 h-9 rounded-xl bg-[#EBE1F5] text-[#745699] flex items-center justify-center">
                <UserCheck className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-serif text-lg font-bold text-[#2C2420]">
                  Admin Profile & Account Recovery
                </h3>
                <p className="text-xs text-[#7C6C63]">
                  Authorized contact credentials and encrypted recovery answer
                </p>
              </div>
            </div>

            {profileStatus.type && (
              <div
                className={`mt-4 p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                  profileStatus.type === 'success'
                    ? 'bg-emerald-50 border border-emerald-200 text-emerald-800'
                    : 'bg-red-50 border border-red-200 text-red-800'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0 mt-0.5" />
                <span>{profileStatus.message}</span>
              </div>
            )}

            <form onSubmit={handleProfileSubmit} className="mt-5 space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                    Store Owner Name
                  </label>
                  <input
                    type="text"
                    required
                    value={adminName}
                    onChange={(e) => setAdminName(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                    Primary Admin Email
                  </label>
                  <input
                    type="email"
                    required
                    value={adminEmail}
                    onChange={(e) => setAdminEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  Security Recovery Question
                </label>
                <input
                  type="text"
                  value={securityQuestion}
                  onChange={(e) => setSecurityQuestion(e.target.value)}
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-[#2C2420] mb-1">
                  New Security Answer (Encrypted with Salt upon save)
                </label>
                <input
                  type="password"
                  value={securityAnswer}
                  onChange={(e) => setSecurityAnswer(e.target.value)}
                  placeholder="Leave blank to keep existing answer"
                  className="w-full px-3.5 py-2.5 text-xs rounded-xl border border-[#EAE3DA] bg-white focus:outline-none focus:ring-2 focus:ring-[#9B86BD]/40 text-[#2C2420]"
                />
              </div>

              <button
                type="submit"
                disabled={isUpdatingProfile}
                className="w-full py-2.5 px-4 rounded-xl bg-[#2C2420] hover:bg-[#433730] text-white text-xs font-semibold flex items-center justify-center gap-2 transition-all"
              >
                {isUpdatingProfile ? 'Saving...' : 'Save Profile & Recovery Settings'}
              </button>
            </form>
          </div>
        </div>

        {/* Right Column: Brute-force & Security Audit Log (5 cols) */}
        <div className="lg:col-span-5 space-y-6">
          
          {/* Brute Force Protection Card */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE3DA] shadow-xs space-y-3">
            <div className="flex items-center gap-2">
              <ShieldAlert className="w-5 h-5 text-[#9B86BD]" />
              <h3 className="font-serif text-base font-bold text-[#2C2420]">
                Active Brute-Force Shield
              </h3>
            </div>
            <p className="text-xs text-[#6B5B52] leading-relaxed">
              If an attacker attempts more than 5 consecutive incorrect passwords, the admin portal enforces an automatic 2-minute lockout with exponential backoff to prevent dictionary probing.
            </p>

            {rateLimitMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 text-emerald-800 text-xs border border-emerald-200">
                {rateLimitMessage}
              </div>
            )}

            <button
              onClick={handleClearRateLimit}
              className="w-full py-2 px-3 rounded-xl bg-[#FAF8F5] hover:bg-[#EAE3DA] text-[#5A4940] text-xs font-medium border border-[#EAE3DA] flex items-center justify-center gap-2 transition-colors"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#9B86BD]" />
              <span>Reset Rate-Limit Attempt Counters</span>
            </button>
          </div>

          {/* Security Audit Log */}
          <div className="bg-white rounded-3xl p-6 border border-[#EAE3DA] shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <History className="w-5 h-5 text-[#745699]" />
                <h3 className="font-serif text-base font-bold text-[#2C2420]">
                  Security Audit Log
                </h3>
              </div>
              <button
                onClick={refreshSecurityLogs}
                className="p-1.5 rounded-lg text-[#7C6C63] hover:text-[#2C2420] hover:bg-[#FAF8F5]"
                title="Refresh logs"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>
            <p className="text-xs text-[#7C6C63]">
              Real-time audit records of authentication events and critical security changes.
            </p>

            <div className="space-y-2.5 max-h-96 overflow-y-auto pr-1">
              {securityLogs && securityLogs.length > 0 ? (
                securityLogs.map((log) => {
                  let badgeColor = 'bg-gray-100 text-gray-700';
                  if (log.event === 'LOGIN_SUCCESS') badgeColor = 'bg-emerald-100 text-emerald-800';
                  if (log.event === 'LOGIN_FAILED') badgeColor = 'bg-red-100 text-red-800';
                  if (log.event === 'PASSWORD_CHANGED') badgeColor = 'bg-purple-100 text-purple-800';
                  if (log.event === 'BACKUP_DOWNLOADED') badgeColor = 'bg-blue-100 text-blue-800';
                  if (log.event === 'DATA_RESTORED') badgeColor = 'bg-amber-100 text-amber-800';

                  return (
                    <div
                      key={log.id}
                      className="p-3 rounded-xl bg-[#FAF8F5] border border-[#EAE3DA] text-xs space-y-1"
                    >
                      <div className="flex items-center justify-between">
                        <span className={`px-2 py-0.5 rounded-full font-mono text-[10px] font-bold ${badgeColor}`}>
                          {log.event}
                        </span>
                        <span className="text-[10px] text-[#8C7A70]">
                          {new Date(log.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })}
                        </span>
                      </div>
                      <p className="text-[#3A2E28] text-[11px] leading-relaxed">
                        {log.details}
                      </p>
                    </div>
                  );
                })
              ) : (
                <div className="py-6 text-center text-xs text-[#8C7A70]">
                  No security events logged yet.
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};
