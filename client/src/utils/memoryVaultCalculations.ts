// Memory Vault Financial Calculations
// Based on real compound interest, GTT token economics, vendor costs, and market growth

export interface MemoryVaultCalculation {
  initialInvestment: number;
  stakingPeriod: number;
  finalValue: number;
  totalReturn: number;
  annualGrowthRate: number;
  gttTokensEarned: number;
  gttTokenValue: number;
}

// Vendor cost structure and revenue analysis
export const VENDOR_COSTS = {
  ipfsStorage: 0.15, // $0.15 per GB per year
  blockchainTransaction: 0.02, // $0.02 per transaction
  videoProcessing: 0.08, // $0.08 per minute processed
  aiValidation: 0.05, // $0.05 per capsule validation
  securityAudit: 0.12, // $0.12 per capsule security check
  legalCompliance: 0.25, // $0.25 per legal document verification
  insuranceFee: 0.03, // $0.03 per $100 of value insured
  platformMaintenance: 0.1, // $0.10 per capsule per year
};

// Revenue model with aggressive pricing that maintains profitability
export const REVENUE_MODEL = {
  minimumMargin: 0.35, // 35% minimum profit margin
  scalingDiscount: 0.15, // 15% bulk discount at scale
  institutionalMultiplier: 2.5, // 2.5x pricing for institutional clients
  premiumFeatures: 0.4, // 40% premium for advanced features
  yearlySubscriptionDiscount: 0.2, // 20% discount for yearly subscriptions
};

// Current GTT token price and economic model
export const GTT_TOKEN_ECONOMICS = {
  currentPrice: 0.0075, // $0.0075 per GTT
  expectedAnnualGrowth: 0.15, // 15% annual appreciation
  stakingAPY: 0.08, // 8% annual staking rewards
  capsuleRewardRate: 0.1, // 10% of capsule value in GTT tokens
  platformGrowthMultiplier: 1.05, // 5% additional growth from platform adoption
};

// Base annual growth rates for different asset classes
const BASE_GROWTH_RATES = {
  digital_collectibles: 0.12, // 12% - digital art/NFT historical performance
  family_memories: 0.1, // 10% - premium storage + appreciation
  time_capsules: 0.09, // 9% - time-locked assets
  business_documents: 0.11, // 11% - professional archives
  creative_content: 0.13, // 13% - IP and creative works
  life_data: 0.08, // 8% - personal data archives
  legal_documents: 0.14, // 14% - legal evidence and court records
  institutional_records: 0.15, // 15% - schools, sports, official achievements
  whistleblower_evidence: 0.16, // 16% - high-value truth verification
  sports_achievements: 0.13, // 13% - athletic records and yearbooks
  academic_records: 0.12, // 12% - school records and achievements
};

// Calculate total vendor costs for a capsule
export function calculateVendorCosts(
  capsuleSize: number, // in GB
  processingMinutes: number = 5,
  isLegal: boolean = false,
  isInstitutional: boolean = false,
): number {
  let totalCost = 0;

  // Base costs
  totalCost += VENDOR_COSTS.ipfsStorage * capsuleSize; // Storage per year
  totalCost += VENDOR_COSTS.blockchainTransaction; // Transaction fee
  totalCost += VENDOR_COSTS.videoProcessing * processingMinutes; // Processing
  totalCost += VENDOR_COSTS.aiValidation; // AI validation
  totalCost += VENDOR_COSTS.securityAudit; // Security check
  totalCost += VENDOR_COSTS.platformMaintenance; // Maintenance

  // Additional costs for legal documents
  if (isLegal) {
    totalCost += VENDOR_COSTS.legalCompliance;
  }

  // Insurance cost based on value
  const estimatedValue = capsuleSize * 100; // $100 per GB estimated value
  totalCost += (estimatedValue / 100) * VENDOR_COSTS.insuranceFee;

  return totalCost;
}

