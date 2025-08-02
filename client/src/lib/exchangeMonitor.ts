// Mock Supabase client for development
const mockSupabaseClient = {
  from: (table: string) => ({
    insert: (data: any) => ({
      then: (callback: (result: any) => void) => {
        console.log(`Exchange log inserted:`, data);
        callback({ data, error: null });
      },
    }),
    select: (columns: string) => ({
      eq: (column: string, value: any) => ({
        gte: (column2: string, value2: any) => ({
          lt: (column3: string, value3: any) => ({
            then: (callback: (result: any) => void) => {
              const mockTransactions = [
                {
                  id: 1,
                  userId: value,
                  from: "GTT",
                  to: "USD",
                  amount: 100,
                  priceUSD: 0.15,
                  txHash: "0x123...abc",
                  region: "US",
                  timestamp: "2025-01-15T10:30:00Z",
                },
                {
                  id: 2,
                  userId: value,
                  from: "USD",
                  to: "GTT",
                  amount: 50,
                  priceUSD: 0.14,
                  txHash: "0x456...def",
                  region: "US",
                  timestamp: "2025-02-20T14:15:00Z",
                },
              ];
              callback({ data: mockTransactions, error: null });
            },
          }),
        }),
      }),
    }),
  }),
};

export interface ExchangeTransaction {
  userId: string;
  from: string;
  to: string;
  amount: number;
  priceUSD: number;
  txHash?: string;
  region?: string;
  timestamp?: string;
}

export interface TaxReport {
  userId: string;
  year: number;
  totalGTTSold: number;
  totalGTTBought: number;
  totalUSDValue: number;
  capitalGains: number;
  taxableEvents: ExchangeTransaction[];
}

export async function logExchange(tx: ExchangeTransaction) {
  try {
    const transactionWithTimestamp = {
      ...tx,
      timestamp: tx.timestamp || new Date().toISOString(),
    };

    return new Promise((resolve) => {
      mockSupabaseClient
        .from("exchange_log")
        .insert([transactionWithTimestamp])
        .then((result) => {
          resolve(result);
        });
    });
  } catch (error) {
    console.error("Exchange logging error:", error);
    throw error;
  }
}

export async function getTaxReport(
  userId: string,
  year: number,
): Promise<TaxReport> {
  try {
    const transactions = await new Promise<ExchangeTransaction[]>((resolve) => {
      mockSupabaseClient
        .from("exchange_log")
        .select("*")
        .eq("userId", userId)
        .gte("timestamp", `${year}-01-01`)
        .lt("timestamp", `${year + 1}-01-01`)
        .then((result: any) => {
          resolve(result.data || []);
        });
    });

    // Calculate tax summary
    let totalGTTSold = 0;
    let totalGTTBought = 0;
    let totalUSDValue = 0;
    let capitalGains = 0;

    transactions.forEach((tx) => {
      if (tx.from === "GTT" && tx.to === "USD") {
        totalGTTSold += tx.amount;
        totalUSDValue += tx.amount * tx.priceUSD;
      } else if (tx.from === "USD" && tx.to === "GTT") {
        totalGTTBought += tx.amount;
        totalUSDValue -= tx.amount * tx.priceUSD;
      }
    });

    // Simplified capital gains calculation
    capitalGains = totalUSDValue * 0.15; // Assuming 15% tax rate

    return {
      userId,
      year,
      totalGTTSold,
      totalGTTBought,
      totalUSDValue,
      capitalGains,
      taxableEvents: transactions,
    };
  } catch (error) {
    console.error("Tax report error:", error);
    throw error;
  }
}

export async function monitorLargeTransactions(threshold: number = 1000) {
  // Mock monitoring for transactions above threshold
  const mockLargeTransactions = [
    {
      userId: "whale-001",
      amount: 5000,
      from: "GTT",
      to: "USD",
      priceUSD: 0.15,
      flagReason: "Large volume transaction",
      timestamp: new Date().toISOString(),
    },
  ];

  return mockLargeTransactions;
}

export async function getExchangeAnalytics(
  timeframe: "24h" | "7d" | "30d" = "24h",
) {
  // Mock exchange analytics
  return {
    timeframe,
    totalVolume: 125000,
    totalTransactions: 456,
    averageTransactionSize: 274,
    topTradingPairs: [
      { pair: "GTT/USD", volume: 85000, percentage: 68 },
      { pair: "USD/GTT", volume: 40000, percentage: 32 },
    ],
    priceRange: {
      high: 0.165,
      low: 0.145,
      current: 0.152,
    },
    uniqueTraders: 123,
    regions: [
      { region: "US", percentage: 45 },
      { region: "EU", percentage: 30 },
      { region: "APAC", percentage: 25 },
    ],
  };
}

export async function detectSuspiciousPatterns(userId: string) {
  // Mock suspicious pattern detection
  const patterns = {
    rapidTrading: false,
    unusualVolume: false,
    crossBorderActivity: false,
    potentialWashTrading: false,
    riskScore: "low",
  };

  return patterns;
}

export async function generateComplianceReport(
  startDate: string,
  endDate: string,
) {
  return {
    reportPeriod: `${startDate} to ${endDate}`,
    totalTransactions: 1247,
    totalVolume: 450000,
    suspiciousActivities: 3,
    regionsMonitored: ["US", "EU", "APAC"],
    complianceStatus: "compliant",
    recommendedActions: [
      "Continue monitoring large transactions",
      "Review cross-border activity patterns",
      "Update AML procedures quarterly",
    ],
    generatedAt: new Date().toISOString(),
  };
}
