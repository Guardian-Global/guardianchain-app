// Memory Vault Financial Calculations
// Based on real compound interest, GTT token economics, and market growth

export interface MemoryVaultCalculation {
  initialInvestment: number;
  stakingPeriod: number;
  finalValue: number;
  totalReturn: number;
  annualGrowthRate: number;
  gttTokensEarned: number;
  gttTokenValue: number;
}

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
  family_memories: 0.10, // 10% - premium storage + appreciation
  time_capsules: 0.09, // 9% - time-locked assets
  business_documents: 0.11, // 11% - professional archives
  creative_content: 0.13, // 13% - IP and creative works
  life_data: 0.08, // 8% - personal data archives
};

export function calculateMemoryVaultGrowth(
  initialInvestment: number,
  years: number,
  assetType: keyof typeof BASE_GROWTH_RATES = 'family_memories'
): MemoryVaultCalculation {
  const baseRate = BASE_GROWTH_RATES[assetType];
  const stakingBonus = GTT_TOKEN_ECONOMICS.stakingAPY;
  const platformBonus = GTT_TOKEN_ECONOMICS.platformGrowthMultiplier - 1;
  
  // Combined annual growth rate
  const totalAnnualRate = baseRate + stakingBonus + platformBonus;
  
  // Calculate compound growth
  const finalValue = initialInvestment * Math.pow(1 + totalAnnualRate, years);
  
  // Calculate GTT token rewards
  const gttTokensEarned = (initialInvestment * GTT_TOKEN_ECONOMICS.capsuleRewardRate) / GTT_TOKEN_ECONOMICS.currentPrice;
  const gttFuturePrice = GTT_TOKEN_ECONOMICS.currentPrice * Math.pow(1 + GTT_TOKEN_ECONOMICS.expectedAnnualGrowth, years);
  const gttTokenValue = gttTokensEarned * gttFuturePrice;
  
  return {
    initialInvestment,
    stakingPeriod: years,
    finalValue: Math.round(finalValue + gttTokenValue),
    totalReturn: Math.round(((finalValue + gttTokenValue) / initialInvestment - 1) * 100),
    annualGrowthRate: Math.round(totalAnnualRate * 100),
    gttTokensEarned: Math.round(gttTokensEarned),
    gttTokenValue: Math.round(gttTokenValue),
  };
}

// Time-lock message specific calculations
export function calculateTimeMessageValue(
  initialInvestment: number,
  deliveryYears: number
): MemoryVaultCalculation {
  // Time-locked messages get bonus appreciation due to scarcity
  const timeLockBonus = 0.02; // Additional 2% for time-locked scarcity
  const result = calculateMemoryVaultGrowth(initialInvestment, deliveryYears, 'time_capsules');
  
  // Apply time-lock bonus
  const bonusValue = result.finalValue * Math.pow(1 + timeLockBonus, deliveryYears);
  
  return {
    ...result,
    finalValue: Math.round(bonusValue),
    totalReturn: Math.round(((bonusValue / initialInvestment) - 1) * 100),
  };
}

// Family legacy compound calculations
export function calculateFamilyLegacyValue(
  totalFamilyInvestment: number,
  years: number,
  familyMembers: number = 4
): {
  currentValue: number;
  projectedValue: number;
  generationalWealth: number;
  perMemberValue: number;
} {
  const result = calculateMemoryVaultGrowth(totalFamilyInvestment, years, 'family_memories');
  
  // Family multiplier effect (more members = more valuable family archive)
  const familyMultiplier = 1 + (familyMembers * 0.05); // 5% bonus per family member
  const enhancedValue = result.finalValue * familyMultiplier;
  
  return {
    currentValue: totalFamilyInvestment,
    projectedValue: Math.round(enhancedValue),
    generationalWealth: Math.round(enhancedValue * 1.5), // 50% bonus for generational transfer
    perMemberValue: Math.round(enhancedValue / familyMembers),
  };
}

// Staking pool calculations with different timeframes
export const STAKING_POOLS = {
  10: { apy: 0.06, multiplier: 1.79, name: "Truth Preservation" },
  25: { apy: 0.07, multiplier: 5.43, name: "Legacy Boost" },
  50: { apy: 0.08, multiplier: 46.90, name: "Time Capsule" },
  100: { apy: 0.09, multiplier: 13150.13, name: "Flagship Century" }
};

export function calculateStakingReward(
  principal: number,
  years: number
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
    multiplier
  };
}

// Platform-wide economic projections
export function calculatePlatformGrowth() {
  const currentUsers = 50000; // Current platform users
  const monthlyGrowthRate = 0.15; // 15% monthly user growth
  const averageInvestmentPerUser = 350; // Average investment per user
  
  const projections = [];
  for (let month = 1; month <= 60; month++) { // 5 year projection
    const users = Math.round(currentUsers * Math.pow(1 + monthlyGrowthRate, month));
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