# GriefScore Tiers & GTT Yield Calculator

## Overview
The GriefScore system is GuardianChain's revolutionary approach to valuing emotional truth and assigning yield multipliers to verified capsules. Higher grief scores indicate more significant personal testimony, trauma recovery, or transformative memories, which earn proportionally higher GTT rewards.

## Tier Structure

### 🟦 Truth Seeker (1x Multiplier)
**GriefScore Range:** 0-30  
**Monthly Yield:** $25-50  
**Capsule Types:** General memories, daily logs, observations  
**Verification:** Community-based  

**Benefits:**
- Basic GTT earning potential
- Access to public vault browsing
- Standard capsule creation tools
- Community verification process

### 🟩 Memory Guardian (2x Multiplier)
**GriefScore Range:** 31-70  
**Monthly Yield:** $75-125  
**Capsule Types:** Significant life events, relationship memories, personal growth  
**Verification:** Enhanced community + AI analysis  

**Benefits:**
- Double GTT earning potential
- Priority verification queue
- Advanced capsule creation tools
- Access to Guardian network
- Emotional resonance analytics

### 🟪 Veritas Holder (3x Multiplier)
**GriefScore Range:** 71-100  
**Monthly Yield:** $150-200+  
**Capsule Types:** Trauma recovery, whistleblowing, legal testimony, crisis documentation  
**Verification:** Professional-grade + Veritas Seal  

**Benefits:**
- Triple GTT earning potential
- Instant verification priority
- Veritas Seal certification
- Legal-grade documentation
- Anonymous submission options
- Professional counseling resources

## GriefScore Calculation Factors

### Emotional Intensity (40% weight)
- Personal significance of the memory
- Emotional impact on the creator
- Transformative life importance
- Therapeutic value assessment

### Truth Verification Complexity (30% weight)
- Evidence requirements
- Witness availability
- Document authenticity needs
- Professional validation required

### Social Impact Potential (20% weight)
- Public interest significance
- Educational value
- Societal benefit
- Historical importance

### Rarity & Uniqueness (10% weight)
- Uncommon experience documentation
- First-hand witness accounts
- Exclusive access to events
- Cultural preservation value

## Yield Distribution Mechanics

### Base GTT Calculation
```
Monthly GTT = (Capsule Views × Verification Score × GriefScore Multiplier × Tier Bonus)
```

### Additional Yield Sources
- **Replay Fees:** 25% of unlock payments go to capsule author
- **Referral Bonuses:** 10% commission on referred user earnings
- **Validator Rewards:** Additional GTT for participating in verification
- **DAO Governance:** Voting rewards for active participation

### Real-Time Yield Examples

**Example 1: Daily Memory (Truth Seeker)**
- GriefScore: 15
- Monthly Views: 100
- Base GTT: 10 tokens
- Estimated Value: $35

**Example 2: Relationship Trauma (Memory Guardian)**
- GriefScore: 55
- Monthly Views: 250
- Base GTT: 45 tokens
- Estimated Value: $110

**Example 3: Whistleblower Testimony (Veritas Holder)**
- GriefScore: 85
- Monthly Views: 500
- Base GTT: 120 tokens
- Estimated Value: $280

## Tier Advancement

### Progression Mechanics
Users advance tiers through:
- Consistent high-quality capsule creation
- Community engagement and verification participation
- Professional validation achievements
- Long-term platform commitment

### Verification Requirements
- **Truth Seeker → Memory Guardian:** 10 verified capsules, 6-month activity
- **Memory Guardian → Veritas Holder:** Professional validation, legal documentation, or institutional backing

## Ethical Guidelines

### Content Standards
- Authentic personal experiences only
- No fabricated or stolen content
- Respect for privacy and consent
- Professional support for trauma content

### Verification Integrity
- Multi-source confirmation required
- AI bias detection and correction
- Human oversight for sensitive content
- Appeal process for disputed scores

## Technical Implementation

### Smart Contract Integration
```solidity
contract GriefScoreYield {
    struct CapsuleYield {
        uint256 griefScore;
        uint256 tierMultiplier;
        uint256 monthlyGTT;
        address author;
    }
}
```

### API Endpoints
- `GET /api/griefscore/calculate` - Calculate score for new capsule
- `GET /api/yield/estimate` - Estimate monthly GTT earnings
- `POST /api/tier/advance` - Request tier advancement
- `GET /api/yield/history` - View historical earnings

## Future Enhancements

### Planned Features
- AI-powered grief score prediction
- Therapeutic integration partnerships
- Legal testimony certification
- Crisis response rapid verification
- Cross-platform memory importing

### Research Initiatives
- Trauma-informed AI development
- Therapeutic outcome measurement
- Verified truth impact studies
- Digital memory preservation research

---

*This yield system is designed to fairly compensate truth-tellers while maintaining the integrity and authenticity that makes GuardianChain a trusted platform for memory preservation.*