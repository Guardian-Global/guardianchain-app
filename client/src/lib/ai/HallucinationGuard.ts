/**
 * AI Hallucination Guard - Truth Shield Integration
 * Provides AI-powered content verification to prevent false information
 */

export interface TruthShieldResponse {
  valid: boolean;
  confidence: number;
  issues: string[];
  suggestions?: string[];
  riskLevel: 'low' | 'medium' | 'high';
}

export async function verifyWithTruthShield(inputText: string): Promise<TruthShieldResponse> {
  try {
    // Primary verification with external AI service
    const response = await fetch('/api/ai/verify-truth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        text: inputText,
        strictMode: true 
      })
    });

    if (!response.ok) {
      throw new Error(`Truth verification failed: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
    
  } catch (error) {
    console.error('TruthShield verification error:', error);
    
    // Fallback to local validation patterns
    return performLocalValidation(inputText);
  }
}

/**
 * Local fallback validation using pattern matching
 */
function performLocalValidation(text: string): TruthShieldResponse {
  const issues: string[] = [];
  let riskLevel: 'low' | 'medium' | 'high' = 'low';
  let confidence = 0.7;

  // Check for suspicious patterns
  const suspiciousPatterns = [
    /guaranteed?\s+\d+%?\s+return/i,
    /secret\s+method/i,
    /doctors\s+hate\s+this/i,
    /proven\s+by\s+science/i,
    /100%\s+effective/i,
    /miracle\s+cure/i,
    /conspiracy\s+theorists\s+don't\s+want/i
  ];

  const urgencyPatterns = [
    /act\s+now/i,
    /limited\s+time/i,
    /expires\s+soon/i,
    /urgent/i,
    /emergency/i
  ];

  // Count pattern matches
  let suspiciousCount = 0;
  let urgencyCount = 0;

  suspiciousPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      suspiciousCount++;
      issues.push(`Suspicious claim pattern detected`);
    }
  });

  urgencyPatterns.forEach(pattern => {
    if (pattern.test(text)) {
      urgencyCount++;
      issues.push(`Urgency language detected`);
    }
  });

  // Determine risk level
  if (suspiciousCount >= 2 || urgencyCount >= 3) {
    riskLevel = 'high';
    confidence = 0.3;
  } else if (suspiciousCount >= 1 || urgencyCount >= 2) {
    riskLevel = 'medium';
    confidence = 0.5;
  }

  // Check for factual claims without sources
  const factualClaims = /\d+%\s+of\s+people|studies\s+show|research\s+proves/i.test(text);
  const hasSources = /source:|reference:|study:|research:/i.test(text);
  
  if (factualClaims && !hasSources) {
    issues.push('Factual claims without cited sources');
    riskLevel = riskLevel === 'low' ? 'medium' : 'high';
    confidence = Math.max(0.2, confidence - 0.2);
  }

  return {
    valid: riskLevel === 'low' && issues.length < 2,
    confidence,
    issues,
    suggestions: generateSuggestions(issues),
    riskLevel
  };
}

function generateSuggestions(issues: string[]): string[] {
  const suggestions: string[] = [];

  if (issues.some(issue => issue.includes('sources'))) {
    suggestions.push('Add credible sources and references to support your claims');
  }

  if (issues.some(issue => issue.includes('Suspicious'))) {
    suggestions.push('Rephrase using neutral, factual language');
  }

  if (issues.some(issue => issue.includes('Urgency'))) {
    suggestions.push('Remove time pressure and urgency language');
  }

  if (suggestions.length === 0) {
    suggestions.push('Content appears valid but consider adding sources for verification');
  }

  return suggestions;
}

/**
 * Quick validation for form inputs
 */
export function quickValidate(text: string): boolean {
  if (!text || text.length < 10) return false;
  
  const result = performLocalValidation(text);
  return result.valid && result.confidence > 0.5;
}

/**
 * Enhanced validation with AI assistance
 */
export async function enhancedValidation(
  text: string, 
  category?: string
): Promise<TruthShieldResponse> {
  const baseValidation = await verifyWithTruthShield(text);
  
  // Category-specific validation
  if (category) {
    const categoryRisks = await validateByCategory(text, category);
    baseValidation.issues.push(...categoryRisks);
  }
  
  return baseValidation;
}

async function validateByCategory(text: string, category: string): Promise<string[]> {
  const issues: string[] = [];
  
  switch (category.toLowerCase()) {
    case 'medical':
    case 'health':
      if (!/disclaimer|consult\s+doctor/i.test(text)) {
        issues.push('Medical content should include appropriate disclaimers');
      }
      break;
      
    case 'financial':
    case 'investment':
      if (!/not\s+financial\s+advice/i.test(text)) {
        issues.push('Financial content should include investment disclaimers');
      }
      break;
      
    case 'conspiracy':
      if (text.length < 100) {
        issues.push('Conspiracy claims require detailed evidence and documentation');
      }
      break;
  }
  
  return issues;
}