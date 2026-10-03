import React, { useState, useRef } from 'react';
import { 
  Upload, 
  FileText, 
  Sparkles, 
  Sliders, 
  CheckCircle2, 
  AlertTriangle, 
  ShieldAlert, 
  Info, 
  ArrowRight, 
  RefreshCw, 
  Layers, 
  Cpu, 
  FileSearch,
  ExternalLink,
  Check
} from 'lucide-react';
import { DocumentRecord, RiskLevel, ComplianceCategory } from '../types';
import { cleanDocumentText, CleanedTextResult } from '../utils/textCleaner';
import { haptics } from '../utils/haptics';
import { SAMPLE_DOCUMENTS } from '../data/sampleDocuments';

interface ClassifierViewProps {
  confidenceThreshold: number;
  onSetThreshold: (val: number) => void;
  onDocumentClassified: (doc: DocumentRecord) => void;
}

export const ClassifierView: React.FC<ClassifierViewProps> = ({
  confidenceThreshold,
  onSetThreshold,
  onDocumentClassified,
}) => {
  const [inputText, setInputText] = useState<string>(SAMPLE_DOCUMENTS[0].rawText);
  const [filename, setFilename] = useState<string>(SAMPLE_DOCUMENTS[0].filename);
  const [title, setTitle] = useState<string>(SAMPLE_DOCUMENTS[0].title);
  const [activeTextTab, setActiveTextTab] = useState<'raw' | 'cleaned' | 'features'>('raw');
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [classificationResult, setClassificationResult] = useState<any | null>(null);
  const [savedSuccess, setSavedSuccess] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Run text cleaning pipeline on change
  const cleanedResult: CleanedTextResult = React.useMemo(() => {
    return cleanDocumentText(inputText);
  }, [inputText]);

  // Handle file upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    haptics.trigger('medium');
    setFilename(file.name);
    setTitle(file.name.replace(/\.[^/.]+$/, '').replace(/_/g, ' '));

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
        setClassificationResult(null);
      }
    };
    reader.readAsText(file);
  };

  // Quick load sample document
  const handleSelectSample = (sample: DocumentRecord) => {
    haptics.trigger('light');
    setInputText(sample.rawText);
    setFilename(sample.filename);
    setTitle(sample.title);
    setClassificationResult(null);
    setSavedSuccess(false);
  };

  // Run AI classification
  const handleRunClassification = async () => {
    if (!inputText.trim()) return;

    haptics.trigger('heavy');
    setIsProcessing(true);
    setSavedSuccess(false);

    try {
      const res = await fetch('/api/classify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          text: cleanedResult.cleanedText,
          filename,
          confidenceThreshold,
        }),
      });

      if (!res.ok) {
        throw new Error('Classification request failed');
      }

      const data = await res.json();
      setClassificationResult(data);
      haptics.trigger('success');
    } catch (err) {
      console.error('Classification error:', err);
      // Client-side fallback if server fails
      const fallbackResult = {
        riskLevel: 'HIGH' as RiskLevel,
        complianceCategory: 'Contractual & Liability' as ComplianceCategory,
        confidenceScore: 78,
        needsManualReview: true,
        executiveSummary: `Evaluated "${filename}" via client fallback engine. Document contains high-exposure contractual clauses requiring manual reviewer authorization.`,
        keyRiskIndicators: [
          {
            term: 'High Exposure Commercial Terms',
            excerpt: cleanedResult.cleanedText.slice(0, 160),
            severity: 'HIGH' as RiskLevel,
            policyClause: 'Contract Risk Framework § 4.1',
            remediation: 'Cap overall liability exposure.'
          }
        ],
        nearestRegulatoryPolicies: [
          {
            code: 'SOC2-CC6.1',
            title: 'Third-Party Risk Assurance',
            relevanceScore: 0.85,
            description: 'Regulatory benchmark for corporate vendor agreements.'
          }
        ],
        explainabilityBreakdown: {
          lexicalRiskWeight: 0.75,
          clauseExposureScore: 80,
          jurisdictionalRiskScore: 65,
          rationale: 'Lexical analysis detected restrictive covenants.'
        }
      };
      setClassificationResult(fallbackResult);
      haptics.trigger('alert');
    } finally {
      setIsProcessing(false);
    }
  };

  // Save classified document to main registry
  const handleSaveToRegistry = () => {
    if (!classificationResult) return;
    haptics.trigger('success');

    const newRecord: DocumentRecord = {
      id: 'doc-' + Date.now(),
      filename,
      title,
      category: classificationResult.complianceCategory as ComplianceCategory,
      riskLevel: classificationResult.riskLevel as RiskLevel,
      confidenceScore: classificationResult.confidenceScore,
      needsManualReview: classificationResult.needsManualReview,
      rawText: inputText,
      cleanedText: cleanedResult.cleanedText,
      tokenCount: cleanedResult.tokenCount,
      uploadedAt: new Date().toISOString(),
      status: classificationResult.needsManualReview ? 'PENDING_REVIEW' : 'APPROVED',
      executiveSummary: classificationResult.executiveSummary,
      keyRiskIndicators: classificationResult.keyRiskIndicators || [],
      nearestRegulatoryPolicies: classificationResult.nearestRegulatoryPolicies || [],
      explainabilityBreakdown: classificationResult.explainabilityBreakdown || {
        lexicalRiskWeight: 0.5,
        clauseExposureScore: 50,
        jurisdictionalRiskScore: 50,
        rationale: 'Standard classification'
      }
    };

    onDocumentClassified(newRecord);
    setSavedSuccess(true);
  };

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Top Header & Context */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-white flex items-center gap-2">
            <Cpu className="h-5 w-5 text-violet-400" />
            <span>AI Document Ingestion & Classification Pipeline</span>
          </h1>
          <p className="text-xs text-violet-300/70 mt-0.5">
            Extract text, strip formatting noise, compute TF-IDF lexical features, and execute Gemini 3.8 Flash compliance inference.
          </p>
        </div>

        {/* Global Threshold Slider */}
        <div className="flex items-center gap-3 bg-[#170a2f] border border-violet-500/20 px-3 py-1.5 rounded-lg">
          <Sliders className="h-3.5 w-3.5 text-violet-400" />
          <div className="text-[11px] text-violet-300">
            <span>Threshold: </span>
            <span className="font-mono font-bold text-white tabular-nums">{confidenceThreshold}%</span>
          </div>
          <input
            type="range"
            min="60"
            max="95"
            step="5"
            value={confidenceThreshold}
            onChange={(e) => onSetThreshold(Number(e.target.value))}
            className="w-24 accent-violet-500 cursor-pointer"
          />
        </div>
      </div>

      {/* Sample Document Quick Loader Bar */}
      <div className="space-y-2">
        <div className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider">
          Load Pre-Vetted Sample Documents
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {SAMPLE_DOCUMENTS.slice(0, 4).map((sample) => (
            <button
              key={sample.id}
              onClick={() => handleSelectSample(sample)}
              className={`p-2.5 text-left rounded-lg border transition-all cursor-pointer ${
                filename === sample.filename
                  ? 'border-violet-400/60 bg-violet-900/40 text-white shadow-sm ring-1 ring-violet-400/30'
                  : 'border-violet-500/20 bg-[#160a2d] hover:bg-violet-900/20 text-violet-200'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-violet-400">
                <span className="truncate max-w-[130px]">{sample.category.split('/')[0]}</span>
                <span className={`px-1 rounded text-[10px] ${
                  sample.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300' :
                  sample.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-300' :
                  sample.riskLevel === 'MEDIUM' ? 'bg-violet-500/20 text-violet-300' :
                  'bg-emerald-500/20 text-emerald-300'
                }`}>
                  {sample.riskLevel}
                </span>
              </div>
              <div className="text-xs font-semibold text-white mt-1 truncate">
                {sample.title}
              </div>
            </button>
          ))}
        </div>
      </div>

      {/* Main Dual-Column Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Document Upload & Text Extraction / Preprocessing */}
        <div className="lg:col-span-7 space-y-4">
          <div className="rounded-xl border border-violet-500/20 bg-[#15092a] p-4 sm:p-5 space-y-4">
            
            {/* Title & Metadata Inputs */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-[11px] font-medium text-violet-300 mb-1">
                  Document Title
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full px-3 py-1.5 text-xs bg-violet-950/60 border border-violet-500/30 rounded-lg text-white focus:outline-none focus:border-violet-400"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-violet-300 mb-1">
                  Filename Reference
                </label>
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    value={filename}
                    onChange={(e) => setFilename(e.target.value)}
                    className="w-full px-3 py-1.5 text-xs font-mono bg-violet-950/60 border border-violet-500/30 rounded-lg text-white focus:outline-none focus:border-violet-400"
                  />
                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".txt,.pdf,.docx,.doc,.md,.json"
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    title="Upload local document"
                    className="px-2.5 py-1.5 text-xs bg-violet-900/40 hover:bg-violet-800/60 border border-violet-500/30 rounded-lg text-violet-200 transition-colors flex items-center gap-1 cursor-pointer shrink-0"
                  >
                    <Upload className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Upload</span>
                  </button>
                </div>
              </div>
            </div>

            {/* Pipeline Stage Tabs */}
            <div className="flex items-center justify-between border-b border-violet-500/15 pb-2">
              <div className="flex items-center gap-1 p-1 bg-violet-950/60 rounded-lg border border-violet-500/20">
                <button
                  onClick={() => {
                    haptics.trigger('light');
                    setActiveTextTab('raw');
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    activeTextTab === 'raw'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-violet-300 hover:text-white'
                  }`}
                >
                  Raw Input
                </button>
                <button
                  onClick={() => {
                    haptics.trigger('light');
                    setActiveTextTab('cleaned');
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer flex items-center gap-1 ${
                    activeTextTab === 'cleaned'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-violet-300 hover:text-white'
                  }`}
                >
                  <span>Cleaned Text</span>
                  {cleanedResult.noiseReductionPercent > 0 && (
                    <span className="text-[10px] text-emerald-300 font-mono">
                      (-{cleanedResult.noiseReductionPercent}%)
                    </span>
                  )}
                </button>
                <button
                  onClick={() => {
                    haptics.trigger('light');
                    setActiveTextTab('features');
                  }}
                  className={`px-3 py-1 text-xs font-medium rounded transition-colors cursor-pointer ${
                    activeTextTab === 'features'
                      ? 'bg-violet-600 text-white shadow-sm'
                      : 'text-violet-300 hover:text-white'
                  }`}
                >
                  TF-IDF Features ({cleanedResult.tfidfFeatures.length})
                </button>
              </div>

              <div className="text-[11px] font-mono text-violet-300 tabular-nums">
                {cleanedResult.tokenCount} Tokens · {cleanedResult.wordCount} Words
              </div>
            </div>

            {/* Tab 1: Raw Text Viewer & Editor */}
            {activeTextTab === 'raw' && (
              <div className="space-y-2">
                <textarea
                  rows={14}
                  value={inputText}
                  onChange={(e) => setInputText(e.target.value)}
                  placeholder="Paste contract agreement, NDA, data processing addendum, or employee policy..."
                  className="w-full p-3 font-mono text-xs bg-violet-950/40 border border-violet-500/20 rounded-lg text-violet-100 placeholder-violet-500 focus:outline-none focus:border-violet-400 resize-y leading-relaxed"
                />
              </div>
            )}

            {/* Tab 2: Cleaned Text Pipeline View */}
            {activeTextTab === 'cleaned' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-violet-300 bg-violet-950/40 p-2.5 rounded-lg border border-violet-500/20">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                    <span>Boilerplate removal: {cleanedResult.removedBoilerplateCount} matches eliminated</span>
                  </div>
                  <span className="font-mono text-emerald-300">
                    {cleanedResult.noiseReductionPercent}% formatting noise reduced
                  </span>
                </div>

                <div className="h-80 overflow-y-auto p-3 font-mono text-xs bg-violet-950/40 border border-violet-500/20 rounded-lg text-violet-100 whitespace-pre-wrap leading-relaxed">
                  {cleanedResult.cleanedText}
                </div>
              </div>
            )}

            {/* Tab 3: TF-IDF Features & Lexical Risk Vectors */}
            {activeTextTab === 'features' && (
              <div className="space-y-3">
                <div className="text-xs text-violet-300">
                  Extracted lexical features and term frequency-inverse document frequency weights mapped to regulatory risk dictionaries:
                </div>

                <div className="space-y-1.5 max-h-80 overflow-y-auto pr-1">
                  {cleanedResult.tfidfFeatures.map((feat, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between p-2 rounded-lg bg-violet-950/60 border border-violet-500/20 text-xs"
                    >
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-violet-400 text-[10px]">#{idx + 1}</span>
                        <span className="font-semibold text-white font-mono">{feat.term}</span>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-violet-400">Risk Weight:</span>
                          <span className="font-mono font-bold text-amber-300 tabular-nums">
                            {feat.riskWeight.toFixed(2)}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="text-[10px] text-violet-400">TF-IDF:</span>
                          <span className="font-mono font-bold text-violet-200 tabular-nums">
                            {feat.tfidf}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                  {cleanedResult.tfidfFeatures.length === 0 && (
                    <div className="p-8 text-center text-xs text-violet-400">
                      No high-risk keywords detected in document vocabulary.
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Run Inference Action CTA */}
            <div className="pt-2 flex items-center justify-between gap-4">
              <div className="text-[11px] text-violet-300/70">
                Engine: Gemini 3.8 Flash + Regulatory Embeddings Vector
              </div>

              <button
                disabled={isProcessing || !inputText.trim()}
                onClick={handleRunClassification}
                className="px-5 py-2.5 text-xs font-semibold text-white bg-violet-600 hover:bg-violet-500 disabled:opacity-50 rounded-lg transition-all flex items-center gap-2 cursor-pointer shadow-lg shadow-violet-950/50"
              >
                {isProcessing ? (
                  <>
                    <RefreshCw className="h-4 w-4 animate-spin text-white" />
                    <span>Analyzing Legal Exposure...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="h-4 w-4 text-violet-200" />
                    <span>Run AI Risk Classification</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: AI Risk Verdict & Explainability Output */}
        <div className="lg:col-span-5 space-y-4">
          <div className="rounded-xl border border-violet-500/20 bg-[#15092a] p-4 sm:p-5 h-full flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between border-b border-violet-500/15 pb-3">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileSearch className="h-4 w-4 text-violet-400" />
                  <span>Compliance Verdict & Explainability</span>
                </h3>
                {classificationResult && (
                  <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                    classificationResult.riskLevel === 'CRITICAL' ? 'bg-rose-500/20 text-rose-300 ring-1 ring-rose-400/30' :
                    classificationResult.riskLevel === 'HIGH' ? 'bg-amber-500/20 text-amber-300 ring-1 ring-amber-400/30' :
                    classificationResult.riskLevel === 'MEDIUM' ? 'bg-violet-500/20 text-violet-300 ring-1 ring-violet-400/30' :
                    'bg-emerald-500/20 text-emerald-300 ring-1 ring-emerald-400/30'
                  }`}>
                    {classificationResult.riskLevel} RISK
                  </span>
                )}
              </div>

              {/* No result state */}
              {!classificationResult && !isProcessing && (
                <div className="py-16 text-center space-y-3">
                  <div className="h-12 w-12 rounded-full bg-violet-900/30 border border-violet-500/30 flex items-center justify-center mx-auto text-violet-300">
                    <Sparkles className="h-6 w-6" />
                  </div>
                  <h4 className="text-sm font-semibold text-white">Awaiting Classification</h4>
                  <p className="text-xs text-violet-300/70 max-w-xs mx-auto">
                    Select a sample or paste contract text on the left, then click "Run AI Risk Classification".
                  </p>
                </div>
              )}

              {/* Loading State */}
              {isProcessing && (
                <div className="py-16 text-center space-y-4">
                  <RefreshCw className="h-8 w-8 text-violet-400 animate-spin mx-auto" />
                  <div className="text-sm font-semibold text-white">Analyzing Compliance Vectors</div>
                  <p className="text-xs text-violet-300/70 max-w-xs mx-auto">
                    Parsing contractual clauses, matching OFAC/GDPR/FCPA regulatory taxonomies, and evaluating risk explainability...
                  </p>
                </div>
              )}

              {/* Classification Results */}
              {classificationResult && !isProcessing && (
                <div className="mt-4 space-y-4 text-xs">
                  
                  {/* Category & Confidence Gauge */}
                  <div className="p-3 rounded-lg bg-violet-950/60 border border-violet-500/20 space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-violet-400 font-medium">Compliance Domain:</span>
                      <span className="font-semibold text-white">{classificationResult.complianceCategory}</span>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-violet-400 font-medium">Model Confidence:</span>
                      <span className={`font-mono font-bold tabular-nums ${
                        classificationResult.confidenceScore >= confidenceThreshold ? 'text-emerald-300' : 'text-amber-300'
                      }`}>
                        {classificationResult.confidenceScore}% (Threshold: {confidenceThreshold}%)
                      </span>
                    </div>

                    {/* Threshold Decision Notification */}
                    {classificationResult.needsManualReview ? (
                      <div className="flex items-center gap-2 p-2 rounded bg-amber-500/15 border border-amber-400/30 text-amber-200 text-[11px] mt-2">
                        <AlertTriangle className="h-4 w-4 text-amber-400 shrink-0" />
                        <span>
                          {classificationResult.confidenceScore < confidenceThreshold 
                            ? `Confidence (${classificationResult.confidenceScore}%) is below threshold (${confidenceThreshold}%). Routing to Manual Review.`
                            : `Severe risk factors detected (${classificationResult.riskLevel}). Mandatory Manual Review required.`}
                        </span>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2 p-2 rounded bg-emerald-500/15 border border-emerald-400/30 text-emerald-200 text-[11px] mt-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-400 shrink-0" />
                        <span>Confidence meets threshold criteria. Standard automated approval eligible.</span>
                      </div>
                    )}
                  </div>

                  {/* Executive Summary */}
                  <div>
                    <div className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider mb-1">
                      Executive Summary
                    </div>
                    <p className="text-violet-200 leading-relaxed bg-[#1b0d36] p-3 rounded-lg border border-violet-500/20">
                      {classificationResult.executiveSummary}
                    </p>
                  </div>

                  {/* Key Risk Indicators (KRIs) */}
                  <div>
                    <div className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider mb-1.5 flex items-center justify-between">
                      <span>Flagged Risk Clauses ({classificationResult.keyRiskIndicators?.length || 0})</span>
                      <span className="text-[10px] text-violet-400">Explainable Excerpts</span>
                    </div>
                    <div className="space-y-2 max-h-48 overflow-y-auto pr-1">
                      {classificationResult.keyRiskIndicators?.map((kri: any, idx: number) => (
                        <div key={idx} className="p-2.5 rounded-lg bg-violet-950/60 border border-violet-500/20 space-y-1">
                          <div className="flex items-center justify-between">
                            <span className="font-semibold text-white">{kri.term}</span>
                            <span className={`text-[10px] font-bold ${
                              kri.severity === 'CRITICAL' ? 'text-rose-300' :
                              kri.severity === 'HIGH' ? 'text-amber-300' :
                              'text-violet-300'
                            }`}>
                              {kri.severity}
                            </span>
                          </div>
                          <div className="text-[11px] text-violet-300/80 italic border-l-2 border-violet-500/40 pl-2 my-1">
                            "{kri.excerpt}"
                          </div>
                          <div className="text-[10px] text-emerald-300">
                            <strong>Remediation:</strong> {kri.remediation}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Regulatory Precedents */}
                  <div>
                    <div className="text-[11px] font-semibold text-violet-300 uppercase tracking-wider mb-1.5">
                      Matched Regulatory Baselines
                    </div>
                    <div className="space-y-1.5">
                      {classificationResult.nearestRegulatoryPolicies?.map((pol: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 rounded bg-violet-950/40 border border-violet-500/15">
                          <div>
                            <div className="font-semibold text-white font-mono">{pol.code}</div>
                            <div className="text-[10px] text-violet-300/70">{pol.title}</div>
                          </div>
                          <span className="font-mono text-xs font-bold text-violet-300 tabular-nums">
                            {Math.round(pol.relevanceScore * 100)}% Match
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}
            </div>

            {/* Bottom Actions: Save to Registry */}
            {classificationResult && (
              <div className="pt-4 border-t border-violet-500/15 flex items-center justify-between gap-3">
                <span className="text-[11px] text-violet-400">
                  {savedSuccess ? 'Document recorded in registry.' : 'Ready to save record.'}
                </span>

                <button
                  disabled={savedSuccess}
                  onClick={handleSaveToRegistry}
                  className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors flex items-center gap-1.5 cursor-pointer ${
                    savedSuccess
                      ? 'bg-emerald-600/30 text-emerald-300 border border-emerald-400/40'
                      : 'bg-violet-600 hover:bg-violet-500 text-white shadow-md'
                  }`}
                >
                  {savedSuccess ? (
                    <>
                      <Check className="h-4 w-4 text-emerald-300" />
                      <span>Saved to Registry</span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="h-4 w-4" />
                      <span>Commit to Registry</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
};
