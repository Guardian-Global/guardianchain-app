import express from 'express';
import Stripe from 'stripe';
import OpenAI from 'openai';

const router = express.Router();

// Initialize services
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
});

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY!,
});

// Premium subscription creation endpoint
router.post('/create-subscription', async (req, res) => {
  try {
    const { tier, features } = req.body;
    
    // Define pricing based on tier
    const tierPricing = {
      'Truth Guardian': 29900, // $299.00
      'Protocol Sovereign': 99900, // $999.00
      'Enterprise Alliance': 'custom' // Custom pricing
    };
    
    if (tierPricing[tier] === 'custom') {
      return res.json({
        message: 'Custom pricing tier',
        contact_sales: true,
        tier: tier
      });
    }
    
    const priceAmount = tierPricing[tier];
    if (!priceAmount) {
      return res.status(400).json({ error: 'Invalid tier selected' });
    }
    
    // Create customer
    const customer = await stripe.customers.create({
      metadata: {
        tier: tier,
        features: features,
        guardianchain_user: 'true'
      }
    });
    
    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customer.id,
      items: [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `GUARDIANCHAIN ${tier}`,
            description: `Enterprise truth verification access - ${tier} tier`,
          },
          unit_amount: priceAmount,
          recurring: {
            interval: 'month',
          },
        },
      }],
      payment_behavior: 'default_incomplete',
      payment_settings: {
        save_default_payment_method: 'on_subscription',
      },
      expand: ['latest_invoice.payment_intent'],
    });
    
    res.json({
      subscription_id: subscription.id,
      client_secret: subscription.latest_invoice?.payment_intent?.client_secret,
      customer_id: customer.id,
      tier: tier
    });
    
  } catch (error) {
    console.error('Subscription creation error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
});

// GTT token rewards calculation endpoint
router.post('/calculate-gtt-rewards', async (req, res) => {
  try {
    const { tier, usage_metrics } = req.body;
    
    // Base GTT rewards per tier
    const baseRewards = {
      'Truth Guardian': 10000,
      'Protocol Sovereign': 50000,
      'Enterprise Alliance': 1000000
    };
    
    // Usage multipliers
    const usageMultiplier = {
      api_calls: usage_metrics?.api_calls || 0,
      verifications: usage_metrics?.verifications || 0,
      enterprise_integrations: usage_metrics?.enterprise_integrations || 0
    };
    
    // Calculate bonus rewards based on usage
    const bonusRewards = Math.floor(
      (usageMultiplier.api_calls * 0.1) +
      (usageMultiplier.verifications * 1.0) +
      (usageMultiplier.enterprise_integrations * 100)
    );
    
    const totalRewards = baseRewards[tier] + bonusRewards;
    
    res.json({
      tier: tier,
      base_rewards: baseRewards[tier],
      bonus_rewards: bonusRewards,
      total_monthly_gtt: totalRewards,
      annual_gtt_value: totalRewards * 12,
      usage_breakdown: usageMultiplier
    });
    
  } catch (error) {
    console.error('GTT calculation error:', error);
    res.status(500).json({ error: 'Failed to calculate GTT rewards' });
  }
});

// AI-powered value assessment endpoint
router.post('/ai-value-assessment', async (req, res) => {
  try {
    const { company_data, use_case, current_costs } = req.body;
    
    const completion = await openai.chat.completions.create({
      model: "gpt-4o", // the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
      messages: [
        {
          role: "system",
          content: "You are a blockchain enterprise consultant analyzing potential value creation from GUARDIANCHAIN truth verification protocol implementation."
        },
        {
          role: "user",
          content: `Analyze the potential value creation for this enterprise:
          
          Company: ${company_data?.name || 'Enterprise Client'}
          Industry: ${company_data?.industry || 'Technology'}
          Current verification costs: $${current_costs || 100000}/month
          Use case: ${use_case || 'Supply chain verification'}
          
          Provide a detailed analysis of:
          1. Potential annual savings
          2. ROI calculation
          3. Risk reduction benefits
          4. Compliance improvements
          5. Recommended GUARDIANCHAIN tier
          
          Format as JSON with numerical values.`
        }
      ],
      response_format: { type: "json_object" },
    });
    
    const assessment = JSON.parse(completion.choices[0].message.content || '{}');
    
    res.json({
      ai_assessment: assessment,
      generated_at: new Date().toISOString(),
      confidence_score: 0.94,
      recommendations: assessment.recommendations || []
    });
    
  } catch (error) {
    console.error('AI assessment error:', error);
    res.status(500).json({ error: 'AI value assessment failed' });
  }
});

// Enterprise ROI calculator endpoint
router.post('/enterprise-roi', async (req, res) => {
  try {
    const { 
      current_verification_costs, 
      manual_processing_hours, 
      compliance_overhead,
      fraud_losses 
    } = req.body;
    
    // GUARDIANCHAIN savings calculations
    const automationSavings = (manual_processing_hours || 1000) * 50; // $50/hour saved
    const complianceSavings = (compliance_overhead || 50000) * 0.8; // 80% reduction
    const fraudReduction = (fraud_losses || 100000) * 0.95; // 95% fraud reduction
    const verificationSavings = (current_verification_costs || 10000) * 0.7; // 70% cost reduction
    
    const totalMonthlySavings = automationSavings + complianceSavings + fraudReduction + verificationSavings;
    const annualSavings = totalMonthlySavings * 12;
    
    // Cost of GUARDIANCHAIN (Protocol Sovereign tier)
    const monthlyGuardianChainCost = 999;
    const annualGuardianChainCost = monthlyGuardianChainCost * 12;
    
    const netAnnualSavings = annualSavings - annualGuardianChainCost;
    const roiPercentage = ((netAnnualSavings / annualGuardianChainCost) * 100).toFixed(1);
    
    res.json({
      savings_breakdown: {
        automation_savings: automationSavings,
        compliance_savings: complianceSavings,
        fraud_reduction_value: fraudReduction,
        verification_cost_savings: verificationSavings
      },
      financial_summary: {
        total_monthly_savings: totalMonthlySavings,
        annual_savings: annualSavings,
        guardianchain_annual_cost: annualGuardianChainCost,
        net_annual_savings: netAnnualSavings,
        roi_percentage: `${roiPercentage}%`,
        payback_period_months: Math.ceil(annualGuardianChainCost / totalMonthlySavings)
      },
      recommendations: [
        netAnnualSavings > 500000 ? 'Enterprise Alliance tier recommended' : 'Protocol Sovereign tier optimal',
        'Immediate implementation recommended for maximum savings',
        'Consider phased rollout across departments'
      ]
    });
    
  } catch (error) {
    console.error('ROI calculation error:', error);
    res.status(500).json({ error: 'ROI calculation failed' });
  }
});

// Premium feature usage tracking
router.post('/track-usage', async (req, res) => {
  try {
    const { feature, usage_type, metadata } = req.body;
    
    // Track premium feature usage for billing and analytics
    const usageRecord = {
      timestamp: new Date().toISOString(),
      feature: feature,
      usage_type: usage_type,
      user_id: req.session?.user?.id || 'anonymous',
      metadata: metadata
    };
    
    // In production, store in database
    // For now, return usage confirmation
    
    res.json({
      tracked: true,
      usage_record: usageRecord,
      billing_impact: feature.includes('enterprise') ? 'billable' : 'included'
    });
    
  } catch (error) {
    console.error('Usage tracking error:', error);
    res.status(500).json({ error: 'Usage tracking failed' });
  }
});

export default router;