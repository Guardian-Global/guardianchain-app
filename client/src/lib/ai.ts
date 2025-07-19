// Real AI integration - no mock responses
export async function runAccountingAI() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("AI Accounting not configured: OpenAI API key required");
  }
  
  try {
    const response = await fetch('/api/ai/accounting-analysis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        request: 'treasury_analysis'
      })
    });
    
    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.analysis;
  } catch (error) {
    throw new Error("AI Accounting unavailable: " + (error as Error).message);
  }
}

export async function generateFinancialInsights() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("Financial insights not configured: OpenAI API key required");
  }
  
  try {
    const response = await fetch('/api/ai/financial-insights', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      }
    });
    
    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }
    
    const data = await response.json();
    return data.insights;
  } catch (error) {
    throw new Error("Financial insights unavailable: " + (error as Error).message);
  }
}