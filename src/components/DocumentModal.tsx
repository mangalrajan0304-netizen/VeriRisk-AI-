import React from 'react';
import { 
  X, 
  FileText, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle, 
  ExternalLink,
  Layers,
  BookOpen
} from 'lucide-react';
import { DocumentRecord } from '../types';
import { haptics } from '../utils/haptics';

interface DocumentModalProps {
  document: DocumentRecord | null;
  onClose: () => void;
}

export const DocumentModal: React.FC<DocumentModalProps> = ({ document, onClose }) => {
  if (!document) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-4xl max-h-[90vh] rounded-2xl border border-violet-500/30 bg-[#130726] shadow-2xl text-white flex flex-col overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-violet-500/20 flex items-center justify-between bg-[#180a32]">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-violet-600/30 text-violet-300 ring-1 ring-violet-400/40">
              <BookOpen className="h-5 w-5 text-violet-300" />
            </div>
            <div>
              <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
                <span>{document.category}</span>
                <span aria-hidden="true">·</span>
                <span className="font-mono text-violet-300">{document.filename}</span>
              </div>
              <h2 className="text-base font-bold text-white mt-0.5">{document.title}</h2>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <span className={`px-2.5 py-1 rounded text-xs font-bold ${
              document.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30' :
              document.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30' :
              document.riskLevel === 'MEDIUM' ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30' :
              'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30'
            }`}>
              {document.riskLevel} RISK ({document.confidenceScore}% Certainty)
            </span>

            <button
              onClick={() => {
                haptics.trigger('light');
                onClose();
              }}
              className="p-1.5 rounded-lg text-violet-400 hover:text-white hover:bg-violet-900/40 transition-colors cursor-pointer"
            >
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        {/* Content Body (Scrollable) */}
        <div className="p-6 overflow-y-auto space-y-6">
          
          {/* Executive Summary */}
          <div className="p-4 rounded-xl bg-violet-950/60 border border-violet-500/25 space-y-1.5">
            <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
              Executive Compliance Assessment
            </div>
            <p className="text-xs text-violet-100 leading-relaxed">
              {document.executiveSummary}
            </p>
          </div>

          {/* Explainability Vectors */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <div className="p-3 rounded-lg bg-violet-950/40 border border-violet-500/20">
              <div className="text-[10px] text-violet-400">Lexical Risk Factor</div>
              <div className="font-mono text-base font-bold text-white mt-1">
                {(document.explainabilityBreakdown.lexicalRiskWeight * 100).toFixed(0)}%
              </div>
            </div>

            <div className="p-3 rounded-lg bg-violet-950/40 border border-violet-500/20">
              <div className="text-[10px] text-violet-400">Clause Exposure Score</div>
              <div className="font-mono text-base font-bold text-white mt-1">
                {document.explainabilityBreakdown.clauseExposureScore} / 100
              </div>
            </div>

            <div className="p-3 rounded-lg bg-violet-950/40 border border-violet-500/20">
              <div className="text-[10px] text-violet-400">Jurisdictional Risk Factor</div>
              <div className="font-mono text-base font-bold text-white mt-1">
                {document.explainabilityBreakdown.jurisdictionalRiskScore} / 100
              </div>
            </div>
          </div>

          {/* Key Risk Indicators Excerpts */}
          {document.keyRiskIndicators && document.keyRiskIndicators.length > 0 && (
            <div className="space-y-3">
              <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
                Flagged Clauses & Regulatory Directives
              </div>
              <div className="space-y-3">
                {document.keyRiskIndicators.map((kri, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-violet-950/50 border border-violet-500/25 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-white">{kri.term}</span>
                      <span className="font-mono text-[10px] text-violet-300">{kri.policyClause}</span>
                    </div>
                    <div className="p-2.5 rounded bg-black/40 border-l-2 border-amber-400 text-[11px] text-amber-200 italic leading-relaxed">
                      "{kri.excerpt}"
                    </div>
                    <div className="text-[11px] text-emerald-300">
                      <strong>Required Remediation: </strong>
                      {kri.remediation}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Cleaned Document Text Body */}
          <div className="space-y-2">
            <div className="text-xs font-semibold text-violet-300 uppercase tracking-wider">
              Document Text Body (Sanitized & Normalized)
            </div>
            <div className="p-4 rounded-xl bg-black/50 border border-violet-500/20 font-mono text-xs text-violet-200/90 whitespace-pre-wrap leading-relaxed max-h-72 overflow-y-auto">
              {document.cleanedText || document.rawText}
            </div>
          </div>

        </div>

        {/* Footer */}
        <div className="p-4 border-t border-violet-500/20 bg-[#160a2d] flex justify-end">
          <button
            onClick={() => {
              haptics.trigger('light');
              onClose();
            }}
            className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors cursor-pointer"
          >
            Close Document
          </button>
        </div>

      </div>
    </div>
  );
};
