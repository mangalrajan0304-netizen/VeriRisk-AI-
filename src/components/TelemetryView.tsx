import React, { useState, useEffect } from 'react';
import { 
  Activity, 
  Terminal, 
  Download, 
  RefreshCw, 
  Server, 
  Globe, 
  ShieldCheck, 
  AlertOctagon, 
  Search, 
  FileSpreadsheet, 
  FileCode, 
  Check, 
  Wifi,
  Zap
} from 'lucide-react';
import { DocumentRecord, TelemetryLog, EdgeNode } from '../types';
import { haptics } from '../utils/haptics';

interface TelemetryViewProps {
  documents: DocumentRecord[];
}

export const TelemetryView: React.FC<TelemetryViewProps> = ({ documents }) => {
  const [logs, setLogs] = useState<TelemetryLog[]>([]);
  const [filterLevel, setFilterLevel] = useState<string>('ALL');
  const [logSearch, setLogSearch] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [exportNotice, setExportNotice] = useState<string | null>(null);

  // Global Edge Node infrastructure
  const [edgeNodes, setEdgeNodes] = useState<EdgeNode[]>([
    { name: 'us-east-virginia', region: 'US East (N. Virginia)', latencyMs: 24, status: 'HEALTHY', failoverActive: false },
    { name: 'eu-central-frankfurt', region: 'EU Central (Frankfurt)', latencyMs: 31, status: 'HEALTHY', failoverActive: false },
    { name: 'ap-northeast-tokyo', region: 'APAC East (Tokyo)', latencyMs: 19, status: 'HEALTHY', failoverActive: false }
  ]);

  // Fetch telemetry logs from backend or populate defaults
  const fetchTelemetry = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/telemetry');
      if (res.ok) {
        const data = await res.json();
        if (data.logs) {
          setLogs(data.logs);
        }
      }
    } catch {
      // Fallback local initial telemetry
      if (logs.length === 0) {
        setLogs([
          {
            id: 'log-1',
            timestamp: new Date().toISOString(),
            type: 'INFO',
            message: 'Global CDN edge cache synchronized across US-East, EU-Central, and APAC-East.',
            source: 'cdn-edge',
            latencyMs: 14
          },
          {
            id: 'log-2',
            timestamp: new Date(Date.now() - 60000).toISOString(),
            type: 'AUDIT',
            message: 'OAuth 2.0 mutual bearer authorization validated for compliance officer session.',
            source: 'oauth-gateway',
            latencyMs: 8
          },
          {
            id: 'log-3',
            timestamp: new Date(Date.now() - 180000).toISOString(),
            type: 'INFO',
            message: 'Gemini 3.8 Flash model inference initialized with 80% confidence threshold gating.',
            source: 'gemini-worker',
            latencyMs: 280
          }
        ]);
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchTelemetry();
  }, []);

  // Simulate automated failover test
  const handleTriggerFailoverTest = () => {
    haptics.trigger('heavy');
    setEdgeNodes(prev => prev.map(node => {
      if (node.name === 'us-east-virginia') {
        return { ...node, status: 'FAILOVER', failoverActive: true, latencyMs: 39 };
      }
      return node;
    }));

    const failoverLog: TelemetryLog = {
      id: 'log-' + Date.now(),
      timestamp: new Date().toISOString(),
      type: 'WARN',
      message: 'AUTOMATED FAILOVER: Primary US-East node rerouted to EU-Central. Zero packet loss, edge cache maintained.',
      source: 'failover-controller',
      latencyMs: 39
    };

    setLogs(prev => [failoverLog, ...prev]);

    setTimeout(() => {
      setEdgeNodes(prev => prev.map(node => ({
        ...node,
        status: 'HEALTHY',
        failoverActive: false,
        latencyMs: node.name === 'us-east-virginia' ? 24 : node.latencyMs
      })));
    }, 8000);
  };

  // Export to CSV
  const handleExportCSV = () => {
    haptics.trigger('success');
    const headers = ['ID', 'Title', 'Filename', 'Category', 'RiskLevel', 'Confidence', 'Status', 'Reviewer', 'UploadedAt'];
    const rows = documents.map(d => [
      d.id,
      `"${d.title.replace(/"/g, '""')}"`,
      `"${d.filename.replace(/"/g, '""')}"`,
      `"${d.category}"`,
      d.riskLevel,
      d.confidenceScore,
      d.status,
      `"${d.reviewer || 'N/A'}"`,
      d.uploadedAt
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `veririsk_compliance_audit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotice('Exported compliance audit registry to CSV');
  };

  // Export to JSON
  const handleExportJSON = () => {
    haptics.trigger('success');
    const exportData = {
      metadata: {
        application: 'VeriRisk AI Document Governance',
        exportTimestamp: new Date().toISOString(),
        totalDocuments: documents.length,
        systemHealth: 'OPERATIONAL',
      },
      documents,
      telemetryLogs: logs.slice(0, 20),
    };

    const jsonString = `data:text/json;charset=utf-8,${encodeURIComponent(JSON.stringify(exportData, null, 2))}`;
    const link = document.createElement('a');
    link.setAttribute('href', jsonString);
    link.setAttribute('download', `veririsk_telemetry_dump_${Date.now()}.json`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    showNotice('Exported full telemetry and document JSON dump');
  };

  // Print Executive Summary Report
  const handlePrintReport = () => {
    haptics.trigger('medium');
    window.print();
  };

  const showNotice = (msg: string) => {
    setExportNotice(msg);
    setTimeout(() => setExportNotice(null), 4000);
  };

  const filteredLogs = logs.filter(log => {
    const matchesLevel = filterLevel === 'ALL' || log.type === filterLevel;
    const matchesSearch = logSearch === '' || 
      log.message.toLowerCase().includes(logSearch.toLowerCase()) ||
      log.source.toLowerCase().includes(logSearch.toLowerCase());
    return matchesLevel && matchesSearch;
  });

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header & Export Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Activity className="h-5 w-5 text-violet-400" />
            <span>Real-Time Error Telemetry, Logs & Infrastructure Resilience</span>
          </h1>
          <p className="text-xs text-violet-300/70 mt-0.5">
            Low-latency global edge monitoring, automated failover health, and export dashboards for regulatory auditing.
          </p>
        </div>

        {/* Export Buttons */}
        <div className="flex flex-wrap items-center gap-2.5">
          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 text-xs font-semibold text-violet-200 bg-violet-900/40 hover:bg-violet-800/60 border border-violet-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileSpreadsheet className="h-3.5 w-3.5 text-emerald-400" />
            <span>Export CSV</span>
          </button>

          <button
            onClick={handleExportJSON}
            className="px-3 py-1.5 text-xs font-semibold text-violet-200 bg-violet-900/40 hover:bg-violet-800/60 border border-violet-500/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer"
          >
            <FileCode className="h-3.5 w-3.5 text-violet-400" />
            <span>Export JSON</span>
          </button>

          <button
            onClick={handlePrintReport}
            className="px-3 py-1.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer shadow-md shadow-violet-950/40"
          >
            <Download className="h-3.5 w-3.5" />
            <span>Print Audit Report</span>
          </button>
        </div>
      </div>

      {/* Export Confirmation Notice */}
      {exportNotice && (
        <div className="flex items-center gap-2 p-3 rounded-lg bg-emerald-500/20 border border-emerald-400/30 text-emerald-200 text-xs animate-fadeIn">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{exportNotice}</span>
        </div>
      )}

      {/* Global Edge Node Health & Automated Failover */}
      <div className="rounded-xl border border-violet-500/20 bg-[#15092a] p-5 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-500/15 pb-4">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Globe className="h-4 w-4 text-violet-400" />
              <span>Multi-Region Edge Caching & Automated Failover Architecture</span>
            </h3>
            <p className="text-xs text-violet-300/70 mt-0.5">
              Edge routing ensures sub-50ms inference latency for cross-border compliance teams.
            </p>
          </div>

          <button
            onClick={handleTriggerFailoverTest}
            className="px-3 py-1.5 text-xs font-medium text-amber-300 bg-amber-500/20 hover:bg-amber-500/30 border border-amber-400/30 rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer self-start sm:self-center"
          >
            <Zap className="h-3.5 w-3.5 text-amber-400" />
            <span>Test Automated Failover</span>
          </button>
        </div>

        {/* 3 Edge Nodes */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {edgeNodes.map((node) => (
            <div
              key={node.name}
              className={`p-4 rounded-lg border transition-all ${
                node.status === 'FAILOVER'
                  ? 'border-amber-400/50 bg-amber-950/20 text-white'
                  : 'border-violet-500/20 bg-violet-950/50 text-white'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="font-semibold text-xs text-white">{node.region}</span>
                <span className={`text-[10px] font-mono px-2 py-0.5 rounded font-bold ${
                  node.status === 'HEALTHY'
                    ? 'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30'
                    : 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30'
                }`}>
                  {node.status}
                </span>
              </div>

              <div className="mt-3 flex items-baseline justify-between">
                <span className="text-[11px] text-violet-400">P95 Latency:</span>
                <span className="font-mono text-base font-bold text-white tabular-nums">
                  {node.latencyMs} ms
                </span>
              </div>

              <div className="mt-1 flex items-baseline justify-between text-[11px] text-violet-400">
                <span>CDN Cache Hit:</span>
                <span className="font-mono text-emerald-300 font-semibold tabular-nums">98.4%</span>
              </div>

              {node.failoverActive && (
                <div className="mt-2 text-[10px] text-amber-300 font-mono bg-amber-900/40 p-1 rounded">
                  Traffic automatically rerouted to EU Central (Frankfurt)
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Real-time Telemetry Log Viewer */}
      <div className="rounded-xl border border-violet-500/20 bg-[#15092a] p-5 space-y-4">
        
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-violet-500/15 pb-4">
          <div className="flex items-center gap-2">
            <Terminal className="h-4 w-4 text-violet-400" />
            <h3 className="text-sm font-bold text-white">Live System Telemetry & Audit Stream</h3>
          </div>

          <div className="flex flex-wrap items-center gap-2.5">
            {/* Search Input */}
            <div className="relative">
              <Search className="absolute left-2.5 top-2 h-3.5 w-3.5 text-violet-400" />
              <input
                type="text"
                placeholder="Filter logs..."
                value={logSearch}
                onChange={(e) => setLogSearch(e.target.value)}
                className="pl-8 pr-3 py-1 text-xs bg-violet-950/60 border border-violet-500/30 rounded text-white focus:outline-none focus:border-violet-400 w-36 sm:w-44"
              />
            </div>

            {/* Level Select */}
            <div className="flex items-center gap-1 p-0.5 bg-violet-950/60 rounded border border-violet-500/20 text-[11px]">
              {['ALL', 'INFO', 'WARN', 'AUDIT'].map(lvl => (
                <button
                  key={lvl}
                  onClick={() => {
                    haptics.trigger('light');
                    setFilterLevel(lvl);
                  }}
                  className={`px-2 py-0.5 rounded transition-colors cursor-pointer ${
                    filterLevel === lvl ? 'bg-violet-600 text-white' : 'text-violet-300 hover:text-white'
                  }`}
                >
                  {lvl}
                </button>
              ))}
            </div>

            <button
              onClick={fetchTelemetry}
              disabled={isLoading}
              title="Refresh logs"
              className="p-1.5 text-violet-300 hover:text-white bg-violet-900/30 rounded border border-violet-500/20 cursor-pointer"
            >
              <RefreshCw className={`h-3.5 w-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Dense Terminal Log Stream */}
        <div className="bg-[#0b0416] p-3 rounded-lg border border-violet-500/20 font-mono text-xs max-h-96 overflow-y-auto space-y-2">
          {filteredLogs.map((log) => {
            const levelColor = log.type === 'ERROR' ? 'text-rose-400 bg-rose-500/10' :
                               log.type === 'WARN' ? 'text-amber-400 bg-amber-500/10' :
                               log.type === 'AUDIT' ? 'text-emerald-400 bg-emerald-500/10' :
                               'text-violet-300 bg-violet-500/10';

            return (
              <div key={log.id} className="flex flex-col sm:flex-row sm:items-start gap-2 py-1 px-2 rounded hover:bg-violet-950/40 transition-colors leading-relaxed">
                <span className="text-[10px] text-violet-500 shrink-0 font-mono">
                  {new Date(log.timestamp).toLocaleTimeString()}
                </span>

                <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded shrink-0 ${levelColor}`}>
                  {log.type}
                </span>

                <span className="text-[10px] text-violet-400 shrink-0">
                  [{log.source}]
                </span>

                <span className="text-violet-100 flex-1 break-words">
                  {log.message}
                </span>

                {log.latencyMs > 0 && (
                  <span className="text-[10px] text-violet-400/80 font-mono shrink-0 tabular-nums">
                    {log.latencyMs}ms
                  </span>
                )}
              </div>
            );
          })}

          {filteredLogs.length === 0 && (
            <div className="p-8 text-center text-xs text-violet-500 font-mono">
              No telemetry events match query filter.
            </div>
          )}
        </div>

      </div>
    </div>
  );
};
