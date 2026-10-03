export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export type ComplianceCategory =
  | 'GDPR / Data Privacy'
  | 'Financial & AML / Sanctions'
  | 'Anti-Bribery & FCPA'
  | 'IP & Confidentiality'
  | 'Employment & Labor'
  | 'Contractual & Liability'
  | 'Operational Compliance';

export interface KeyRiskIndicator {
  term: string;
  excerpt: string;
  severity: RiskLevel;
  policyClause: string;
  remediation: string;
}

export interface RegulatoryPolicy {
  code: string;
  title: string;
  relevanceScore: number;
  description: string;
}

export interface ExplainabilityBreakdown {
  lexicalRiskWeight: number;
  clauseExposureScore: number;
  jurisdictionalRiskScore: number;
  rationale: string;
}

export interface DocumentRecord {
  id: string;
  filename: string;
  title: string;
  category: ComplianceCategory;
  riskLevel: RiskLevel;
  confidenceScore: number;
  needsManualReview: boolean;
  rawText: string;
  cleanedText: string;
  tokenCount: number;
  uploadedAt: string;
  status: 'PENDING_REVIEW' | 'APPROVED' | 'RECLASSIFIED' | 'ESCALATED' | 'REMEDIATION_REQUESTED';
  reviewer?: string;
  reviewerNotes?: string;
  reviewedAt?: string;
  executiveSummary: string;
  keyRiskIndicators: KeyRiskIndicator[];
  nearestRegulatoryPolicies: RegulatoryPolicy[];
  explainabilityBreakdown: ExplainabilityBreakdown;
  groundTruthRisk?: RiskLevel; // For confusion matrix & evaluation
}

export interface TelemetryLog {
  id: string;
  timestamp: string;
  type: 'INFO' | 'WARN' | 'ERROR' | 'AUDIT';
  message: string;
  source: string;
  latencyMs: number;
  metadata?: Record<string, any>;
}

export interface EdgeNode {
  name: string;
  region: string;
  latencyMs: number;
  status: 'HEALTHY' | 'DEGRADED' | 'FAILOVER';
  failoverActive: boolean;
}

export interface UserRole {
  id: string;
  title: string;
  name: string;
  email: string;
  department: string;
  scopes: string[];
  avatarInitials: string;
}
