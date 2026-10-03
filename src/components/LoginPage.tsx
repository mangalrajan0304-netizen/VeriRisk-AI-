import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Lock, 
  Mail, 
  ArrowRight, 
  Eye, 
  EyeOff, 
  KeyRound, 
  UserCheck, 
  Check, 
  Globe, 
  Volume2, 
  VolumeX, 
  Moon, 
  Sun,
  Fingerprint,
  Building,
  Shield
} from 'lucide-react';
import { UserRole } from '../types';
import { MOCK_USERS } from '../data/sampleDocuments';
import { sounds } from '../utils/haptics';

interface LoginPageProps {
  onLogin: (role: UserRole) => void;
  nightMode: boolean;
  onToggleNightMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const LoginPage: React.FC<LoginPageProps> = ({
  onLogin,
  nightMode,
  onToggleNightMode,
  soundEnabled,
  onToggleSound,
}) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>(MOCK_USERS[0]);
  const [email, setEmail] = useState<string>(MOCK_USERS[0].email);
  const [password, setPassword] = useState<string>('••••••••••••');
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [rememberMe, setRememberMe] = useState<boolean>(true);
  const [isAuthenticating, setIsAuthenticating] = useState<boolean>(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [showForgotModal, setShowForgotModal] = useState<boolean>(false);

  // Handle switching preset demo persona
  const handleSelectRole = (role: UserRole) => {
    sounds.playTab();
    setSelectedRole(role);
    setEmail(role.email);
    setPassword('••••••••••••');
    setAuthError(null);
  };

  // Perform sign-in
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) {
      setAuthError('Please enter a valid enterprise corporate email');
      sounds.playAlert();
      return;
    }

    setIsAuthenticating(true);
    setAuthError(null);
    sounds.playScan();

