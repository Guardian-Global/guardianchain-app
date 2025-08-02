// Real AI integration - no mock responses
export async function runAccountingAI() {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("AI Accounting not configured: OpenAI API key required");
  }

  try {
    const response = await fetch("/api/ai/accounting-analysis", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        request: "treasury_analysis",
      }),
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
    throw new Error(
      "Financial insights not configured: OpenAI API key required",
    );
  }

  try {
    const response = await fetch("/api/ai/financial-insights", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error(`AI service error: ${response.status}`);
    }

    const data = await response.json();
    return data.insights;
  } catch (error) {
    throw new Error(
      "Financial insights unavailable: " + (error as Error).message,
    );
  }
}

// Legacy export for compatibility - deprecated, use getAIAdvisorInsights instead
export const askAI = generateFinancialInsights;

export async function getAIAdvisorInsights({
  treasury,
  market,
}: {
  treasury: any;
  market: any;
}) {
  const prompt = `
    You are the financial advisor for GuardianChain.
    Current GTT price: $${market?.price || 0}, 24h change: ${
      market?.change24h || 0
    }%
    Treasury balance: ${treasury?.balance || 0} GTT, Monthly Revenue: $${
      treasury?.monthlyRevenue || 0
    }
    Yield Paid: ${treasury?.yieldPaid || 0} GTT, Active Capsules: ${
      treasury?.activeCapsules || 0
    }
    Provide a summary of financial health and one actionable insight.
  `;

  try {
    const response = await fetch("/api/ai/advisor", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      throw new Error(`AI advisor error: ${response.status}`);
    }

    const data = await response.json();
    return (
      data.advice ||
      "Analysis pending - connect OpenAI API to enable AI advisor"
    );
  } catch (error) {
    return "AI advisor unavailable: Connect OpenAI API key to enable financial insights";
  }
}
