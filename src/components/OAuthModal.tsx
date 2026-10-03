import React, { useState } from 'react';
import { 
  X, 
  Key, 
  ShieldCheck, 
  UserCheck, 
  Copy, 
  Check, 
  Clock, 
  Lock, 
  Fingerprint, 
  Layers,
  LogOut 
} from 'lucide-react';
import { UserRole } from '../types';
import { MOCK_USERS } from '../data/sampleDocuments';
import { sounds } from '../utils/haptics';

interface OAuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  activeRole: UserRole;
  onSwitchRole: (role: UserRole) => void;
  onLogout?: () => void;
}

export const OAuthModal: React.FC<OAuthModalProps> = ({
  isOpen,
  onClose,
  activeRole,
  onSwitchRole,
  onLogout,
}) => {
  const [copiedToken, setCopiedToken] = useState<boolean>(false);

  if (!isOpen) return null;

  const mockJwt = `eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCIsImtpZCI6InZyaXNrLTIwMjYifQ.${btoa(
    JSON.stringify({
      sub: activeRole.id,
      name: activeRole.name,
      email: activeRole.email,
      department: activeRole.department,
      iss: 'https://identity.veririsk.internal/oauth2/v1',
      aud: 'veririsk-applet-prod',
      scopes: activeRole.scopes,
      exp: Math.floor(Date.now() / 1000) + 3600,
    })
  )}.vW8kX_9m2aL_4QzP...[verified-signature]`;

  const handleCopy = () => {
    sounds.playClick();
    navigator.clipboard.writeText(mockJwt);
    setCopiedToken(true);
    setTimeout(() => setCopiedToken(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl rounded-2xl border border-violet-500/30 bg-[#140828] p-6 shadow-2xl text-white space-y-6">
        
        {/* Header */}
        <div className="flex items-center justify-between border-b border-violet-500/20 pb-4">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300 ring-1 ring-violet-400/40">
              <Key className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">OAuth 2.0 Identity & Access Management</h2>
              <p className="text-xs text-violet-300/70">
                Single Sign-On (SSO) session with Role-Based Access Control (RBAC).
              </p>
            </div>
          </div>

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="p-1 rounded-lg text-violet-400 hover:text-white hover:bg-violet-900/40 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Current Active User Session Profile */}
        <div className="p-4 rounded-xl bg-violet-950/60 border border-violet-500/25 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs text-violet-400 font-semibold uppercase tracking-wider">
              Active Authorized Session
            </span>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400 font-mono">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Token Valid (52m remaining)</span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-violet-600 font-bold text-white ring-2 ring-violet-400/50 text-sm">
              {activeRole.avatarInitials}
            </div>
            <div>
              <div className="font-bold text-white text-sm">{activeRole.name}</div>
              <div className="text-xs text-violet-300">{activeRole.title} · {activeRole.department}</div>
              <div className="text-[11px] text-violet-400 font-mono mt-0.5">{activeRole.email}</div>
            </div>
          </div>

          {/* Granted Scopes */}
          <div className="pt-2 border-t border-violet-500/15">
            <div className="text-[11px] text-violet-400 mb-1.5 font-medium">Granted OAuth Scopes:</div>
            <div className="flex flex-wrap gap-1.5">
              {activeRole.scopes.map(scope => (
                <span
                  key={scope}
                  className="px-2 py-0.5 rounded text-[10px] font-mono bg-violet-900/60 text-violet-200 border border-violet-500/30"
                >
                  {scope}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* User Role Switcher for Testing Tiered Permissions */}
        <div className="space-y-2">
          <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
            Switch Organizational Role (Tiered Access)
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
            {MOCK_USERS.map((user) => (
              <button
                key={user.id}
                onClick={() => {
                  sounds.playTab();
                  onSwitchRole(user);
                }}
                className={`p-2.5 rounded-lg border text-left transition-all cursor-pointer ${
                  activeRole.id === user.id
                    ? 'border-violet-400 bg-violet-900/50 text-white shadow-sm ring-1 ring-violet-400/40'
                    : 'border-violet-500/20 bg-violet-950/40 hover:bg-violet-900/20 text-violet-200'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-white truncate">{user.name.split(',')[0]}</span>
                  {activeRole.id === user.id && (
                    <UserCheck className="h-3.5 w-3.5 text-emerald-400" />
                  )}
                </div>
                <div className="text-[11px] text-violet-300 truncate mt-0.5">{user.title}</div>
              </button>
            ))}
          </div>
        </div>

        {/* Bearer Token Viewer */}
        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs">
            <span className="font-semibold text-violet-300">Signed JWT Bearer Authorization</span>
            <button
              onClick={handleCopy}
              className="text-[11px] text-violet-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              {copiedToken ? (
                <>
                  <Check className="h-3.5 w-3.5 text-emerald-400" />
                  <span className="text-emerald-300 font-mono">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="h-3.5 w-3.5" />
                  <span>Copy Token</span>
                </>
              )}
            </button>
          </div>
          <div className="p-2.5 rounded-lg bg-black/60 border border-violet-500/20 font-mono text-[10px] text-violet-300/80 break-all select-all leading-relaxed max-h-20 overflow-y-auto">
            {mockJwt}
          </div>
        </div>

        {/* Footer */}
        <div className="pt-2 border-t border-violet-500/20 flex items-center justify-between">
          {onLogout ? (
            <button
              onClick={() => {
                sounds.playLogout();
                onClose();
                onLogout();
              }}
              className="px-3 py-1.5 text-xs font-semibold text-rose-300 hover:text-white bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
            >
              <LogOut className="h-3.5 w-3.5" />
              <span>Sign Out of Terminal</span>
            </button>
          ) : <div />}

          <button
            onClick={() => {
              sounds.playClick();
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors cursor-pointer"
          >
            Close Session View
          </button>
        </div>

      </div>
    </div>
  );
};
