import React, { useState } from 'react';
import { 
  AlertTriangle, 
  CheckCircle2, 
  ShieldAlert, 
  FileEdit, 
  Send, 
  Search, 
  Filter, 
  User, 
  Clock, 
  FileText, 
  Check, 
  CornerDownRight, 
  ArrowRight,
  ShieldCheck,
  History
} from 'lucide-react';
import { DocumentRecord, RiskLevel, ComplianceCategory, UserRole } from '../types';
import { haptics } from '../utils/haptics';

interface ReviewQueueViewProps {
  documents: DocumentRecord[];
  activeRole: UserRole;
  onUpdateDocument: (doc: DocumentRecord) => void;
  onSelectDocumentForInspection: (doc: DocumentRecord) => void;
}

export const ReviewQueueView: React.FC<ReviewQueueViewProps> = ({
  documents,
  activeRole,
  onUpdateDocument,
  onSelectDocumentForInspection,
}) => {
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);
  const [filterSeverity, setFilterSeverity] = useState<string>('ALL');
  const [auditorNote, setAuditorNote] = useState<string>('');
  const [actionSuccessMessage, setActionSuccessMessage] = useState<string | null>(null);

  // Focus on documents that need manual review or have review states
  const reviewQueue = documents.filter(doc => {
    const isUnderReview = doc.needsManualReview || doc.status !== 'APPROVED';
    if (filterSeverity === 'ALL') return isUnderReview;
    if (filterSeverity === 'PENDING') return doc.status === 'PENDING_REVIEW';
    if (filterSeverity === 'ESCALATED') return doc.status === 'ESCALATED';
    return isUnderReview && doc.riskLevel === filterSeverity;
  });

  const activeDoc = documents.find(d => d.id === selectedDocId) || reviewQueue[0] || null;

  const handleApprove = (doc: DocumentRecord) => {
    haptics.trigger('success');
    const updated: DocumentRecord = {
      ...doc,
      status: 'APPROVED',
      needsManualReview: false,
      reviewer: `${activeRole.name} (${activeRole.title})`,
      reviewedAt: new Date().toISOString(),
      reviewerNotes: auditorNote.trim() || 'Reviewed and approved by authorized officer. Risk mitigated or deemed within organizational appetite.'
    };
    onUpdateDocument(updated);
    setAuditorNote('');
    showSuccess(`Approved "${doc.title}"`);
  };

  const handleEscalate = (doc: DocumentRecord) => {
    haptics.trigger('alert');
    const updated: DocumentRecord = {
      ...doc,
      status: 'ESCALATED',
      needsManualReview: true,
      reviewer: `${activeRole.name} (${activeRole.title})`,
      reviewedAt: new Date().toISOString(),
      reviewerNotes: auditorNote.trim() || 'Escalated to Chief Legal Officer and Executive Risk Committee for immediate review.'
    };
    onUpdateDocument(updated);
    setAuditorNote('');
    showSuccess(`Escalated "${doc.title}" to Chief Legal Officer`);
  };

  const handleRequestRemediation = (doc: DocumentRecord) => {
    haptics.trigger('medium');
    const updated: DocumentRecord = {
      ...doc,
      status: 'REMEDIATION_REQUESTED',
      needsManualReview: true,
      reviewer: `${activeRole.name} (${activeRole.title})`,
      reviewedAt: new Date().toISOString(),
      reviewerNotes: auditorNote.trim() || 'Contractual remediation requested. Clause amendments required prior to execution.'
    };
    onUpdateDocument(updated);
    setAuditorNote('');
    showSuccess(`Remediation requested for "${doc.title}"`);
  };

  const handleReclassify = (doc: DocumentRecord, newRisk: RiskLevel) => {
    haptics.trigger('medium');
    const updated: DocumentRecord = {
      ...doc,
      riskLevel: newRisk,
      status: 'RECLASSIFIED',
      needsManualReview: newRisk === 'CRITICAL' || newRisk === 'HIGH',
      reviewer: `${activeRole.name} (${activeRole.title})`,
      reviewedAt: new Date().toISOString(),
      reviewerNotes: auditorNote.trim() || `Manually reclassified risk severity to ${newRisk}.`
    };
    onUpdateDocument(updated);
    setAuditorNote('');
    showSuccess(`Reclassified "${doc.title}" to ${newRisk} Risk`);
  };

  const showSuccess = (msg: string) => {
    setActionSuccessMessage(msg);
    setTimeout(() => setActionSuccessMessage(null), 4000);
  };

  return (
    <div className="space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-amber-400" />
            <span>Manual Compliance Review & Disposition Queue</span>
          </h1>
          <p className="text-xs text-violet-300/70 mt-0.5">
            Triage uncertain model predictions (&lt; threshold), critical policy violations, and contractual remediation covenants.
          </p>
        </div>

        {/* Filter Segmented Control */}
        <div className="flex items-center gap-1 p-1 bg-[#160a2d] rounded-lg border border-violet-500/20 text-xs">
          {['ALL', 'PENDING', 'CRITICAL', 'HIGH', 'ESCALATED'].map((filter) => (
            <button
              key={filter}
              onClick={() => {
                haptics.trigger('light');
                setFilterSeverity(filter);
              }}
              className={`px-3 py-1 font-medium rounded transition-colors cursor-pointer ${
                filterSeverity === filter
                  ? 'bg-violet-600 text-white shadow-sm'
                  : 'text-violet-300 hover:text-white'
              }`}
            >
              {filter === 'ALL' ? 'All Queue' : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Success Notification Banner */}
      {actionSuccessMessage && (
        <div className="flex items-center justify-between p-3 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs animate-fadeIn">
          <div className="flex items-center gap-2">
            <Check className="h-4 w-4 text-emerald-400" />
            <span>{actionSuccessMessage}</span>
          </div>
          <button 
            onClick={() => setActionSuccessMessage(null)}
            className="text-emerald-400 hover:text-white font-mono text-[11px]"
          >
            Dismiss
          </button>
        </div>
      )}

      {/* Two-Pane Review Station */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Pane: Queue List */}
        <div className="lg:col-span-5 space-y-3">
          <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider flex items-center justify-between">
            <span>Documents Requiring Disposition ({reviewQueue.length})</span>
            <span className="text-[10px] text-violet-400">Click item to inspect</span>
          </div>

          <div className="space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
            {reviewQueue.map((doc) => {
              const isSelected = activeDoc?.id === doc.id;
              return (
                <div
                  key={doc.id}
                  onClick={() => {
                    haptics.trigger('light');
                    setSelectedDocId(doc.id);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                    isSelected
                      ? 'border-violet-400/60 bg-violet-900/40 text-white shadow-md ring-1 ring-violet-400/30'
                      : 'border-violet-500/20 bg-[#15092a] hover:bg-violet-900/20 text-violet-200'
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h4 className="text-xs font-bold text-white leading-snug">
                        {doc.title}
                      </h4>
                      <div className="text-[11px] text-violet-400 font-mono mt-0.5">
                        {doc.filename}
                      </div>
                    </div>

                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold shrink-0 ${
                      doc.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30' :
                      doc.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30' :
                      doc.riskLevel === 'MEDIUM' ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30' :
                      'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30'
                    }`}>
                      {doc.riskLevel}
                    </span>
                  </div>

                  <div className="mt-2 text-[11px] text-violet-300/80 line-clamp-2">
                    {doc.executiveSummary}
                  </div>

                  <div className="mt-3 pt-2.5 border-t border-violet-500/15 flex items-center justify-between text-[10px] text-violet-400 font-mono">
                    <span>Certainty: <strong className="text-violet-200">{doc.confidenceScore}%</strong></span>
                    <span className="capitalize">{doc.status.replace('_', ' ').toLowerCase()}</span>
                  </div>
                </div>
              );
            })}

            {reviewQueue.length === 0 && (
              <div className="p-10 rounded-xl border border-violet-500/20 bg-[#15092a] text-center space-y-2">
                <CheckCircle2 className="h-8 w-8 text-emerald-400 mx-auto" />
                <div className="text-xs font-semibold text-white">Queue Clear</div>
                <p className="text-[11px] text-violet-300/70">
                  No documents currently pending manual review under this filter.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Pane: Inspector & Auditor Action Console */}
        <div className="lg:col-span-7">
          {activeDoc ? (
            <div className="rounded-xl border border-violet-500/20 bg-[#15092a] p-5 space-y-5">
              
              {/* Document Overview Header */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-500/15 pb-4">
                <div>
                  <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
                    <span>{activeDoc.category}</span>
                    <span aria-hidden="true">·</span>
                    <span className="font-mono text-violet-300">{activeDoc.tokenCount} Tokens</span>
                  </div>
                  <h3 className="text-base font-bold text-white mt-1">
                    {activeDoc.title}
                  </h3>
                </div>

                <button
                  onClick={() => {
                    haptics.trigger('light');
                    onSelectDocumentForInspection(activeDoc);
                  }}
                  className="px-3 py-1.5 text-xs font-medium text-violet-200 bg-violet-900/40 hover:bg-violet-800/60 border border-violet-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
                >
                  <FileText className="h-3.5 w-3.5 text-violet-300" />
                  <span>View Full Contract</span>
                </button>
              </div>

              {/* Model Confidence & Why Flagged */}
              <div className="p-3.5 rounded-lg bg-violet-950/60 border border-violet-500/20 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-violet-300 font-medium">Model Confidence:</span>
                  <span className="font-mono font-bold text-white tabular-nums text-sm">
                    {activeDoc.confidenceScore}%
                  </span>
                </div>
                <div className="text-[11px] text-violet-300/80 leading-relaxed">
                  <strong>Trigger Reason: </strong>
                  {activeDoc.riskLevel === 'CRITICAL' 
                    ? 'Identified critical regulatory violation (OFAC/FCPA/Sanctions embargo).'
                    : activeDoc.confidenceScore < 80 
                    ? 'Prediction confidence fell below the 80% automated execution threshold.'
                    : 'High contractual liability exposure requiring compliance sign-off.'}
                </div>
              </div>

              {/* Flagged Excerpts & Key Risk Factors */}
              <div className="space-y-2">
                <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                  Flagged Clause Excerpts & Recommended Remediations
                </div>
                <div className="space-y-2.5 max-h-56 overflow-y-auto pr-1">
                  {activeDoc.keyRiskIndicators?.map((kri, idx) => (
                    <div key={idx} className="p-3 rounded-lg bg-violet-950/40 border border-violet-500/20 text-xs space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="font-bold text-white">{kri.term}</span>
                        <span className="text-[10px] font-mono text-violet-400">{kri.policyClause}</span>
                      </div>
                      <div className="p-2 rounded bg-[#100624] border-l-2 border-amber-400 text-[11px] text-amber-200/90 italic">
                        "{kri.excerpt}"
                      </div>
                      <div className="text-[11px] text-emerald-300">
                        <strong className="text-emerald-400">Remediation:</strong> {kri.remediation}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Auditor Trail / Previous Notes */}
              {activeDoc.reviewer && (
                <div className="p-3 rounded-lg bg-violet-950/30 border border-violet-500/15 text-xs space-y-1">
                  <div className="flex items-center gap-1.5 text-violet-400 font-medium">
                    <History className="h-3.5 w-3.5" />
                    <span>Last Auditor Review: {activeDoc.reviewer}</span>
                  </div>
                  <p className="text-[11px] text-violet-200 italic pl-5">
                    "{activeDoc.reviewerNotes}"
                  </p>
                </div>
              )}

              {/* Auditor Action Box */}
              <div className="pt-2 border-t border-violet-500/15 space-y-3">
                <div className="text-xs font-semibold text-white flex items-center justify-between">
                  <span>Auditor Disposition & Sign-Off</span>
                  <span className="text-[11px] text-violet-400 font-mono">
                    Signed as: {activeRole.name.split(',')[0]}
                  </span>
                </div>

                <textarea
                  rows={2}
                  value={auditorNote}
                  onChange={(e) => setAuditorNote(e.target.value)}
                  placeholder="Enter auditor review notes, legal justifications, or mitigation conditions..."
                  className="w-full p-2.5 text-xs bg-violet-950/60 border border-violet-500/30 rounded-lg text-white placeholder-violet-500 focus:outline-none focus:border-violet-400 resize-none"
                />

                {/* Disposition Action Buttons */}
                <div className="flex flex-wrap items-center justify-between gap-2 pt-1">
                  
                  {/* Reclassify Dropdown / Buttons */}
                  <div className="flex items-center gap-1">
                    <span className="text-[10px] text-violet-400 mr-1">Reclassify:</span>
                    {(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as RiskLevel[]).map((lvl) => (
                      <button
                        key={lvl}
                        onClick={() => handleReclassify(activeDoc, lvl)}
                        className={`px-2 py-1 text-[10px] font-semibold rounded border transition-colors cursor-pointer ${
                          activeDoc.riskLevel === lvl
                            ? 'bg-violet-600 text-white border-violet-400'
                            : 'bg-violet-950/40 text-violet-300 border-violet-500/20 hover:text-white'
                        }`}
                      >
                        {lvl.charAt(0)}
                      </button>
                    ))}
                  </div>

                  {/* Primary Workflow Actions */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleRequestRemediation(activeDoc)}
                      className="px-3 py-1.5 text-xs font-semibold text-amber-200 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 rounded-lg transition-colors cursor-pointer"
                    >
                      Remediate
                    </button>

                    <button
                      onClick={() => handleEscalate(activeDoc)}
                      className="px-3 py-1.5 text-xs font-semibold text-rose-200 bg-rose-500/20 hover:bg-rose-500/30 border border-rose-400/30 rounded-lg transition-colors cursor-pointer"
                    >
                      Escalate
                    </button>

                    <button
                      onClick={() => handleApprove(activeDoc)}
                      className="px-4 py-1.5 text-xs font-semibold text-white bg-emerald-600 hover:bg-emerald-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-emerald-950/40"
                    >
                      <Check className="h-3.5 w-3.5" />
                      <span>Approve</span>
                    </button>
                  </div>

                </div>
              </div>

            </div>
          ) : (
            <div className="p-12 rounded-xl border border-violet-500/20 bg-[#15092a] text-center space-y-2">
              <FileText className="h-8 w-8 text-violet-500 mx-auto" />
              <div className="text-sm font-semibold text-white">Select a Document</div>
              <p className="text-xs text-violet-300/70">
                Choose a flagged document from the left to inspect its risk clauses and record disposition.
              </p>
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
