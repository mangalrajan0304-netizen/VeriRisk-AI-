import { DocumentRecord } from '../types';

export const SAMPLE_DOCUMENTS: DocumentRecord[] = [
  {
    id: 'doc-001',
    filename: 'Vendor_Commercial_Supply_Agreement_v4.docx',
    title: 'Cross-Border Supply Agreement with Transshipment Rider',
    category: 'Financial & AML / Sanctions',
    riskLevel: 'CRITICAL',
    confidenceScore: 96,
    needsManualReview: true,
    tokenCount: 1420,
    uploadedAt: '2026-10-02T14:30:00Z',
    status: 'PENDING_REVIEW',
    groundTruthRisk: 'CRITICAL',
    executiveSummary: 'CRITICAL SANCTION ALERT: Document contains freight transit provisions routing marine shipments via Sevastopol Port (Crimea) and third-party unverified escrow intermediaries. Direct breach of OFAC 31 C.F.R. § 560 and EU Council Regulation 692/2014.',
    rawText: `COMMERCIAL SUPPLY AND DISTRIBUTION AGREEMENT
[STRICTLY CONFIDENTIAL AND PROPRIETARY]
PAGE 1 OF 12 -- DRAFT SUBJECT TO LEGAL RATIFICATION

This Commercial Supply Agreement ("Agreement") is made effective as of October 1, 2026, by and between Apex Global Logistics B.V. ("Supplier") and Titan Industrial Supply Corp. ("Buyer").

SECTION 4. LOGISTICS AND TRANSSHIPMENT ROUTES
4.1 The Supplier warrants that all raw industrial titanium and petrochemical derivatives shall be dispatched via maritime freight. The agreed intermediate staging hub for customs inspection and sea transit buffering shall be designated at Sevastopol Port, Crimean Peninsula, with transshipment cleared under local maritime registry.
4.2 Neither party shall be liable for delays resulting from multilateral trade restrictions or export control measures imposed by Western regulatory regimes, which the parties agree shall not constitute an event of Force Majeure.

SECTION 9. PAYMENT CLEARING THROUGH OFFSHORE SETTLEMENT
9.1 To bypass correspondent banking delays in New York, settlements exceeding $250,000 shall be remitted to intermediate escrow holding accounts in non-cooperative offshore jurisdictions without mandatory beneficial ownership disclosures.`,
    cleanedText: `COMMERCIAL SUPPLY AND DISTRIBUTION AGREEMENT

This Commercial Supply Agreement ("Agreement") is made effective as of October 1, 2026, by and between Apex Global Logistics B.V. ("Supplier") and Titan Industrial Supply Corp. ("Buyer").

SECTION 4. LOGISTICS AND TRANSSHIPMENT ROUTES
4.1 The Supplier warrants that all raw industrial titanium and petrochemical derivatives shall be dispatched via maritime freight. The agreed intermediate staging hub for customs inspection and sea transit buffering shall be designated at Sevastopol Port, Crimean Peninsula, with transshipment cleared under local maritime registry.
4.2 Neither party shall be liable for delays resulting from multilateral trade restrictions or export control measures imposed by Western regulatory regimes, which the parties agree shall not constitute an event of Force Majeure.

SECTION 9. PAYMENT CLEARING THROUGH OFFSHORE SETTLEMENT
9.1 To bypass correspondent banking delays in New York, settlements exceeding $250,000 shall be remitted to intermediate escrow holding accounts in non-cooperative offshore jurisdictions without mandatory beneficial ownership disclosures.`,
    keyRiskIndicators: [
      {
        term: 'Sanctioned Crimean Port Routing',
        excerpt: 'designated at Sevastopol Port, Crimean Peninsula, with transshipment cleared under local maritime registry',
        severity: 'CRITICAL',
        policyClause: 'OFAC 31 C.F.R. § 560 / Russian Sanctions Regulations',
        remediation: 'Immediately strike Section 4.1. Prohibit any transshipment through sanctioned jurisdictions.'
      },
      {
        term: 'Offshore Escrow & AML Bypass',
        excerpt: 'To bypass correspondent banking delays in New York, settlements exceeding $250,000 shall be remitted to intermediate escrow holding accounts',
        severity: 'CRITICAL',
        policyClause: 'FinCEN Anti-Money Laundering / Bank Secrecy Act (BSA)',
        remediation: 'Require wire transfers exclusively through regulated Tier-1 correspondent banks with full KYC/AML verification.'
      }
    ],
    nearestRegulatoryPolicies: [
      {
        code: 'OFAC-31CFR-560',
        title: 'Office of Foreign Assets Control Comprehensive Embargo Regulations',
        relevanceScore: 0.98,
        description: 'Federal statutory prohibition against US persons engaging in direct or indirect transactions involving Crimea/sanctioned territories.'
      },
      {
        code: 'EU-REG-692/2014',
        title: 'EU Restrictions on Goods Originating in Crimea or Sevastopol',
        relevanceScore: 0.94,
        description: 'Prohibits import, financing, and insurance of goods originating from or routed through Sevastopol.'
      }
    ],
    explainabilityBreakdown: {
      lexicalRiskWeight: 0.96,
      clauseExposureScore: 98,
      jurisdictionalRiskScore: 99,
      rationale: 'High frequency of OFAC embargo terms, sanctioned geographical coordinates, and deliberate banking circumvention language.'
    }
  },
  {
    id: 'doc-002',
    filename: 'Global_Consultancy_Agreement_Eurasia.pdf',
    title: 'Strategic Government Relations Advisory Retainer',
    category: 'Anti-Bribery & FCPA',
    riskLevel: 'CRITICAL',
    confidenceScore: 95,
    needsManualReview: true,
    tokenCount: 1180,
    uploadedAt: '2026-10-02T16:15:00Z',
    status: 'ESCALATED',
    reviewer: 'Evelyn Vance, Compliance Director',
    reviewedAt: '2026-10-02T17:00:00Z',
    reviewerNotes: 'Escalated to Chief Legal Officer immediately. Unaudited facilitation fees payable to ministry affiliates.',
    groundTruthRisk: 'CRITICAL',
    executiveSummary: 'CRITICAL FCPA BREACH: Agreement mandates discretionary "public liaison facilitation disbursements" to foreign ministry personnel without receipt auditing or Anti-Corruption certifications.',
    rawText: `STRATEGIC ADVISORY SERVICES AGREEMENT
INTERNAL USE ONLY -- PRIVILEGED & CONFIDENTIAL
PAGE 1 OF 8

This Retainer Agreement is entered into by Hyperion Defense Systems Inc. ("Client") and Caspian Advisory Partners FZE ("Consultant").

SECTION 3. GOVERNMENT LIAISON & DISCRETIONARY BUDGET
3.1 The Consultant shall assist the Client in securing state procurement licenses and radio spectrum allocations.
3.2 In furtherance of rapid ministerial approval, the Client shall provide an advance contingency allocation of $85,000 per quarter for "courtesy entertainment, expedited processing gifts, and unvetted facilitation payments" to departmental licensing officials.
3.3 The Consultant shall not be required to produce itemized tax receipts for payments disbursed under the Discretionary Facilitation category where local customs discourage formal bookkeeping.`,
    cleanedText: `STRATEGIC ADVISORY SERVICES AGREEMENT

This Retainer Agreement is entered into by Hyperion Defense Systems Inc. ("Client") and Caspian Advisory Partners FZE ("Consultant").

SECTION 3. GOVERNMENT LIAISON & DISCRETIONARY BUDGET
3.1 The Consultant shall assist the Client in securing state procurement licenses and radio spectrum allocations.
3.2 In furtherance of rapid ministerial approval, the Client shall provide an advance contingency allocation of $85,000 per quarter for "courtesy entertainment, expedited processing gifts, and unvetted facilitation payments" to departmental licensing officials.
3.3 The Consultant shall not be required to produce itemized tax receipts for payments disbursed under the Discretionary Facilitation category where local customs discourage formal bookkeeping.`,
    keyRiskIndicators: [
      {
        term: 'Discretionary Foreign Official Facilitation Payments',
        excerpt: 'unvetted facilitation payments to departmental licensing officials',
        severity: 'CRITICAL',
        policyClause: 'FCPA 15 U.S.C. § 78dd-1 / UK Bribery Act 2010 Section 6',
        remediation: 'Eliminate Section 3.2 and 3.3 entirely. Add standard FCPA representations, right-to-audit, and strict anti-corruption warranties.'
      }
    ],
    nearestRegulatoryPolicies: [
      {
        code: 'FCPA-15USC-78dd',
        title: 'Foreign Corrupt Practices Act Anti-Bribery Provisions',
        relevanceScore: 0.99,
        description: 'Prohibits corrupt payments to foreign officials to obtain or retain government business or licenses.'
      },
      {
        code: 'UKBA-2010-S7',
        title: 'Corporate Failure to Prevent Bribery',
        relevanceScore: 0.92,
        description: 'Strict corporate liability for acts of bribery by associated third-party service providers.'
      }
    ],
    explainabilityBreakdown: {
      lexicalRiskWeight: 0.98,
      clauseExposureScore: 96,
      jurisdictionalRiskScore: 91,
      rationale: 'Direct admission of undocumented cash disbursements to licensing regulators; severe statutory exposure.'
    }
  },
  {
    id: 'doc-003',
    filename: 'Customer_Data_Transfer_Addendum_EU.pdf',
    title: 'Cross-Border Cloud Telemetry & Data Processing Addendum',
    category: 'GDPR / Data Privacy',
    riskLevel: 'HIGH',
    confidenceScore: 78,
    needsManualReview: true,
    tokenCount: 2200,
    uploadedAt: '2026-10-03T08:12:00Z',
    status: 'PENDING_REVIEW',
    groundTruthRisk: 'HIGH',
    executiveSummary: 'HIGH PRIVACY RISK (Score 78% < 80% Threshold): Personal customer telemetric and behavioural biometrics transmitted overseas without binding EU Standard Contractual Clauses (SCC) Module 2 or transfer impact assessment.',
    rawText: `DATA PROCESSING ADDENDUM (DPA)
PRINTED ON: 10/02/2026 -- ALL RIGHTS RESERVED
PAGE 1 OF 16

Between NovaCloud Analytics Ltd. ("Processor") and European Financial Services AG ("Controller").

CLAUSE 7. INTERNATIONAL TRANSFERS OF CONTROLLER PERSONAL DATA
7.1 The Controller authorizes the Processor to replicate and train analytical neural models using end-user behavioral telemetry, IP geolocation records, and device voice sample biometrics in server environments located in Singapore and the United States.
7.2 The Processor may onboard secondary subprocessors without prior written notification to the Controller, provided such subprocessors maintain commercially reasonable cybersecurity safeguards.
7.3 The parties have not appended executed Standard Contractual Clauses (SCCs), as Controller agrees Processor's corporate privacy framework suffices.`,
    cleanedText: `DATA PROCESSING ADDENDUM (DPA)

Between NovaCloud Analytics Ltd. ("Processor") and European Financial Services AG ("Controller").

CLAUSE 7. INTERNATIONAL TRANSFERS OF CONTROLLER PERSONAL DATA
7.1 The Controller authorizes the Processor to replicate and train analytical neural models using end-user behavioral telemetry, IP geolocation records, and device voice sample biometrics in server environments located in Singapore and the United States.
7.2 The Processor may onboard secondary subprocessors without prior written notification to the Controller, provided such subprocessors maintain commercially reasonable cybersecurity safeguards.
7.3 The parties have not appended executed Standard Contractual Clauses (SCCs), as Controller agrees Processor's corporate privacy framework suffices.`,
    keyRiskIndicators: [
      {
        term: 'Omission of Mandatory EU SCCs',
        excerpt: 'The parties have not appended executed Standard Contractual Clauses (SCCs)',
        severity: 'HIGH',
        policyClause: 'GDPR Article 46 / Schrems II Ruling',
        remediation: 'Incorporate EU Commission Standard Contractual Clauses 2021/914 Module 2 (Controller-to-Processor).'
      },
      {
        term: 'Silent Subprocessor Onboarding',
        excerpt: 'Processor may onboard secondary subprocessors without prior written notification',
        severity: 'HIGH',
        policyClause: 'GDPR Article 28(2)',
        remediation: 'Mandate minimum 30-day prior written notice with Controller objection rights before onboarding new subprocessors.'
      }
    ],
    nearestRegulatoryPolicies: [
      {
        code: 'GDPR-ART46',
        title: 'Transfers Subject to Appropriate Safeguards',
        relevanceScore: 0.95,
        description: 'Requires legally binding mechanisms such as standard contractual clauses and supplementary technical protections.'
      },
      {
        code: 'EDPB-RECOMM-01/2020',
        title: 'Measures that Supplement Transfer Tools to Ensure Compliance with the EU Level of Protection',
        relevanceScore: 0.89,
        description: 'Requires Transfer Impact Assessment (TIA) when routing biometric or telemetric personal data outside the EEA.'
      }
    ],
    explainabilityBreakdown: {
      lexicalRiskWeight: 0.81,
      clauseExposureScore: 84,
      jurisdictionalRiskScore: 89,
      rationale: 'Absence of approved adequacy mechanism for cross-border processing of biometric and telemetry data.'
    }
  },
  {
    id: 'doc-004',
    filename: 'Enterprise_SaaS_Master_Subscription_Agreement.pdf',
    title: 'Enterprise Cloud Platform Subscription Agreement',
    category: 'Contractual & Liability',
    riskLevel: 'MEDIUM',
    confidenceScore: 84,
    needsManualReview: false,
    tokenCount: 1850,
    uploadedAt: '2026-10-01T11:45:00Z',
    status: 'APPROVED',
    reviewer: 'Marcus Sterling, Legal Reviewer',
    reviewedAt: '2026-10-01T15:20:00Z',
    reviewerNotes: 'Liability capped at 1.5x annual contract value; indemnity aligns with enterprise standard risk guidelines.',
    groundTruthRisk: 'MEDIUM',
    executiveSummary: 'MEDIUM RISK: Standard enterprise commercial software contract with capped consequential damages (1.5x ARR) and mutual 99.9% uptime service level agreement.',
    rawText: `MASTER CLOUD SERVICES SUBSCRIPTION AGREEMENT
CONFIDENTIAL & PROPRIETARY -- PAGE 1 OF 14

SECTION 11. LIMITATION OF LIABILITY
11.1 EXCEPT FOR BREACHES OF CONFIDENTIALITY UNDER SECTION 8 OR WILLFUL MISCONDUCT, IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES.
11.2 EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, MULTIPLIED BY A FACTOR OF 1.5.

SECTION 12. INDEMNIFICATION
12.1 Provider shall defend Customer against third-party intellectual property infringement claims arising from the core Software, subject to prompt written notification.`,
    cleanedText: `MASTER CLOUD SERVICES SUBSCRIPTION AGREEMENT

SECTION 11. LIMITATION OF LIABILITY
11.1 EXCEPT FOR BREACHES OF CONFIDENTIALITY UNDER SECTION 8 OR WILLFUL MISCONDUCT, IN NO EVENT SHALL EITHER PARTY BE LIABLE FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, OR PUNITIVE DAMAGES.
11.2 EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL NOT EXCEED THE TOTAL FEES PAID OR PAYABLE BY CUSTOMER IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM, MULTIPLIED BY A FACTOR OF 1.5.

SECTION 12. INDEMNIFICATION
12.1 Provider shall defend Customer against third-party intellectual property infringement claims arising from the core Software, subject to prompt written notification.`,
    keyRiskIndicators: [
      {
        term: '1.5x ARR Liability Multiplier',
        excerpt: 'TOTAL AGGREGATE LIABILITY... SHALL NOT EXCEED THE TOTAL FEES PAID... MULTIPLIED BY A FACTOR OF 1.5',
        severity: 'MEDIUM',
        policyClause: 'Enterprise Commercial Risk Policy § 7.2',
        remediation: 'Negotiate down to 1.0x ARR standard cap if negotiating with high-risk sub-contractors.'
      }
    ],
    nearestRegulatoryPolicies: [
      {
        code: 'SOC2-CC6.1',
        title: 'SOC 2 Vendor Risk & Service Commitments',
        relevanceScore: 0.81,
        description: 'Vendor operational availability, maintenance schedules, and liability boundary definitions.'
      }
    ],
    explainabilityBreakdown: {
      lexicalRiskWeight: 0.45,
      clauseExposureScore: 52,
      jurisdictionalRiskScore: 28,
      rationale: 'Balanced risk terms, customary limitation of damages, standard IP indemnification protections.'
    }
  },
  {
    id: 'doc-005',
    filename: 'Mutual_Non_Disclosure_Agreement_Standard.pdf',
    title: 'Standard Bilateral Corporate NDA (2026 Revision)',
    category: 'IP & Confidentiality',
    riskLevel: 'LOW',
    confidenceScore: 94,
    needsManualReview: false,
    tokenCount: 920,
    uploadedAt: '2026-10-01T09:00:00Z',
    status: 'APPROVED',
    reviewer: 'Marcus Sterling, Legal Reviewer',
    reviewedAt: '2026-10-01T09:45:00Z',
    reviewerNotes: 'Clean mutual NDA. 3-year term, standard trade secret carve-out.',
    groundTruthRisk: 'LOW',
    executiveSummary: 'LOW RISK: Standard bilateral confidentiality agreement with customary exclusions for independently developed data and 3-year survivability term.',
    rawText: `MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT
PAGE 1 OF 4 -- DRAFT - SUBJECT TO CHANGE

1. PURPOSE
The parties wish to explore a potential strategic technology collaboration (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any proprietary information disclosed by one party ("Disclosing Party") to the other ("Receiving Party"), whether orally or in writing, that is designated as confidential.
Exclusions: Information that is or becomes publicly known without breach, already known to Receiving Party, or independently developed without reference to Confidential Information.

3. TERM AND OBLIGATIONS
The obligations of confidentiality shall survive for three (3) years from the date of disclosure; trade secrets shall remain protected for as long as permitted under applicable trade secret statutes.`,
    cleanedText: `MUTUAL CONFIDENTIALITY AND NON-DISCLOSURE AGREEMENT

1. PURPOSE
The parties wish to explore a potential strategic technology collaboration (the "Purpose").

2. CONFIDENTIAL INFORMATION
"Confidential Information" means any proprietary information disclosed by one party ("Disclosing Party") to the other ("Receiving Party"), whether orally or in writing, that is designated as confidential.
Exclusions: Information that is or becomes publicly known without breach, already known to Receiving Party, or independently developed without reference to Confidential Information.

3. TERM AND OBLIGATIONS
The obligations of confidentiality shall survive for three (3) years from the date of disclosure; trade secrets shall remain protected for as long as permitted under applicable trade secret statutes.`,
    keyRiskIndicators: [
      {
        term: 'Defend Trade Secrets Act Reference',
        excerpt: 'trade secrets shall remain protected for as long as permitted under applicable trade secret statutes',
        severity: 'LOW',
        policyClause: 'Uniform Trade Secrets Act (UTSA) § 1(4)',
        remediation: 'None required; standard market protection.'
      }
    ],
    nearestRegulatoryPolicies: [
      {
        code: 'DTSA-18USC-1836',
        title: 'Defend Trade Secrets Act of 2016',
        relevanceScore: 0.88,
        description: 'Federal statutory civil cause of action for trade secret misappropriation.'
      }
    ],
    explainabilityBreakdown: {
      lexicalRiskWeight: 0.12,
      clauseExposureScore: 15,
      jurisdictionalRiskScore: 10,
      rationale: 'Clean bilateral language, balanced mutual protections, standard 3-year survival term.'
    }
  },
  {
    id: 'doc-006',
    filename: 'IT_Hardware_Remote_Equipment_Loan_Policy.pdf',
    title: 'Employee IT Hardware & Mobile Device Loan Agreement',
    category: 'Employment & Labor',
    riskLevel: 'LOW',
    confidenceScore: 92,
    needsManualReview: false,
    tokenCount: 750,
    uploadedAt: '2026-10-02T10:00:00Z',
    status: 'APPROVED',
    groundTruthRisk: 'LOW',
    executiveSummary: 'LOW RISK: Routine workplace hardware loan agreement outlining equipment care, prompt return upon termination, and full-disk encryption requirements.',
    rawText: `EMPLOYEE HARDWARE LOAN AGREEMENT
PAGE 1 OF 3 -- INTERNAL USE ONLY

This policy outlines the guidelines governing company-issued hardware assets provided to remote and hybrid workforce members.
1. Ownership: All issued laptop computers, docking stations, and mobile phones remain the sole personal property of the Company.
2. Endpoint Security: Employees must keep Mobile Device Management (MDM) software active at all times and not disable BitLocker or FileVault full-disk encryption.
3. Return of Property: Within five (5) business days following separation of employment, employee agrees to return all loaned items in good working condition.`,
    cleanedText: `EMPLOYEE HARDWARE LOAN AGREEMENT

This policy outlines the guidelines governing company-issued hardware assets provided to remote and hybrid workforce members.
1. Ownership: All issued laptop computers, docking stations, and mobile phones remain the sole personal property of the Company.
2. Endpoint Security: Employees must keep Mobile Device Management (MDM) software active at all times and not disable BitLocker or FileVault full-disk encryption.
3. Return of Property: Within five (5) business days following separation of employment, employee agrees to return all loaned items in good working condition.`,
    keyRiskIndicators: [
      {
        term: 'Endpoint Full-Disk Encryption Requirement',
        excerpt: 'not disable BitLocker or FileVault full-disk encryption',
        severity: 'LOW',
        policyClause: 'ISO 27001 Annex A.8.1 (User Endpoint Devices)',
        remediation: 'Compliant with security baseline standards.'
      }
    ],
    nearestRegulatoryPolicies: [
      {
        code: 'ISO-27001-A8',
        title: 'Technological Controls - User Endpoint Devices',
        relevanceScore: 0.84,
        description: 'Mandates full encryption and endpoint security policies for corporate remote equipment.'
      }
    ],
    explainabilityBreakdown: {
      lexicalRiskWeight: 0.15,
      clauseExposureScore: 18,
      jurisdictionalRiskScore: 12,
      rationale: 'Complies with enterprise asset governance and employment guidelines.'
    }
  },
  {
    id: 'doc-007',
    filename: 'Executive_Severance_and_Release_Agreement.docx',
    title: 'Senior Executive Separation, Release & Non-Disparagement Rider',
    category: 'Employment & Labor',
    riskLevel: 'HIGH',
    confidenceScore: 79,
    needsManualReview: true,
    tokenCount: 1640,
    uploadedAt: '2026-10-03T09:30:00Z',
    status: 'PENDING_REVIEW',
    groundTruthRisk: 'HIGH',
    executiveSummary: 'HIGH RISK (Score 79% < 80% Threshold): Separation release contains overly broad non-disclosure covenants that potentially restrict statutory whistleblower reporting to regulatory agencies (SEC/EEOC/OSHA).',
    rawText: `CONFIDENTIAL SEPARATION AND GENERAL RELEASE OF CLAIMS
PAGE 1 OF 9 -- STRICTLY CONFIDENTIAL

This Separation Agreement is made by and between Apex Global Holdings ("Employer") and Senior Vice President ("Executive").

SECTION 6. COVENANT NOT TO DISCLOSE OR COOPERATE
6.1 Executive agrees that under no circumstances shall Executive voluntarily participate in, testify, or disclose internal corporate correspondence to any third party, government agency, or regulatory body without prior written authorization from Employer's General Counsel.
6.2 Executive shall forfeit all accelerated stock option vesting and severance payments in the event Executive files an administrative grievance with any labor commission.`,
    cleanedText: `CONFIDENTIAL SEPARATION AND GENERAL RELEASE OF CLAIMS

This Separation Agreement is made by and between Apex Global Holdings ("Employer") and Senior Vice President ("Executive").

SECTION 6. COVENANT NOT TO DISCLOSE OR COOPERATE
6.1 Executive agrees that under no circumstances shall Executive voluntarily participate in, testify, or disclose internal corporate correspondence to any third party, government agency, or regulatory body without prior written authorization from Employer's General Counsel.
6.2 Executive shall forfeit all accelerated stock option vesting and severance payments in the event Executive files an administrative grievance with any labor commission.`,
    keyRiskIndicators: [
      {
        term: 'Unlawful Whistleblower Gag Provision',
        excerpt: 'under no circumstances shall Executive voluntarily participate in, testify, or disclose... to any government agency without prior written authorization',
        severity: 'HIGH',
        policyClause: 'SEC Rule 21F-17 (Whistleblower Protection) / Defend Trade Secrets Act § 1833(b)',
        remediation: 'Immediately carve out statutory rights to communicate directly with SEC, EEOC, NLRB, and law enforcement agencies.'
      }
    ],
    nearestRegulatoryPolicies: [
      {
        code: 'SEC-RULE-21F-17',
        title: 'Staff Legal Bulletin on Whistleblower Pre-Dispute Restrictions',
        relevanceScore: 0.96,
        description: 'Prohibits any action to impede an individual from communicating directly with SEC staff about possible securities law violations.'
      },
      {
        code: 'NLRB-MCLAREN-MACOMB',
        title: 'Overly Broad Severance Covenants Ruling',
        relevanceScore: 0.91,
        description: 'Severance provisions conditioning payouts on gag clauses violate Section 7 rights.'
      }
    ],
    explainabilityBreakdown: {
      lexicalRiskWeight: 0.85,
      clauseExposureScore: 88,
      jurisdictionalRiskScore: 74,
      rationale: 'Explicit forfeiture penalty conditioning compliance on silence regarding government disclosures; high enforcement risk.'
    }
  }
];

