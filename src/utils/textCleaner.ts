// Document Text Extraction, Formatting Sanitization & Lexical Feature Extraction Pipeline

export interface CleanedTextResult {
  cleanedText: string;
  removedBoilerplateCount: number;
  noiseReductionPercent: number;
  wordCount: number;
  tokenCount: number;
  clauses: string[];
  tfidfFeatures: Array<{ term: string; tfidf: number; riskWeight: number }>;
}

const COMMON_BOILERPLATES = [
  /confidential\s*(?:and|&)\s*proprietary/gi,
  /page\s*\d+\s*(?:of|\/)\s*\d+/gi,
  /all rights reserved\.?/gi,
  /printed on:?\s*\d{1,2}[\/\.-]\d{1,2}[\/\.-]\d{2,4}/gi,
  /internal use only/gi,
  /strictly confidential/gi,
  /draft\s*-\s*subject to change/gi,
  /---+\s*page\s*break\s*---+/gi,
  /\[\s*stamp:\s*received\s*\]/gi,
];

// Weighted risk dictionary for TF-IDF / feature extraction
const RISK_TERMS_WEIGHT: Record<string, number> = {
  'sanction': 0.95,
  'embargo': 0.95,
  'ofac': 0.98,
  'crimea': 0.95,
  'bribe': 0.99,
  'kickback': 0.99,
  'facilitation payment': 0.92,
  'unlimited liability': 0.88,
  'indemnification': 0.72,
  'cross-border': 0.78,
  'gdpr': 0.75,
  'biometric': 0.82,
  'personally identifiable': 0.68,
  'subcontractor': 0.45,
  'gross negligence': 0.85,
  'consequential damages': 0.70,
  'exclusive jurisdiction': 0.55,
  'arbitration': 0.40,
  'waiver of jury': 0.60,
  'trade secret': 0.65,
  'whistleblower': 0.80,
  'non-compete': 0.75,
  'severance': 0.50,
  'data breach': 0.88,
  'export control': 0.90,
  'dual-use': 0.85,
};

export function cleanDocumentText(rawText: string): CleanedTextResult {
  let cleaned = rawText;
  let boilerplateMatches = 0;

  // 1. Remove repetitive headers & footers
  for (const regex of COMMON_BOILERPLATES) {
    const matches = cleaned.match(regex);
    if (matches) {
      boilerplateMatches += matches.length;
      cleaned = cleaned.replace(regex, '');
    }
  }

  // 2. Strip HTML/XML tags if raw input had any markup
  cleaned = cleaned.replace(/<[^>]*>/g, ' ');

  // 3. Normalize non-standard quotation marks, dashes, control characters
  cleaned = cleaned
    .replace(/[\u2018\u2019]/g, "'")
    .replace(/[\u201C\u201D]/g, '"')
    .replace(/[\u2013\u2014]/g, '-')
    .replace(/[\t\r\f\v]/g, ' ')
    .replace(/\u00A0/g, ' ');

  // 4. Normalize multiple spaces & excessive blank lines
  cleaned = cleaned
    .replace(/[ ]{2,}/g, ' ')
    .replace(/\n\s*\n\s*\n+/g, '\n\n')
    .trim();

  // 5. Segment into discrete clauses / paragraphs
  const clauses = cleaned
    .split(/(?:\n\n|\.\s+(?=[A-Z0-9\(\[\"\']))/)
    .map(c => c.trim())
    .filter(c => c.length > 25);

  const wordCount = cleaned.split(/\s+/).filter(Boolean).length;
  const tokenCount = Math.round(wordCount * 1.33);

  const originalLength = rawText.length || 1;
  const cleanedLength = cleaned.length;
  const noiseReductionPercent = Math.max(0, Math.round(((originalLength - cleanedLength) / originalLength) * 100));

  // 6. Compute TF-IDF risk features
  const lower = cleaned.toLowerCase();
  const tfidfFeatures: Array<{ term: string; tfidf: number; riskWeight: number }> = [];

  for (const [term, weight] of Object.entries(RISK_TERMS_WEIGHT)) {
    const termRegex = new RegExp(`\\b${term}\\b`, 'gi');
    const termMatches = lower.match(termRegex);
    if (termMatches && termMatches.length > 0) {
      const tf = termMatches.length / Math.max(wordCount, 1);
      // Normalized TF-IDF proxy
      const tfidf = Number((tf * 1000 * weight).toFixed(2));
      tfidfFeatures.push({
        term,
        tfidf,
        riskWeight: weight,
      });
    }
  }

  // Sort by highest risk weighted TF-IDF
  tfidfFeatures.sort((a, b) => b.tfidf * b.riskWeight - a.tfidf * a.riskWeight);

  return {
    cleanedText: cleaned,
    removedBoilerplateCount: boilerplateMatches,
    noiseReductionPercent,
    wordCount,
    tokenCount,
    clauses,
    tfidfFeatures: tfidfFeatures.slice(0, 10),
  };
}
