import React, { useState } from 'react';
import { DocumentRecord, UserRole } from './types';
import { SAMPLE_DOCUMENTS, MOCK_USERS } from './data/sampleDocuments';
import { Navbar } from './components/Navbar';
import { OverviewDashboard } from './components/OverviewDashboard';
import { ClassifierView } from './components/ClassifierView';
import { ReviewQueueView } from './components/ReviewQueueView';
import { EvaluationView } from './components/EvaluationView';
import { TelemetryView } from './components/TelemetryView';
import { OAuthModal } from './components/OAuthModal';
import { DocumentModal } from './components/DocumentModal';
import { LoginPage } from './components/LoginPage';
import { sounds } from './utils/haptics';

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(true);
  const [currentTab, setCurrentTab] = useState<'dashboard' | 'classifier' | 'review' | 'evaluation' | 'telemetry'>('dashboard');
  const [documents, setDocuments] = useState<DocumentRecord[]>(SAMPLE_DOCUMENTS);
  const [confidenceThreshold, setConfidenceThreshold] = useState<number>(80);
  const [activeRole, setActiveRole] = useState<UserRole>(MOCK_USERS[0]);
  const [nightMode, setNightMode] = useState<boolean>(true); // true = Deep Obsidian Midnight Violet, false = Royal Studio Violet
  const [soundEnabled, setSoundEnabled] = useState<boolean>(sounds.isEnabled());
  const [isOAuthModalOpen, setIsOAuthModalOpen] = useState<boolean>(false);
  const [inspectedDoc, setInspectedDoc] = useState<DocumentRecord | null>(null);

  // Toggle night mode tones
  const handleToggleNightMode = () => {
    setNightMode(prev => !prev);
  };

  // Toggle sound effects and haptics
  const handleToggleSound = () => {
    const newState = sounds.toggle();
    setSoundEnabled(newState);
  };

  // Handle Login
  const handleLogin = (role: UserRole) => {
    setActiveRole(role);
    setIsAuthenticated(true);
    setCurrentTab('dashboard');
  };

  // Handle Logout
  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  // Add newly classified document
  const handleDocumentClassified = (newDoc: DocumentRecord) => {
    setDocuments(prev => [newDoc, ...prev]);
    // If flagged, prompt reviewer
    if (newDoc.needsManualReview) {
      setCurrentTab('review');
    }
  };

  // Update existing document status/review
  const handleUpdateDocument = (updatedDoc: DocumentRecord) => {
    setDocuments(prev => prev.map(d => (d.id === updatedDoc.id ? updatedDoc : d)));
  };

  const flaggedCount = documents.filter(d => d.needsManualReview && d.status === 'PENDING_REVIEW').length;

  // Render Login Page if not authenticated
  if (!isAuthenticated) {
    return (
      <LoginPage
        onLogin={handleLogin}
        nightMode={nightMode}
        onToggleNightMode={handleToggleNightMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
      />
    );
  }

  return (
    <div className={`min-h-screen transition-colors duration-300 ${
      nightMode ? 'bg-[#0b0416] text-white' : 'bg-[#120726] text-white'
    }`}>
      
      {/* Primary Navigation Bar */}
      <Navbar
        currentTab={currentTab}
        onSelectTab={setCurrentTab}
        flaggedCount={flaggedCount}
        activeRole={activeRole}
        onOpenOAuthModal={() => setIsOAuthModalOpen(true)}
        nightMode={nightMode}
        onToggleNightMode={handleToggleNightMode}
        soundEnabled={soundEnabled}
        onToggleSound={handleToggleSound}
        onLogout={handleLogout}
      />

      {/* Main Viewport Container */}
      <main className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-8">
        {currentTab === 'dashboard' && (
          <OverviewDashboard
            documents={documents}
            confidenceThreshold={confidenceThreshold}
            onSetThreshold={setConfidenceThreshold}
            onSelectDocument={(doc) => setInspectedDoc(doc)}
            onNavigateToClassifier={() => setCurrentTab('classifier')}
            onNavigateToReview={() => setCurrentTab('review')}
          />
        )}

        {currentTab === 'classifier' && (
          <ClassifierView
            confidenceThreshold={confidenceThreshold}
            onSetThreshold={setConfidenceThreshold}
            onDocumentClassified={handleDocumentClassified}
          />
        )}

        {currentTab === 'review' && (
          <ReviewQueueView
            documents={documents}
            activeRole={activeRole}
            onUpdateDocument={handleUpdateDocument}
            onSelectDocumentForInspection={(doc) => setInspectedDoc(doc)}
          />
        )}

        {currentTab === 'evaluation' && (
          <EvaluationView
            documents={documents}
            confidenceThreshold={confidenceThreshold}
            onSetThreshold={setConfidenceThreshold}
          />
        )}

        {currentTab === 'telemetry' && (
          <TelemetryView documents={documents} />
        )}
      </main>

      {/* Bottom Footer */}
      <footer className="border-t border-violet-500/20 bg-[#090312] py-8 text-xs text-violet-400">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="font-bold text-white">VeriRisk AI</span>
            <span aria-hidden="true">·</span>
            <span>Document Risk & Compliance Classification Engine</span>
            <span aria-hidden="true">·</span>
            <span>ISO 27001 & SOC 2 Audited</span>
          </div>

          <div className="flex items-center gap-4 text-[11px] text-violet-400/80">
            <span>High-Contrast Violet UI</span>
            <span aria-hidden="true">·</span>
            <button
              onClick={() => {
                sounds.playLogout();
                handleLogout();
              }}
              className="text-violet-300 hover:text-white transition-colors cursor-pointer"
            >
              Terminal Sign Out
            </button>
            <span aria-hidden="true">·</span>
            <span className="text-emerald-400">Edge Caching Active</span>
          </div>
        </div>
      </footer>

      {/* Modals */}
      <OAuthModal
        isOpen={isOAuthModalOpen}
        onClose={() => setIsOAuthModalOpen(false)}
        activeRole={activeRole}
        onSwitchRole={(role) => setActiveRole(role)}
        onLogout={handleLogout}
      />

      <DocumentModal
        document={inspectedDoc}
        onClose={() => setInspectedDoc(null)}
      />

    </div>
  );
}
