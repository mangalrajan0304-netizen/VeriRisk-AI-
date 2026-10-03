import React from 'react';
import { 
  ShieldCheck, 
  Moon, 
  Sun, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  FileText, 
  AlertTriangle, 
  BarChart3, 
  Activity,
  Layers,
  LogOut
} from 'lucide-react';
import { sounds } from '../utils/haptics';
import { UserRole } from '../types';

interface NavbarProps {
  currentTab: 'dashboard' | 'classifier' | 'review' | 'evaluation' | 'telemetry';
  onSelectTab: (tab: 'dashboard' | 'classifier' | 'review' | 'evaluation' | 'telemetry') => void;
  flaggedCount: number;
  activeRole: UserRole;
  onOpenOAuthModal: () => void;
  nightMode: boolean;
  onToggleNightMode: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  onSelectTab,
  flaggedCount,
  activeRole,
  onOpenOAuthModal,
  nightMode,
  onToggleNightMode,
  soundEnabled,
  onToggleSound,
  onLogout,
}) => {
  const handleNavClick = (tab: 'dashboard' | 'classifier' | 'review' | 'evaluation' | 'telemetry') => {
    sounds.playTab();
    onSelectTab(tab);
  };

  return (
    <header className="sticky top-0 z-40 w-full border-b border-violet-500/20 bg-[#120826]/90 backdrop-blur-md transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-violet-600/30 text-violet-300 ring-1 ring-violet-400/40">
            <ShieldCheck className="h-5 w-5 text-violet-300" />
          </div>
          <button 
            onClick={() => handleNavClick('dashboard')}
            className="text-left font-bold tracking-tight text-white hover:text-violet-200 transition-colors cursor-pointer"
          >
            <span className="text-lg">VeriRisk</span>
            <span className="text-violet-400 font-medium ml-1">AI</span>
          </button>
        </div>

        {/* Zone 2: Clean text navigation links */}
        <nav className="hidden md:flex items-center gap-1 lg:gap-2">
          <button
            onClick={() => handleNavClick('dashboard')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'dashboard'
                ? 'bg-violet-600/30 text-white ring-1 ring-violet-400/40'
                : 'text-violet-200/80 hover:text-white hover:bg-violet-900/30'
            }`}
          >
            <Layers className="h-3.5 w-3.5 text-violet-400" />
            <span>Overview</span>
          </button>

          <button
            onClick={() => handleNavClick('classifier')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'classifier'
                ? 'bg-violet-600/30 text-white ring-1 ring-violet-400/40'
                : 'text-violet-200/80 hover:text-white hover:bg-violet-900/30'
            }`}
          >
            <FileText className="h-3.5 w-3.5 text-violet-400" />
            <span>Document Classifier</span>
          </button>

          <button
            onClick={() => handleNavClick('review')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'review'
                ? 'bg-violet-600/30 text-white ring-1 ring-violet-400/40'
                : 'text-violet-200/80 hover:text-white hover:bg-violet-900/30'
            }`}
          >
            <AlertTriangle className="h-3.5 w-3.5 text-amber-400" />
            <span>Manual Review</span>
            {flaggedCount > 0 && (
              <span className="ml-1 px-1.5 py-0.2 text-[10px] font-bold bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30 rounded">
                {flaggedCount}
              </span>
            )}
          </button>

          <button
            onClick={() => handleNavClick('evaluation')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'evaluation'
                ? 'bg-violet-600/30 text-white ring-1 ring-violet-400/40'
                : 'text-violet-200/80 hover:text-white hover:bg-violet-900/30'
            }`}
          >
            <BarChart3 className="h-3.5 w-3.5 text-violet-400" />
            <span>Metrics & Matrix</span>
          </button>

          <button
            onClick={() => handleNavClick('telemetry')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-md transition-colors flex items-center gap-1.5 cursor-pointer whitespace-nowrap ${
              currentTab === 'telemetry'
                ? 'bg-violet-600/30 text-white ring-1 ring-violet-400/40'
                : 'text-violet-200/80 hover:text-white hover:bg-violet-900/30'
            }`}
          >
            <Activity className="h-3.5 w-3.5 text-emerald-400" />
            <span>Telemetry & Logs</span>
          </button>
        </nav>

        {/* Zone 3: Primary Actions (Sound, Theme, OAuth Profile, Logout) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Sound Effects Toggle */}
          <button
            onClick={() => {
              onToggleSound();
            }}
            title={soundEnabled ? 'Sound effects enabled (click to mute)' : 'Sound effects muted (click to enable)'}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-500/20 bg-violet-950/40 text-violet-300 hover:text-white hover:border-violet-400/40 transition-colors cursor-pointer"
          >
            {soundEnabled ? (
              <Volume2 className="h-4 w-4 text-violet-300" />
            ) : (
              <VolumeX className="h-4 w-4 text-violet-500" />
            )}
          </button>

          {/* Night Mode / Violet Shade Accessibility Toggle */}
          <button
            onClick={() => {
              sounds.playClick();
              onToggleNightMode();
            }}
            title={nightMode ? 'Switch to Royal Violet Tone' : 'Switch to Midnight Obsidian Violet Tone'}
            className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-500/20 bg-violet-950/40 text-violet-300 hover:text-white hover:border-violet-400/40 transition-colors cursor-pointer"
          >
            {nightMode ? (
              <Moon className="h-4 w-4 text-violet-300" />
            ) : (
              <Sun className="h-4 w-4 text-amber-300" />
            )}
          </button>

          {/* OAuth 2.0 Auth / Role Profile Button */}
          <button
            onClick={() => {
              sounds.playClick();
              onOpenOAuthModal();
            }}
            className="flex items-center gap-2 rounded-lg border border-violet-500/30 bg-violet-900/40 px-2.5 py-1 text-xs font-medium text-white hover:bg-violet-800/50 hover:border-violet-400/50 transition-all cursor-pointer shadow-sm"
          >
            <div className="flex h-6 w-6 items-center justify-center rounded-full bg-violet-500 text-[11px] font-bold text-white ring-1 ring-white/20">
              {activeRole.avatarInitials}
            </div>
            <div className="hidden sm:flex flex-col text-left leading-none">
              <span className="text-[11px] font-semibold text-white truncate max-w-[110px]">{activeRole.name.split(',')[0]}</span>
              <span className="text-[9px] text-violet-300 font-mono">OAuth 2.0 Active</span>
            </div>
            <UserCheck className="h-3.5 w-3.5 text-emerald-400 ml-0.5" />
          </button>

          {/* Logout Button */}
          <button
            onClick={() => {
              sounds.playLogout();
              onLogout();
            }}
            title="Sign out of console"
            className="flex h-8 w-8 items-center justify-center rounded-md border border-violet-500/20 bg-violet-950/40 text-violet-300 hover:text-rose-300 hover:border-rose-400/40 transition-colors cursor-pointer"
          >
            <LogOut className="h-4 w-4" />
          </button>

        </div>
      </div>
    </header>
  );
};