export const MOCK_USERS = [
  {
    id: 'user-01',
    title: 'Senior Compliance Officer',
    name: 'Evelyn Vance, J.D.',
    email: 'evelyn.vance@veririsk.internal',
    department: 'Global Regulatory & Governance',
    scopes: ['documents:read', 'compliance:audit', 'risk:override', 'remediation:sign'],
    avatarInitials: 'EV'
  },
  {
    id: 'user-02',
    title: 'Chief Risk Officer',
    name: 'Dr. Gregory Thorne',
    email: 'gregory.thorne@veririsk.internal',
    department: 'Enterprise Risk Management',
    scopes: ['documents:read', 'compliance:audit', 'risk:override', 'admin:failover', 'reports:export'],
    avatarInitials: 'GT'
  },
  {
    id: 'user-03',
    title: 'Lead Legal Counsel',
    name: 'Marcus Sterling, Esq.',
    email: 'marcus.sterling@veririsk.internal',
    department: 'Corporate Legal & IP',
    scopes: ['documents:read', 'contracts:remediate', 'compliance:audit'],
    avatarInitials: 'MS'
  },
  {
    id: 'user-04',
    title: 'External Risk Auditor',
    name: 'Siddharth Nair, CISA',
    email: 'siddharth.nair@auditgroup.com',
    department: 'Third-Party Assurance',
    scopes: ['documents:read', 'audit:export'],
    avatarInitials: 'SN'
  }
];
