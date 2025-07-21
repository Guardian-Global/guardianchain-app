/**
 * Pricing Service for GUARDIANCHAIN
 * Ensures pricing accuracy across frontend and backend
 * Integrates with Stripe for payments
 */

import { UserTier, USER_TIERS } from './yieldCalculations';

export interface StripePrice {
  id: string;
  tier: string;
  amount: number; // in cents
  currency: string;
  interval: 'month' | 'year';
  nickname: string;
}

export interface PricingFeature {
  name: string;
  description: string;
  tiers: string[]; // Which tiers include this feature
  comingSoon?: boolean;
}

export interface PricingMatrix {
  tiers: UserTier[];
  features: PricingFeature[];
  stripeMonthlyPrices: StripePrice[];
  stripeAnnualPrices: StripePrice[];
}

// CRITICAL: These Stripe price IDs must match exactly with Stripe dashboard
// TODO: Replace with actual Stripe price IDs from dashboard
export const STRIPE_PRICE_IDS = {
  SEEKER_MONTHLY: 'price_seeker_monthly_placeholder', // TODO: Replace with real Stripe price ID
  SEEKER_ANNUAL: 'price_seeker_annual_placeholder',   // TODO: Replace with real Stripe price ID
  CREATOR_MONTHLY: 'price_creator_monthly_placeholder', // TODO: Replace with real Stripe price ID
  CREATOR_ANNUAL: 'price_creator_annual_placeholder',   // TODO: Replace with real Stripe price ID
  SOVEREIGN_MONTHLY: 'price_sovereign_monthly_placeholder', // TODO: Replace with real Stripe price ID
  SOVEREIGN_ANNUAL: 'price_sovereign_annual_placeholder'    // TODO: Replace with real Stripe price ID
};

