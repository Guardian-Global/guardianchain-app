// roles, pricing, and mint bundle definitions for all GuardianChain tiers

export type TierName = 'Explorer' | 'Seeker' | 'Creator' | 'Sovereign';

export interface TierConfig {
  name: TierName;
  priceUsd: number;
  capsuleMints: number;
  yieldBonus: number; // e.g. 0.05 for 5%
  description: string;
}

export const TIERS: TierConfig[] = [
  {
    name: 'Explorer',
    priceUsd: 0,
    capsuleMints: 3,
    yieldBonus: 0,
    description: "Free entry, 3 mints/month. For first experiences and memorials.",
  },
  {
    name: 'Seeker',
    priceUsd: 9.99,
    capsuleMints: 15,
    yieldBonus: 0.05,
    description: "First paid tier. 15 mints/month, 5% yield bonus, entry into Creator economy.",
  },
  {
    name: 'Creator',
    priceUsd: 24.99,
    capsuleMints: 50,
    yieldBonus: 0.10,
    description: "Pro creator tier. 50 mints/month, 10% yield bonus, priority support.",
  },
  {
    name: 'Sovereign',
    priceUsd: 49.99,
    capsuleMints: 200,
    yieldBonus: 0.25,
    description: "Premium. 200 mints/month, 25% yield bonus, early features, highest yield access.",
  },
];