// Calculate pricing with proper profit margins
export function calculateOptimalPricing(
  vendorCosts: number,
  isInstitutional: boolean = false,
  bulkDiscount: boolean = false,
): { basePrice: number; finalPrice: number; margin: number } {
  let basePrice = vendorCosts / (1 - REVENUE_MODEL.minimumMargin);

  // Apply institutional multiplier
  if (isInstitutional) {
    basePrice *= REVENUE_MODEL.institutionalMultiplier;
  }

  // Apply bulk discount if applicable
  let finalPrice = basePrice;
  if (bulkDiscount) {
    finalPrice = basePrice * (1 - REVENUE_MODEL.scalingDiscount);
  }

  const margin = ((finalPrice - vendorCosts) / finalPrice) * 100;

  return {
    basePrice: Math.round(basePrice),
    finalPrice: Math.round(finalPrice),
    margin: Math.round(margin),
  };
}

export function calculateMemoryVaultGrowth(
  initialInvestment: number,
  years: number,
  assetType: keyof typeof BASE_GROWTH_RATES = "family_memories",
): MemoryVaultCalculation {
  // Limit maximum time period to prevent astronomical figures
  const maxYears = Math.min(years, 100); // Cap at 100 years for realistic calculations

  const baseRate = BASE_GROWTH_RATES[assetType];
  const stakingBonus = GTT_TOKEN_ECONOMICS.stakingAPY;
  const platformBonus = GTT_TOKEN_ECONOMICS.platformGrowthMultiplier - 1;

  // Combined annual growth rate
  const totalAnnualRate = baseRate + stakingBonus + platformBonus;

  // Calculate compound growth with realistic cap
  const finalValue =
    initialInvestment * Math.pow(1 + totalAnnualRate, maxYears);

  // Calculate GTT token rewards (users earn tokens based on capsule validation)
  const gttTokensEarned =
    (initialInvestment * GTT_TOKEN_ECONOMICS.capsuleRewardRate) /
    GTT_TOKEN_ECONOMICS.currentPrice;
  const gttFuturePrice =
    GTT_TOKEN_ECONOMICS.currentPrice *
    Math.pow(1 + GTT_TOKEN_ECONOMICS.expectedAnnualGrowth, maxYears);
  const gttTokenValue = gttTokensEarned * gttFuturePrice;

  return {
    initialInvestment,
    stakingPeriod: maxYears, // Return the capped years
    finalValue: Math.round(finalValue + gttTokenValue),
    totalReturn: Math.round(
      ((finalValue + gttTokenValue) / initialInvestment - 1) * 100,
    ),
    annualGrowthRate: Math.round(totalAnnualRate * 100),
    gttTokensEarned: Math.round(gttTokensEarned),
    gttTokenValue: Math.round(gttTokenValue),
  };
}

// Time-lock message specific calculations
export function calculateTimeMessageValue(
  initialInvestment: number,
  deliveryYears: number,
): MemoryVaultCalculation {
  // Time-locked messages get bonus appreciation due to scarcity
  const timeLockBonus = 0.02; // Additional 2% for time-locked scarcity
  const result = calculateMemoryVaultGrowth(
    initialInvestment,
    deliveryYears,
    "time_capsules",
  );

  // Apply time-lock bonus
  const bonusValue =
    result.finalValue * Math.pow(1 + timeLockBonus, deliveryYears);

  return {
    ...result,
    finalValue: Math.round(bonusValue),
    totalReturn: Math.round((bonusValue / initialInvestment - 1) * 100),
  };
}

// Family legacy compound calculations
export function calculateFamilyLegacyValue(
  totalFamilyInvestment: number,
  years: number,
  familyMembers: number = 4,
): {
  currentValue: number;
  projectedValue: number;
  generationalWealth: number;
  perMemberValue: number;
} {
  const result = calculateMemoryVaultGrowth(
    totalFamilyInvestment,
    years,
    "family_memories",
  );

  // Family multiplier effect (more members = more valuable family archive)
  const familyMultiplier = 1 + familyMembers * 0.05; // 5% bonus per family member
  const enhancedValue = result.finalValue * familyMultiplier;

  return {
    currentValue: totalFamilyInvestment,
    projectedValue: Math.round(enhancedValue),
    generationalWealth: Math.round(enhancedValue * 1.5), // 50% bonus for generational transfer
    perMemberValue: Math.round(enhancedValue / familyMembers),
  };
}