// Comprehensive feature matrix - MUST match whitepaper exactly
export const PRICING_FEATURES: PricingFeature[] = [
  {
    name: 'Basic Capsule Creation',
    description: 'Create and submit truth capsules for community verification',
    tiers: ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    name: 'Community Verification',
    description: 'Participate in decentralized truth verification process',
    tiers: ['EXPLORER', 'SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    name: 'Standard Yield (5% APY)',
    description: 'Earn GTT tokens from verified capsules at base rate',
    tiers: ['EXPLORER']
  },
  {
    name: 'Enhanced Yield (8% APY)',
    description: 'Higher yield rate for verified truth capsules',
    tiers: ['SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    name: 'Premium Yield (12% APY)',
    description: 'Premium yield rate with tier bonuses',
    tiers: ['CREATOR', 'SOVEREIGN']
  },
  {
    name: 'Maximum Yield (18% APY)',
    description: 'Highest yield rate with maximum bonuses',
    tiers: ['SOVEREIGN']
  },
  {
    name: 'Priority Verification',
    description: 'Your capsules get verified faster by the community',
    tiers: ['SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    name: 'Analytics Dashboard',
    description: 'Detailed performance metrics and yield tracking',
    tiers: ['SEEKER', 'CREATOR', 'SOVEREIGN']
  },
  {
    name: 'Premium Creation Tools',
    description: 'Advanced capsule creation and editing capabilities',
    tiers: ['CREATOR', 'SOVEREIGN']
  },
  {
    name: 'AI Content Assistant',
    description: 'AI-powered writing and fact-checking assistance',
    tiers: ['CREATOR', 'SOVEREIGN']
  },
  {
    name: 'Commercial Licensing',
    description: 'License your verified capsules for commercial use',
    tiers: ['CREATOR', 'SOVEREIGN']
  },
  {
    name: 'White-label Access',
    description: 'Deploy GUARDIANCHAIN with your own branding',
    tiers: ['SOVEREIGN']
  },
  {
    name: 'API Access',
    description: 'Full API access for custom integrations',
    tiers: ['SOVEREIGN']
  },
  {
    name: 'Enterprise Support',
    description: 'Dedicated support team and custom development',
    tiers: ['SOVEREIGN']
  },
  {
    name: 'Advanced Analytics',
    description: 'Enterprise-grade analytics and reporting tools',
    tiers: ['SOVEREIGN']
  }
];

class PricingService {
  private cachedPricing: PricingMatrix | null = null;
  private lastFetch: Date | null = null;
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  /**
   * Get complete pricing matrix
   */
  async getPricingMatrix(): Promise<PricingMatrix> {
    // Return cached data if still fresh
    if (this.cachedPricing && this.lastFetch && 
        Date.now() - this.lastFetch.getTime() < this.cacheTimeout) {
      return this.cachedPricing;
    }

    try {
      // Fetch live pricing from backend
      const response = await fetch('/api/pricing/matrix');
      if (response.ok) {
        const data = await response.json();
        this.cachedPricing = data;
        this.lastFetch = new Date();
        return data;
      }
    } catch (error) {
      console.error('Failed to fetch live pricing:', error);
    }

    // Fallback to static pricing configuration
    return this.getStaticPricingMatrix();
  }

  /**
   * Get static pricing matrix (fallback)
   */
  private getStaticPricingMatrix(): PricingMatrix {
    const tiers = Object.values(USER_TIERS);
    
    const stripeMonthlyPrices: StripePrice[] = [
      {
        id: STRIPE_PRICE_IDS.SEEKER_MONTHLY,
        tier: 'SEEKER',
        amount: 2900, // $29.00 in cents
        currency: 'usd',
        interval: 'month',
        nickname: 'Truth Seeker Monthly'
      },
      {
        id: STRIPE_PRICE_IDS.CREATOR_MONTHLY,
        tier: 'CREATOR', 
        amount: 9900, // $99.00 in cents
        currency: 'usd',
        interval: 'month',
        nickname: 'Truth Creator Monthly'
      },
      {
        id: STRIPE_PRICE_IDS.SOVEREIGN_MONTHLY,
        tier: 'SOVEREIGN',
        amount: 29900, // $299.00 in cents
        currency: 'usd',
        interval: 'month',
        nickname: 'Truth Sovereign Monthly'
      }
    ];

    const stripeAnnualPrices: StripePrice[] = [
      {
        id: STRIPE_PRICE_IDS.SEEKER_ANNUAL,
        tier: 'SEEKER',
        amount: 29000, // $290.00 in cents (2 months free)
        currency: 'usd',
        interval: 'year',
        nickname: 'Truth Seeker Annual'
      },
      {
        id: STRIPE_PRICE_IDS.CREATOR_ANNUAL,
        tier: 'CREATOR',
        amount: 99000, // $990.00 in cents (2 months free)
        currency: 'usd',
        interval: 'year',
        nickname: 'Truth Creator Annual'
      },
      {
        id: STRIPE_PRICE_IDS.SOVEREIGN_ANNUAL,
        tier: 'SOVEREIGN',
        amount: 299000, // $2990.00 in cents (2 months free)
        currency: 'usd',
        interval: 'year',
        nickname: 'Truth Sovereign Annual'
      }
    ];

    return {
      tiers,
      features: PRICING_FEATURES,
      stripeMonthlyPrices,
      stripeAnnualPrices
    };
  }

  /**
   * Get Stripe price ID for a specific tier and billing interval
   */
  getStripePriceId(tier: string, interval: 'month' | 'year'): string | null {
    const tierUpper = tier.toUpperCase();
    
    if (interval === 'month') {
      switch (tierUpper) {
        case 'SEEKER': return STRIPE_PRICE_IDS.SEEKER_MONTHLY;
        case 'CREATOR': return STRIPE_PRICE_IDS.CREATOR_MONTHLY;
        case 'SOVEREIGN': return STRIPE_PRICE_IDS.SOVEREIGN_MONTHLY;
        default: return null;
      }
    } else {
      switch (tierUpper) {
        case 'SEEKER': return STRIPE_PRICE_IDS.SEEKER_ANNUAL;
        case 'CREATOR': return STRIPE_PRICE_IDS.CREATOR_ANNUAL;
        case 'SOVEREIGN': return STRIPE_PRICE_IDS.SOVEREIGN_ANNUAL;
        default: return null;
      }
    }
  }

  /**
   * Calculate annual savings for yearly billing
   */
  calculateAnnualSavings(tier: string): { monthlyPrice: number; annualPrice: number; savings: number; savingsPercent: number } {
    const tierData = USER_TIERS[tier.toUpperCase()];
    if (!tierData || tierData.price === 0) {
      return { monthlyPrice: 0, annualPrice: 0, savings: 0, savingsPercent: 0 };
    }

    const monthlyPrice = tierData.price;
    const annualPrice = monthlyPrice * 10; // 2 months free
    const savings = monthlyPrice * 2;
    const savingsPercent = Math.round((savings / (monthlyPrice * 12)) * 100);

    return {
      monthlyPrice,
      annualPrice,
      savings,
      savingsPercent
    };
  }

  /**
   * Get features for a specific tier
   */
  getFeaturesForTier(tier: string): PricingFeature[] {
    return PRICING_FEATURES.filter(feature => 
      feature.tiers.includes(tier.toUpperCase())
    );
  }

  /**
   * Check if a feature is available in a tier
   */
  isFeatureAvailable(feature: string, tier: string): boolean {
    const featureObj = PRICING_FEATURES.find(f => f.name === feature);
    return featureObj?.tiers.includes(tier.toUpperCase()) || false;
  }

  /**
   * Get upgrade path for a user
   */
  getUpgradePath(currentTier: string): UserTier[] {
    const tiers = Object.values(USER_TIERS);
    const currentTierData = USER_TIERS[currentTier.toUpperCase()];
    
    if (!currentTierData) return tiers;
    
    return tiers.filter(tier => tier.price > currentTierData.price);
  }

  /**
   * Validate pricing configuration
   */
  async validatePricingConfiguration(): Promise<{ isValid: boolean; errors: string[] }> {
    const errors: string[] = [];
    
    // Check Stripe price IDs
    Object.entries(STRIPE_PRICE_IDS).forEach(([key, priceId]) => {
      if (priceId.includes('placeholder')) {
        errors.push(`Stripe price ID for ${key} is still a placeholder`);
      }
      if (!priceId.startsWith('price_')) {
        errors.push(`Invalid Stripe price ID format for ${key}: ${priceId}`);
      }
    });

    // Validate tier pricing matches
    const matrix = await this.getPricingMatrix();
    matrix.tiers.forEach(tier => {
      const monthlyPrice = matrix.stripeMonthlyPrices.find(p => p.tier === tier.id.toUpperCase());
      if (monthlyPrice && monthlyPrice.amount !== tier.price * 100) {
        errors.push(`Price mismatch for ${tier.name}: Stripe=${monthlyPrice.amount/100}, Tier=${tier.price}`);
      }
    });

    return {
      isValid: errors.length === 0,
      errors
    };
  }

  /**
   * Clear pricing cache (useful for testing)
   */
  clearCache(): void {
    this.cachedPricing = null;
    this.lastFetch = null;
  }
}

// Export singleton instance
export const pricingService = new PricingService();

// Export service class for testing
export { PricingService };