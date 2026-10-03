import React from 'react';
import { 
  FileText, 
  AlertTriangle, 
  CheckCircle2, 
  ArrowUpRight, 
  TrendingUp, 
  Search, 
  ShieldAlert, 
  Filter,
  Eye,
  Sliders,
  Sparkles
} from 'lucide-react';
import { DocumentRecord, RiskLevel } from '../types';
import { haptics } from '../utils/haptics';

interface OverviewDashboardProps {
  documents: DocumentRecord[];
  confidenceThreshold: number;
  onSetThreshold: (val: number) => void;
  onSelectDocument: (doc: DocumentRecord) => void;
  onNavigateToClassifier: () => void;
  onNavigateToReview: () => void;
}

export const OverviewDashboard: React.FC<OverviewDashboardProps> = ({
  documents,
  confidenceThreshold,
  onSetThreshold,
  onSelectDocument,
  onNavigateToClassifier,
  onNavigateToReview,
}) => {
  const [filterRisk, setFilterRisk] = React.useState<string>('ALL');
  const [searchQuery, setSearchQuery] = React.useState<string>('');

  const flaggedDocs = documents.filter(d => d.needsManualReview && d.status === 'PENDING_REVIEW');
  const criticalDocs = documents.filter(d => d.riskLevel === 'CRITICAL');
  const highDocs = documents.filter(d => d.riskLevel === 'HIGH');
  const mediumDocs = documents.filter(d => d.riskLevel === 'MEDIUM');
  const lowDocs = documents.filter(d => d.riskLevel === 'LOW');

  const avgConfidence = documents.length > 0 
    ? Math.round(documents.reduce((acc, d) => acc + d.confidenceScore, 0) / documents.length)
    : 0;

  const filteredDocs = documents.filter(doc => {
    const matchesRisk = filterRisk === 'ALL' || doc.riskLevel === filterRisk;
    const matchesSearch = searchQuery === '' || 
      doc.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.filename.toLowerCase().includes(searchQuery.toLowerCase()) ||
      doc.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesRisk && matchesSearch;
  });

  const getRiskBadge = (level: RiskLevel) => {
    switch (level) {
      case 'CRITICAL':
        return <span className="text-xs font-semibold text-rose-300">Critical Risk</span>;
      case 'HIGH':
        return <span className="text-xs font-semibold text-amber-300">High Risk</span>;
      case 'MEDIUM':
        return <span className="text-xs font-semibold text-violet-300">Medium Risk</span>;
      case 'LOW':
        return <span className="text-xs font-semibold text-emerald-300">Low Risk</span>;
    }
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Banner / Hero with Metric Highlights */}
      <div className="rounded-xl border border-violet-500/20 bg-gradient-to-r from-violet-950/40 via-[#180a33] to-[#120726] p-6 lg:p-8">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex items-center gap-2 text-xs font-semibold text-violet-400">
              <span>Enterprise Risk Intelligence</span>
              <span aria-hidden="true">·</span>
              <span>Gemini 3.8 Multi-Tier</span>
              <span aria-hidden="true">·</span>
              <span>Continuous Compliance</span>
            </div>
            <h1 className="text-2xl lg:text-3xl font-bold tracking-tight text-white">
              AI Document Risk & Compliance Governance
            </h1>
            <p className="text-sm text-violet-200/80 leading-relaxed">
              Automated document classification, regulatory violation explainability, and proactive manual review triage for enterprise contracts, trade agreements, and privacy covenants.
            </p>
          </div>

          {/* Quick CTA Actions */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={() => {
                haptics.trigger('medium');
                onNavigateToClassifier();
              }}
              className="px-4 py-2 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors flex items-center gap-2 cursor-pointer shadow-md shadow-violet-900/30"
            >
              <FileText className="h-4 w-4" />
              <span>Classify New Document</span>
            </button>

            <button
              onClick={() => {
                haptics.trigger('medium');
                onNavigateToReview();
              }}
              className="px-4 py-2 text-xs font-semibold text-violet-200 bg-violet-900/40 hover:bg-violet-800/60 border border-violet-500/30 rounded-lg transition-colors flex items-center gap-2 cursor-pointer"
            >
              <AlertTriangle className="h-4 w-4 text-amber-400" />
              <span>Manual Review Queue ({flaggedDocs.length})</span>
            </button>
          </div>
        </div>

        {/* Global Confidence Threshold Bar */}
        <div className="mt-6 pt-6 border-t border-violet-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Sliders className="h-4 w-4 text-violet-400" />
            <div>
              <div className="text-xs font-semibold text-white">Automated Acceptance Threshold</div>
              <div className="text-[11px] text-violet-300/70">
                Documents with model confidence below {confidenceThreshold}% or flagged critical violations route to human reviewers.
              </div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="range"
              min="60"
              max="95"
              step="5"
              value={confidenceThreshold}
              onChange={(e) => {
                const val = Number(e.target.value);
                haptics.trigger('light');
                onSetThreshold(val);
              }}
              className="w-36 accent-violet-500 cursor-pointer"
            />
            <span className="font-mono text-xs font-bold text-violet-200 bg-violet-900/60 px-2.5 py-1 rounded border border-violet-500/30 tabular-nums">
              {confidenceThreshold}% Min
            </span>
          </div>
        </div>
      </div>

      {/* Primary KPI Metrics Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
        <div className="rounded-lg border border-violet-500/20 bg-[#160a2d] p-4">
          <div className="text-xs text-violet-300/70">Active Documents</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{documents.length}</span>
            <span className="text-[11px] text-violet-400 font-medium">Repository</span>
          </div>
        </div>

        <div className="rounded-lg border border-violet-500/20 bg-[#160a2d] p-4">
          <div className="text-xs text-violet-300/70">Pending Manual Review</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-amber-300 font-mono tabular-nums">{flaggedDocs.length}</span>
            <span className="text-[11px] text-amber-400/80 font-medium">Triage Queue</span>
          </div>
        </div>

        <div className="rounded-lg border border-violet-500/20 bg-[#160a2d] p-4">
          <div className="text-xs text-violet-300/70">Critical Exposure</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-300 font-mono tabular-nums">{criticalDocs.length}</span>
            <span className="text-[11px] text-rose-400/80 font-medium">Sanctions & FCPA</span>
          </div>
        </div>

        <div className="rounded-lg border border-violet-500/20 bg-[#160a2d] p-4">
          <div className="text-xs text-violet-300/70">Mean Model Certainty</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-white font-mono tabular-nums">{avgConfidence}%</span>
            <span className="text-[11px] text-emerald-400 font-medium">Weighted</span>
          </div>
        </div>

        <div className="rounded-lg border border-violet-500/20 bg-[#160a2d] p-4 col-span-2 md:col-span-1">
          <div className="text-xs text-violet-300/70">Automated Approvals</div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-300 font-mono tabular-nums">
              {documents.filter(d => d.status === 'APPROVED').length}
            </span>
            <span className="text-[11px] text-emerald-400/80 font-medium">Compliant</span>
          </div>
        </div>
      </div>

      {/* Main Document Table & Risk Classification Feed */}
      <div className="rounded-xl border border-violet-500/20 bg-[#15092a] overflow-hidden">
        
        {/* Table Control Header */}
        <div className="p-4 sm:p-5 border-b border-violet-500/15 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-base font-bold text-white">Document Compliance Registry</h2>
            <p className="text-xs text-violet-300/70">
              Live audit record with regulatory category mapping, risk severity, and review dispositions.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-violet-400" />
              <input
                type="text"
                placeholder="Search contracts, clauses..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-8 pr-3 py-1.5 text-xs bg-violet-950/60 border border-violet-500/30 rounded-lg text-white placeholder-violet-400/50 focus:outline-none focus:border-violet-400 w-48 sm:w-56"
              />
            </div>

            {/* Filter Risk Segmented Controls */}
            <div className="flex items-center gap-1 p-1 bg-violet-950/60 rounded-lg border border-violet-500/20">
              {['ALL', 'CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map((lvl) => (
                <button
                  key={lvl}
                  onClick={() => {
                    haptics.trigger('light');
                    setFilterRisk(lvl);
                  }}
                  className={`px-2.5 py-1 text-[11px] font-medium rounded transition-colors cursor-pointer ${
                    filterRisk === lvl
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-violet-300 hover:text-white'
                  }`}
                >
                  {lvl === 'ALL' ? 'All' : lvl.charAt(0) + lvl.slice(1).toLowerCase()}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Dense Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-[#1b0c36]/60 text-violet-300 border-b border-violet-500/15 text-[11px] font-semibold">
              <tr>
                <th className="py-3 px-4">Document Title & Filename</th>
                <th className="py-3 px-4">Compliance Domain</th>
                <th className="py-3 px-4">Risk Severity</th>
                <th className="py-3 px-4 text-right">Confidence</th>
                <th className="py-3 px-4">Audit Status</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-violet-500/10">
              {filteredDocs.map((doc) => {
                return (
                  <tr 
                    key={doc.id}
                    onClick={() => {
                      haptics.trigger('light');
                      onSelectDocument(doc);
                    }}
                    className="hover:bg-violet-900/20 transition-colors cursor-pointer group"
                  >
                    <td className="py-3.5 px-4">
                      <div className="font-semibold text-white group-hover:text-violet-200 transition-colors">
                        {doc.title}
                      </div>
                      <div className="text-[11px] text-violet-400 font-mono mt-0.5">
                        {doc.filename}
                      </div>
                    </td>

                    <td className="py-3.5 px-4">
                      <span className="text-violet-200">{doc.category}</span>
                    </td>

                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-1.5">
                        {getRiskBadge(doc.riskLevel)}
                      </div>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <span className={`font-mono font-bold tabular-nums ${
                        doc.confidenceScore >= confidenceThreshold ? 'text-emerald-300' : 'text-amber-300'
                      }`}>
                        {doc.confidenceScore}%
                      </span>
                    </td>

                    <td className="py-3.5 px-4">
                      {doc.needsManualReview && doc.status === 'PENDING_REVIEW' ? (
                        <span className="text-[11px] font-medium text-amber-300 flex items-center gap-1">
                          <AlertTriangle className="h-3 w-3 text-amber-400 shrink-0" />
                          Review Required
                        </span>
                      ) : doc.status === 'APPROVED' ? (
                        <span className="text-[11px] font-medium text-emerald-300 flex items-center gap-1">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400 shrink-0" />
                          Approved
                        </span>
                      ) : doc.status === 'ESCALATED' ? (
                        <span className="text-[11px] font-medium text-rose-300 flex items-center gap-1">
                          <ShieldAlert className="h-3 w-3 text-rose-400 shrink-0" />
                          Escalated
                        </span>
                      ) : (
                        <span className="text-[11px] font-medium text-violet-300">
                          {doc.status.replace('_', ' ')}
                        </span>
                      )}
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          haptics.trigger('light');
                          onSelectDocument(doc);
                        }}
                        className="px-2.5 py-1 text-[11px] font-medium text-violet-300 hover:text-white bg-violet-900/30 hover:bg-violet-800/50 border border-violet-500/20 rounded transition-colors"
                      >
                        Inspect
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Empty state if search yields no results */}
        {filteredDocs.length === 0 && (
          <div className="p-12 text-center">
            <Search className="h-8 w-8 text-violet-500 mx-auto mb-3" />
            <h3 className="text-sm font-semibold text-white">No documents match this filter</h3>
            <p className="text-xs text-violet-300/70 mt-1 max-w-sm mx-auto">
              Try adjusting your search criteria or reset the risk filter to view all enterprise records.
            </p>
            <button
              onClick={() => {
                setFilterRisk('ALL');
                setSearchQuery('');
              }}
              className="mt-4 px-3 py-1.5 text-xs text-violet-300 border border-violet-500/30 rounded-lg hover:bg-violet-900/30"
            >
              Reset Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