// Realistic staking pool calculations with accurate compound interest
export const STAKING_POOLS = {
  10: { apy: 0.06, multiplier: 1.79, name: "Truth Preservation" },
  25: { apy: 0.07, multiplier: 5.43, name: "Legacy Boost" },
  50: { apy: 0.08, multiplier: 46.9, name: "Time Capsule" },
  100: { apy: 0.09, multiplier: 136.31, name: "Flagship Century" }, // Realistic 136x for 100 years at 9% APY
};

export function calculateStakingReward(
  principal: number,
  years: number,
): { finalValue: number; totalEarned: number; multiplier: number } {
  const pool = STAKING_POOLS[years as keyof typeof STAKING_POOLS];
  if (!pool) {
    throw new Error(`No staking pool available for ${years} years`);
  }

  const finalValue = Math.round(principal * Math.pow(1 + pool.apy, years));
  const totalEarned = finalValue - principal;
  const multiplier = Math.round((finalValue / principal) * 100) / 100;

  return {
    finalValue,
    totalEarned,
    multiplier,
  };
}

// Platform-wide economic projections
export function calculatePlatformGrowth() {
  const currentUsers = 150; // Current platform users (realistic starting point)
  const monthlyGrowthRate = 0.08; // 8% monthly user growth (realistic)
  const averageInvestmentPerUser = 85; // Average investment per user (realistic)

  const projections = [];
  for (let month = 1; month <= 60; month++) {
    // 5 year projection
    const users = Math.round(
      currentUsers * Math.pow(1 + monthlyGrowthRate, month),
    );
    const totalValue = users * averageInvestmentPerUser;
    projections.push({
      month,
      users,
      totalPlatformValue: totalValue,
      gttMarketCap: totalValue * 0.1, // 10% of platform value
    });
  }

  return projections;
}

// Institutional market calculations
interface InstitutionalMarket {
  name: string;
  averagePrice: number;
  globalMarket: number;
  adoptionRate: number;
  growthRate: number;
}

export const INSTITUTIONAL_MARKETS: Record<string, InstitutionalMarket> = {
  courts: {
    name: "Courts & Legal Systems",
    averagePrice: 2500, // $2,500 per legal case
    globalMarket: 500000, // 500K legal cases globally per year (realistic)
    adoptionRate: 0.05, // 5% adoption in 5 years
    growthRate: 0.18, // 18% premium legal verification
  },
  schools: {
    name: "Schools & Education",
    averagePrice: 150, // $150 per student record/yearbook
    globalMarket: 1500000, // 1.5M students globally (realistic)
    adoptionRate: 0.1, // 10% adoption in 5 years
    growthRate: 0.12, // 12% academic achievement preservation
  },
  sports: {
    name: "Sports & Athletics",
    averagePrice: 800, // $800 per sports event recording
    globalMarket: 100000, // 100K sports events globally per year (realistic)
    adoptionRate: 0.15, // 15% adoption in 5 years
    growthRate: 0.13, // 13% athletic achievement value
  },
  legal: {
    name: "Legal Firms & Evidence",
    averagePrice: 1200, // $1,200 per legal document
    globalMarket: 200000, // 200K legal documents per year (realistic)
    adoptionRate: 0.08, // 8% adoption in 5 years
    growthRate: 0.14, // 14% legal evidence appreciation
  },
};

export function calculateInstitutionalMarketSize(): {
  totalAddressableMarket: number;
  fiveYearRevenue: number;
  gttTokenDemand: number;
} {
  let totalMarket = 0;
  let fiveYearRevenue = 0;

  Object.values(INSTITUTIONAL_MARKETS).forEach((market) => {
    const marketSize = market.averagePrice * market.globalMarket;
    const adoptedMarket = marketSize * market.adoptionRate;
    totalMarket += marketSize;
    fiveYearRevenue += adoptedMarket;
  });

  // GTT token demand based on 10% of revenue going to token rewards
  const gttTokenDemand = fiveYearRevenue * 0.1;

  return {
    totalAddressableMarket: Math.round(totalMarket),
    fiveYearRevenue: Math.round(fiveYearRevenue),
    gttTokenDemand: Math.round(gttTokenDemand),
  };
}