    setTimeout(() => {
      setIsAuthenticating(false);
      sounds.playLogin();
      onLogin(selectedRole);
    }, 600);
  };

  // 1-Click OAuth SSO
  const handleOAuthSSO = (provider: string) => {
    sounds.playScan();
    setIsAuthenticating(true);

    setTimeout(() => {
      setIsAuthenticating(false);
      sounds.playLogin();
      onLogin(selectedRole);
    }, 700);
  };

  return (
    <div className={`min-h-screen flex flex-col justify-between transition-colors duration-300 ${
      nightMode ? 'bg-[#090312] text-white' : 'bg-[#120726] text-white'
    }`}>
      
      {/* Top Bar for Login */}
      <header className="w-full border-b border-violet-500/20 bg-[#120826]/80 backdrop-blur-md px-6 py-4">
        <div className="mx-auto max-w-7xl flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/30 text-violet-300 ring-1 ring-violet-400/40">
              <ShieldCheck className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <span className="text-lg font-bold tracking-tight text-white">VeriRisk</span>
              <span className="text-violet-400 font-medium ml-1">AI</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Sound Toggle */}
            <button
              onClick={() => {
                onToggleSound();
              }}
              title={soundEnabled ? 'Mute sound effects' : 'Enable sound effects'}
              className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-500/20 bg-violet-950/40 text-violet-300 hover:text-white transition-colors cursor-pointer"
            >
              {soundEnabled ? (
                <Volume2 className="h-4 w-4 text-violet-300" />
              ) : (
                <VolumeX className="h-4 w-4 text-violet-500" />
              )}
            </button>

            {/* Night Mode Toggle */}
            <button
              onClick={() => {
                sounds.playTab();
                onToggleNightMode();
              }}
              title="Toggle Violet Theme Tone"
              className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-500/20 bg-violet-950/40 text-violet-300 hover:text-white transition-colors cursor-pointer"
            >
              {nightMode ? (
                <Moon className="h-4 w-4 text-violet-300" />
              ) : (
                <Sun className="h-4 w-4 text-amber-300" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Main Login Card Section */}
      <main className="flex-1 flex items-center justify-center p-4 sm:p-6 lg:p-8">
        <div className="w-full max-w-md space-y-6">
          
          {/* Card Container */}
          <div className="rounded-2xl border border-violet-500/25 bg-[#140828]/95 p-6 sm:p-8 shadow-2xl backdrop-blur-xl space-y-6 animate-fadeIn">
            
            {/* Header */}
            <div className="text-center space-y-2">
              <div className="inline-flex h-12 w-12 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300 ring-1 ring-violet-400/50 mb-1">
                <Lock className="h-6 w-6 text-violet-300" />
              </div>
              <h1 className="text-xl font-bold tracking-tight text-white">
                Enterprise Compliance Login
              </h1>
              <p className="text-xs text-violet-300/70">
                Authenticate via Single Sign-On (SSO) or authorized compliance credentials.
              </p>
            </div>

            {/* Single Sign-On (SSO) Quick Buttons */}
            <div className="space-y-2.5">
              <button
                type="button"
                onClick={() => handleOAuthSSO('Google Workspace')}
                disabled={isAuthenticating}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg border border-violet-500/30 bg-violet-900/30 hover:bg-violet-800/40 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Globe className="h-4 w-4 text-violet-300" />
                <span>Continue with Google Workspace (OAuth 2.0)</span>
              </button>

              <button
                type="button"
                onClick={() => handleOAuthSSO('Okta SSO')}
                disabled={isAuthenticating}
                className="w-full py-2.5 px-4 text-xs font-semibold rounded-lg border border-violet-500/30 bg-violet-900/30 hover:bg-violet-800/40 text-white transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <Building className="h-4 w-4 text-violet-300" />
                <span>Continue with Enterprise Okta / Azure AD</span>
              </button>
            </div>

            {/* Divider */}
            <div className="relative flex items-center justify-center">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-violet-500/20" />
              </div>
              <span className="relative bg-[#140828] px-3 text-[11px] font-mono text-violet-400">
                or use role credentials
              </span>
            </div>

            {/* Select Role / Demo Accounts */}
            <div className="space-y-2">
              <label className="block text-[11px] font-semibold text-violet-300 uppercase tracking-wider">
                Select Authorized Role Persona
              </label>
              <div className="grid grid-cols-2 gap-2">
                {MOCK_USERS.map((user) => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => handleSelectRole(user)}
                    className={`p-2 rounded-lg border text-left transition-all cursor-pointer ${
                      selectedRole.id === user.id
                        ? 'border-violet-400 bg-violet-900/60 text-white shadow-sm ring-1 ring-violet-400/40'
                        : 'border-violet-500/20 bg-violet-950/40 hover:bg-violet-900/20 text-violet-300'
                    }`}
                  >
                    <div className="font-bold text-[11px] text-white truncate">
                      {user.name.split(',')[0]}
                    </div>
                    <div className="text-[10px] text-violet-400 truncate">
                      {user.title.split(' ')[0]}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              
              {/* Email */}
              <div className="space-y-1">
                <label className="block text-xs font-medium text-violet-200">
                  Enterprise Work Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-2.5 h-4 w-4 text-violet-400" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full pl-9 pr-3 py-2 text-xs bg-violet-950/60 border border-violet-500/30 rounded-lg text-white placeholder-violet-500 focus:outline-none focus:border-violet-400 transition-colors font-mono"
                    placeholder="officer@veririsk.internal"
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="block text-xs font-medium text-violet-200">
                    Security Token / Password
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setShowForgotModal(true);
                    }}
                    className="text-[11px] text-violet-400 hover:text-white transition-colors cursor-pointer"
                  >
                    Forgot Key?
                  </button>
                </div>
                <div className="relative">
                  <KeyRound className="absolute left-3 top-2.5 h-4 w-4 text-violet-400" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-9 pr-10 py-2 text-xs bg-violet-950/60 border border-violet-500/30 rounded-lg text-white focus:outline-none focus:border-violet-400 transition-colors font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      sounds.playClick();
                      setShowPassword(!showPassword);
                    }}
                    className="absolute right-3 top-2.5 text-violet-400 hover:text-white cursor-pointer"
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {/* Remember me & security badge */}
              <div className="flex items-center justify-between text-xs">
                <label className="flex items-center gap-2 text-violet-300 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => {
                      sounds.playClick();
                      setRememberMe(e.target.checked);
                    }}
                    className="rounded border-violet-500/30 bg-violet-950 text-violet-600 focus:ring-0 cursor-pointer"
                  />
                  <span className="text-[11px]">Keep session authorized</span>
                </label>

                <span className="text-[10px] text-emerald-400 font-mono flex items-center gap-1">
                  <Fingerprint className="h-3 w-3" />
                  FIPS 140-2
                </span>
              </div>

              {/* Error Message */}
              {authError && (
                <div className="p-2.5 rounded bg-rose-500/20 border border-rose-400/40 text-rose-200 text-xs text-center font-mono">
                  {authError}
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isAuthenticating}
                className="w-full py-2.5 px-4 text-xs font-bold text-white bg-violet-600 hover:bg-violet-500 active:scale-[0.99] disabled:opacity-50 rounded-lg transition-all flex items-center justify-center gap-2 cursor-pointer shadow-lg shadow-violet-950/50"
              >
                {isAuthenticating ? (
                  <span>Validating Security Clearance...</span>
                ) : (
                  <>
                    <span>Enter Risk & Compliance Console</span>
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </button>

            </form>

          </div>

          {/* Footer Security Certifications */}
          <div className="flex items-center justify-center gap-4 text-[11px] text-violet-400 font-mono text-center">
            <span className="flex items-center gap-1">
              <Shield className="h-3.5 w-3.5 text-violet-400" />
              <span>TLS 1.3 Strict</span>
            </span>
            <span>·</span>
            <span>256-Bit AES</span>
            <span>·</span>
            <span className="text-emerald-400">Zero-Trust RBAC</span>
          </div>

        </div>
      </main>

      {/* Forgot Credentials Modal */}
      {showForgotModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm rounded-xl border border-violet-500/30 bg-[#160a2c] p-5 text-white space-y-4 shadow-2xl">
            <h3 className="text-sm font-bold text-white">Corporate Identity Assistance</h3>
            <p className="text-xs text-violet-300 leading-relaxed">
              VeriRisk AI uses delegated enterprise OAuth 2.0 and SAML 2.0. If you have misplaced your security token or hardware key, select any demo persona on the login screen for instant verification, or reach out to your Global Security Operations Center (SOC).
            </p>
            <div className="flex justify-end pt-2">
              <button
                onClick={() => {
                  sounds.playClick();
                  setShowForgotModal(false);
                }}
                className="px-4 py-1.5 text-xs font-semibold bg-violet-600 hover:bg-violet-500 text-white rounded-lg cursor-pointer"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Subtle Bottom Bar */}
      <footer className="py-4 text-center text-xs text-violet-500 border-t border-violet-500/10">
        VeriRisk AI &copy; 2026. Enterprise Risk & Compliance Classifier.
      </footer>

    </div>
  );
};
